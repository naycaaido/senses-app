import { Router } from "express";
import jadwalController from "../controller/jadwalController.js";
import requireRole from "../middleware/requireRole.js";
import validateToken from "../middleware/validateToken.js";

const jadwalRoute = Router();

jadwalRoute.get(
  "/jadwal/tersedia",
  validateToken,
  requireRole("pasien"),
  jadwalController.getJadwalTersedia,
);

export default jadwalRoute;
