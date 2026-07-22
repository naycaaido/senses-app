import BadRequestError from "../exceptions/BadRequestError.js";
import ConflictError from "../exceptions/ConflictError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import prisma from "../config/prisma.js";

const RESERVATION_STATUS = [
  "Terjadwal",
  "Hadir",
  "Selesai",
  "Dibatalkan",
  "Tidak Hadir",
];

const STATUS_TRANSITIONS = {
  Terjadwal: ["Hadir", "Dibatalkan", "Tidak Hadir"],
  Hadir: ["Selesai"],
};

const RESERVATION_INCLUDE = {
  pasien: {
    select: {
      email: true,
      nama_lengkap: true,
      telepon: true,
    },
  },
  layanan: {
    select: {
      id_layanan: true,
      nama_layanan: true,
      estimasi_durasi: true,
      harga: true,
    },
  },
  jadwal: {
    orderBy: { jam_mulai: "asc" },
    select: {
      id_jadwal: true,
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      status_jadwal: true,
    },
  },
};

const parsePositiveInteger = (value, field) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new BadRequestError(`${field} must be a positive integer`);
  }
  return parsed;
};

const parseSlotIds = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new BadRequestError("id_jadwal must be a non-empty array");
  }

  const ids = value.map((id) => parsePositiveInteger(id, "id_jadwal"));
  if (new Set(ids).size !== ids.length) {
    throw new BadRequestError("id_jadwal cannot contain duplicate slot IDs");
  }

  return ids;
};

const serializeJadwal = (jadwal) => ({
  ...jadwal,
  tanggal: jadwal.tanggal.toISOString().slice(0, 10),
  jam_mulai: jadwal.jam_mulai.toISOString().slice(11, 16),
  jam_selesai: jadwal.jam_selesai.toISOString().slice(11, 16),
});

const serializeReservation = (reservasi) => ({
  ...reservasi,
  harga_layanan: Number(reservasi.harga_layanan),
  tanggal_reservasi: reservasi.tanggal_reservasi.toISOString().slice(0, 10),
  layanan: {
    ...reservasi.layanan,
    harga: Number(reservasi.layanan.harga),
  },
  jadwal: reservasi.jadwal.map(serializeJadwal),
});

const validateSlots = (slots, selectedIds, expectedSlotCount) => {
  if (slots.length !== selectedIds.length) {
    throw new NotFoundError("One or more schedule slots were not found");
  }

  if (slots.length !== expectedSlotCount) {
    throw new BadRequestError(
      "The number of selected slots does not match the service duration",
    );
  }

  if (
    slots.some(
      (slot) =>
        slot.status_jadwal !== "Aktif" || slot.no_reservasi !== null,
    )
  ) {
    throw new ConflictError("One or more selected schedule slots are unavailable");
  }

  const sorted = [...slots].sort(
    (left, right) => left.jam_mulai.getTime() - right.jam_mulai.getTime(),
  );
  const firstDate = sorted[0].tanggal.toISOString().slice(0, 10);

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const currentDate = current.tanggal.toISOString().slice(0, 10);

    if (
      currentDate !== firstDate ||
      current.jam_mulai.getTime() - previous.jam_mulai.getTime() !== 30 * 60 * 1000
    ) {
      throw new BadRequestError(
        "Selected schedule slots must be consecutive and on the same date",
      );
    }
  }
};

const createReservation = async ({
  email_pasien,
  id_layanan,
  id_jadwal,
  keluhan_awal,
  id_resepsionis = null,
}) => {
  const serviceId = parsePositiveInteger(id_layanan, "id_layanan");
  const slotIds = parseSlotIds(id_jadwal);
  const complaint =
    typeof keluhan_awal === "string" ? keluhan_awal.trim() || null : null;

  return prisma.$transaction(async (tx) => {
    const [patient, service, slots] = await Promise.all([
      tx.pasien.findUnique({
        where: { email: email_pasien },
        select: { email: true, profil_lengkap: true },
      }),
      tx.layanan.findFirst({
        where: { id_layanan: serviceId, status_layanan: "Aktif" },
        select: { id_layanan: true, estimasi_durasi: true, harga: true },
      }),
      tx.jadwal.findMany({
        where: { id_jadwal: { in: slotIds } },
        select: {
          id_jadwal: true,
          no_reservasi: true,
          tanggal: true,
          jam_mulai: true,
          jam_selesai: true,
          status_jadwal: true,
        },
      }),
    ]);

    if (!patient) {
      throw new NotFoundError("Patient not found");
    }
    if (!patient.profil_lengkap) {
      throw new BadRequestError("Patient profile must be completed before booking");
    }
    if (!service) {
      throw new NotFoundError("Active service not found");
    }

    validateSlots(slots, slotIds, service.estimasi_durasi / 30);

    const reservation = await tx.reservasi.create({
      data: {
        email_pasien,
        id_layanan: serviceId,
        id_resepsionis,
        keluhan_awal: complaint,
        harga_layanan: service.harga,
      },
      select: { no_reservasi: true },
    });

    const claimedSlots = await tx.jadwal.updateMany({
      where: {
        id_jadwal: { in: slotIds },
        status_jadwal: "Aktif",
        no_reservasi: null,
      },
      data: { no_reservasi: reservation.no_reservasi },
    });
    if (claimedSlots.count !== slotIds.length) {
      throw new ConflictError("Selected schedule slots were just booked by another request");
    }

    const detail = await tx.reservasi.findUnique({
      where: { no_reservasi: reservation.no_reservasi },
      include: RESERVATION_INCLUDE,
    });
    return serializeReservation(detail);
  });
};

