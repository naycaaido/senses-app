import assert from "node:assert/strict";
import test from "node:test";
import prisma from "../src/config/prisma.js";
import reservasiService from "../src/services/reservasiService.js";

const buildReservation = (date) => ({
  no_reservasi: "RSV-000001",
  email_pasien: "patient@example.com",
  tanggal_reservasi: date,
  status_reservasi: "Terjadwal",
  harga_layanan: 250000,
  pasien: { email: "patient@example.com", nama_lengkap: "Patient", telepon: "0812" },
  layanan: { id_layanan: 1, nama_layanan: "Facial", estimasi_durasi: 30, harga: 250000 },
  jadwal: [{
    id_jadwal: 1,
    tanggal: date,
    jam_mulai: new Date("1970-01-01T09:00:00.000Z"),
    jam_selesai: new Date("1970-01-01T09:30:00.000Z"),
    status_jadwal: "Aktif",
  }],
});

test("cancellation releases future reservation slots but rejects past slots", async () => {
  let released = false;
  let statusData;
  const futureReservation = buildReservation(new Date("2099-07-22T00:00:00.000Z"));

  const tx = {
    reservasi: {
      findUnique: async () => futureReservation,
      update: async (_args) => {
        statusData = _args.data;
        return { no_reservasi: "RSV-000001" };
      },
    },
    jadwal: {
      updateMany: async () => {
        released = true;
        return { count: 1 };
      },
    },
  };
  prisma.$transaction = async (callback) => callback(tx);

  await reservasiService.cancelReservationByPatient({
    no_reservasi: "RSV-000001",
    email_pasien: "patient@example.com",
  });
  assert.equal(released, true);
  assert.equal(statusData.status_reservasi, "Dibatalkan");

  tx.reservasi.findUnique = async () =>
    buildReservation(new Date("2020-01-01T00:00:00.000Z"));
  await assert.rejects(
    reservasiService.cancelReservationByPatient({
      no_reservasi: "RSV-000001",
      email_pasien: "patient@example.com",
    }),
    { statusCode: 409 },
  );
});
