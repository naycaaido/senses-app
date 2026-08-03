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

const createReservation = async (req, res, next) => {
  try {
    const { email_pasien: _ignoredEmail, id_resepsionis: _ignoredReceptionist, ...payload } =
      req.body;
    const reservasi = await reservasiService.createReservation({
      email_pasien: req.user.email,
      ...payload,
    });
    return res.status(201).json({
      message: "Reservation created successfully",
      reservasi,
    });
  } catch (error) {
    return next(error);
  }
};

const getMyReservations = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, "page", 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, "limit", 20, 100);
    const result = await reservasiService.getPatientReservations({
      email: req.user.email,
      page,
      limit,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getReservationDetail = async (req, res, next) => {
  try {
    const reservasi = await reservasiService.getReservationDetail(
      req.params.no_reservasi,
      req.user,
    );
    return res.status(200).json({ reservasi });
  } catch (error) {
    return next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservasi = await reservasiService.cancelReservationByPatient({
      no_reservasi: req.params.no_reservasi,
      email_pasien: req.user.email,
      alasan_pembatalan: req.body.alasan_pembatalan,
    });
    return res.status(200).json({
      message: "Reservation cancelled successfully",
      reservasi,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createReservation,
  getMyReservations,
  getReservationDetail,
  cancelReservation,
};
