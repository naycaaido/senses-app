const STATUS_LABELS = {
  Selesai: "SELESAI",
  Dibatalkan: "DIBATALKAN",
};

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase leading-4 tracking-[0.04em] ${status === "Selesai" ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fee2e2] text-[#b91c1c]"}`}>
      {label}
    </span>
  );
}