const getReservationDetail = async (no_reservasi, user) => {
  const reservasi = await prisma.reservasi.findUnique({
    where: { no_reservasi },
    include: RESERVATION_INCLUDE,
  });
  if (!reservasi) {
    throw new NotFoundError("Reservation not found");
  }

  if (user.role === "pasien" && reservasi.email_pasien !== user.email) {
    throw new ForbiddenError("You do not have access to this reservation");
  }

  return serializeReservation(reservasi);
};

const getPatientReservations = async ({ email, page, limit }) => {
  const where = { email_pasien: email };
  const [data, total] = await Promise.all([
    prisma.reservasi.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { tanggal_reservasi: "desc" },
      include: RESERVATION_INCLUDE,
    }),
    prisma.reservasi.count({ where }),
  ]);

  return {
    data: data.map(serializeReservation),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const getReservationsForResepsionis = async ({
  page,
  limit,
  status,
  email_pasien,
}) => {
  if (status && !RESERVATION_STATUS.includes(status)) {
    throw new BadRequestError("Invalid reservation status");
  }

  const where = {
    ...(status ? { status_reservasi: status } : {}),
    ...(email_pasien ? { email_pasien } : {}),
  };
  const [data, total] = await Promise.all([
    prisma.reservasi.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { tanggal_reservasi: "desc" },
      include: RESERVATION_INCLUDE,
    }),
    prisma.reservasi.count({ where }),
  ]);

  return {
    data: data.map(serializeReservation),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

const cancellationReason = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new BadRequestError("alasan_pembatalan must be a string");
  }

  const reason = value.trim();
  if (reason.length > 255) {
    throw new BadRequestError("alasan_pembatalan must not exceed 255 characters");
  }
  return reason || null;
};

const assertValidTransition = (currentStatus, nextStatus) => {
  if (!STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new ConflictError(
      `Reservation cannot transition from ${currentStatus} to ${nextStatus}`,
    );
  }
};

const firstScheduledSlot = (reservasi) => {
  if (!reservasi.jadwal.length) {
    throw new ConflictError("Reservation does not have a schedule slot");
  }

  return [...reservasi.jadwal].sort(
    (left, right) => left.jam_mulai.getTime() - right.jam_mulai.getTime(),
  )[0];
};

const canCancelReservation = (reservasi) => {
  const firstSlot = firstScheduledSlot(reservasi);
  const date = firstSlot.tanggal.toISOString().slice(0, 10);
  const time = firstSlot.jam_mulai.toISOString().slice(11, 16);
  const startAt = new Date(`${date}T${time}:00+07:00`);

  if (Date.now() >= startAt.getTime()) {
    throw new ConflictError(
      "Reservation can no longer be cancelled because the scheduled time has passed",
    );
  }
};

const updateReservationStatus = async ({
  no_reservasi,
  nextStatus,
  id_resepsionis = undefined,
  email_pasien = undefined,
  alasan_pembatalan = undefined,
}) => {
  return prisma.$transaction(async (tx) => {
    const reservasi = await tx.reservasi.findUnique({
      where: { no_reservasi },
      include: RESERVATION_INCLUDE,
    });
    if (!reservasi) {
      throw new NotFoundError("Reservation not found");
    }

    if (email_pasien && reservasi.email_pasien !== email_pasien) {
      throw new ForbiddenError("You do not have access to this reservation");
    }

    assertValidTransition(reservasi.status_reservasi, nextStatus);

    const data = { status_reservasi: nextStatus };
    if (id_resepsionis !== undefined) {
      data.id_resepsionis = id_resepsionis;
    }

    if (nextStatus === "Dibatalkan") {
      canCancelReservation(reservasi);
      data.alasan_pembatalan = cancellationReason(alasan_pembatalan);
      await tx.jadwal.updateMany({
        where: { no_reservasi },
        data: { no_reservasi: null },
      });
    }

    await tx.reservasi.update({
      where: { no_reservasi },
      data,
      select: { no_reservasi: true },
    });
    return serializeReservation(await tx.reservasi.findUnique({
      where: { no_reservasi },
      include: RESERVATION_INCLUDE,
    }));
  });
};

const cancelReservationByPatient = async ({
  no_reservasi,
  email_pasien,
  alasan_pembatalan,
}) => {
  return updateReservationStatus({
    no_reservasi,
    nextStatus: "Dibatalkan",
    email_pasien,
    alasan_pembatalan,
  });
};

const updateReservationByResepsionis = async ({
  no_reservasi,
  id_resepsionis,
  nextStatus,
  alasan_pembatalan,
}) => {
  return updateReservationStatus({
    no_reservasi,
    nextStatus,
    id_resepsionis,
    alasan_pembatalan,
  });
};

export default {
  createReservation,
  getReservationDetail,
  getPatientReservations,
  getReservationsForResepsionis,
  cancelReservationByPatient,
  updateReservationByResepsionis,
};
