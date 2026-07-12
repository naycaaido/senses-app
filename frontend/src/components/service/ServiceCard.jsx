import { Link } from "react-router-dom";

export default function ServiceCard({
  service,
  reservationPath,
  actionLabel = "Reservasi",
}) {
  return (
    <article className="service-card">
      <div className="service-card__header">
        <div className="service-card__header-left">
          <h2 className="service-card__title">{service.name}</h2>
          <span className="service-card__duration">
            <img
              src="/assets/icon-clock.svg"
              alt=""
              className="service-card__duration-icon"
              aria-hidden="true"
            />
            {service.duration}
          </span>
        </div>
        <span className="service-card__price">{service.price}</span>
      </div>

      <div className="service-card__body">
        <p className="service-card__description">{service.description}</p>
        <div className="service-card__action">
          <Link to={reservationPath} className="service-card__btn">
            {actionLabel}
            <img
              src="/assets/icon-arrow.svg"
              alt=""
              className="service-card__btn-icon"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
