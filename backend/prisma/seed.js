import bcrypt from "bcrypt";
import {
  MetodePembayaran,
  PihakPembatalan,
  StatusJadwal,
  StatusLayanan,
  StatusReservasi,
} from "@prisma/client";
import prisma from "../src/config/prisma.js";

const DEMO_ACCOUNT_PASSWORD = "senses123";
const RECEPTIONIST = {
  nama_lengkap: "Rina Oktaviani",
  telepon: "081287654321",
};

const PATIENTS = [
  {
    key: "andi",
    email: "andi.pratama@example.com",
    nama_lengkap: "Andi Pratama",
    telepon: "081234567801",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "Jakarta",
    tanggal_lahir: "1993-05-13",
    pendidikan_terakhir: "S1",
    pekerjaan: "Karyawan Swasta",
    status_perkawinan: "Menikah",
    agama: "Islam",
    alamat_domisili: "Jl. Taman Kemang No. 18",
    kota: "Jakarta Selatan",
  },
  {
    key: "siti",
    email: "siti.rahmawati@example.com",
    nama_lengkap: "Siti Rahmawati",
    telepon: "081234567802",
    jenis_kelamin: "Perempuan",
    tempat_lahir: "Tangerang",
    tanggal_lahir: "1997-11-02",
    pendidikan_terakhir: "D3",
    pekerjaan: "Wiraswasta",
    status_perkawinan: "Belum Menikah",
    agama: "Islam",
    alamat_domisili: "Jl. Melati Raya No. 27",
    kota: "Tangerang Selatan",
  },
  {
    key: "bima",
    email: "bima.saputra@example.com",
    nama_lengkap: "Bima Saputra",
    telepon: "081234567803",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "Bekasi",
    tanggal_lahir: "1989-08-21",
    pendidikan_terakhir: "S1",
    pekerjaan: "Analis Keuangan",
    status_perkawinan: "Menikah",
    agama: "Islam",
    alamat_domisili: "Jl. Cendana No. 9",
    kota: "Bekasi",
  },
];

const SERVICES = [
  {
    key: "personal-skin-consultation",
    nama_layanan: "Personal Skin Consultation",
    estimasi_durasi: 30,
    deskripsi_layanan:
      "Sesi konsultasi untuk mengevaluasi kondisi kulit, mengidentifikasi keluhan utama, dan menentukan rekomendasi perawatan yang sesuai dengan kebutuhan pasien.",
    harga: 150000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "acne-starter-pack",
    nama_layanan: "Acne Starter Pack",
    estimasi_durasi: 60,
    deskripsi_layanan:
      "Perawatan awal untuk kulit berjerawat yang membantu membersihkan pori, mengurangi minyak berlebih, dan merawat area kulit yang sedang mengalami peradangan.",
    harga: 250000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "essential-skin-balance",
    nama_layanan: "Essential Skin Balance",
    estimasi_durasi: 60,
    deskripsi_layanan:
      "Perawatan untuk membantu menjaga keseimbangan kelembapan dan minyak pada kulit sehingga kulit terasa lebih bersih, segar, dan terawat.",
    harga: 300000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "deep-cleansing-corrective",
    nama_layanan: "Deep Cleansing & Corrective",
    estimasi_durasi: 90,
    deskripsi_layanan:
      "Perawatan pembersihan mendalam yang difokuskan pada pengangkatan kotoran, sel kulit mati, dan penyumbatan pori serta membantu memperbaiki tekstur kulit.",
    harga: 450000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "essential-barrier-facial",
    nama_layanan: "Essential Barrier Facial",
    estimasi_durasi: 60,
    deskripsi_layanan:
      "Perawatan wajah untuk membantu menjaga dan memperkuat lapisan pelindung kulit, terutama bagi kulit yang terasa kering, sensitif, atau mudah mengalami iritasi.",
    harga: 375000,
    status_layanan: StatusLayanan.Aktif,
  },
  {
    key: "ultra-light-therapy",
    nama_layanan: "Ultra Light Therapy",
    estimasi_durasi: 30,
    deskripsi_layanan:
      "Terapi menggunakan teknologi cahaya untuk mendukung proses perawatan kulit sesuai kondisi dan kebutuhan pasien.",
    harga: 275000,
    status_layanan: StatusLayanan.Aktif,
  },
];

