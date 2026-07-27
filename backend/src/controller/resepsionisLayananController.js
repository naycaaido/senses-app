import BadRequestError from "../exceptions/BadRequestError.js";
import layananService from "../services/layananService.js";

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

const parseServiceId = (value) => {
  const id_layanan = Number(value);
  if (!Number.isSafeInteger(id_layanan) || id_layanan < 1) {
    throw new BadRequestError("id_layanan must be a positive integer");
  }
  return id_layanan;
};

const listLayanan = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, "page", 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, "limit", 20, 100);
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim() || undefined
        : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const result = await layananService.listLayananByResepsionis({
      page,
      limit,
      search,
      status,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const createLayanan = async (req, res, next) => {
  try {
    const layanan = await layananService.createLayanan(req.body);
    return res.status(201).json({
      message: "Service created successfully",
      layanan,
    });
  } catch (error) {
    return next(error);
  }
};

const updateLayanan = async (req, res, next) => {
  try {
    const layanan = await layananService.updateLayanan(
      parseServiceId(req.params.id_layanan),
      req.body,
    );
    return res.status(200).json({
      message: "Service updated successfully",
      layanan,
    });
  } catch (error) {
    return next(error);
  }
};

const nonaktifkanLayanan = async (req, res, next) => {
  try {
    const layanan = await layananService.setLayananStatus(
      parseServiceId(req.params.id_layanan),
      "Nonaktif",
    );
    return res.status(200).json({
      message: "Service deactivated successfully",
      layanan,
    });
  } catch (error) {
    return next(error);
  }
};

const aktifkanLayanan = async (req, res, next) => {
  try {
    const layanan = await layananService.setLayananStatus(
      parseServiceId(req.params.id_layanan),
      "Aktif",
    );
    return res.status(200).json({
      message: "Service activated successfully",
      layanan,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  listLayanan,
  createLayanan,
  updateLayanan,
  nonaktifkanLayanan,
  aktifkanLayanan,
};
