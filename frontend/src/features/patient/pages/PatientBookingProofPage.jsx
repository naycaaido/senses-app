import { Link } from "react-router-dom";
import BookingProofCard from "../components/BookingProofCard.jsx";

const booking = {
  doctor: "dr. Ria Vista Sari, SpDV",
  serviceName: "Konsultasi Kulit",
  date: "06 Juli 2026",
  time: "10.00",
  totalPrice: "Rp195.000",
};

export default function PatientBookingProofPage() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <BookingProofCard booking={booking} />

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#f5edd6] bg-[#f5edd6] p-[21px]">
        <img
          src="/assets/icon-booking-info.svg"
          alt=""
          className="mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">
            Mohon datang 15 menit lebih awal.
          </p>
          <p className="mt-1 text-[15px] leading-6 text-[#6b6b6b]">
            Lakukan registrasi ulang di resepsionis saat tiba agar status Anda
            berubah menjadi &ldquo;Hadir&rdquo; dan antrean berjalan tepat waktu.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 min-[481px]:flex-row">
        <Link to="/pasien/beranda" className="inline-flex flex-1 items-center justify-center rounded-full bg-[#3d4940] px-5 py-2.5 text-[15px] font-medium leading-6 text-[#fbf8f3] shadow-[0_1px_2px_rgba(44,44,44,0.04),0_8px_24px_rgba(61,73,64,0.18)] hover:bg-[#0c3320]">
          Lihat Status Reservasi
        </Link>
        <Link to="/pasien/beranda" className="inline-flex flex-1 items-center justify-center rounded-full border border-[#3d4940] px-5 py-2.5 text-[15px] font-medium leading-6 text-[#3d4940] hover:bg-[#3d4940]/5">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
