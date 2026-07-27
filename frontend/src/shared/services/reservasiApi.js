import api from "../utils/api.js";

function requireArray(value, message) {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

export async function getAvailableSchedules(tanggal) {
  const response = await api.get("/jadwal/tersedia", { tanggal });
  return requireArray(response?.data, "Format jadwal dari server tidak valid.");
}

export async function createPatientReservation(payload) {
  const response = await api.post("/reservasi", payload);
  if (!response?.reservasi) {
    throw new Error("Format reservasi dari server tidak valid.");
  }
  return response.reservasi;
}

export async function getReservationDetail(noReservasi) {
  const response = await api.get(`/reservasi/${encodeURIComponent(noReservasi)}`);
  if (!response?.reservasi) {
    throw new Error("Format detail reservasi dari server tidak valid.");
  }
  return response.reservasi;
}

export async function getMyReservations(params = {}) {
  const response = await api.get("/reservasi/me", params);
  return {
    data: requireArray(response?.data, "Format riwayat reservasi dari server tidak valid."),
    pagination: response?.pagination,
  };
}


export async function cancelPatientReservation(noReservasi, payload = {}) {
  const response = await api.patch(
    `/reservasi/${encodeURIComponent(noReservasi)}/batal`,
    payload,
  );
  if (!response?.reservasi) {
    throw new Error("Format reservasi dari server tidak valid.");
  }
  return response.reservasi;
}
