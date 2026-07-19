import { useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../components/Icons.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { TIME_SLOTS, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'


const WEEKDAYS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function endOf(slot) {
  const [h, m] = slot.split('.').map(Number)
  const total = h * 60 + m + 30
  return `${String(Math.floor(total / 60)).padStart(2, '0')}.${String(total % 60).padStart(2, '0')}`
}

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cx('relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50', checked && 'bg-[#3d4940]')}
    >
      <span className={cx('absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-all', checked && 'left-[22px]')} />
    </button>
  )
}

function MiniCalendar({ selected, onSelect }) {
  const [cursor, setCursor] = useState(new Date(2026, 6, 1))
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, muted: true })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false })

  return (
    <Card pad="md">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-[#191c1e]">Kalender</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Bulan sebelumnya"
            className="rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Bulan berikutnya"
            className="rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="mt-3 text-[13px] font-semibold text-[#191c1e]">
        {MONTHS_ID[month]} {year}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[10px] font-semibold tracking-[0.025em] text-[#434655]">
            {d}
          </span>
        ))}
        {cells.map((cell, i) => {
          const isSelected =
            !cell.muted && selected.getDate() === cell.day && selected.getMonth() === month
          return (
            <button
              key={i}
              disabled={cell.muted}
              onClick={() => onSelect(new Date(year, month, cell.day))}
              className={cx(
                'flex size-9 items-center justify-center rounded-lg text-[13px] text-[#191c1e] transition-colors hover:not-disabled:bg-[#f5f5f3]',
                cell.muted && 'cursor-default text-neutral-300 hover:bg-transparent',
                isSelected && 'bg-[#3d4940] font-semibold text-white hover:bg-[#3d4940]',
              )}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function StatBox({ label, value, note, highlight }) {
  return (
    <Card pad="md" className={highlight ? 'border-[#f0e6cc] bg-[#faf5e8]' : undefined}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">{label}</p>
      <p className="mt-1 font-serif text-[28px] text-[#191c1e]">{value}</p>
      <p className="mt-1 text-xs text-[#434655]">{note}</p>
    </Card>
  )
}

export default function JadwalOperasional() {
  const { schedule, toggleSlot, setAllSlots, resetSchedule } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 6, 7))
  const [saved, setSaved] = useState(false)

  const activeCount = TIME_SLOTS.filter((s) => schedule[s].active).length
  const inactiveCount = TIME_SLOTS.filter((s) => !schedule[s].active).length
  const bookedCount = TIME_SLOTS.filter((s) => schedule[s].booked).length

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#a8945e]">Pengaturan Operasional</p>
        <h1 className="font-serif text-[34px] text-[#191c1e]">Kelola Ketersediaan Jadwal</h1>
        <p className="text-[13px] text-[#434655]">Atur slot praktik dokter pada jam operasional tetap klinik.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Total Slot" value={TIME_SLOTS.length} note="09.00 sampai 17.00" />
            <StatBox label="Slot Aktif" value={activeCount} note="Dapat dipilih pasien" />
            <StatBox label="Slot Nonaktif" value={inactiveCount} note="Jadwal tidak tersedia" />
            <StatBox label="Sudah Dipesan" value={bookedCount} note="Tidak dapat diubah" highlight />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => setAllSlots(false)}>
              Nonaktifkan Semua
            </Button>
            <Button variant="soft" onClick={() => setAllSlots(true)}>
              Aktifkan Semua
            </Button>
          </div>
        </div>
      </div>

      <Card pad="lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-[22px] text-[#191c1e]">
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <p className="text-[13px] text-[#434655]">Aktifkan slot saat dokter tersedia untuk praktik.</p>
          </div>
          <div className="flex gap-4 text-[11px] text-[#434655]">
            {[
              ['bg-[#3d4940]', 'Aktif'],
              ['bg-neutral-300', 'Nonaktif'],
              ['bg-[#e3c97f]', 'Dipesan'],
            ].map(([dot, label]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={cx('size-2.5 rounded-full', dot)} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#e6e6e2] pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {TIME_SLOTS.map((slot) => {
            const { active, booked } = schedule[slot]
            return (
              <div
                key={slot}
                className={cx(
                  'flex items-center justify-between rounded-xl border border-[#e6e6e2] bg-white px-4 py-3',
                  booked && 'border-[#f0e6cc] bg-[#faf5e8]',
                  !booked && !active && 'bg-[#f5f5f3]',
                )}
              >
                <div>
                  <p className={cx('font-serif text-lg text-[#191c1e]', !active && !booked && 'text-[#a3a3a3]')}>
                    {slot}
                  </p>
                  <p className="text-[11px] text-[#434655]">
                    {slot} – {endOf(slot)}
                  </p>
                </div>
                {booked ? (
                  <Chip tone="gold">DIPESAN</Chip>
                ) : (
                  <Toggle checked={active} label={`Slot ${slot}`} onChange={() => toggleSlot(slot)} />
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-5 rounded-xl bg-[#faf5e8] px-4 py-3 text-xs text-[#8a7745]">
          <span className="font-semibold">Catatan:</span> Slot yang sudah dipesan tidak dapat
          dinonaktifkan. Batalkan atau jadwalkan ulang reservasi terkait terlebih dahulu.
        </p>

        <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#e6e6e2] pt-5">
          {saved && <span className="text-xs font-medium text-emerald-600">Jadwal disimpan.</span>}
          <Button variant="outline" onClick={resetSchedule}>
            Batalkan Perubahan
          </Button>
          <Button onClick={flash}>Simpan Jadwal</Button>
        </div>
      </Card>
    </div>
  )
}
