import assert from "node:assert/strict";
import test from "node:test";
import { MetodePembayaran, StatusReservasi } from "@prisma/client";
import prisma from "../src/config/prisma.js";
import pembayaranService from "../src/services/pembayaranService.js";
import requireRole from "../src/middleware/requireRole.js";

const reservation = (status = StatusReservasi.Selesai) => ({
  no_reservasi: "RSV-000001",
  status_reservasi: status,
  harga_layanan: 250000,
  email_pasien: "patient@example.com",
  pasien: { nama_lengkap: "Patient" },
  layanan: { nama_layanan: "Facial" },
});

const payment = (reservasi = reservation()) => ({
  no_reservasi: reservasi.no_reservasi,
  tanggal_bayar: new Date("2026-08-03T07:00:00.000Z"),
  total_biaya: 250000,
  metode_pembayaran: MetodePembayaran.QRIS,
  reservasi,
});

test("payment uses no_reservasi, the price snapshot, and has no legacy ID", async () => {
  const reservasi = reservation();
  let created;
  let lookupWhere;
  let existingChecked = false;
  const tx = {
    reservasi: { findUnique: async () => reservasi },
    pembayaran: {
      findUnique: async ({ where }) => {
        if (!existingChecked) {
          existingChecked = true;
          return null;
        }
        lookupWhere = where;
        return payment(reservasi);
      },
      create: async ({ data }) => {
        created = data;
        return { no_reservasi: data.no_reservasi };
      },
    },
  };
  prisma.$transaction = async (callback) => callback(tx);

  const result = await pembayaranService.createPembayaran({
    no_reservasi: reservasi.no_reservasi,
    metode_pembayaran: MetodePembayaran.QRIS,
  });

  assert.equal(created.total_biaya, 250000);
  assert.deepEqual(lookupWhere, { no_reservasi: "RSV-000001" });
  assert.equal(result.no_reservasi, "RSV-000001");
  assert.equal(result.id_pembayaran, undefined);
  assert.equal(result.total_biaya, 250000);
});

test("second payment, invalid method, and invalid reservation status are rejected", async () => {
  const tx = {
    reservasi: { findUnique: async () => reservation() },
    pembayaran: { findUnique: async () => payment() },
  };
  prisma.$transaction = async (callback) => callback(tx);

  await assert.rejects(
    pembayaranService.createPembayaran({
      no_reservasi: "RSV-000001",
      metode_pembayaran: MetodePembayaran.QRIS,
    }),
    { statusCode: 409 },
  );
  await assert.rejects(
    pembayaranService.createPembayaran({
      no_reservasi: "RSV-000001",
      metode_pembayaran: "Kartu Kredit",
    }),
    { statusCode: 400 },
  );

  tx.reservasi.findUnique = async () => reservation(StatusReservasi.Hadir);
  tx.pembayaran.findUnique = async () => null;
  await assert.rejects(
    pembayaranService.createPembayaran({
      no_reservasi: "RSV-000001",
      metode_pembayaran: MetodePembayaran.Tunai,
    }),
    { statusCode: 409 },
  );
});

test("payment detail is found by no_reservasi and public status is mapped", async () => {
  let where;
  prisma.pembayaran.findUnique = async (args) => {
    where = args.where;
    return payment({ ...reservation(), status_reservasi: StatusReservasi.TidakHadir });
  };

  const result = await pembayaranService.getPembayaranById("RSV-000001");
  assert.deepEqual(where, { no_reservasi: "RSV-000001" });
  assert.equal(result.id_pembayaran, undefined);
  assert.equal(result.reservasi.status_reservasi, "Tidak Hadir");
});

test("patient role cannot pass the receptionist-only payment authorization", () => {
  let error;
  requireRole("resepsionis")(
    { user: { role: "pasien", email: "patient@example.com" } },
    {},
    (result) => {
      error = result;
    },
  );
  assert.equal(error.statusCode, 403);
});
