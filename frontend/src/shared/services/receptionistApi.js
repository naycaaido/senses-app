import api from "../utils/api.js";

const toDotTime = (value) => (typeof value === "string" ? value.replace(":", ".") : "—");
const RECEPTIONIST_STATUS_ACTIONS = new Set(["hadir", "selesai", "tidak-hadir"]);

function requiredCancellationReason(value) {
  const reason = typeof value === "string" ? value.trim() : "";
  if (!reason) throw new Error("Alasan pembatalan wajib diisi.");
  if (reason.length > 255) throw new Error("Alasan pembatalan maksimal 255 karakter.");
  return reason;
}

export function mapReceptionistService(layanan) {
  return {
    id: layanan.id_layanan,
    name: layanan.nama_layanan,
    description: layanan.deskripsi_layanan,
    price: Number(layanan.harga),
    duration: layanan.estimasi_durasi,
    status: layanan.status_layanan,
  };
}

export function mapReceptionistPatient(pasien) {
  return {
    id: pasien.email,
    email: pasien.email,
    name: pasien.nama_lengkap,
    phone: pasien.telepon,
  };
}

export function mapReceptionistReservation(reservasi) {
  const firstSlot = reservasi.jadwal?.[0];
  const lastSlot = reservasi.jadwal?.at(-1);
  return {
    id: reservasi.no_reservasi,
    patientId: reservasi.email_pasien,
    patientEmail: reservasi.email_pasien,
    patientName: reservasi.pasien?.nama_lengkap || reservasi.email_pasien,
    phone: reservasi.pasien?.telepon || "—",
    service: reservasi.layanan?.nama_layanan || "—",
    price: Number(reservasi.harga_layanan),
    duration: reservasi.layanan?.estimasi_durasi || 0,
    date: firstSlot?.tanggal || reservasi.tanggal_reservasi,
    time: toDotTime(firstSlot?.jam_mulai),
    endTime: toDotTime(lastSlot?.jam_selesai),
    status: reservasi.status_reservasi,
    complaint: reservasi.keluhan_awal,
    pembatalan: reservasi.pembatalan
      ? {
          alasan_pembatalan: reservasi.pembatalan?.alasan_pembatalan,
          pihak_pembatalan: reservasi.pembatalan?.pihak_pembatalan,
          dibatalkan_pada: reservasi.pembatalan?.dibatalkan_pada,
        }
      : null,
    pembayaran: reservasi.pembayaran
      ? {
          no_reservasi: reservasi.pembayaran?.no_reservasi,
          tanggal_bayar: reservasi.pembayaran?.tanggal_bayar,
          total_biaya: reservasi.pembayaran?.total_biaya,
          metode_pembayaran: reservasi.pembayaran?.metode_pembayaran,
        }
      : null,
    slots: reservasi.jadwal || [],
  };
}

function paginated(response, mapper, message) {
  if (!Array.isArray(response?.data)) throw new Error(message);
  return { data: response.data.map(mapper), pagination: response.pagination };
}

export async function getReceptionistServices(params = {}) {
  return paginated(
    await api.get("/resepsionis/layanan", params),
    mapReceptionistService,
    "Format layanan dari server tidak valid.",
  );
}

export async function createReceptionistService(payload) {
  const response = await api.post("/resepsionis/layanan", payload);
  if (!response?.layanan) throw new Error("Format layanan dari server tidak valid.");
  return mapReceptionistService(response.layanan);
}

export async function updateReceptionistService(id, payload) {
  const response = await api.put(`/resepsionis/layanan/${id}`, payload);
  if (!response?.layanan) throw new Error("Format layanan dari server tidak valid.");
  return mapReceptionistService(response.layanan);
}

export async function setReceptionistServiceStatus(id, status) {
  const action = status === "Aktif" ? "aktif" : "nonaktif";
  const response = await api.patch(`/resepsionis/layanan/${id}/${action}`);
  if (!response?.layanan) throw new Error("Format layanan dari server tidak valid.");
  return mapReceptionistService(response.layanan);
}

export async function getReceptionistPatients(params = {}) {
  return paginated(
    await api.get("/resepsionis/pasien", params),
    mapReceptionistPatient,
    "Format pasien dari server tidak valid.",
  );
}

export async function getReceptionistSchedules(tanggal) {
  const response = await api.get("/resepsionis/jadwal", { tanggal });
  if (!Array.isArray(response?.data)) throw new Error("Format jadwal dari server tidak valid.");
  return response.data;
}

export async function setReceptionistScheduleStatus(id, status) {
  const action = status === "Aktif" ? "aktif" : "nonaktif";
  const response = await api.patch(`/resepsionis/jadwal/${id}/${action}`);
  if (!response?.jadwal) throw new Error("Format jadwal dari server tidak valid.");
  return response.jadwal;
}

export async function setAllReceptionistScheduleStatus({ tanggal, status }) {
  const response = await api.patch("/resepsionis/jadwal/batch-status", { tanggal, status });
  if (!Array.isArray(response?.data)) throw new Error("Format jadwal dari server tidak valid.");
  return response;
}

export async function getReceptionistReservations(params = {}) {
  return paginated(
    await api.get("/resepsionis/reservasi", params),
    mapReceptionistReservation,
    "Format reservasi dari server tidak valid.",
  );
}

export async function createReceptionistReservation(payload) {
  const response = await api.post("/resepsionis/reservasi", payload);
  if (!response?.reservasi) throw new Error("Format reservasi dari server tidak valid.");
  return mapReceptionistReservation(response.reservasi);
}

export async function getReceptionistReservationDetail(id) {
  const response = await api.get(`/reservasi/${encodeURIComponent(id)}`);
  if (!response?.reservasi) throw new Error("Format detail reservasi dari server tidak valid.");
  return mapReceptionistReservation(response.reservasi);
}

export async function updateReceptionistReservationStatus(id, action) {
  if (!RECEPTIONIST_STATUS_ACTIONS.has(action)) {
    throw new Error("Aksi status reservasi tidak valid.");
  }
  const response = await api.patch(`/resepsionis/reservasi/${encodeURIComponent(id)}/${action}`);
  if (!response?.reservasi) throw new Error("Format reservasi dari server tidak valid.");
  return mapReceptionistReservation(response.reservasi);
}

export async function cancelReceptionistReservation(id, alasanPembatalan) {
  const alasan_pembatalan = requiredCancellationReason(alasanPembatalan);
  const response = await api.patch(
    `/resepsionis/reservasi/${encodeURIComponent(id)}/batal`,
    { alasan_pembatalan },
  );
  if (!response?.reservasi) throw new Error("Format reservasi dari server tidak valid.");
  return mapReceptionistReservation(response.reservasi);
}
