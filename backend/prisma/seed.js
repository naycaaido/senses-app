import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

const DUMMY_PASSWORD = "senses123";
const RECEPTIONIST = {
  id_resepsionis: 9001,
  nama_lengkap: "Resepsionis Dummy",
  telepon: "081234567890",
};

const PATIENTS = [
  {
    email: "andi.dummy@example.com",
    nama_lengkap: "Andi Pratama",
    telepon: "081234567801",
    jenis_kelamin: "Laki-laki",
  },
  {
    email: "siti.dummy@example.com",
    nama_lengkap: "Siti Aulia",
    telepon: "081234567802",
    jenis_kelamin: "Perempuan",
  },
  {
    email: "bima.dummy@example.com",
    nama_lengkap: "Bima Saputra",
    telepon: "081234567803",
    jenis_kelamin: "Laki-laki",
  },
];

const SERVICES = [
  {
    key: "consultation",
    nama_layanan: "Konsultasi Kulit Dummy",
    estimasi_durasi: 30,
    deskripsi_layanan: "Konsultasi awal untuk data pengembangan.",
    harga: 150000,
    status_layanan: "Aktif",
  },
  {
    key: "facial",
    nama_layanan: "Facial Acne Dummy",
    estimasi_durasi: 60,
    deskripsi_layanan: "Perawatan acne untuk data pengembangan.",
    harga: 250000,
    status_layanan: "Aktif",
  },
  {
    key: "laser",
    nama_layanan: "Laser Rejuvenation Dummy",
    estimasi_durasi: 60,
    deskripsi_layanan: "Perawatan laser untuk data pengembangan.",
    harga: 450000,
    status_layanan: "Aktif",
  },
  {
    key: "inactive",
    nama_layanan: "Perawatan Nonaktif Dummy",
    estimasi_durasi: 30,
    deskripsi_layanan: "Contoh layanan yang tidak dapat dipesan.",
    harga: 100000,
    status_layanan: "Nonaktif",
  },
];

const SLOT_STARTS = Array.from({ length: 16 }, (_, index) => {
  const minutes = 9 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

const atUtcMidnight = (offset = 0) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};

const timeAtUtc = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
};

const endTime = (start) => {
  const [hours, minutes] = start.split(":").map(Number);
  return `${String(Math.floor((hours * 60 + minutes + 30) / 60)).padStart(2, "0")}:${String((minutes + 30) % 60).padStart(2, "0")}`;
};

async function seedReceptionist(password) {
  const existing = await prisma.resepsionis.findUnique({
    where: { id_resepsionis: RECEPTIONIST.id_resepsionis },
    select: { id_resepsionis: true, telepon: true },
  });

  if (existing && existing.telepon !== RECEPTIONIST.telepon) {
    throw new Error(
      `ID resepsionis ${RECEPTIONIST.id_resepsionis} sudah dipakai data non-dummy. Seeder dihentikan agar data tersebut tidak tertimpa.`,
    );
  }

  return prisma.resepsionis.upsert({
    where: { id_resepsionis: RECEPTIONIST.id_resepsionis },
    update: { ...RECEPTIONIST, password },
    create: { ...RECEPTIONIST, password },
  });
}

async function seedPatients(password) {
  return Promise.all(
    PATIENTS.map((patient) =>
      prisma.pasien.upsert({
        where: { email: patient.email },
        update: {
          ...patient,
          password,
          tempat_lahir: "Jakarta",
          tanggal_lahir: new Date("1995-01-15T00:00:00.000Z"),
          pendidikan_terakhir: "S1",
          pekerjaan: "Karyawan Swasta",
          status_perkawinan: "Belum Menikah",
          agama: "Islam",
          alamat_domisili: "Jl. Contoh No. 1",
          kota: "Jakarta",
          profil_lengkap: true,
        },
        create: {
          ...patient,
          password,
          tempat_lahir: "Jakarta",
          tanggal_lahir: new Date("1995-01-15T00:00:00.000Z"),
          pendidikan_terakhir: "S1",
          pekerjaan: "Karyawan Swasta",
          status_perkawinan: "Belum Menikah",
          agama: "Islam",
          alamat_domisili: "Jl. Contoh No. 1",
          kota: "Jakarta",
          profil_lengkap: true,
        },
      }),
    ),
  );
}

async function seedServices() {
  const services = await Promise.all(
    SERVICES.map(async ({ key, ...service }) => {
      const existing = await prisma.layanan.findFirst({
        where: { nama_layanan: service.nama_layanan },
        select: { id_layanan: true },
      });
      const record = existing
        ? await prisma.layanan.update({ where: { id_layanan: existing.id_layanan }, data: service })
        : await prisma.layanan.create({ data: service });
      return [key, record];
    }),
  );

  return new Map(services);
}

