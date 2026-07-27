import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NoActiveReservationState from "../components/NoActiveReservationState.jsx";
import { getMyReservations } from "../../../shared/services/reservasiApi.js";
import { getAuthUser } from "../../../shared/utils/authStorage.js";

const ACTIVE_STATUSES = new Set(["Terjadwal", "Hadir"]);
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const firstNameFrom = (name) =>
  typeof name === "string" && name.trim()
    ? name.trim().split(/\s+/)[0]
    : "Pasien";

const firstSlotOf = (reservasi) =>
  [...(reservasi.jadwal || [])].sort((left, right) =>
    left.jam_mulai.localeCompare(right.jam_mulai),
  )[0];

const scheduledAt = (reservasi) => {
  const slot = firstSlotOf(reservasi);
  if (!slot?.tanggal || !slot?.jam_mulai) return Number.MAX_SAFE_INTEGER;
  return new Date(`${slot.tanggal}T${slot.jam_mulai}:00+07:00`).getTime();
};

function Header({ firstName }) {
  return (
    <header className="mb-6">
      <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#3d4940] md:text-[40px] md:leading-[46px]">
        Halo {firstName}
      </h1>
      <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">
        Pantau reservasi Anda secara langsung di sini.
      </p>
    </header>
  );
}

export default function PatientDashboardApiPage() {
  const firstName = firstNameFrom(getAuthUser()?.nama_lengkap);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyReservations({ page: 1, limit: 100 });
      setReservations(result.data);
    } catch (requestError) {
      setError(requestError.message || "Reservasi belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const activeReservation = useMemo(() =>
    reservations
      .filter((reservasi) => ACTIVE_STATUSES.has(reservasi.status_reservasi))
      .sort((left, right) => scheduledAt(left) - scheduledAt(right))[0] || null,
  [reservations]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
        <Header firstName={firstName} />
        <p className="rounded-2xl border border-[#f0ede7] bg-white px-6 py-12 text-center text-[15px] text-[#6b6b6b]" role="status">
          Memuat reservasi Anda…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
        <Header firstName={firstName} />
        <div className="rounded-2xl border border-[#e5c7c1] bg-[#fff5f2] px-6 py-8 text-center text-[#8a3324]" role="alert">
          <p className="m-0">{error}</p>
          <button type="button" onClick={loadReservations} className="mt-3 rounded-full bg-[#3d4940] px-4 py-2 text-sm font-medium text-[#fbf8f3] hover:bg-[#0c3320]">
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!activeReservation) {
    return <NoActiveReservationState firstName={firstName} />;
  }

  const firstSlot = firstSlotOf(activeReservation);
  const date = firstSlot?.tanggal
    ? dateFormatter.format(new Date(`${firstSlot.tanggal}T00:00:00`))
    : "—";
  const time = firstSlot?.jam_mulai || "—";
  const service = activeReservation.layanan?.nama_layanan || "—";
  const duration = activeReservation.layanan?.estimasi_durasi
    ? `${activeReservation.layanan.estimasi_durasi} menit`
    : "—";

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <Header firstName={firstName} />

      <div className="flex flex-col items-stretch gap-6 min-[1025px]:items-start min-[1025px]:flex-row">
        <aside className="w-full shrink-0 overflow-hidden rounded-2xl bg-[#3d4940] shadow-[0_1px_3px_rgba(44,44,44,0.06),0_12px_32px_-16px_rgba(61,73,64,0.22)] min-[1025px]:w-[360px]">
          <div className="flex flex-col items-center gap-3 px-6 pb-7 pt-8 text-center">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf8f3]/70">Reservasi Aktif</p>
            <p className="m-0 font-serif text-[64px] font-bold leading-[64px] text-[#fbf8f3] min-[1025px]:text-[88px] min-[1025px]:leading-[88px]">{time}</p>
            <span className="rounded-full border border-[#a8945e]/40 bg-[#f5edd6] px-[11px] py-[5px] text-xs font-semibold tracking-[0.06em] text-[#6b5a28]">
              {activeReservation.status_reservasi}
            </span>
            <p className="m-0 text-[15px] leading-6 text-[#fbf8f3]/80">{service}</p>
          </div>
          <div className="grid grid-cols-2 border-t border-[#fbf8f3]/15 bg-[#5c6b5e]/40 text-center">
            <div className="px-4 py-5">
              <p className="m-0 text-[11px] uppercase tracking-[0.08em] text-[#fbf8f3]/60">Tanggal</p>
              <p className="mt-1 text-sm font-medium text-[#fbf8f3]">{date}</p>
            </div>
            <div className="border-l border-[#fbf8f3]/15 px-4 py-5">
              <p className="m-0 text-[11px] uppercase tracking-[0.08em] text-[#fbf8f3]/60">Durasi</p>
              <p className="mt-1 text-sm font-medium text-[#a8945e]">{duration}</p>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]">
            <h2 className="mb-5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]">Reservasi Aktif</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                ["Layanan", service, "/assets/icon-service.svg"],
                ["Tanggal", date, "/assets/icon-calendar.svg"],
                ["Jam", `${time} WIB`, "/assets/icon-clock-dark.svg"],
                ["Durasi", duration, "/assets/icon-check-green.svg"],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]">
                    <img src={icon} alt="" className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="m-0 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">{label}</p>
                    <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f5edd6] p-4">
              <img src="/assets/icon-info-gold.svg" alt="" className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="m-0 text-[15px] leading-6 text-[#2c2c2c]">Mohon datang 15 menit lebih awal dan lakukan registrasi ulang di resepsionis.</p>
            </div>
          </div>

          <Link to="/pasien/riwayat" className="flex items-center justify-between rounded-2xl border border-[#f0ede7] bg-white p-[21px] hover:bg-[#faf7f2]">
            <div>
              <p className="m-0 font-serif text-base font-bold leading-[26.4px] text-[#3d4940]">Riwayat Kunjungan</p>
              <p className="m-0 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]">Lihat catatan perawatan Anda sebelumnya</p>
            </div>
            <img src="/assets/icon-chevron-right.svg" alt="" className="size-5 shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </div>

    </div>
  );
}
