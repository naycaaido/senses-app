import bcrypt from "bcrypt";
import {
  MetodePembayaran,
  PihakPembatalan,
  StatusJadwal,
  StatusLayanan,
  StatusReservasi,
} from "@prisma/client";
import prisma from "../src/config/prisma.js";

const SEED_MARKER = "[SEED:SENSES-CLINIC]";
const DUMMY_PASSWORD = "senses123";
const RECEPTIONIST = {
  nama_lengkap: "Seed Scheduler Sense's Clinic",
  telepon: "089900000001",
};

const PATIENTS = [
  {
    key: "andi",
    email: "andi.seed@senses-clinic.invalid",
    nama_lengkap: "Andi Seed",
    telepon: "089900000101",
    jenis_kelamin: "Laki-laki",
  },
  {
    key: "siti",
    email: "siti.seed@senses-clinic.invalid",
    nama_lengkap: "Siti Seed",
    telepon: "089900000102",
    jenis_kelamin: "Perempuan",
  },
  {
    key: "bima",
    email: "bima.seed@senses-clinic.invalid",
    nama_lengkap: "Bima Seed",
    telepon: "089900000103",
    jenis_kelamin: "Laki-laki",
  },
];

const SERVICES = [
  {
    key: "consultation",
    nama_layanan: "[SEED] Konsultasi Kulit",
    estimasi_durasi: 30,
    deskripsi_layanan: "Layanan dummy khusus seeder.",
    harga: 150000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "facial",
    nama_layanan: "[SEED] Facial Acne",
    estimasi_durasi: 60,
    deskripsi_layanan: "Layanan dummy khusus seeder.",
    harga: 250000,
    status_layanan: StatusLayanan.Aktif,
  },
];

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

