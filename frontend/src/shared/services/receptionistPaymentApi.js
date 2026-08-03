import api from "../utils/api.js";

function assertArray(response) {
  if (!Array.isArray(response?.data)) throw new Error("Format pembayaran dari server tidak valid.");
  return { data: response.data, pagination: response.pagination };
}

export async function getReceptionistPayments(params = {}) {
  return assertArray(await api.get("/resepsionis/pembayaran", params));
}

export async function getReceptionistInvoice(noReservasi) {
  const response = await api.get(`/resepsionis/reservasi/${encodeURIComponent(noReservasi)}/tagihan`);
  if (!response?.tagihan) throw new Error("Format tagihan dari server tidak valid.");
  return response.tagihan;
}

export async function createReceptionistPayment(payload) {
  const response = await api.post("/resepsionis/pembayaran", payload);
  if (!response?.pembayaran) throw new Error("Format pembayaran dari server tidak valid.");
  return response.pembayaran;
}
