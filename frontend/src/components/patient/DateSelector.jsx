export default function DateSelector({ dates, selectedId, onSelect }) {
  return (
    <div className="date-selector">
      <h2 className="date-selector__title">Pilih Jadwal</h2>
      <div className="date-selector__dates">
        {dates.map((date) => {
          const isSelected = date.id === selectedId;
          return (
            <button
              key={date.id}
              type="button"
              className={
                "date-pill" + (isSelected ? " date-pill--selected" : "")
              }
              onClick={() => onSelect(date.id)}
              aria-pressed={isSelected}
            >
              <span className="date-pill__date">{date.date}</span>
              <span className="date-pill__day">{date.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
