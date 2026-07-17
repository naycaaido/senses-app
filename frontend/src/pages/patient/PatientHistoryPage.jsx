import styles from "../../styles/patient-history.module.css";
import cx from "../../utils/classNames.js";
import { useMemo, useState } from "react";
import HistorySearch from "../../components/patient/HistorySearch.jsx";
import HistoryFilter from "../../components/patient/HistoryFilter.jsx";
import HistoryCard from "../../components/patient/HistoryCard.jsx";

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
    <div className={cx(styles, "patient-history")}>
      <header className={cx(styles, "patient-history__header")}>
        <h1 className={cx(styles, "patient-history__title")}>Riwayat Kunjungan</h1>
        <p className={cx(styles, "patient-history__desc")}>
          Riwayat kunjungan dan layanan yang pernah Anda lakukan di
          Sense&rsquo;s Clinic.
        </p>
      </header>

      <div className={cx(styles, "patient-history__toolbar")}>
        <HistorySearch value={query} onChange={setQuery} />
        <HistoryFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {filteredVisits.length > 0 ? (
        <div className={cx(styles, "patient-history__list")}>
          {filteredVisits.map((visit) => (
            <HistoryCard key={visit.reservationId} visit={visit} />
          ))}
        </div>
      ) : (
        <p className={cx(styles, "patient-history__empty")}>{EMPTY_MESSAGE}</p>
      )}
    </div>
  );
}
