import BadRequestError from "../exceptions/BadRequestError.js";
import jadwalService from "../services/jadwalService.js";

const parseScheduleId = (value) => {
  const id_jadwal = Number(value);
  if (!Number.isSafeInteger(id_jadwal) || id_jadwal < 1) {
    throw new BadRequestError("id_jadwal must be a positive integer");
  }
  return id_jadwal;
};

const getJadwal = async (req, res, next) => {
  try {
    const data = await jadwalService.getJadwalByResepsionis(req.query.tanggal);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const createJadwal = async (req, res, next) => {
  try {
    const jadwal = await jadwalService.createJadwal(req.body);
    return res.status(201).json({
      message: "Schedule slot created successfully",
      jadwal,
    });
  } catch (error) {
    return next(error);
  }
};

const aktifkanJadwal = async (req, res, next) => {
  try {
    const jadwal = await jadwalService.setJadwalStatus(
      parseScheduleId(req.params.id_jadwal),
      "Aktif",
    );
    return res.status(200).json({
      message: "Schedule slot activated successfully",
      jadwal,
    });
  } catch (error) {
    return next(error);
  }
};

const nonaktifkanJadwal = async (req, res, next) => {
  try {
    const jadwal = await jadwalService.setJadwalStatus(
      parseScheduleId(req.params.id_jadwal),
      "Nonaktif",
    );
    return res.status(200).json({
      message: "Schedule slot deactivated successfully",
      jadwal,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getJadwal,
  createJadwal,
  aktifkanJadwal,
  nonaktifkanJadwal,
};