const addCalendarDays = (tanggal, offset) => {
  const result = new Date(`${tanggal}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + offset);
  return result.toISOString().slice(0, 10);
};

const dateOnly = (tanggal) => new Date(`${tanggal}T00:00:00.000Z`);

const timeOnly = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
};

const addThirtyMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 30;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
};

const atWib = (tanggal, time) => new Date(`${tanggal}T${time}:00+07:00`);

const seedPassword = (() => {
  let passwordHash;
  return async () => {
    if (!passwordHash) passwordHash = await bcrypt.hash(DUMMY_PASSWORD, 10);
    return passwordHash;
  };
})();

const seedPatientData = (patient) => ({
  email: patient.email,
  nama_lengkap: patient.nama_lengkap,
  telepon: patient.telepon,
  jenis_kelamin: patient.jenis_kelamin,
  tempat_lahir: "Jakarta",
  tanggal_lahir: new Date("1995-01-15T00:00:00.000Z"),
  pendidikan_terakhir: "S1",
  pekerjaan: "Data Seed",
  status_perkawinan: "Belum Menikah",
  agama: "Islam",
  alamat_domisili: "Alamat khusus seed",
  kota: "Jakarta",
  profil_lengkap: true,
});

async function ensureReceptionist(tx) {
  const existing = await tx.resepsionis.findFirst({
    where: RECEPTIONIST,
    select: { id_resepsionis: true },
  });
  if (existing) return existing;

  return tx.resepsionis.create({
    data: { ...RECEPTIONIST, password: await seedPassword() },
    select: { id_resepsionis: true },
  });
}

async function ensurePatients(tx) {
  const patients = await Promise.all(
    PATIENTS.map(async (patient) => {
      const existing = await tx.pasien.findUnique({
        where: { email: patient.email },
        select: { email: true },
      });
      if (existing) return [patient.key, existing];

      return [
        patient.key,
        await tx.pasien.create({
          data: { ...seedPatientData(patient), password: await seedPassword() },
          select: { email: true },
        }),
      ];
    }),
  );
  return new Map(patients);
}

async function ensureServices(tx) {
  const services = await Promise.all(
    SERVICES.map(async ({ key, ...service }) => {
      const existing = await tx.layanan.findFirst({
        where: { nama_layanan: service.nama_layanan },
        select: { id_layanan: true },
      });
      if (existing) return [key, existing];

      return [
        key,
        await tx.layanan.create({ data: service, select: { id_layanan: true } }),
      ];
    }),
  );
  return new Map(services);
}

async function cleanupSeedReservations(tx) {
  const reservations = await tx.reservasi.findMany({
    where: {
      email_pasien: { in: PATIENTS.map((patient) => patient.email) },
      keluhan_awal: { startsWith: SEED_MARKER },
    },
    select: { no_reservasi: true },
  });
  const reservationNumbers = reservations.map((reservation) => reservation.no_reservasi);
  if (reservationNumbers.length === 0) return;

  const schedules = await tx.jadwal.findMany({
    where: { no_reservasi: { in: reservationNumbers } },
    select: { id_jadwal: true },
  });

  await tx.pembayaran.deleteMany({ where: { no_reservasi: { in: reservationNumbers } } });
  await tx.pembatalanReservasi.deleteMany({
    where: { no_reservasi: { in: reservationNumbers } },
  });
  if (schedules.length > 0) {
    await tx.jadwal.deleteMany({
      where: { id_jadwal: { in: schedules.map((schedule) => schedule.id_jadwal) } },
    });
  }
  await tx.reservasi.deleteMany({ where: { no_reservasi: { in: reservationNumbers } } });
}

async function ensureScheduleSlots(tx, tanggal, starts) {
  return Promise.all(
    starts.map(async (jam_mulai) => {
      const jamMulai = timeOnly(jam_mulai);
      return tx.jadwal.create({
        data: {
          tanggal: dateOnly(tanggal),
          jam_mulai: jamMulai,
          jam_selesai: timeOnly(addThirtyMinutes(jam_mulai)),
          status_jadwal: StatusJadwal.Aktif,
          no_reservasi: null,
        },
        select: { id_jadwal: true, no_reservasi: true, status_jadwal: true },
      });
    }),
  );
}

async function createSeedReservation(tx, scenario, context) {
  const patient = context.patients.get(scenario.patient);
  const service = context.services.get(scenario.service);
  const slots = scenario.slot_starts.length > 0
    ? await ensureScheduleSlots(tx, scenario.tanggal, scenario.slot_starts)
    : [];

  if (slots.some(
    (slot) => slot.status_jadwal !== StatusJadwal.Aktif || slot.no_reservasi !== null,
  )) {
    throw new Error(`Slot demo ${scenario.key} tidak tersedia; data non-seed tidak diubah.`);
  }

  const reservasi = await tx.reservasi.create({
    data: {
      email_pasien: patient.email,
      id_layanan: service.id_layanan,
      id_resepsionis: context.receptionist.id_resepsionis,
      tanggal_reservasi: dateOnly(scenario.tanggal),
      status_reservasi: scenario.status,
      keluhan_awal: `${SEED_MARKER} ${scenario.keluhan_awal}`,
      harga_layanan: scenario.harga_layanan,
    },
    select: { no_reservasi: true, harga_layanan: true },
  });

  if (slots.length > 0) {
    const claimed = await tx.jadwal.updateMany({
      where: {
        id_jadwal: { in: slots.map((slot) => slot.id_jadwal) },
        status_jadwal: StatusJadwal.Aktif,
        no_reservasi: null,
      },
      data: { no_reservasi: reservasi.no_reservasi },
    });
    if (claimed.count !== slots.length) {
      throw new Error(`Slot demo ${scenario.key} berubah saat seed berjalan.`);
    }
  }

  if (scenario.metode_pembayaran) {
    await tx.pembayaran.create({
      data: {
        no_reservasi: reservasi.no_reservasi,
        total_biaya: reservasi.harga_layanan,
        metode_pembayaran: scenario.metode_pembayaran,
      },
    });
  }

  if (scenario.pembatalan) {
    await tx.pembatalanReservasi.create({
      data: {
        no_reservasi: reservasi.no_reservasi,
        alasan_pembatalan: scenario.pembatalan.alasan_pembatalan,
        pihak_pembatalan: scenario.pembatalan.pihak_pembatalan,
        dibatalkan_pada: scenario.pembatalan.dibatalkan_pada,
      },
    });
  }
}

function buildScenarios(now = new Date()) {
  const today = formatWibDate(now);
  const completedDate = addCalendarDays(today, -365);
  const historicalDate = addCalendarDays(today, -364);
  const scheduledDate = addCalendarDays(today, 90);
  const cancelledDate = addCalendarDays(today, 91);

  return [
    {
      key: "scheduled",
      patient: "andi",
      service: "facial",
      tanggal: scheduledDate,
      slot_starts: ["09:00", "09:30"],
      status: StatusReservasi.Terjadwal,
      harga_layanan: 250000,
      keluhan_awal: "Reservasi terjadwal.",
    },
    {
      key: "present",
      patient: "siti",
      service: "consultation",
      tanggal: historicalDate,
      slot_starts: ["10:00"],
      status: StatusReservasi.Hadir,
      harga_layanan: 150000,
      keluhan_awal: "Pasien sudah hadir.",
    },
    {
      key: "completed",
      patient: "bima",
      service: "consultation",
      tanggal: completedDate,
      slot_starts: ["11:00"],
      status: StatusReservasi.Selesai,
      harga_layanan: 150000,
      keluhan_awal: "Perawatan selesai.",
      metode_pembayaran: MetodePembayaran.QRIS,
    },
    {
      key: "cancelled",
      patient: "andi",
      service: "consultation",
      tanggal: cancelledDate,
      slot_starts: [],
      status: StatusReservasi.Dibatalkan,
      harga_layanan: 150000,
      keluhan_awal: "Reservasi dibatalkan; tidak ada slot tersisa.",
      pembatalan: {
        alasan_pembatalan: "Data demo pembatalan.",
        pihak_pembatalan: PihakPembatalan.Resepsionis,
        dibatalkan_pada: atWib(cancelledDate, "08:00"),
      },
    },
    {
      key: "no-show",
      patient: "siti",
      service: "consultation",
      tanggal: historicalDate,
      slot_starts: ["13:00"],
      status: StatusReservasi.TidakHadir,
      harga_layanan: 150000,
      keluhan_awal: "Pasien tidak hadir.",
    },
  ];
}

async function main() {
  await prisma.$transaction(async (tx) => {
    const receptionist = await ensureReceptionist(tx);
    const patients = await ensurePatients(tx);
    const services = await ensureServices(tx);
    await cleanupSeedReservations(tx);

    for (const scenario of buildScenarios()) {
      await createSeedReservation(tx, scenario, { receptionist, patients, services });
    }
  });

  console.log("Seeder selesai.");
  console.log(`Akun seed memakai domain .invalid dengan password ${DUMMY_PASSWORD}.`);
}

main()
  .catch((error) => {
    console.error("Seeder gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
