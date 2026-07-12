const STATUS_LABELS = {
  Selesai: "SELESAI",
  Dibatalkan: "DIBATALKAN",
};

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{label}</span>;
}
