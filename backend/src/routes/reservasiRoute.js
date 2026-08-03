import { Router } from "express";
import reservasiController from "../controller/reservasiController.js";
import requireRole from "../middleware/requireRole.js";
import validateToken from "../middleware/validateToken.js";

const reservasiRoute = Router();

reservasiRoute.post(
  "/reservasi",
  validateToken,
  requireRole("pasien"),
  reservasiController.createReservation,
);
reservasiRoute.get(
  "/reservasi/me",
  validateToken,
  requireRole("pasien"),
  reservasiController.getMyReservations,
);
reservasiRoute.get(
  "/reservasi/:no_reservasi",
  validateToken,
  requireRole("pasien", "resepsionis"),
  reservasiController.getReservationDetail,
);
reservasiRoute.patch(
  "/reservasi/:no_reservasi/batal",
  validateToken,
  requireRole("pasien"),
  reservasiController.cancelReservation,
);

export default reservasiRoute;
