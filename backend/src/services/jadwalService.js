import BadRequestError from "../exceptions/BadRequestError.js";
import ConflictError from "../exceptions/ConflictError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { StatusJadwal } from "@prisma/client";
import prisma from "../config/prisma.js";
import { scheduleStartAtWib } from "../utils/clinicTime.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const SCHEDULE_STATUS = Object.values(StatusJadwal);
const DEFAULT_SCHEDULE_HORIZON_DAYS = 30;
const SLOT_DURATION_MINUTES = 30;
const CLINIC_OPEN_MINUTES = 9 * 60;
const CLINIC_CLOSE_MINUTES = 17 * 60;

const JADWAL_SELECT = {
  id_jadwal: true,
  no_reservasi: true,
  tanggal: true,
  jam_mulai: true,
  jam_selesai: true,
  status_jadwal: true,
};

const parseTanggal = (value) => {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    throw new BadRequestError("tanggal must use YYYY-MM-DD format");
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new BadRequestError("tanggal is not a valid date");
  }

  return parsed;
};

const parseTime = (value, field) => {
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) {
    throw new BadRequestError(`${field} must use HH:MM format`);
  }

  const [hours, minutes] = value.split(":").map(Number);
  return { value, minutesSinceMidnight: hours * 60 + minutes };
};

const dateForTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
};

const serializeJadwal = (jadwal) => ({
  ...jadwal,
  tanggal: jadwal.tanggal.toISOString().slice(0, 10),
  jam_mulai: jadwal.jam_mulai.toISOString().slice(11, 16),
  jam_selesai: jadwal.jam_selesai.toISOString().slice(11, 16),
  tersedia:
    jadwal.status_jadwal === StatusJadwal.Aktif && jadwal.no_reservasi === null,
});

const slotDataFrom = ({ tanggal, jam_mulai, jam_selesai }) => {
  const parsedTanggal = parseTanggal(tanggal);
  const mulai = parseTime(jam_mulai, "jam_mulai");
  const selesai = parseTime(jam_selesai, "jam_selesai");

  if (
    mulai.minutesSinceMidnight + 30 >= 24 * 60 ||
    selesai.minutesSinceMidnight !== mulai.minutesSinceMidnight + 30
  ) {
    throw new BadRequestError("A schedule slot must last exactly 30 minutes");
  }

  return {
    tanggal: parsedTanggal,
    jam_mulai: dateForTime(mulai.value),
    jam_selesai: dateForTime(selesai.value),
    status_jadwal: StatusJadwal.Aktif,
  };
};

const getJadwalTersedia = async (tanggal) => {
  const slots = await prisma.jadwal.findMany({
    where: {
      tanggal: parseTanggal(tanggal),
      status_jadwal: StatusJadwal.Aktif,
      no_reservasi: null,
    },
    orderBy: { jam_mulai: "asc" },
    select: JADWAL_SELECT,
  });
  const now = Date.now();
  return slots
    .filter((slot) => scheduleStartAtWib(slot.tanggal, slot.jam_mulai).getTime() > now)
    .map(serializeJadwal);
};

const formatWibDate = (value) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};

