export default function QueueCard({ time, status, service, estimatedWait }) {
  return (
    <div className="queue-card">
      <div className="queue-card__header">
        <p className="queue-card__label">Jam reservasi</p>
        <p className="queue-card__time">{time}</p>
      </div>

      <div className="queue-card__body">
        <div className="queue-card__badge">
          <img
            src="/assets/icon-clock-gold.svg"
            alt=""
            className="queue-card__badge-icon"
            aria-hidden="true"
          />
          <span className="queue-card__badge-text">{status}</span>
        </div>
        <p className="queue-card__service">{service}</p>
      </div>

      <div className="queue-card__footer">
        <div className="queue-card__estimate">
          <img
            src="/assets/icon-clock-estimate.svg"
            alt=""
            className="queue-card__estimate-icon"
            aria-hidden="true"
          />
          <span className="queue-card__estimate-label">Estimasi</span>
          <span className="queue-card__estimate-value">Menunggu</span>
        </div>
        <div className="queue-card__wait">
          <span className="queue-card__wait-value">&plusmn; {estimatedWait}</span>
        </div>
      </div>
    </div>
  );
}
