import { useEffect, useMemo, useState } from "react";
import HistorySearch from "../components/HistorySearch.jsx";
import HistoryFilter from "../components/HistoryFilter.jsx";
import HistoryCard from "../components/HistoryCard.jsx";
import { getMyReservations } from "../../../shared/services/reservasiApi.js";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});
const EMPTY_MESSAGE = "Tidak ada riwayat kunjungan yang sesuai.";

function toVisit(reservasi) {
  const firstSlot = reservasi.jadwal?.[0];
  return {
    serviceName: reservasi.layanan.nama_layanan,
    reservationId: reservasi.no_reservasi,
    status: reservasi.status_reservasi,
    date: firstSlot ? dateFormatter.format(new Date(`${firstSlot.tanggal}T00:00:00`)) : "—",
    time: firstSlot ? `${firstSlot.jam_mulai} WIB` : "—",
    duration: `${reservasi.layanan.estimasi_durasi} Menit`,
    paymentMethod: null,
    noteLabel: reservasi.keluhan_awal ? "Keluhan Awal" : "Catatan Reservasi",
    note: reservasi.keluhan_awal || "Tidak ada keluhan awal.",
    totalPayment: rupiahFormatter.format(reservasi.harga_layanan),
  };
}

export default function PatientHistoryPage() {
  const [visits, setVisits] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVisits = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyReservations({ page: 1, limit: 100 });
      setVisits(result.data.map(toVisit));
    } catch (requestError) {
      setError(requestError.message || "Riwayat reservasi belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const filteredVisits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return visits.filter((visit) => {
      const matchesStatus = statusFilter === "all" || visit.status === statusFilter;
      const matchesQuery = normalizedQuery === "" ||
        visit.serviceName.toLowerCase().includes(normalizedQuery) ||
        visit.reservationId.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, visits]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <header className="mb-6">
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Riwayat Kunjungan</h1>
        <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">Riwayat kunjungan dan layanan yang pernah Anda lakukan di Sense&rsquo;s Clinic.</p>
      </header>

      <div className="mb-6 flex flex-col items-stretch gap-4 rounded-[18px] border border-[#f3f4f6] bg-white p-[17px] shadow-sm min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
        <HistorySearch value={query} onChange={setQuery} />
        <HistoryFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {loading && <p className="m-0 rounded-[18px] border border-[#f3f4f6] bg-white px-6 py-12 text-center text-[15px] leading-6 text-[#6b6b6b]" role="status">Memuat riwayat reservasi...</p>}
      {!loading && error && (
        <div className="rounded-[18px] border border-[#e5c7c1] bg-[#fff5f2] px-6 py-8 text-center text-[#8a3324]" role="alert">
          <p className="m-0">{error}</p>
          <button type="button" className="mt-3 rounded-full bg-[#3d4940] px-4 py-2 text-sm font-medium text-[#fbf8f3] hover:bg-[#0c3320]" onClick={loadVisits}>Coba lagi</button>
        </div>
      )}
      {!loading && !error && (filteredVisits.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredVisits.map((visit) => (
            <HistoryCard key={visit.reservationId} visit={visit} />
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-[18px] border border-[#f3f4f6] bg-white px-6 py-12 text-center text-[15px] leading-6 text-[#6b6b6b]">{EMPTY_MESSAGE}</p>
      ))}
    </div>
  );
}
