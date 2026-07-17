import styles from "../../styles/patient-reservation.module.css";
import cx from "../../utils/classNames.js";
export default function DateSelector({ dates, selectedId, onSelect }) {
  return (
    <div className={cx(styles, "date-selector")}>
      <h2 className={cx(styles, "date-selector__title")}>Pilih Jadwal</h2>
      <div className={cx(styles, "date-selector__dates")}>
        {dates.map((date) => {
          const isSelected = date.id === selectedId;
          return (
            <button
              key={date.id}
              type="button"
              className={cx(
                styles,
                "date-pill",
                isSelected && "date-pill--selected",
              )}
              onClick={() => onSelect(date.id)}
              aria-pressed={isSelected}
            >
              <span className={cx(styles, "date-pill__date")}>{date.date}</span>
              <span className={cx(styles, "date-pill__day")}>{date.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
