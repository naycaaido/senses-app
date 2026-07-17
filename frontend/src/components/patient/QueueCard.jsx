import styles from "../../styles/patient-dashboard.module.css";
import cx from "../../utils/classNames.js";
export default function QueueCard({ time, status, service, estimatedWait }) {
  return (
    <div className={cx(styles, "queue-card")}>
      <div className={cx(styles, "queue-card__header")}>
        <p className={cx(styles, "queue-card__label")}>Jam reservasi</p>
        <p className={cx(styles, "queue-card__time")}>{time}</p>
      </div>

      <div className={cx(styles, "queue-card__body")}>
        <div className={cx(styles, "queue-card__badge")}>
          <img
            src="/assets/icon-clock-gold.svg"
            alt=""
            className={cx(styles, "queue-card__badge-icon")}
            aria-hidden="true"
          />
          <span className={cx(styles, "queue-card__badge-text")}>{status}</span>
        </div>
        <p className={cx(styles, "queue-card__service")}>{service}</p>
      </div>

      <div className={cx(styles, "queue-card__footer")}>
        <div className={cx(styles, "queue-card__estimate")}>
          <img
            src="/assets/icon-clock-estimate.svg"
            alt=""
            className={cx(styles, "queue-card__estimate-icon")}
            aria-hidden="true"
          />
          <span className={cx(styles, "queue-card__estimate-label")}>Estimasi</span>
          <span className={cx(styles, "queue-card__estimate-value")}>Menunggu</span>
        </div>
        <div className={cx(styles, "queue-card__wait")}>
          <span className={cx(styles, "queue-card__wait-value")}>&plusmn; {estimatedWait}</span>
        </div>
      </div>
    </div>
  );
}
