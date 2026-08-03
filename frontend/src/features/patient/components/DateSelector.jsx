export default function DateSelector({ dates, selectedId, onSelect }) {
  return (
    <div>
      <h2 className="mb-4 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]">Pilih Jadwal</h2>
      <div className="flex flex-wrap gap-2.5">
        {dates.map((date) => {
          const isSelected = date.id === selectedId;
          return (
            <button
              key={date.id}
              type="button"
              className={`flex h-[71px] w-[124px] flex-col items-center justify-between rounded-[10px] border px-[15px] py-[15px] text-[#2c2c2c] ${isSelected ? "border-[#3d4940] bg-[#3d4940] text-white" : "border-[#2c2c2c] bg-white"}`}
              onClick={() => onSelect(date.id)}
              aria-pressed={isSelected}
            >
              <span className="text-xl leading-5">{date.date}</span>
              <span className="text-[15px] leading-[15px] tracking-[0.06em]">{date.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
