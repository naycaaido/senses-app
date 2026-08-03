import { getReservationStatusConfig } from "../../../shared/utils/statusMap.js";

const TONE_CLASSES = {
  green: "bg-[#dcfce7] text-[#15803d]",
  blue: "bg-[#dbeafe] text-[#1d4ed8]",
  red: "bg-[#fee2e2] text-[#b91c1c]",
  gray: "bg-[#e5e7eb] text-[#4b5563]",
};

export default function StatusBadge({ status }) {
  const { label, tone } = getReservationStatusConfig(status);
  return (
    <span className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase leading-4 tracking-[0.04em] ${TONE_CLASSES[tone] || TONE_CLASSES.gray}`}>
      {label.toUpperCase()}
    </span>
  );
}
