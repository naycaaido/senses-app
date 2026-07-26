import BadRequestError from "../exceptions/BadRequestError.js";
import ConflictError from "../exceptions/ConflictError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import prisma from "../config/prisma.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const SCHEDULE_STATUS = ["Aktif", "Nonaktif"];

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
    jadwal.status_jadwal === "Aktif" && jadwal.no_reservasi === null,
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
    status_jadwal: "Aktif",
  };
};

const getJadwalTersedia = async (tanggal) => {
  const slots = await prisma.jadwal.findMany({
    where: {
      tanggal: parseTanggal(tanggal),
      status_jadwal: "Aktif",
      no_reservasi: null,
    },
    orderBy: { jam_mulai: "asc" },
    select: JADWAL_SELECT,
  });
  return slots.map(serializeJadwal);
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

  if (status_jadwal === "Nonaktif" && jadwal.no_reservasi) {
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
};
