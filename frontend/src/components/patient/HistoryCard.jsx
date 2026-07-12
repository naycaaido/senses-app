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
    <article className={`history-card history-card--${status.toLowerCase()}`}>
      <div className="history-card__header">
        <div className="history-card__service">
          <div className="history-card__icon">
            <img
              src="/assets/icon-history-service.svg"
              alt=""
              className="history-card__icon-img"
              aria-hidden="true"
            />
          </div>
          <div className="history-card__service-text">
            <h3 className="history-card__service-name">{serviceName}</h3>
            <p className="history-card__service-id">ID: {reservationId}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="history-card__meta">
        <div className="history-card__meta-item">
          <p className="history-card__meta-label">TANGGAL</p>
          <p className="history-card__meta-value">{date}</p>
        </div>
        <div className="history-card__meta-item">
          <p className="history-card__meta-label">WAKTU</p>
          <p className="history-card__meta-value">{time}</p>
        </div>
        <div className="history-card__meta-item">
          <p className="history-card__meta-label">DURASI</p>
          <p className="history-card__meta-value">{duration}</p>
        </div>
        <div className="history-card__meta-item">
          <p className="history-card__meta-label">METODE BAYAR</p>
          <p className="history-card__meta-value">{paymentMethod || "—"}</p>
        </div>
      </div>

      <div className="history-card__note">
        <p className="history-card__note-label">{noteLabel}</p>
        <p className="history-card__note-text">{note}</p>
      </div>

      <div className="history-card__footer">
        <div className="history-card__total">
          <p className="history-card__total-label">Total Pembayaran</p>
          <p className="history-card__total-value">
            {totalPayment ? `Rp ${totalPayment}` : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}
