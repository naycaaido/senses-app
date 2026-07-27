import BadRequestError from "../exceptions/BadRequestError.js";
import pembayaranService from "../services/pembayaranService.js";

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

const getTagihan = async (req, res, next) => {
  try {
    const tagihan = await pembayaranService.getTagihan(req.params.no_reservasi);
    return res.status(200).json({ tagihan });
  } catch (error) {
    return next(error);
  }
};

const createPembayaran = async (req, res, next) => {
  try {
    const pembayaran = await pembayaranService.createPembayaran(req.body);
    return res.status(201).json({
      message: "Payment created successfully",
      pembayaran,
    });
  } catch (error) {
    return next(error);
  }
};

const listPembayaran = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, "page", 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, "limit", 20, 100);
    const metode_pembayaran =
      typeof req.query.metode_pembayaran === "string"
        ? req.query.metode_pembayaran
        : undefined;

    const result = await pembayaranService.listPembayaran({
      page,
      limit,
      metode_pembayaran,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getPembayaranById = async (req, res, next) => {
  try {
    const pembayaran = await pembayaranService.getPembayaranById(
      req.params.id_pembayaran,
    );
    return res.status(200).json({ pembayaran });
  } catch (error) {
    return next(error);
  }
};

export default {
  getTagihan,
  createPembayaran,
  listPembayaran,
  getPembayaranById,
};
