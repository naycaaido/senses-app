import styles from "../../styles/patient-history.module.css";
import cx from "../../utils/classNames.js";
const STATUS_LABELS = {
  Selesai: "SELESAI",
  Dibatalkan: "DIBATALKAN",
};

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={cx(styles, "status-badge", `status-badge--${status.toLowerCase()}`)}>
      {label}
    </span>
  );
}