async function seedScheduleDay(tanggal) {
  const schedules = await Promise.all(
    SLOT_STARTS.map((jam_mulai) =>
      prisma.jadwal.upsert({
        where: { tanggal_jam_mulai: { tanggal, jam_mulai: timeAtUtc(jam_mulai) } },
        update: {},
        create: {
          tanggal,
          jam_mulai: timeAtUtc(jam_mulai),
          jam_selesai: timeAtUtc(endTime(jam_mulai)),
          status_jadwal: "Aktif",
        },
      }),
    ),
  );
  return new Map(schedules.map((schedule) => [schedule.jam_mulai.toISOString().slice(11, 16), schedule]));
}

async function seedReservation({ no_reservasi, patient, service, receptionist, tanggal, slots, status, keluhan_awal }) {
  return prisma.$transaction(async (tx) => {
    const existingReservation = await tx.reservasi.findUnique({
      where: { no_reservasi },
      select: { keluhan_awal: true },
    });
    if (existingReservation && !existingReservation.keluhan_awal?.startsWith("[SEED]")) {
      throw new Error(`${no_reservasi} sudah dipakai reservasi non-dummy; data tersebut tidak diubah.`);
    }

    await tx.jadwal.updateMany({ where: { no_reservasi }, data: { no_reservasi: null } });

    const requestedSlots = await tx.jadwal.findMany({
      where: { id_jadwal: { in: slots.map((slot) => slot.id_jadwal) } },
      select: { id_jadwal: true, no_reservasi: true, status_jadwal: true },
    });
    if (
      requestedSlots.length !== slots.length ||
      requestedSlots.some((slot) => slot.status_jadwal !== "Aktif" || slot.no_reservasi !== null)
    ) {
      throw new Error(`Slot untuk ${no_reservasi} tidak tersedia; data jadwal non-dummy tidak diubah.`);
    }

    const reservasi = await tx.reservasi.upsert({
      where: { no_reservasi },
      update: {
        email_pasien: patient.email,
        id_layanan: service.id_layanan,
        id_resepsionis: receptionist.id_resepsionis,
        tanggal_reservasi: tanggal,
        status_reservasi: status,
        keluhan_awal,
        alasan_pembatalan: null,
        harga_layanan: service.harga,
      },
      create: {
        no_reservasi,
        email_pasien: patient.email,
        id_layanan: service.id_layanan,
        id_resepsionis: receptionist.id_resepsionis,
        tanggal_reservasi: tanggal,
        status_reservasi: status,
        keluhan_awal,
        harga_layanan: service.harga,
      },
    });

    const claimed = await tx.jadwal.updateMany({
      where: { id_jadwal: { in: slots.map((slot) => slot.id_jadwal) }, no_reservasi: null },
      data: { no_reservasi },
    });
    if (claimed.count !== slots.length) {
      throw new Error(`Slot untuk ${no_reservasi} baru saja berubah dan tidak dapat dipakai.`);
    }
    return reservasi;
  });
}

async function main() {
  const password = await bcrypt.hash(DUMMY_PASSWORD, 10);
  const receptionist = await seedReceptionist(password);
  const patients = await seedPatients(password);
  const services = await seedServices();

  const completedDate = atUtcMidnight(-1);
  const bookingDate = atUtcMidnight(1);
  await seedScheduleDay(atUtcMidnight(2));
  const completedSlots = await seedScheduleDay(completedDate);
  const bookingSlots = await seedScheduleDay(bookingDate);

  const completedReservation = await seedReservation({
    no_reservasi: "RSV-990001",
    patient: patients[1],
    service: services.get("consultation"),
    receptionist,
    tanggal: completedDate,
    slots: [completedSlots.get("10:00")],
    status: "Selesai",
    keluhan_awal: "[SEED] Kontrol perawatan dummy.",
  });
  await seedReservation({
    no_reservasi: "RSV-990002",
    patient: patients[0],
    service: services.get("facial"),
    receptionist,
    tanggal: bookingDate,
    slots: [bookingSlots.get("09:00"), bookingSlots.get("09:30")],
    status: "Terjadwal",
    keluhan_awal: "[SEED] Keluhan jerawat dummy.",
  });

  await prisma.pembayaran.upsert({
    where: { no_reservasi: completedReservation.no_reservasi },
    update: { total_biaya: completedReservation.harga_layanan, metode_pembayaran: "QRIS" },
    create: {
      no_reservasi: completedReservation.no_reservasi,
      total_biaya: completedReservation.harga_layanan,
      metode_pembayaran: "QRIS",
    },
  });

  console.log("Seeder selesai.");
  console.log(`Resepsionis dummy: ID ${RECEPTIONIST.id_resepsionis}, password ${DUMMY_PASSWORD}`);
  console.log(`Pasien dummy: ${PATIENTS.map((patient) => patient.email).join(", ")}, password ${DUMMY_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seeder gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
