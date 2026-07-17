import styles from "../../styles/service-card.module.css";
import cx from "../../utils/classNames.js";
import { Link } from "react-router-dom";

export default function ServiceCard({
  service,
  reservationPath,
  actionLabel = "Reservasi",
}) {
  return (
    <article className={cx(styles, "service-card")}>
      <div className={cx(styles, "service-card__header")}>
        <div className={cx(styles, "service-card__header-left")}>
          <h2 className={cx(styles, "service-card__title")}>{service.name}</h2>
          <span className={cx(styles, "service-card__duration")}>
            <img
              src="/assets/icon-clock.svg"
              alt=""
              className={cx(styles, "service-card__duration-icon")}
              aria-hidden="true"
            />
            {service.duration}
          </span>
        </div>
        <span className={cx(styles, "service-card__price")}>{service.price}</span>
      </div>

      <div className={cx(styles, "service-card__body")}>
        <p className={cx(styles, "service-card__description")}>{service.description}</p>
        <div className={cx(styles, "service-card__action")}>
          <Link to={reservationPath} className={cx(styles, "service-card__btn")}>
            {actionLabel}
            <img
              src="/assets/icon-arrow.svg"
              alt=""
              className={cx(styles, "service-card__btn-icon")}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
