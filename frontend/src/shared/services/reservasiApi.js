import api from "../utils/api.js";

function requireArray(value, message) {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

function normalizeCancellation(pembatalan) {
  if (!pembatalan) return null;
  return {
    alasan_pembatalan: pembatalan?.alasan_pembatalan,
    pihak_pembatalan: pembatalan?.pihak_pembatalan,
    dibatalkan_pada: pembatalan?.dibatalkan_pada,
  };
}

function normalizeReservation(reservasi) {
  return {
    ...reservasi,
    pembatalan: normalizeCancellation(reservasi?.pembatalan),
  };
}

function requiredCancellationReason(value) {
  const reason = typeof value === "string" ? value.trim() : "";
  if (!reason) {
    throw new Error("Alasan pembatalan wajib diisi.");
  }
  if (reason.length > 255) {
    throw new Error("Alasan pembatalan maksimal 255 karakter.");
  }
  return reason;
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
  return normalizeReservation(response.reservasi);
}

export async function getReservationDetail(noReservasi) {
  const response = await api.get(`/reservasi/${encodeURIComponent(noReservasi)}`);
  if (!response?.reservasi) {
    throw new Error("Format detail reservasi dari server tidak valid.");
  }
  return normalizeReservation(response.reservasi);
}

export async function getMyReservations(params = {}) {
  const response = await api.get("/reservasi/me", params);
  return {
    data: requireArray(
      response?.data,
      "Format riwayat reservasi dari server tidak valid.",
    ).map(normalizeReservation),
    pagination: response?.pagination,
  };
}


export async function cancelPatientReservation(noReservasi, alasanPembatalan) {
  const alasan_pembatalan = requiredCancellationReason(alasanPembatalan);
  const response = await api.patch(
    `/reservasi/${encodeURIComponent(noReservasi)}/batal`,
    { alasan_pembatalan },
  );
  if (!response?.reservasi) {
    throw new Error("Format reservasi dari server tidak valid.");
  }
  return normalizeReservation(response.reservasi);
}
