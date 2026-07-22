import assert from "node:assert/strict";
import test from "node:test";
import prisma from "../src/config/prisma.js";
import jadwalService from "../src/services/jadwalService.js";

test("booked schedule slots cannot be deactivated", async () => {
  const date = new Date("2026-07-22T00:00:00.000Z");
  prisma.jadwal.findUnique = async () => ({
    id_jadwal: 1,
    no_reservasi: "RSV-000001",
    tanggal: date,
    jam_mulai: new Date("1970-01-01T09:00:00.000Z"),
    jam_selesai: new Date("1970-01-01T09:30:00.000Z"),
    status_jadwal: "Aktif",
  });

  await assert.rejects(
    jadwalService.setJadwalStatus(1, "Nonaktif"),
    { statusCode: 409 },
  );
});
