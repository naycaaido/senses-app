export default function TimeSlotGrid({ slots, selectedTime, onSelect }) {
  return (
    <div className="mt-[15px] grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        const classes = `flex h-[63px] items-center justify-center rounded-[20px] border text-xl tracking-[0.06em] ${!slot.available ? "cursor-not-allowed border-[#e2e2e2] bg-[#e4e4e4] text-black/40" : isSelected ? "border-[#3d4940] bg-[#3d4940] text-white" : "border-[#e2e2e2] bg-white text-[#2c2c2c]"}`;
        return (
          <button
            key={slot.time}
            type="button"
            className={classes}
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot.time)}
            aria-pressed={isSelected}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
