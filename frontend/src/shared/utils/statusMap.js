const STATUS_CONFIG = {
  Terjadwal: { label: "Terkonfirmasi", tone: "green" },
  Hadir: { label: "Hadir", tone: "blue" },
  Selesai: { label: "Selesai", tone: "green" },
  Dibatalkan: { label: "Dibatalkan", tone: "red" },
  "Tidak Hadir": { label: "Tidak Hadir", tone: "red" },
};

const DEFAULT = { label: "Tidak Diketahui", tone: "gray" };

export function getReservationStatusLabel(status) {
  return STATUS_CONFIG[status]?.label ?? status ?? DEFAULT.label;
}

export function getReservationStatusConfig(status) {
  return STATUS_CONFIG[status] ?? { ...DEFAULT, label: status ?? DEFAULT.label };
}
