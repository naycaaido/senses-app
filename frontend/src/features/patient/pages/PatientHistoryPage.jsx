import { useMemo, useState } from "react";
import HistorySearch from "../components/HistorySearch.jsx";
import HistoryFilter from "../components/HistoryFilter.jsx";
import HistoryCard from "../components/HistoryCard.jsx";

const visitHistory = [
  {
    serviceName: "Konsultasi Dokter Umum",
    reservationId: "#RES-20231024-001",
    status: "Selesai",
    date: "24 Oktober 2023",
    time: "09:30 WIB",
    duration: "45 Menit",
    paymentMethod: "Transfer Bank",
    noteLabel: "Keluhan Awal",
    note: "Pasien disarankan untuk menjaga pola makan dan istirahat yang cukup selama 3 hari ke depan.",
    totalPayment: "250.000",
  },
  {
    serviceName: "Pemeriksaan Lab Rutin",
    reservationId: "#RES-20230912-045",
    status: "Selesai",
    date: "12 September 2023",
    time: "14:00 WIB",
    duration: "60 Menit",
    paymentMethod: "Kartu Kredit",
    noteLabel: "Keluhan Awal",
    note: "Hasil laboratorium normal, vitamin D ditingkatkan.",
    totalPayment: "1.200.000",
  },
  {
    serviceName: "Facial Hydra Glow",
    reservationId: "#RES-20230802-018",
    status: "Dibatalkan",
    date: "02 Agustus 2023",
    time: "11:00 WIB",
    duration: "75 Menit",
    paymentMethod: null,
    noteLabel: "Catatan Reservasi",
    note: "Reservasi dibatalkan oleh pasien karena jadwal bentrok dengan kegiatan lain.",
    totalPayment: null,
  },
];

const EMPTY_MESSAGE = "Tidak ada riwayat kunjungan yang sesuai.";

export default function PatientHistoryPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVisits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return visitHistory.filter((visit) => {
      const matchesStatus =
        statusFilter === "all" || visit.status === statusFilter;

      const matchesQuery =
        normalizedQuery === "" ||
        visit.serviceName.toLowerCase().includes(normalizedQuery) ||
        visit.reservationId.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <header className="mb-6">
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">Riwayat Kunjungan</h1>
        <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">
          Riwayat kunjungan dan layanan yang pernah Anda lakukan di
          Sense&rsquo;s Clinic.
        </p>
      </header>

      <div className="mb-6 flex flex-col items-stretch gap-4 rounded-[18px] border border-[#f3f4f6] bg-white p-[17px] shadow-sm min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
        <HistorySearch value={query} onChange={setQuery} />
        <HistoryFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {filteredVisits.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredVisits.map((visit) => (
            <HistoryCard key={visit.reservationId} visit={visit} />
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-[18px] border border-[#f3f4f6] bg-white px-6 py-12 text-center text-[15px] leading-6 text-[#6b6b6b]">{EMPTY_MESSAGE}</p>
      )}
    </div>
  );
}
