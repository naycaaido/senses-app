import assert from "node:assert/strict";
import test from "node:test";
import { StatusJadwal } from "@prisma/client";
import prisma from "../src/config/prisma.js";
import jadwalService from "../src/services/jadwalService.js";
import {
  buildScheduleCandidates,
  scheduleHorizonDays,
} from "../src/services/jadwalService.js";
import { scheduleStartAtWib } from "../src/utils/clinicTime.js";

const FIXED_NOW = new Date("2026-08-03T14:00:00+07:00").getTime();

const buildSlot = (id, tanggal, jamMulai) => {
  const [hours, minutes] = jamMulai.split(":").map(Number);
  return {
    id_jadwal: id,
    no_reservasi: null,
    tanggal: new Date(`${tanggal}T00:00:00.000Z`),
    jam_mulai: new Date(Date.UTC(1970, 0, 1, hours, minutes, 0)),
    jam_selesai: new Date(Date.UTC(1970, 0, 1, hours, minutes + 30, 0)),
    status_jadwal: StatusJadwal.Aktif,
  };
};

test("WIB schedule helper accepts HH:MM and HH:MM:SS", () => {
  const expected = new Date("2026-08-03T14:30:00+07:00").getTime();
  assert.equal(scheduleStartAtWib("2026-08-03", "14:30").getTime(), expected);
  assert.equal(scheduleStartAtWib("2026-08-03", "14:30:00").getTime(), expected);
});

test("available schedules only include slots whose WIB start time is in the future", async (t) => {
  t.mock.method(Date, "now", () => FIXED_NOW);
  const slots = [
    buildSlot(1, "2026-08-03", "09:00"),
    buildSlot(2, "2026-08-03", "14:00"),
    buildSlot(3, "2026-08-03", "14:30"),
    buildSlot(4, "2026-08-04", "09:00"),
    buildSlot(5, "2026-08-02", "15:00"),
  ];
  prisma.jadwal.findMany = async ({ where }) => {
    const requestedDate = where.tanggal.toISOString().slice(0, 10);
    return slots.filter(
      (slot) => slot.tanggal.toISOString().slice(0, 10) === requestedDate,
    );
  };

  const today = await jadwalService.getJadwalTersedia("2026-08-03");
  const future = await jadwalService.getJadwalTersedia("2026-08-04");
  const past = await jadwalService.getJadwalTersedia("2026-08-02");

  assert.deepEqual(today.map((slot) => slot.id_jadwal), [3]);
  assert.deepEqual(future.map((slot) => slot.id_jadwal), [4]);
  assert.deepEqual(past, []);
});

test("booked schedule slots cannot be deactivated", async () => {
  const date = new Date("2026-07-22T00:00:00.000Z");
  prisma.jadwal.findUnique = async () => ({
    id_jadwal: 1,
    no_reservasi: "RSV-000001",
    tanggal: date,
    jam_mulai: new Date("1970-01-01T09:00:00.000Z"),
    jam_selesai: new Date("1970-01-01T09:30:00.000Z"),
    status_jadwal: StatusJadwal.Aktif,
  });

  await assert.rejects(
    jadwalService.setJadwalStatus(1, StatusJadwal.Nonaktif),
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
    status_jadwal: StatusJadwal.Aktif,
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
    status: StatusJadwal.Nonaktif,
  });

  assert.equal(result.updated_count, 1);
  assert.equal(result.skipped_booked_count, 1);
  assert.equal(result.data[0].status_jadwal, StatusJadwal.Nonaktif);
  assert.equal(result.data[1].status_jadwal, StatusJadwal.Aktif);
});

const slotKey = (slot) => `${slot.tanggal.toISOString()}-${slot.jam_mulai.toISOString()}`;

const useCreateManyRecorder = (existingSlots = []) => {
  const keys = new Set(existingSlots.map(slotKey));
  prisma.jadwal.createMany = async ({ data, skipDuplicates }) => {
    assert.equal(skipDuplicates, true);
    let count = 0;
    for (const slot of data) {
      const key = slotKey(slot);
      if (!keys.has(key)) {
        keys.add(key);
        count += 1;
      }
    }
    return { count };
  };
  return keys;
};

test("future schedule dates produce sixteen active 30-minute candidates", () => {
  const candidates = buildScheduleCandidates({
    startDate: "2026-08-05",
    horizonDays: 1,
    now: new Date("2026-08-04T14:00:00+07:00"),
  });

  assert.equal(candidates.length, 16);
  assert.equal(candidates[0].jam_mulai.toISOString().slice(11, 16), "09:00");
  assert.equal(candidates[0].jam_selesai.toISOString().slice(11, 16), "09:30");
  assert.equal(candidates.at(-1).jam_mulai.toISOString().slice(11, 16), "16:30");
  assert.equal(candidates.at(-1).jam_selesai.toISOString().slice(11, 16), "17:00");
  assert.equal(candidates[0].status_jadwal, StatusJadwal.Aktif);
  assert.equal(candidates[0].no_reservasi, null);
});

test("today only plans slots whose WIB start time is after now", async () => {
  const now = new Date("2026-08-04T14:00:00+07:00");
  let inserted = [];
  prisma.jadwal.createMany = async ({ data }) => {
    inserted = data;
    return { count: data.length };
  };

  const summary = await jadwalService.ensureScheduleWindow({
    startDate: "2026-08-04",
    horizonDays: 1,
    now,
  });

  assert.equal(summary.slot_direncanakan, 5);
  assert.equal(summary.slot_dibuat, 5);
  assert.equal(summary.slot_dilewati, 0);
  assert.equal(inserted[0].jam_mulai.toISOString().slice(11, 16), "14:30");
});

test("generator is idempotent and never changes existing slots", async () => {
  const existing = buildScheduleCandidates({
    startDate: "2026-08-05",
    horizonDays: 1,
    now: new Date("2026-08-04T14:00:00+07:00"),
  })[0];
  existing.status_jadwal = StatusJadwal.Nonaktif;
  existing.no_reservasi = "RSV-000001";
  useCreateManyRecorder([existing]);

  const options = {
    startDate: "2026-08-05",
    horizonDays: 1,
    now: new Date("2026-08-04T14:00:00+07:00"),
  };
  const first = await jadwalService.ensureScheduleWindow(options);
  const second = await jadwalService.ensureScheduleWindow(options);

  assert.equal(first.slot_dibuat, 15);
  assert.equal(first.slot_dilewati, 1);
  assert.equal(second.slot_dibuat, 0);
  assert.equal(second.slot_dilewati, 16);
  assert.equal(existing.status_jadwal, StatusJadwal.Nonaktif);
  assert.equal(existing.no_reservasi, "RSV-000001");
});

test("parallel generator executions rely on the unique constraint safely", async () => {
  const keys = useCreateManyRecorder();
  const options = {
    startDate: "2026-08-05",
    horizonDays: 1,
    now: new Date("2026-08-04T14:00:00+07:00"),
  };
  const [first, second] = await Promise.all([
    jadwalService.ensureScheduleWindow(options),
    jadwalService.ensureScheduleWindow(options),
  ]);

  assert.equal(first.slot_dibuat + second.slot_dibuat, 16);
  assert.equal(keys.size, 16);
});

test("horizon configuration defaults safely and accepts valid environment values", () => {
  assert.equal(scheduleHorizonDays(undefined), 30);
  assert.equal(scheduleHorizonDays("7"), 7);
  assert.equal(scheduleHorizonDays("0"), 30);
  assert.equal(scheduleHorizonDays("invalid"), 30);
});
