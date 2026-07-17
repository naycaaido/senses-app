import styles from "../../styles/patient-history.module.css";
import cx from "../../utils/classNames.js";
export default function HistorySearch({ value, onChange }) {
  return (
    <div className={cx(styles, "history-search")}>
      <img
        src="/assets/icon-search.svg"
        alt=""
        className={cx(styles, "history-search__icon")}
        aria-hidden="true"
      />
      <label
        htmlFor="patient-history-search"
        className={cx(styles, "sr-only")}
      >
        Cari riwayat kunjungan
      </label>
      <input
        id="patient-history-search"
        type="text"
        className={cx(styles, "history-search__input")}
        placeholder="Cari layanan atau ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Cari layanan atau ID"
      />
    </div>
  );
}
