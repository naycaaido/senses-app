import styles from "../../styles/patient-profile.module.css";
import cx from "../../utils/classNames.js";
export default function ProfileAvatar({ initials, size = 56, className = "" }) {
  return (
    <div
      className={cx(styles, "profile-avatar", className)}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      <span className={cx(styles, "profile-avatar__initials")}>{initials}</span>
    </div>
  );
}
