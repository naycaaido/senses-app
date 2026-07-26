import api from "../utils/api.js";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

function mapServiceForDisplay(layanan) {
  return {
    id: layanan.id_layanan,
    id_layanan: layanan.id_layanan,
    name: layanan.nama_layanan,
    description: layanan.deskripsi_layanan,
    price: `Rp${rupiahFormatter.format(layanan.harga)}`,
    duration: `± ${layanan.estimasi_durasi} menit`,
    durationMinutes: layanan.estimasi_durasi,
  };
}

export async function getActiveServices() {
  const response = await api.get("/layanan");
  if (!Array.isArray(response?.data)) {
    throw new Error("Format data layanan dari server tidak valid.");
  }

  return response.data.map(mapServiceForDisplay);
}
