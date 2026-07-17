import styles from "../../styles/patient-reservation.module.css";
import cx from "../../utils/classNames.js";
export default function ReservationSummary({
  doctor,
  service,
  selectedDate,
  selectedTime,
}) {
  return (
    <aside className={cx(styles, "summary-card")}>
      <div className={cx(styles, "summary-card__header")}>
        <h2 className={cx(styles, "summary-card__header-title")}>Ringkasan Reservasi</h2>
      </div>

      <div className={cx(styles, "summary-card__body")}>
        <div className={cx(styles, "summary-row")}>
          <div className={cx(styles, "summary-row__icon")}>
            <img src="/assets/icon-reservation-doctor.svg" alt="" />
          </div>
          <div>
            <p className={cx(styles, "summary-row__label")}>Dokter</p>
            <p className={cx(styles, "summary-row__value")}>{doctor.name}</p>
            <p className={cx(styles, "summary-row__sub")}>{doctor.specialization}</p>
          </div>
        </div>

        <div className={cx(styles, "summary-row")}>
          <div className={cx(styles, "summary-row__icon")}>
            <img src="/assets/icon-reservation-check.svg" alt="" />
          </div>
          <div>
            <p className={cx(styles, "summary-row__label")}>Layanan</p>
            <p className={cx(styles, "summary-row__value")}>{service.name}</p>
          </div>
        </div>

        <div className={cx(styles, "summary-row")}>
          <div className={cx(styles, "summary-row__icon")}>
            <img src="/assets/icon-clock.svg" alt="" />
          </div>
          <div>
            <p className={cx(styles, "summary-row__label")}>Estimasi</p>
            <p className={cx(styles, "summary-row__value")}>{service.duration}</p>
          </div>
        </div>

        <div className={cx(styles, "summary-row")}>
          <div className={cx(styles, "summary-row__icon")}>
            <img src="/assets/icon-reservation-calendar.svg" alt="" />
          </div>
          <div>
            <p className={cx(styles, "summary-row__label")}>Tanggal</p>
            <p className={cx(styles, "summary-row__value")}>
              {selectedDate ? `${selectedDate.date} · ${selectedDate.day}` : "Belum dipilih"}
            </p>
          </div>
        </div>

        <div className={cx(styles, "summary-row")}>
          <div className={cx(styles, "summary-row__icon")}>
            <img src="/assets/icon-clock.svg" alt="" />
          </div>
          <div>
            <p className={cx(styles, "summary-row__label")}>Jam</p>
            <p className={cx(styles, "summary-row__value")}>{selectedTime || "Belum dipilih"}</p>
          </div>
        </div>

        <div className={cx(styles, "summary-divider")}>
          <div className={cx(styles, "summary-total")}>
            <span className={cx(styles, "summary-total__label")}>Total Biaya</span>
            <span className={cx(styles, "summary-total__value")}>{service.price}</span>
          </div>
          <p className={cx(styles, "summary-note")}>
            Pembayaran dilakukan di kasir setelah kunjungan.
          </p>
        </div>
      </div>
    </aside>
  );
}
