const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "Selesai", label: "Selesai" },
  { id: "Dibatalkan", label: "Dibatalkan" },
];

export default function HistoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter status">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium leading-5 ${value === filter.id ? "bg-[#35463a] text-white" : "bg-[#faf7f2] text-[#4b5563]"}`}
          onClick={() => onChange(filter.id)}
          aria-pressed={value === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
