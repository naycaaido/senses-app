import assert from "node:assert/strict";
import test from "node:test";
import {
  PihakPembatalan,
  StatusJadwal,
  StatusReservasi,
} from "@prisma/client";
import prisma from "../src/config/prisma.js";
import reservasiService from "../src/services/reservasiService.js";

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

const buildReservation = ({
  date = "2099-07-22",
  status = StatusReservasi.Terjadwal,
  email = "patient@example.com",
  receptionistId = 4,
  pembatalan = null,
} = {}) => ({
  no_reservasi: "RSV-000001",
  email_pasien: email,
  id_resepsionis: receptionistId,
  tanggal_reservasi: new Date(`${date}T00:00:00.000Z`),
  status_reservasi: status,
  harga_layanan: 250000,
  pasien: { email, nama_lengkap: "Patient", telepon: "0812" },
  layanan: {
    id_layanan: 1,
    nama_layanan: "Facial",
    estimasi_durasi: 30,
    harga: 250000,
  },
  jadwal: [buildSlot(1, date, "09:00")],
  pembatalan,
  pembayaran: null,
});

const setupReservationCreation = ({ slots, duration }) => {
  let createCalled = false;
  let createdData;
  const tx = {
    pasien: {
      findUnique: async () => ({ email: "patient@example.com", profil_lengkap: true }),
    },
    layanan: {
      findFirst: async () => ({ id_layanan: 1, estimasi_durasi: duration, harga: 250000 }),
    },
    jadwal: {
      findMany: async () => slots,
      updateMany: async ({ data }) => {
        for (const slot of slots) slot.no_reservasi = data.no_reservasi;
        return { count: slots.length };
      },
    },
    reservasi: {
      create: async ({ data }) => {
        createCalled = true;
        createdData = data;
        return { no_reservasi: "RSV-000002" };
      },
      findUnique: async () => ({
        ...buildReservation({ date: slots[0].tanggal.toISOString().slice(0, 10) }),
        no_reservasi: "RSV-000002",
        jadwal: slots,
      }),
    },
  };
  prisma.$transaction = async (callback) => callback(tx);
  return { wasCreated: () => createCalled, createdData: () => createdData };
};

const setupCancellation = ({
  actor = "patient",
  createError,
  reservationOptions,
} = {}) => {
  let state = buildReservation(reservationOptions);
  let released = false;
  let cancellationData;
  const originalReceptionistId = state.id_resepsionis;

  const tx = {
    reservasi: {
      findUnique: async () => state,
      update: async ({ data }) => {
        state = { ...state, ...data };
        return { no_reservasi: state.no_reservasi };
      },
    },
    pembatalanReservasi: {
      create: async ({ data }) => {
        if (createError) throw createError;
        cancellationData = {
          ...data,
          dibatalkan_pada: new Date("2026-08-03T07:00:00.000Z"),
        };
        state = { ...state, pembatalan: cancellationData };
        return cancellationData;
      },
    },
    jadwal: {
      updateMany: async () => {
        released = true;
        return { count: 1 };
      },
    },
  };
  prisma.$transaction = async (callback) => {
    const snapshot = state;
    try {
      return await callback(tx);
    } catch (error) {
      state = snapshot;
      released = false;
      throw error;
    }
  };

  const execute = () =>
    actor === "patient"
      ? reservasiService.cancelReservationByPatient({
          no_reservasi: state.no_reservasi,
          email_pasien: "patient@example.com",
          alasan_pembatalan: "Tidak dapat hadir",
        })
      : reservasiService.cancelReservationByResepsionis({
          no_reservasi: state.no_reservasi,
          id_resepsionis: 9,
          alasan_pembatalan: "Dokter berhalangan",
        });

  return {
    execute,
    state: () => state,
    released: () => released,
    cancellationData: () => cancellationData,
    originalReceptionistId,
  };
};

