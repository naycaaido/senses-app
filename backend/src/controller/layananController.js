import BadRequestError from "../exceptions/BadRequestError.js";
import layananService from "../services/layananService.js";

const parseServiceId = (value) => {
  const id_layanan = Number(value);
  if (!Number.isSafeInteger(id_layanan) || id_layanan < 1) {
    throw new BadRequestError("id_layanan must be a positive integer");
  }
  return id_layanan;
};

const getLayanan = async (_req, res, next) => {
  try {
    return res.status(200).json({ data: await layananService.getActiveLayanan() });
  } catch (error) {
    return next(error);
  }
};

const getLayananById = async (req, res, next) => {
  try {
    const layanan = await layananService.getActiveLayananById(
      parseServiceId(req.params.id_layanan),
    );
    return res.status(200).json({ data: layanan });
  } catch (error) {
    return next(error);
  }
};

export default { getLayanan, getLayananById };
