import BadRequestError from "../exceptions/BadRequestError.js";
import ConflictError from "../exceptions/ConflictError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { MetodePembayaran, StatusReservasi } from "@prisma/client";
import prisma from "../config/prisma.js";
import { toPublicReservationStatus } from "../utils/reservationStatus.js";

const PAYMENT_METHODS = Object.values(MetodePembayaran);

const PAYMENT_INCLUDE = {
  reservasi: {
    select: {
      no_reservasi: true,
      email_pasien: true,
      status_reservasi: true,
      harga_layanan: true,
      pasien: { select: { nama_lengkap: true } },
      layanan: { select: { nama_layanan: true } },
    },
  },
};

const serializePayment = (pembayaran) => {
  return {
    ...pembayaran,
    tanggal_bayar: pembayaran.tanggal_bayar.toISOString(),
    total_biaya: Number(pembayaran.total_biaya),
    reservasi: {
      ...pembayaran.reservasi,
      status_reservasi: toPublicReservationStatus(
        pembayaran.reservasi.status_reservasi,
      ),
      harga_layanan: Number(pembayaran.reservasi.harga_layanan),
    },
  };
};

const getCompletedReservation = async (db, no_reservasi) => {
  const reservasi = await db.reservasi.findUnique({
    where: { no_reservasi },
    select: {
      no_reservasi: true,
      status_reservasi: true,
      harga_layanan: true,
      email_pasien: true,
      pasien: { select: { nama_lengkap: true } },
      layanan: { select: { nama_layanan: true } },
    },
  });
  if (!reservasi) {
    throw new NotFoundError("Reservation not found");
  }
  if (reservasi.status_reservasi !== StatusReservasi.Selesai) {
    throw new ConflictError(
      "Payment can only be processed for completed reservations",
    );
  }
  return reservasi;
};

const getTagihan = async (no_reservasi) => {
  return prisma.$transaction(async (tx) => {
    const [reservasi, pembayaran] = await Promise.all([
      getCompletedReservation(tx, no_reservasi),
      tx.pembayaran.findUnique({
        where: { no_reservasi },
        include: PAYMENT_INCLUDE,
      }),
    ]);

    return {
      no_reservasi: reservasi.no_reservasi,
      pasien: reservasi.pasien,
      layanan: reservasi.layanan,
      total_biaya: Number(reservasi.harga_layanan),
      sudah_dibayar: Boolean(pembayaran),
      pembayaran: pembayaran ? serializePayment(pembayaran) : null,
    };
  });
};

const createPembayaran = async ({ no_reservasi, metode_pembayaran }) => {
  if (typeof no_reservasi !== "string" || !no_reservasi.trim()) {
    throw new BadRequestError("no_reservasi is required");
  }
  if (!PAYMENT_METHODS.includes(metode_pembayaran)) {
    throw new BadRequestError(
      "metode_pembayaran must be Tunai, Debit, Transfer, or QRIS",
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const reservasi = await getCompletedReservation(tx, no_reservasi);
      const existing = await tx.pembayaran.findUnique({
        where: { no_reservasi },
        include: PAYMENT_INCLUDE,
      });
      if (existing) {
        throw new ConflictError("This reservation has already been paid");
      }

      const pembayaran = await tx.pembayaran.create({
        data: {
          no_reservasi,
          total_biaya: reservasi.harga_layanan,
          metode_pembayaran,
        },
        select: { no_reservasi: true },
      });

      return serializePayment(
        await tx.pembayaran.findUnique({
          where: { no_reservasi: pembayaran.no_reservasi },
          include: PAYMENT_INCLUDE,
        }),
      );
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ConflictError("This reservation has already been paid");
    }
    throw error;
  }
};

const getPembayaranById = async (no_reservasi) => {
  const pembayaran = await prisma.pembayaran.findUnique({
    where: { no_reservasi },
    include: PAYMENT_INCLUDE,
  });
  if (!pembayaran) {
    throw new NotFoundError("Payment not found");
  }
  return serializePayment(pembayaran);
};

const listPembayaran = async ({ page, limit, metode_pembayaran }) => {
  if (metode_pembayaran && !PAYMENT_METHODS.includes(metode_pembayaran)) {
    throw new BadRequestError("Invalid payment method");
  }

  const where = metode_pembayaran ? { metode_pembayaran } : undefined;
  const [data, total] = await Promise.all([
    prisma.pembayaran.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { tanggal_bayar: "desc" },
      include: PAYMENT_INCLUDE,
    }),
    prisma.pembayaran.count({ where }),
  ]);

  return {
    data: data.map(serializePayment),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

export default {
  getTagihan,
  createPembayaran,
  getPembayaranById,
  listPembayaran,
};
