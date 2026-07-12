export default function ReservationSummary({
  doctor,
  service,
  selectedDate,
  selectedTime,
}) {
  return (
    <aside className="summary-card">
      <div className="summary-card__header">
        <h2 className="summary-card__header-title">Ringkasan Reservasi</h2>
      </div>

      <div className="summary-card__body">
        <div className="summary-row">
          <div className="summary-row__icon">
            <img src="/assets/icon-reservation-doctor.svg" alt="" />
          </div>
          <div>
            <p className="summary-row__label">Dokter</p>
            <p className="summary-row__value">{doctor.name}</p>
            <p className="summary-row__sub">{doctor.specialization}</p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__icon">
            <img src="/assets/icon-reservation-check.svg" alt="" />
          </div>
          <div>
            <p className="summary-row__label">Layanan</p>
            <p className="summary-row__value">{service.name}</p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__icon">
            <img src="/assets/icon-clock.svg" alt="" />
          </div>
          <div>
            <p className="summary-row__label">Estimasi</p>
            <p className="summary-row__value">{service.duration}</p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__icon">
            <img src="/assets/icon-reservation-calendar.svg" alt="" />
          </div>
          <div>
            <p className="summary-row__label">Tanggal</p>
            <p className="summary-row__value">
              {selectedDate ? `${selectedDate.date} · ${selectedDate.day}` : "Belum dipilih"}
            </p>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-row__icon">
            <img src="/assets/icon-clock.svg" alt="" />
          </div>
          <div>
            <p className="summary-row__label">Jam</p>
            <p className="summary-row__value">{selectedTime || "Belum dipilih"}</p>
          </div>
        </div>

        <div className="summary-divider">
          <div className="summary-total">
            <span className="summary-total__label">Total Biaya</span>
            <span className="summary-total__value">{service.price}</span>
          </div>
          <p className="summary-note">
            Pembayaran dilakukan di kasir setelah kunjungan.
          </p>
        </div>
      </div>
    </aside>
  );
}
