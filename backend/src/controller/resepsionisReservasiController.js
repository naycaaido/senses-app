import BadRequestError from "../exceptions/BadRequestError.js";
import reservasiService from "../services/reservasiService.js";

const parsePositiveInteger = (value, field, defaultValue, max) => {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) {
    throw new BadRequestError(`${field} must be an integer between 1 and ${max}`);
  }
  return parsed;
};

const listReservations = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, "page", 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, "limit", 20, 100);
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const email_pasien =
      typeof req.query.email_pasien === "string"
        ? req.query.email_pasien
        : undefined;

    const result = await reservasiService.getReservationsForResepsionis({
      page,
      limit,
      status,
      email_pasien,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const createReservation = async (req, res, next) => {
  try {
    const reservasi = await reservasiService.createReservation({
      ...req.body,
      id_resepsionis: req.user.id_resepsionis,
    });
    return res.status(201).json({
      message: "Reservation created successfully",
      reservasi,
    });
  } catch (error) {
    return next(error);
  }
};

const updateReservationStatus = (nextStatus) => async (req, res, next) => {
  try {
    const reservasi = await reservasiService.updateReservationByResepsionis({
      no_reservasi: req.params.no_reservasi,
      id_resepsionis: req.user.id_resepsionis,
      nextStatus,
      alasan_pembatalan: req.body.alasan_pembatalan,
    });
    return res.status(200).json({
      message: "Reservation status updated successfully",
      reservasi,
    });
  } catch (error) {
    return next(error);
  }
};

const tandaiHadir = updateReservationStatus("Hadir");
const selesaikanReservation = updateReservationStatus("Selesai");
const tandaiTidakHadir = updateReservationStatus("Tidak Hadir");
const batalkanReservation = updateReservationStatus("Dibatalkan");

export default {
  listReservations,
  createReservation,
  tandaiHadir,
  selesaikanReservation,
  tandaiTidakHadir,
  batalkanReservation,
};
