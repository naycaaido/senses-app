export default function BookingInfoRow({ icon, label, value }) {
  return (
    <div className="booking-info">
      <div className="booking-info__icon">
        <img src={icon} alt="" aria-hidden="true" />
      </div>
      <div className="booking-info__text">
        <p className="booking-info__label">{label}</p>
        <p className="booking-info__value">{value}</p>
      </div>
    </div>
  );
}
