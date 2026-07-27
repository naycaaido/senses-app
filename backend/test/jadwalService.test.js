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

test("batch schedule updates preserve booked slots", async () => {
  const date = new Date("2026-07-22T00:00:00.000Z");
  const activeSlot = {
    id_jadwal: 1,
    no_reservasi: null,
    tanggal: date,
    jam_mulai: new Date("1970-01-01T09:00:00.000Z"),
    jam_selesai: new Date("1970-01-01T09:30:00.000Z"),
    status_jadwal: "Aktif",
  };
  const bookedSlot = {
    ...activeSlot,
    id_jadwal: 2,
    no_reservasi: "RSV-000001",
    jam_mulai: new Date("1970-01-01T09:30:00.000Z"),
    jam_selesai: new Date("1970-01-01T10:00:00.000Z"),
  };
  let slots = [activeSlot, bookedSlot];
  prisma.$transaction = async (callback) => callback(prisma);
  prisma.jadwal.findMany = async () => slots;
  prisma.jadwal.updateMany = async ({ where, data }) => {
    slots = slots.map((slot) =>
      where.id_jadwal.in.includes(slot.id_jadwal)
        ? { ...slot, status_jadwal: data.status_jadwal }
        : slot,
    );
    return { count: 1 };
  };

  const result = await jadwalService.setAllJadwalStatusByDate({
    tanggal: "2026-07-22",
    status: "Nonaktif",
  });

  assert.equal(result.updated_count, 1);
  assert.equal(result.skipped_booked_count, 1);
  assert.equal(result.data[0].status_jadwal, "Nonaktif");
  assert.equal(result.data[1].status_jadwal, "Aktif");
});
