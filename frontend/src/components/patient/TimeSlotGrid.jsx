export default function TimeSlotGrid({ slots, selectedTime, onSelect }) {
  return (
    <div className="time-slots">
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        const classes =
          "time-slot" +
          (slot.available ? "" : " time-slot--disabled") +
          (isSelected ? " time-slot--selected" : "");
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
