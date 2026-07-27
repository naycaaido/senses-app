import { useEffect, useMemo, useState } from "react";
import HistorySearch from "../components/HistorySearch.jsx";
import HistoryFilter from "../components/HistoryFilter.jsx";
import HistoryCard from "../components/HistoryCard.jsx";
import {
  cancelPatientReservation,
  getMyReservations,
} from "../../../shared/services/reservasiApi.js";

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
  const [cancellationTarget, setCancellationTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelling, setCancelling] = useState(false);

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

  const closeCancelDialog = () => {
    if (cancelling) return;
    setCancellationTarget(null);
    setCancelReason("");
    setCancelError("");
  };

  const handleCancellation = async () => {
    if (!cancellationTarget) return;

    setCancelling(true);
    setCancelError("");
    try {
      const reservasi = await cancelPatientReservation(
        cancellationTarget.reservationId,
        cancelReason.trim() ? { alasan_pembatalan: cancelReason.trim() } : {},
      );
      const updatedVisit = toVisit(reservasi);
      setVisits((current) => current.map((visit) =>
        visit.reservationId === updatedVisit.reservationId ? updatedVisit : visit,
      ));
      setCancellationTarget(null);
      setCancelReason("");
    } catch (requestError) {
      setCancelError(
        requestError.message || "Reservasi belum dapat dibatalkan. Silakan coba lagi.",
      );
    } finally {
      setCancelling(false);
    }
  };

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
            <HistoryCard
              key={visit.reservationId}
              visit={visit}
              onCancel={setCancellationTarget}
            />
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-[18px] border border-[#f3f4f6] bg-white px-6 py-12 text-center text-[15px] leading-6 text-[#6b6b6b]">{EMPTY_MESSAGE}</p>
      ))}

      {cancellationTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#191c1e]/45 p-4 sm:items-center" role="presentation">
          <div
            className="w-full max-w-[480px] rounded-[22px] bg-white p-6 shadow-2xl sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-reservation-title"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#a03d4a]">Konfirmasi pembatalan</p>
            <h2 id="cancel-reservation-title" className="mt-2 font-serif text-[26px] font-bold leading-8 text-[#3d4940]">
              Batalkan reservasi ini?
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#4f514f]">
              Reservasi {cancellationTarget.serviceName} pada {cancellationTarget.date} pukul {cancellationTarget.time} akan dibatalkan. Aksi ini tidak dapat dikembalikan dan slot jadwal akan tersedia untuk pasien lain.
            </p>
            <label htmlFor="cancel-reason" className="mt-5 block text-sm font-semibold text-[#2c2c2c]">
              Alasan pembatalan <span className="font-normal text-[#6b6b6b]">(opsional)</span>
            </label>
            <textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              maxLength={255}
              rows={4}
              placeholder="Contoh: Ada keperluan mendadak"
              className="mt-2 w-full resize-none rounded-xl border border-[#dedbd5] px-3 py-2.5 text-sm text-[#2c2c2c] outline-none placeholder:text-[#9a9a9a] focus:border-[#3d4940]"
            />
            {cancelError && <p className="mt-3 text-sm text-[#a03d4a]" role="alert">{cancelError}</p>}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelDialog}
                disabled={cancelling}
                className="rounded-full border border-[#d7d5cf] px-5 py-2.5 text-sm font-semibold text-[#3d4940] hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleCancellation}
                disabled={cancelling}
                className="rounded-full bg-[#a03d4a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7d2432] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? "Membatalkan…" : "Ya, batalkan reservasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
