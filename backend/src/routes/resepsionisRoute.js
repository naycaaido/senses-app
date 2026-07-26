import { Router } from "express";
import resepsionisPasienController from "../controller/resepsionisPasienController.js";
import resepsionisLayananController from "../controller/resepsionisLayananController.js";
import resepsionisJadwalController from "../controller/resepsionisJadwalController.js";
import resepsionisReservasiController from "../controller/resepsionisReservasiController.js";
import resepsionisPembayaranController from "../controller/resepsionisPembayaranController.js";
import requireRole from "../middleware/requireRole.js";
import validateToken from "../middleware/validateToken.js";

const resepsionisRoute = Router();

resepsionisRoute.get(
  "/resepsionis/pasien",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPasienController.listPasien,
);
resepsionisRoute.post(
  "/resepsionis/pasien",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPasienController.createPasien,
);
resepsionisRoute.put(
  "/resepsionis/pasien/:email",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPasienController.updatePasien,
);

resepsionisRoute.get(
  "/resepsionis/layanan",
  validateToken,
  requireRole("resepsionis"),
  resepsionisLayananController.listLayanan,
);
resepsionisRoute.post(
  "/resepsionis/layanan",
  validateToken,
  requireRole("resepsionis"),
  resepsionisLayananController.createLayanan,
);
resepsionisRoute.put(
  "/resepsionis/layanan/:id_layanan",
  validateToken,
  requireRole("resepsionis"),
  resepsionisLayananController.updateLayanan,
);
resepsionisRoute.patch(
  "/resepsionis/layanan/:id_layanan/nonaktif",
  validateToken,
  requireRole("resepsionis"),
  resepsionisLayananController.nonaktifkanLayanan,
);
resepsionisRoute.patch(
  "/resepsionis/layanan/:id_layanan/aktif",
  validateToken,
  requireRole("resepsionis"),
  resepsionisLayananController.aktifkanLayanan,
);

resepsionisRoute.get(
  "/resepsionis/jadwal",
  validateToken,
  requireRole("resepsionis"),
  resepsionisJadwalController.getJadwal,
);
resepsionisRoute.post(
  "/resepsionis/jadwal",
  validateToken,
  requireRole("resepsionis"),
  resepsionisJadwalController.createJadwal,
);
resepsionisRoute.patch(
  "/resepsionis/jadwal/batch-status",
  validateToken,
  requireRole("resepsionis"),
  resepsionisJadwalController.setAllJadwalStatus,
);
resepsionisRoute.patch(
  "/resepsionis/jadwal/:id_jadwal/aktif",
  validateToken,
  requireRole("resepsionis"),
  resepsionisJadwalController.aktifkanJadwal,
);
resepsionisRoute.patch(
  "/resepsionis/jadwal/:id_jadwal/nonaktif",
  validateToken,
  requireRole("resepsionis"),
  resepsionisJadwalController.nonaktifkanJadwal,
);

resepsionisRoute.get(
  "/resepsionis/reservasi",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.listReservations,
);
resepsionisRoute.post(
  "/resepsionis/reservasi",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.createReservation,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/hadir",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.tandaiHadir,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/selesai",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.selesaikanReservation,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/tidak-hadir",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.tandaiTidakHadir,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/batal",
  validateToken,
  requireRole("resepsionis"),
  resepsionisReservasiController.batalkanReservation,
);

resepsionisRoute.get(
  "/resepsionis/reservasi/:no_reservasi/tagihan",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPembayaranController.getTagihan,
);
resepsionisRoute.post(
  "/resepsionis/pembayaran",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPembayaranController.createPembayaran,
);
resepsionisRoute.get(
  "/resepsionis/pembayaran",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPembayaranController.listPembayaran,
);
resepsionisRoute.get(
  "/resepsionis/pembayaran/:id_pembayaran",
  validateToken,
  requireRole("resepsionis"),
  resepsionisPembayaranController.getPembayaranById,
);

export default resepsionisRoute;