test("patient cancellation creates the weak entity, releases slots, and preserves receptionist", async () => {
  const setup = setupCancellation();
  const result = await setup.execute();

  assert.equal(setup.state().status_reservasi, StatusReservasi.Dibatalkan);
  assert.equal(setup.cancellationData().pihak_pembatalan, PihakPembatalan.Pasien);
  assert.equal(setup.cancellationData().alasan_pembatalan, "Tidak dapat hadir");
  assert.ok(setup.cancellationData().dibatalkan_pada);
  assert.equal(setup.released(), true);
  assert.equal(setup.state().id_resepsionis, setup.originalReceptionistId);
  assert.equal(result.pembatalan.pihak_pembatalan, PihakPembatalan.Pasien);
  assert.equal(result.alasan_pembatalan, undefined);

  await assert.rejects(setup.execute(), { statusCode: 409 });
});

test("patient cannot cancel another patient's reservation", async () => {
  const state = buildReservation({ email: "other@example.com" });
  prisma.$transaction = async (callback) =>
    callback({ reservasi: { findUnique: async () => state } });
  await assert.rejects(
    reservasiService.cancelReservationByPatient({
      no_reservasi: state.no_reservasi,
      email_pasien: "patient@example.com",
      alasan_pembatalan: "Tidak dapat hadir",
    }),
    { statusCode: 403 },
  );
});

test("cancellation keeps the existing scheduled-time cutoff", async () => {
  const setup = setupCancellation({ reservationOptions: { date: "2020-01-01" } });
  await assert.rejects(setup.execute(), { statusCode: 409 });
  assert.equal(setup.state().status_reservasi, StatusReservasi.Terjadwal);
  assert.equal(setup.released(), false);
});

test("receptionist cancellation records actor, assigns processor, and rolls back on insert failure", async () => {
  const setup = setupCancellation({ actor: "receptionist" });
  await setup.execute();
  assert.equal(setup.cancellationData().pihak_pembatalan, PihakPembatalan.Resepsionis);
  assert.equal(setup.state().id_resepsionis, 9);
  assert.equal(setup.released(), true);

  const failing = setupCancellation({
    actor: "receptionist",
    createError: new Error("simulated cancellation insert failure"),
  });
  await assert.rejects(failing.execute(), /simulated cancellation insert failure/);
  assert.equal(failing.state().status_reservasi, StatusReservasi.Terjadwal);
  assert.equal(failing.state().id_resepsionis, failing.originalReceptionistId);
  assert.equal(failing.released(), false);

  const duplicate = setupCancellation({
    actor: "receptionist",
    createError: Object.assign(new Error("unique violation"), { code: "P2002" }),
  });
  await assert.rejects(duplicate.execute(), {
    statusCode: 409,
    message: "Reservation has already been cancelled",
  });
});

test("general status flow rejects cancellation and maps Tidak Hadir for public API", async () => {
  await assert.rejects(
    reservasiService.updateReservationByResepsionis({
      no_reservasi: "RSV-000001",
      id_resepsionis: 9,
      nextStatus: StatusReservasi.Dibatalkan,
    }),
    { statusCode: 400 },
  );

  let state = buildReservation();
  const tx = {
    reservasi: {
      findUnique: async () => state,
      update: async ({ data }) => {
        state = { ...state, ...data };
        return { no_reservasi: state.no_reservasi };
      },
    },
  };
  prisma.$transaction = async (callback) => callback(tx);
  const result = await reservasiService.updateReservationByResepsionis({
    no_reservasi: state.no_reservasi,
    id_resepsionis: 9,
    nextStatus: StatusReservasi.TidakHadir,
  });
  assert.equal(state.status_reservasi, StatusReservasi.TidakHadir);
  assert.equal(result.status_reservasi, "Tidak Hadir");
});

test("reservation list rejects an invalid public status", async () => {
  await assert.rejects(
    reservasiService.getReservationsForResepsionis({
      page: 1,
      limit: 20,
      status: "TidakHadir",
    }),
    { statusCode: 400 },
  );
});

