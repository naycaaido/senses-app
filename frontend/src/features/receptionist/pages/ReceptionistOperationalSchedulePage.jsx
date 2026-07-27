import { useMemo, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../components/Icons.jsx";
import { TIME_SLOTS, useStore } from "../data/store.jsx";
import { cx } from "../utils/cx.js";

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function endOf(slot) {
  const [h, m] = slot.split(".").map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}.${String(total % 60).padStart(2, "0")}`;
}

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      role='switch'
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed",
        checked ? "bg-[#3d4940]" : "bg-[#d4d4d4]",
        disabled && "opacity-50",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export default function JadwalOperasional() {
  const { schedule, toggleSlot, setAllSlots, resetSchedule, reservations } =
    useStore();
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 6, 7));
  const [saved, setSaved] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const result = [];
    for (let i = firstWeekday - 1; i >= 0; i--)
      result.push({ day: daysInPrev - i, muted: true });
    for (let d = 1; d <= daysInMonth; d++)
      result.push({ day: d, muted: false });
    return result;
  }, [firstWeekday, daysInPrev, daysInMonth]);

  const bookingDates = useMemo(() => {
    const dates = new Set();
    reservations
      .filter((r) => r.status !== "Dibatalkan")
      .forEach((r) => {
        const d = new Date(r.date + "T00:00:00");
        if (d.getFullYear() === year && d.getMonth() === month)
          dates.add(r.date);
      });
    return dates;
  }, [reservations, year, month]);

  const activeCount = TIME_SLOTS.filter((s) => schedule[s].active).length;
  const inactiveCount = TIME_SLOTS.filter((s) => !schedule[s].active).length;
  const bookedCount = TIME_SLOTS.filter((s) => schedule[s].booked).length;

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className='flex flex-col gap-[22px]'>
      {/* ── Page Header ── */}
      <div>
        <p className='text-[11px] font-bold uppercase tracking-[2px] text-[#b99b57]'>
          Pengaturan Operasional
        </p>
        <h1 className='mt-[8px] font-serif text-[44px] font-medium leading-tight text-[#3d4940]'>
          Kelola Ketersediaan Jadwal
        </h1>
        <p className='mt-[8px] text-[14px] leading-[1.6] text-[#747873]'>
          Atur slot praktik dokter pada jam operasional tetap klinik.
        </p>
      </div>

      {/* ── Calendar + Stats Row ── */}
      <div className='flex gap-5'>
        {/* Calendar Widget */}
        <div className='flex w-full w-full flex-col gap-5 rounded-[12px] bg-white p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]'>
          <div className='flex items-center justify-between'>
            <p className='text-[20px] font-semibold text-[#1e293b]'>Kalender</p>
            <div className='flex'>
              <button
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                aria-label='Bulan sebelumnya'
                className='rounded-[8px] p-[4px] pb-[10px] pt-[4px] text-[#1e293b] transition-colors hover:bg-[#f5f5f3]'
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                aria-label='Bulan berikutnya'
                className='rounded-[8px] p-[4px] pb-[10px] pt-[4px] text-[#1e293b] transition-colors hover:bg-[#f5f5f3]'
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>

          <p className='text-[15px] font-semibold text-[#1e293b]'>
            {MONTHS_ID[month]} {year}
          </p>

          <div className='grid grid-cols-7'>
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className='pb-[16px] text-center text-[11px] font-semibold uppercase tracking-[0.55px] text-[#737686]'
              >
                {d}
              </span>
            ))}
            {cells.map((cell, i) => {
              const dateStr = cell.muted
                ? ""
                : `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
              const hasBooking = dateStr && bookingDates.has(dateStr);
              const isSelected =
                !cell.muted &&
                selectedDate.getDate() === cell.day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <div
                  key={i}
                  className='relative flex items-center justify-center pb-[20.5px] pt-[9.5px]'
                >
                  <button
                    disabled={cell.muted}
                    onClick={() =>
                      setSelectedDate(new Date(year, month, cell.day))
                    }
                    className={cx(
                      "flex size-10 items-center justify-center text-[14px] transition-colors",
                      cell.muted
                        ? "cursor-default text-[#c3c6d7]"
                        : isSelected
                          ? "rounded-[8px] bg-[#3d4940] font-bold text-white"
                          : "rounded-[8px] font-semibold text-[#1e293b] hover:bg-[#f5f5f3]",
                    )}
                  >
                    {cell.day}
                  </button>
                  {hasBooking && !isSelected && !cell.muted && (
                    <span className='absolute bottom-[4px] left-1/2 size-[4px] -translate-x-1/2 rounded-full bg-[#f59e0b]' />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats + Actions */}
        <div className='flex w-full flex-col gap-5'>
          <div className='flex flex-wrap gap-[14px]'>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Total Slot
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {TIME_SLOTS.length}
              </p>
              <p className='text-[14px] text-[#747873]'>09.00 sampai 17.00</p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Slot Aktif
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {activeCount}
              </p>
              <p className='text-[14px] text-[#747873]'>Dapat dipilih pasien</p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#ece7df] bg-[rgba(255,255,255,0.75)] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Slot Nonaktif
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {inactiveCount}
              </p>
              <p className='text-[14px] text-[#747873]'>
                Jadwal tidak tersedia
              </p>
            </div>
            <div className='flex w-[calc(50%-7px)] flex-col gap-[5px] rounded-[16px] border border-[#eadcb6] bg-[#f6eedb] p-5'>
              <p className='text-[11px] font-bold uppercase tracking-[1px] text-[#747873]'>
                Sudah Dipesan
              </p>
              <p className='font-serif text-[30px] text-[#3d4940]'>
                {bookedCount}
              </p>
              <p className='text-[14px] text-[#747873]'>Tidak dapat diubah</p>
            </div>
          </div>

          <div className='flex gap-[10px] rounded-[10px] p-[10px]'>
            <button
              onClick={() => setAllSlots(false)}
              className='flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#ece7df] bg-white px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:bg-[#f5f5f3]'
            >
              Nonaktifkan Semua
            </button>
            <button
              onClick={() => setAllSlots(true)}
              className='flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#ece7df] bg-[#e9eee9] px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:brightness-95'
            >
              Aktifkan Semua
            </button>
          </div>
        </div>
      </div>

      {/* ── Schedule Card ── */}
      <div className='w-full rounded-[18px] border border-[#ece7df] bg-white p-[26px] shadow-[0_16px_40px_0_rgba(61,73,64,0.08)]'>
        <div className='flex flex-wrap items-start justify-between gap-3 border-b border-[#ece7df] pb-[22px]'>
          <div>
            <p className='font-serif text-[24px] font-medium text-[#3d4940]'>
              {selectedDate.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className='mt-[9px] text-[14px] text-[#747873]'>
              Aktifkan slot saat dokter tersedia untuk praktik.
            </p>
          </div>
          <div className='flex items-center gap-[14px] pt-[4px]'>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#3d4940]' />
              Aktif
            </span>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#d4d4d4]' />
              Nonaktif
            </span>
            <span className='flex items-center gap-[7px] text-[12px] text-[#747873]'>
              <span className='size-[8px] rounded-full bg-[#e3c97f]' />
              Dipesan
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-3 py-6'>
          {TIME_SLOTS.map((slot) => {
            const { active, booked } = schedule[slot];
            return (
              <div
                key={slot}
                className={cx(
                  "flex w-[250px] min-h-[86px] items-center justify-between rounded-[14px] border p-[17px]",
                  booked
                    ? "border-[#eadcb6] bg-[#f6eedb]"
                    : active
                      ? "border-[#cdd9cf] bg-[#fbfdfb]"
                      : "border-[#ece7df] bg-[#f5f3ef]",
                )}
              >
                <div className='flex flex-col gap-[5px]'>
                  <p
                    className={cx(
                      "font-serif text-[22px]",
                      active || booked ? "text-[#3d4940]" : "text-[#a3a3a3]",
                    )}
                  >
                    {slot}
                  </p>
                  <p className='text-[11px] text-[#747873]'>
                    {slot} – {endOf(slot)}
                  </p>
                </div>
                {booked ? (
                  <span className='flex min-h-[28px] items-center justify-center rounded-full bg-[#ead9ae] px-[10px] text-[10px] font-bold tracking-[0.2px] text-[#765d21]'>
                    DIPESAN
                  </span>
                ) : (
                  <Toggle
                    checked={active}
                    label={`Slot ${slot}`}
                    onChange={() => toggleSlot(slot)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className='rounded-[12px] bg-[#f6eedb] px-4 py-[15px] text-[12px] leading-[1.6] text-[#6c5a2e]'>
          <span className='font-bold'>Catatan:</span> Slot yang sudah dipesan
          tidak dapat dinonaktifkan. Batalkan atau jadwalkan ulang reservasi
          terkait terlebih dahulu.
        </div>

        <div className='h-[22px]' />

        <div className='flex items-center justify-end gap-[10px] border-t border-[#ece7df] pt-5'>
          {saved && (
            <span className='text-[13px] font-medium text-emerald-600'>
              Jadwal disimpan.
            </span>
          )}
          <button
            onClick={resetSchedule}
            className='flex h-11 items-center justify-center rounded-[999px] border border-[#ece7df] bg-white px-[18px] text-[13px] font-bold text-[#3d4940] transition-colors hover:bg-[#f5f5f3]'
          >
            Batalkan Perubahan
          </button>
          <button
            onClick={flash}
            className='flex h-11 items-center justify-center rounded-[999px] bg-[#3d4940] px-[18px] text-[13px] font-bold text-white transition-colors hover:bg-[#333d35]'
          >
            Simpan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}
