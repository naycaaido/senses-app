import styles from "../../styles/patient-profile.module.css";
import cx from "../../utils/classNames.js";
export default function ProfileInfoRow({ label, value }) {
  return (
    <div className={cx(styles, "profile-info-row")}>
      <p className={cx(styles, "profile-info-row__label")}>{label}</p>
      <p className={cx(styles, "profile-info-row__value")}>{value}</p>
    </div>
  );
}
