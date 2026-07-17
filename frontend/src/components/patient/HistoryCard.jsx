import styles from "../../styles/patient-history.module.css";
import cx from "../../utils/classNames.js";
import StatusBadge from "./StatusBadge.jsx";

export default function HistoryCard({ visit }) {
  const {
    serviceName,
    reservationId,
    status,
    date,
    time,
    duration,
    paymentMethod,
    noteLabel,
    note,
    totalPayment,
  } = visit;

  return (
    <article
      className={cx(styles, "history-card", `history-card--${status.toLowerCase()}`)}
    >
      <div className={cx(styles, "history-card__header")}>
        <div className={cx(styles, "history-card__service")}>
          <div className={cx(styles, "history-card__icon")}>
            <img
              src="/assets/icon-history-service.svg"
              alt=""
              className={cx(styles, "history-card__icon-img")}
              aria-hidden="true"
            />
          </div>
          <div className={cx(styles, "history-card__service-text")}>
            <h3 className={cx(styles, "history-card__service-name")}>{serviceName}</h3>
            <p className={cx(styles, "history-card__service-id")}>ID: {reservationId}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className={cx(styles, "history-card__meta")}>
        <div className={cx(styles, "history-card__meta-item")}>
          <p className={cx(styles, "history-card__meta-label")}>TANGGAL</p>
          <p className={cx(styles, "history-card__meta-value")}>{date}</p>
        </div>
        <div className={cx(styles, "history-card__meta-item")}>
          <p className={cx(styles, "history-card__meta-label")}>WAKTU</p>
          <p className={cx(styles, "history-card__meta-value")}>{time}</p>
        </div>
        <div className={cx(styles, "history-card__meta-item")}>
          <p className={cx(styles, "history-card__meta-label")}>DURASI</p>
          <p className={cx(styles, "history-card__meta-value")}>{duration}</p>
        </div>
        <div className={cx(styles, "history-card__meta-item")}>
          <p className={cx(styles, "history-card__meta-label")}>METODE BAYAR</p>
          <p className={cx(styles, "history-card__meta-value")}>{paymentMethod || "—"}</p>
        </div>
      </div>

      <div className={cx(styles, "history-card__note")}>
        <p className={cx(styles, "history-card__note-label")}>{noteLabel}</p>
        <p className={cx(styles, "history-card__note-text")}>{note}</p>
      </div>

      <div className={cx(styles, "history-card__footer")}>
        <div className={cx(styles, "history-card__total")}>
          <p className={cx(styles, "history-card__total-label")}>Total Pembayaran</p>
          <p className={cx(styles, "history-card__total-value")}>
            {totalPayment ? `Rp ${totalPayment}` : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}
