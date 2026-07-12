export default function HistorySearch({ value, onChange }) {
  return (
    <div className="history-search">
      <img
        src="/assets/icon-search.svg"
        alt=""
        className="history-search__icon"
        aria-hidden="true"
      />
      <input
        type="text"
        className="history-search__input"
        placeholder="Cari layanan atau ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Cari layanan atau ID"
      />
    </div>
  );
}
