import styles from "../../styles/patient-booking-proof.module.css";
import cx from "../../utils/classNames.js";
import { Link } from "react-router-dom";
import BookingProofCard from "../../components/patient/BookingProofCard.jsx";

const booking = {
  doctor: "dr. Ria Vista Sari, SpDV",
  serviceName: "Konsultasi Kulit",
  date: "06 Juli 2026",
  time: "10.00",
  totalPrice: "Rp195.000",
};

export default function PatientBookingProofPage() {
  return (
    <div className={cx(styles, "patient-booking-proof")}>
      <BookingProofCard booking={booking} />

      <div className={cx(styles, "booking-reminder")}>
        <img
          src="/assets/icon-booking-info.svg"
          alt=""
          className={cx(styles, "booking-reminder__icon")}
          aria-hidden="true"
        />
        <div className={cx(styles, "booking-reminder__text")}>
          <p className={cx(styles, "booking-reminder__title")}>
            Mohon datang 15 menit lebih awal.
          </p>
          <p className={cx(styles, "booking-reminder__desc")}>
            Lakukan registrasi ulang di resepsionis saat tiba agar status Anda
            berubah menjadi &ldquo;Hadir&rdquo; dan antrean berjalan tepat waktu.
          </p>
        </div>
      </div>

      <div className={cx(styles, "booking-proof__actions")}>
        <Link to="/pasien/dashboard" className={cx(styles, "btn-primary")}>
          Lihat Status Reservasi
        </Link>
        <Link to="/pasien/dashboard" className={cx(styles, "btn-outline")}>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
