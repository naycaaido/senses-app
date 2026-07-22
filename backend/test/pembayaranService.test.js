import assert from "node:assert/strict";
import test from "node:test";
import prisma from "../src/config/prisma.js";
import pembayaranService from "../src/services/pembayaranService.js";

test("payment uses the reservation price snapshot and prevents duplicate payments", async () => {
  const reservation = {
    no_reservasi: "RSV-000001",
    status_reservasi: "Selesai",
    harga_layanan: 250000,
    email_pasien: "patient@example.com",
    pasien: { nama_lengkap: "Patient" },
    layanan: { nama_layanan: "Facial" },
  };
  let created;

  const tx = {
    reservasi: { findUnique: async () => reservation },
    pembayaran: {
      findUnique: async () => null,
      create: async ({ data }) => {
        created = data;
        return { id_pembayaran: "PAY-000001" };
      },
    },
  };
  prisma.$transaction = async (callback) => callback(tx);

  tx.pembayaran.findUnique = async ({ where }) => {
    if (where.id_pembayaran) {
      return {
        id_pembayaran: "PAY-000001",
        no_reservasi: "RSV-000001",
        tanggal_bayar: new Date("2026-07-22T10:00:00.000Z"),
        total_biaya: 250000,
        metode_pembayaran: "QRIS",
        reservasi: reservation,
      };
    }
    return null;
  };

  const pembayaran = await pembayaranService.createPembayaran({
    no_reservasi: "RSV-000001",
    metode_pembayaran: "QRIS",
  });
  assert.equal(created.total_biaya, 250000);
  assert.equal(pembayaran.total_biaya, 250000);

  tx.pembayaran.findUnique = async ({ where }) =>
    where.no_reservasi ? { id_pembayaran: "PAY-000001" } : null;
  await assert.rejects(
    pembayaranService.createPembayaran({
      no_reservasi: "RSV-000001",
      metode_pembayaran: "QRIS",
    }),
    { statusCode: 409 },
  );
});