test("reservation detail returns separate cancellation object or null", async () => {
  prisma.reservasi.findUnique = async () => buildReservation();
  const active = await reservasiService.getReservationDetail("RSV-000001", {
    role: "resepsionis",
  });
  assert.equal(active.pembatalan, null);
  assert.equal(active.alasan_pembatalan, undefined);

  prisma.reservasi.findUnique = async () =>
    buildReservation({
      status: StatusReservasi.Dibatalkan,
      pembatalan: {
        no_reservasi: "RSV-000001",
        alasan_pembatalan: "Tidak dapat hadir",
        pihak_pembatalan: PihakPembatalan.Pasien,
        dibatalkan_pada: new Date("2026-08-03T07:00:00.000Z"),
      },
    });
  const cancelled = await reservasiService.getReservationDetail("RSV-000001", {
    role: "resepsionis",
  });
  assert.equal(cancelled.pembatalan.alasan_pembatalan, "Tidak dapat hadir");
  assert.equal(cancelled.alasan_pembatalan, undefined);
});

test("reservation creation rejects past and exact-current slots for patient and receptionist", async (t) => {
  t.mock.method(Date, "now", () => FIXED_NOW);
  const patientSlot = buildSlot(1, "2026-08-03", "09:00");
  const patientAttempt = setupReservationCreation({ slots: [patientSlot], duration: 30 });
  await assert.rejects(
    reservasiService.createReservation({
      email_pasien: "patient@example.com",
      id_layanan: 1,
      id_jadwal: [1],
    }),
    { statusCode: 409 },
  );
  assert.equal(patientAttempt.wasCreated(), false);
  assert.equal(patientSlot.no_reservasi, null);

  const receptionistSlot = buildSlot(2, "2026-08-03", "14:00");
  const receptionistAttempt = setupReservationCreation({
    slots: [receptionistSlot],
    duration: 30,
  });
  await assert.rejects(
    reservasiService.createReservation({
      email_pasien: "patient@example.com",
      id_layanan: 1,
      id_jadwal: [2],
      id_resepsionis: 7,
    }),
    { statusCode: 409 },
  );
  assert.equal(receptionistAttempt.wasCreated(), false);
  assert.equal(receptionistSlot.no_reservasi, null);
});

test("reservation creation accepts future slots for patient and receptionist", async (t) => {
  t.mock.method(Date, "now", () => FIXED_NOW);
  const patientAttempt = setupReservationCreation({
    slots: [buildSlot(3, "2026-08-03", "14:30")],
    duration: 30,
  });
  await reservasiService.createReservation({
    email_pasien: "patient@example.com",
    id_layanan: 1,
    id_jadwal: [3],
  });
  assert.equal(patientAttempt.wasCreated(), true);

  const receptionistAttempt = setupReservationCreation({
    slots: [buildSlot(4, "2026-08-04", "09:00")],
    duration: 30,
  });
  await reservasiService.createReservation({
    email_pasien: "patient@example.com",
    id_layanan: 1,
    id_jadwal: [4],
    id_resepsionis: 7,
  });
  assert.equal(receptionistAttempt.createdData().id_resepsionis, 7);
});

test("multi-slot reservation validates first start without claiming rejected slots", async (t) => {
  t.mock.method(Date, "now", () => FIXED_NOW);
  const slots = [
    buildSlot(5, "2026-08-03", "13:30"),
    buildSlot(6, "2026-08-03", "14:00"),
  ];
  const attempt = setupReservationCreation({ slots, duration: 60 });
  await assert.rejects(
    reservasiService.createReservation({
      email_pasien: "patient@example.com",
      id_layanan: 1,
      id_jadwal: [5, 6],
    }),
    { statusCode: 409 },
  );
  assert.equal(attempt.wasCreated(), false);
  assert.deepEqual(slots.map((slot) => slot.no_reservasi), [null, null]);
});
