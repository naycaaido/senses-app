import { Link } from "react-router-dom";
import BookingProofCard from "../../components/patient/BookingProofCard.jsx";
import "../../styles/patient-booking-proof.css";

const booking = {
  doctor: "dr. Ria Vista Sari, SpDV",
  serviceName: "Konsultasi Kulit",
  date: "06 Juli 2026",
  time: "10.00",
  totalPrice: "Rp195.000",
};

export default function PatientBookingProofPage() {
  return (
    <div className="patient-booking-proof">
      <BookingProofCard booking={booking} />

      <div className="booking-reminder">
        <img
          src="/assets/icon-booking-info.svg"
          alt=""
          className="booking-reminder__icon"
          aria-hidden="true"
        />
        <div className="booking-reminder__text">
          <p className="booking-reminder__title">
            Mohon datang 15 menit lebih awal.
          </p>
          <p className="booking-reminder__desc">
            Lakukan registrasi ulang di resepsionis saat tiba agar status Anda
            berubah menjadi &ldquo;Hadir&rdquo; dan antrean berjalan tepat waktu.
          </p>
        </div>
      </div>

      <div className="booking-proof__actions">
        <Link to="/pasien/dashboard" className="btn-primary">
          Lihat Status Reservasi
        </Link>
        <Link to="/pasien/dashboard" className="btn-outline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