const addCalendarDays = (tanggal, days) => {
  const date = parseTanggal(tanggal);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const scheduleHorizonDays = (value = process.env.SCHEDULE_HORIZON_DAYS) => {
  if (value === undefined || value === "") return DEFAULT_SCHEDULE_HORIZON_DAYS;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0
    ? parsed
    : DEFAULT_SCHEDULE_HORIZON_DAYS;
};

const timeFromMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const scheduleSlotData = (tanggal, startMinutes) => {
  const jam_mulai = timeFromMinutes(startMinutes);
  const jam_selesai = timeFromMinutes(startMinutes + SLOT_DURATION_MINUTES);
  return {
    tanggal: parseTanggal(tanggal),
    jam_mulai: dateForTime(jam_mulai),
    jam_selesai: dateForTime(jam_selesai),
    status_jadwal: StatusJadwal.Aktif,
    no_reservasi: null,
  };
};

const buildScheduleCandidates = ({ startDate, horizonDays, now = new Date() }) => {
  const todayWib = formatWibDate(now);
  const candidates = [];

  for (let day = 0; day < horizonDays; day += 1) {
    const tanggal = addCalendarDays(startDate, day);
    for (
      let startMinutes = CLINIC_OPEN_MINUTES;
      startMinutes < CLINIC_CLOSE_MINUTES;
      startMinutes += SLOT_DURATION_MINUTES
    ) {
      const data = scheduleSlotData(tanggal, startMinutes);
      if (
        tanggal === todayWib
        && scheduleStartAtWib(data.tanggal, data.jam_mulai).getTime() <= now.getTime()
      ) {
        continue;
      }
      candidates.push(data);
    }
  }

  return candidates;
};

const ensureScheduleWindow = async ({
  startDate,
  horizonDays = scheduleHorizonDays(),
  now = new Date(),
} = {}) => {
  const tanggal_mulai = startDate
    ? parseTanggal(startDate).toISOString().slice(0, 10)
    : formatWibDate(now);
  const jumlah_hari = scheduleHorizonDays(horizonDays);
  const candidates = buildScheduleCandidates({
    startDate: tanggal_mulai,
    horizonDays: jumlah_hari,
    now,
  });
  const result = candidates.length === 0
    ? { count: 0 }
    : await prisma.jadwal.createMany({ data: candidates, skipDuplicates: true });
  const slot_dibuat = result.count;

  return {
    tanggal_mulai,
    tanggal_selesai: addCalendarDays(tanggal_mulai, jumlah_hari - 1),
    jumlah_hari,
    slot_direncanakan: candidates.length,
    slot_dibuat,
    slot_dilewati: candidates.length - slot_dibuat,
  };
};

const getJadwalByResepsionis = async (tanggal) => {
  const slots = await prisma.jadwal.findMany({
    where: { tanggal: parseTanggal(tanggal) },
    orderBy: { jam_mulai: "asc" },
    select: JADWAL_SELECT,
  });
  return slots.map(serializeJadwal);
};

const createJadwal = async (payload) => {
  const data = slotDataFrom(payload);
  const existing = await prisma.jadwal.findUnique({
    where: {
      tanggal_jam_mulai: {
        tanggal: data.tanggal,
        jam_mulai: data.jam_mulai,
      },
    },
    select: { id_jadwal: true },
  });
  if (existing) {
    throw new ConflictError("A schedule slot already exists at this date and time");
  }

  return serializeJadwal(
    await prisma.jadwal.create({ data, select: JADWAL_SELECT }),
  );
};

const setJadwalStatus = async (id_jadwal, status_jadwal) => {
  const jadwal = await prisma.jadwal.findUnique({
    where: { id_jadwal },
    select: JADWAL_SELECT,
  });
  if (!jadwal) {
    throw new NotFoundError("Schedule slot not found");
  }

  if (status_jadwal === StatusJadwal.Nonaktif && jadwal.no_reservasi) {
    throw new ConflictError("Booked schedule slots cannot be deactivated");
  }

  if (jadwal.status_jadwal === status_jadwal) {
    return serializeJadwal(jadwal);
  }

  return serializeJadwal(
    await prisma.jadwal.update({
      where: { id_jadwal },
      data: { status_jadwal },
      select: JADWAL_SELECT,
    }),
  );
};

const setAllJadwalStatusByDate = async ({ tanggal, status }) => {
  if (!SCHEDULE_STATUS.includes(status)) {
    throw new BadRequestError("status must be Aktif or Nonaktif");
  }

  const parsedTanggal = parseTanggal(tanggal);
  return prisma.$transaction(async (tx) => {
    const slots = await tx.jadwal.findMany({
      where: { tanggal: parsedTanggal },
      orderBy: { jam_mulai: "asc" },
      select: JADWAL_SELECT,
    });

    if (slots.length === 0) {
      throw new NotFoundError("No schedule slots found for this date");
    }

    const mutableSlotIds = slots
      .filter((slot) => slot.no_reservasi === null)
      .map((slot) => slot.id_jadwal);

    if (mutableSlotIds.length > 0) {
      await tx.jadwal.updateMany({
        where: { id_jadwal: { in: mutableSlotIds } },
        data: { status_jadwal: status },
      });
    }

    const data = await tx.jadwal.findMany({
      where: { tanggal: parsedTanggal },
      orderBy: { jam_mulai: "asc" },
      select: JADWAL_SELECT,
    });

    return {
      data: data.map(serializeJadwal),
      updated_count: mutableSlotIds.length,
      skipped_booked_count: slots.length - mutableSlotIds.length,
    };
  });
};

export default {
  getJadwalTersedia,
  getJadwalByResepsionis,
  createJadwal,
  setJadwalStatus,
  setAllJadwalStatusByDate,
  ensureScheduleWindow,
};

export {
  DEFAULT_SCHEDULE_HORIZON_DAYS,
  buildScheduleCandidates,
  ensureScheduleWindow,
  scheduleHorizonDays,
};
