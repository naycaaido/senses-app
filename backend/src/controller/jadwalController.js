import jadwalService from "../services/jadwalService.js";

const getJadwalTersedia = async (req, res, next) => {
  try {
    const data = await jadwalService.getJadwalTersedia(req.query.tanggal);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export default { getJadwalTersedia };
