import assert from "node:assert/strict";
import test from "node:test";
import prisma from "../src/config/prisma.js";
import layananService from "../src/services/layananService.js";

test("service creation enforces 30-minute duration and serializes price", async () => {
  let created;
  prisma.layanan.create = async ({ data }) => {
    created = data;
    return { id_layanan: 1, ...data, status_layanan: "Aktif" };
  };

  const layanan = await layananService.createLayanan({
    nama_layanan: "Facial",
    estimasi_durasi: "60",
    deskripsi_layanan: "Perawatan wajah",
    harga: "250000",
  });

  assert.equal(created.estimasi_durasi, 60);
  assert.equal(layanan.harga, 250000);
  await assert.rejects(
    layananService.createLayanan({
      nama_layanan: "Invalid",
      estimasi_durasi: 45,
      deskripsi_layanan: "Invalid",
      harga: 100,
    }),
  );
});