// Identifiers below are read only for one-time cleanup of records written by
// older versions of this script; none are used for newly created records.
const LEGACY_PATIENT_EMAILS = [
  "andi.seed@senses-clinic.invalid",
  "siti.seed@senses-clinic.invalid",
  "bima.seed@senses-clinic.invalid",
  "andi.seed@example.com",
  "siti.seed@example.com",
  "bima.seed@example.com",
];
const LEGACY_RESERVATION_PREFIX = "[SEED:SENSES-CLINIC]";
const LEGACY_SERVICE_NAMES = [
  "[SEED] Konsultasi Kulit",
  "[SEED] Facial Acne",
];
const LEGACY_RECEPTIONIST = {
  nama_lengkap: "Seed Scheduler Sense's Clinic",
  telepon: "089900000001",
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

const accountPassword = (() => {
  let passwordHash;
  return async () => {
    if (!passwordHash) {
      passwordHash = await bcrypt.hash(DEMO_ACCOUNT_PASSWORD, 10);
    }
    return passwordHash;
  };
})();

const patientData = (patient) => ({
  email: patient.email,
  nama_lengkap: patient.nama_lengkap,
  telepon: patient.telepon,
  jenis_kelamin: patient.jenis_kelamin,
  tempat_lahir: patient.tempat_lahir,
  tanggal_lahir: dateOnly(patient.tanggal_lahir),
  pendidikan_terakhir: patient.pendidikan_terakhir,
  pekerjaan: patient.pekerjaan,
  status_perkawinan: patient.status_perkawinan,
  agama: patient.agama,
  alamat_domisili: patient.alamat_domisili,
  kota: patient.kota,
  profil_lengkap: true,
});

async function ensureReceptionist(tx) {
  const existing = await tx.resepsionis.findFirst({
    where: RECEPTIONIST,
    select: { id_resepsionis: true },
  });
  if (existing) return existing;

  return tx.resepsionis.create({
    data: { ...RECEPTIONIST, password: await accountPassword() },
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
          data: { ...patientData(patient), password: await accountPassword() },
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
        await tx.layanan.create({
          data: service,
          select: { id_layanan: true },
        }),
      ];
    }),
  );
  return new Map(services);
}

async function removeReservations(tx, reservations) {
  const reservationNumbers = reservations.map(
    (reservation) => reservation.no_reservasi,
  );
  if (reservationNumbers.length === 0) return;

  const schedules = await tx.jadwal.findMany({
    where: { no_reservasi: { in: reservationNumbers } },
    select: { id_jadwal: true },
  });

  await tx.pembayaran.deleteMany({
    where: { no_reservasi: { in: reservationNumbers } },
  });
  await tx.pembatalanReservasi.deleteMany({
    where: { no_reservasi: { in: reservationNumbers } },
  });
  if (schedules.length > 0) {
    await tx.jadwal.deleteMany({
      where: {
        id_jadwal: { in: schedules.map((schedule) => schedule.id_jadwal) },
      },
    });
  }
  await tx.reservasi.deleteMany({
    where: { no_reservasi: { in: reservationNumbers } },
  });
}

async function cleanupCurrentPatientReservations(tx) {
  const reservations = await tx.reservasi.findMany({
    where: { email_pasien: { in: PATIENTS.map((patient) => patient.email) } },
    select: { no_reservasi: true },
  });
  await removeReservations(tx, reservations);
}

