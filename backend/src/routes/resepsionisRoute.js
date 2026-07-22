import { Router } from "express";
import resepsionisPasienController from "../controller/resepsionisPasienController.js";
import resepsionisLayananController from "../controller/resepsionisLayananController.js";
import resepsionisJadwalController from "../controller/resepsionisJadwalController.js";
import resepsionisReservasiController from "../controller/resepsionisReservasiController.js";
import resepsionisPembayaranController from "../controller/resepsionisPembayaranController.js";
import requireRole from "../middleware/requireRole.js";
import validateToken from "../middleware/validateToken.js";

const resepsionisRoute = Router();

resepsionisRoute.use(validateToken, requireRole("resepsionis"));

resepsionisRoute.get("/resepsionis/pasien", resepsionisPasienController.listPasien);
resepsionisRoute.post("/resepsionis/pasien", resepsionisPasienController.createPasien);
resepsionisRoute.put(
  "/resepsionis/pasien/:email",
  resepsionisPasienController.updatePasien,
);

resepsionisRoute.get(
  "/resepsionis/layanan",
  resepsionisLayananController.listLayanan,
);
resepsionisRoute.post(
  "/resepsionis/layanan",
  resepsionisLayananController.createLayanan,
);
resepsionisRoute.put(
  "/resepsionis/layanan/:id_layanan",
  resepsionisLayananController.updateLayanan,
);
resepsionisRoute.patch(
  "/resepsionis/layanan/:id_layanan/nonaktif",
  resepsionisLayananController.nonaktifkanLayanan,
);

resepsionisRoute.get(
  "/resepsionis/jadwal",
  resepsionisJadwalController.getJadwal,
);
resepsionisRoute.post(
  "/resepsionis/jadwal",
  resepsionisJadwalController.createJadwal,
);
resepsionisRoute.patch(
  "/resepsionis/jadwal/:id_jadwal/aktif",
  resepsionisJadwalController.aktifkanJadwal,
);
resepsionisRoute.patch(
  "/resepsionis/jadwal/:id_jadwal/nonaktif",
  resepsionisJadwalController.nonaktifkanJadwal,
);

resepsionisRoute.get(
  "/resepsionis/reservasi",
  resepsionisReservasiController.listReservations,
);
resepsionisRoute.post(
  "/resepsionis/reservasi",
  resepsionisReservasiController.createReservation,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/hadir",
  resepsionisReservasiController.tandaiHadir,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/selesai",
  resepsionisReservasiController.selesaikanReservation,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/tidak-hadir",
  resepsionisReservasiController.tandaiTidakHadir,
);
resepsionisRoute.patch(
  "/resepsionis/reservasi/:no_reservasi/batal",
  resepsionisReservasiController.batalkanReservation,
);

resepsionisRoute.get(
  "/resepsionis/reservasi/:no_reservasi/tagihan",
  resepsionisPembayaranController.getTagihan,
);
resepsionisRoute.post(
  "/resepsionis/pembayaran",
  resepsionisPembayaranController.createPembayaran,
);
resepsionisRoute.get(
  "/resepsionis/pembayaran",
  resepsionisPembayaranController.listPembayaran,
);
resepsionisRoute.get(
  "/resepsionis/pembayaran/:id_pembayaran",
  resepsionisPembayaranController.getPembayaranById,
);

export default resepsionisRoute;
