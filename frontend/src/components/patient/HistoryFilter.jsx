import styles from "../../styles/patient-history.module.css";
import cx from "../../utils/classNames.js";
const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "Selesai", label: "Selesai" },
  { id: "Dibatalkan", label: "Dibatalkan" },
];

export default function HistoryFilter({ value, onChange }) {
  return (
    <div className={cx(styles, "history-filter")} role="group" aria-label="Filter status">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={cx(
            styles,
            "history-filter__btn",
            value === filter.id && "history-filter__btn--active",
          )}
          onClick={() => onChange(filter.id)}
          aria-pressed={value === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