async function cleanupLegacyData(tx) {
  const reservations = await tx.reservasi.findMany({
    where: {
      OR: [
        { email_pasien: { in: LEGACY_PATIENT_EMAILS } },
        { keluhan_awal: { startsWith: LEGACY_RESERVATION_PREFIX } },
      ],
    },
    select: { no_reservasi: true },
  });
  await removeReservations(tx, reservations);

  const legacyServices = await tx.layanan.findMany({
    where: { nama_layanan: { in: LEGACY_SERVICE_NAMES } },
    select: { id_layanan: true, nama_layanan: true },
  });
  for (const service of legacyServices) {
    const reservationCount = await tx.reservasi.count({
      where: { id_layanan: service.id_layanan },
    });
    if (reservationCount === 0) {
      await tx.layanan.delete({ where: { id_layanan: service.id_layanan } });
    } else {
      console.warn(
        `Layanan lama ${service.nama_layanan} tidak dihapus karena masih direferensikan ${reservationCount} reservasi.`,
      );
    }
  }

  const legacyReceptionists = await tx.resepsionis.findMany({
    where: LEGACY_RECEPTIONIST,
    select: { id_resepsionis: true, nama_lengkap: true },
  });
  for (const receptionist of legacyReceptionists) {
    const reservationCount = await tx.reservasi.count({
      where: { id_resepsionis: receptionist.id_resepsionis },
    });
    if (reservationCount === 0) {
      await tx.resepsionis.delete({
        where: { id_resepsionis: receptionist.id_resepsionis },
      });
    } else {
      console.warn(
        `Resepsionis lama ${receptionist.nama_lengkap} tidak dihapus karena masih direferensikan ${reservationCount} reservasi.`,
      );
    }
  }
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
  const slots =
    scenario.slot_starts.length > 0
      ? await ensureScheduleSlots(tx, scenario.tanggal, scenario.slot_starts)
      : [];

  const reservasi = await tx.reservasi.create({
    data: {
      email_pasien: patient.email,
      id_layanan: service.id_layanan,
      id_resepsionis: context.receptionist.id_resepsionis,
      tanggal_reservasi: dateOnly(scenario.tanggal),
      status_reservasi: scenario.status,
      keluhan_awal: scenario.keluhan_awal,
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
      throw new Error(`Slot skenario ${scenario.key} berubah saat proses berjalan.`);
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
      service: "acne-starter-pack",
      tanggal: scheduledDate,
      slot_starts: ["09:00", "09:30"],
      status: StatusReservasi.Terjadwal,
      harga_layanan: 250000,
      keluhan_awal:
        "Kulit mudah berminyak dan muncul jerawat pada area dahi serta dagu.",
    },
    {
      key: "present",
      patient: "siti",
      service: "personal-skin-consultation",
      tanggal: historicalDate,
      slot_starts: ["10:00"],
      status: StatusReservasi.Hadir,
      harga_layanan: 150000,
      keluhan_awal:
        "Ingin berkonsultasi mengenai kemerahan dan rasa kering pada wajah.",
    },
    {
      key: "completed",
      patient: "bima",
      service: "personal-skin-consultation",
      tanggal: completedDate,
      slot_starts: ["11:00"],
      status: StatusReservasi.Selesai,
      harga_layanan: 150000,
      keluhan_awal:
        "Membutuhkan evaluasi rutin untuk perawatan kulit sensitif.",
      metode_pembayaran: MetodePembayaran.QRIS,
    },
    {
      key: "cancelled",
      patient: "andi",
      service: "personal-skin-consultation",
      tanggal: cancelledDate,
      slot_starts: [],
      status: StatusReservasi.Dibatalkan,
      harga_layanan: 150000,
      keluhan_awal:
        "Memerlukan konsultasi untuk menentukan perawatan kulit yang sesuai.",
      pembatalan: {
        alasan_pembatalan:
          "Pasien berhalangan hadir dan meminta jadwal konsultasi dibatalkan.",
        pihak_pembatalan: PihakPembatalan.Resepsionis,
        dibatalkan_pada: atWib(cancelledDate, "08:00"),
      },
    },
    {
      key: "no-show",
      patient: "siti",
      service: "personal-skin-consultation",
      tanggal: historicalDate,
      slot_starts: ["13:00"],
      status: StatusReservasi.TidakHadir,
      harga_layanan: 150000,
      keluhan_awal:
        "Keluhan komedo dan tekstur kulit tidak merata pada area hidung.",
    },
  ];
}

async function main() {
  await prisma.$transaction(async (tx) => {
    await cleanupLegacyData(tx);
    await cleanupCurrentPatientReservations(tx);
    const receptionist = await ensureReceptionist(tx);
    const patients = await ensurePatients(tx);
    const services = await ensureServices(tx);

    for (const scenario of buildScenarios()) {
      await createSeedReservation(tx, scenario, {
        receptionist,
        patients,
        services,
      });
    }
  });

  console.log("Data awal klinik berhasil disiapkan.");
}

main()
  .catch((error) => {
    console.error("Proses penyiapan data gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
