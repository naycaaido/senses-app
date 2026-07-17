import styles from "../../styles/patient-booking-proof.module.css";
import cx from "../../utils/classNames.js";
export default function BookingInfoRow({ icon, label, value }) {
  return (
    <div className={cx(styles, "booking-info")}>
      <div className={cx(styles, "booking-info__icon")}>
        <img src={icon} alt="" aria-hidden="true" />
      </div>
      <div className={cx(styles, "booking-info__text")}>
        <p className={cx(styles, "booking-info__label")}>{label}</p>
        <p className={cx(styles, "booking-info__value")}>{value}</p>
      </div>
    </div>
  );
}
