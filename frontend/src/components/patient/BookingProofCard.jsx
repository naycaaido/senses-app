import BookingInfoRow from "./BookingInfoRow.jsx";

export default function BookingProofCard({ booking }) {
  return (
    <div className="booking-proof">
      <div className="booking-proof__success">
        <div className="booking-proof__icon-circle">
          <img src="/assets/icon-booking-success.svg" alt="" aria-hidden="true" />
        </div>
        <h1 className="booking-proof__title">Reservasi Berhasil Dibuat</h1>
        <p className="booking-proof__subtitle">
          Terima kasih. Berikut bukti reservasi Anda.
        </p>
      </div>

      <div className="booking-proof__details">
        <BookingInfoRow
          icon="/assets/icon-reservation-doctor.svg"
          label="Dokter"
          value={booking.doctor}
        />
        <BookingInfoRow
          icon="/assets/icon-booking-service.svg"
          label="Layanan"
          value={booking.serviceName}
        />
        <BookingInfoRow
          icon="/assets/icon-reservation-calendar.svg"
          label="Tanggal"
          value={booking.date}
        />
        <BookingInfoRow
          icon="/assets/icon-booking-clock.svg"
          label="Jam"
          value={booking.time}
        />
      </div>

      <div className="booking-proof__total">
        <span className="booking-proof__total-label">Total Biaya</span>
        <span className="booking-proof__total-value">{booking.totalPrice}</span>
      </div>
    </div>
  );
}
