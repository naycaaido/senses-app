const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "Selesai", label: "Selesai" },
  { id: "Dibatalkan", label: "Dibatalkan" },
];

export default function HistoryFilter({ value, onChange }) {
  return (
    <div className="history-filter" role="group" aria-label="Filter status">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`history-filter__btn${
            value === filter.id ? " history-filter__btn--active" : ""
          }`}
          onClick={() => onChange(filter.id)}
          aria-pressed={value === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
