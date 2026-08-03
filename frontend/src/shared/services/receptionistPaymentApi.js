import api from "../utils/api.js";

const PAYMENT_METHODS = new Set(["Tunai", "Debit", "Transfer", "QRIS"]);

function normalizePayment(pembayaran) {
  if (!pembayaran) return null;
  return {
    no_reservasi: pembayaran.no_reservasi,
    tanggal_bayar: pembayaran.tanggal_bayar,
    total_biaya: pembayaran.total_biaya,
    metode_pembayaran: pembayaran.metode_pembayaran,
    reservasi: pembayaran.reservasi,
  };
}

function assertArray(response) {
  if (!Array.isArray(response?.data)) throw new Error("Format pembayaran dari server tidak valid.");
  return { data: response.data.map(normalizePayment), pagination: response.pagination };
}

export async function getReceptionistPayments(params = {}) {
  return assertArray(await api.get("/resepsionis/pembayaran", params));
}

export async function getReceptionistInvoice(noReservasi) {
  const response = await api.get(`/resepsionis/reservasi/${encodeURIComponent(noReservasi)}/tagihan`);
  if (!response?.tagihan) throw new Error("Format tagihan dari server tidak valid.");
  return response.tagihan;
}

export async function getReceptionistPaymentByReservation(noReservasi) {
  const response = await api.get(`/resepsionis/pembayaran/${encodeURIComponent(noReservasi)}`);
  if (!response?.pembayaran) throw new Error("Format pembayaran dari server tidak valid.");
  return normalizePayment(response.pembayaran);
}

export async function createReceptionistPayment(noReservasi, metodePembayaran) {
  const normalizedReservation = typeof noReservasi === "string" ? noReservasi.trim() : "";
  if (!normalizedReservation) throw new Error("Nomor reservasi wajib diisi.");
  if (!PAYMENT_METHODS.has(metodePembayaran)) {
    throw new Error("Metode pembayaran wajib dipilih.");
  }
  const response = await api.post("/resepsionis/pembayaran", {
    no_reservasi: normalizedReservation,
    metode_pembayaran: metodePembayaran,
  });
  if (!response?.pembayaran) throw new Error("Format pembayaran dari server tidak valid.");
  return normalizePayment(response.pembayaran);
}
