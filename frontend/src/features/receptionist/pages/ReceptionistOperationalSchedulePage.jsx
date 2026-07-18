import { useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../components/Icons.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { TIME_SLOTS, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
const shared = {
  page: 'flex flex-col gap-5',
  narrow3xl: 'mx-auto max-w-3xl',
  narrow4xl: 'mx-auto max-w-4xl',
  narrow5xl: 'mx-auto max-w-5xl',
  backLink: 'self-start text-[13px] font-semibold text-[#434655] transition-colors hover:text-[#191c1e]',
  titleSans: 'text-[22px] font-bold text-[#191c1e]',
  titleSerif: 'font-serif text-[34px] text-[#191c1e]',
  subtitle: 'text-[13px] text-[#434655]',
  eyebrowGold: 'text-[11px] font-semibold uppercase tracking-[1.5px] text-[#a8945e]',
  tableWrap: 'overflow-x-auto',
  table: 'w-full',
  tableMin600: 'min-w-[600px]',
  tableMin720: 'min-w-[720px]',
  theadRow: 'border-b border-[#e6e6e2] bg-[#f5f5f3]/60 text-left',
  theadRowY: 'border-y border-[#e6e6e2] bg-[#f5f5f3]/60 text-left',
  th: 'px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]',
  tr: 'border-b border-[#e6e6e2] last:border-b-0',
  td: 'px-5 py-4 text-[13px] text-[#191c1e]',
  cellPerson: 'flex items-center gap-3',
  personName: 'text-[13px] font-semibold text-[#191c1e]',
  personMeta: 'text-xs text-[#434655]',
  toolbar: 'flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e6e2] p-5',
  toolbarFilters: 'flex flex-wrap items-center gap-3',
  toolbarNote: 'text-xs text-[#434655]',
  pagination: 'flex flex-wrap items-center justify-between gap-3 px-5 py-4',
  paginationInfo: 'text-xs text-[#434655]',
  pager: 'flex items-center gap-1',
  pagerArrow: 'rounded-lg p-1.5 text-[#434655] transition-colors hover:not-disabled:bg-[#f5f5f3] disabled:opacity-35',
  pagerPage: 'size-8 rounded-lg text-[13px] font-medium text-[#191c1e] transition-colors hover:bg-[#f5f5f3]',
  pagerPageActive: 'bg-[#3d4940] text-white hover:bg-[#3d4940]',
  infoBox: 'rounded-xl bg-[#f5f5f3] px-4 py-3',
  infoBoxTitle: 'text-[13px] font-semibold text-[#191c1e]',
  infoBoxMeta: 'text-xs text-[#434655]',
  modalNote: 'mt-3 text-xs text-[#434655]',
  iconActions: 'flex gap-1',
  iconButton: 'rounded-lg p-2 text-[#434655] transition-colors hover:bg-[#f5f5f3] hover:text-[#191c1e]',
  iconButtonDanger: 'hover:text-[#a03d4a]',
  linkBlue: 'text-[13px] font-semibold text-blue-600 hover:underline',
  searchWrap: 'relative',
  searchIcon: 'pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]',
}

const styles = {
  topGrid: 'grid grid-cols-1 gap-5 xl:grid-cols-2', rightColumn: 'flex flex-col gap-4', statGrid: 'grid grid-cols-2 gap-4', bulkGrid: 'grid grid-cols-2 gap-4', toggle: 'relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50', toggleOn: 'bg-[#3d4940]', knob: 'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-all', knobOn: 'left-[22px]', calHead: 'flex items-center justify-between', calTitle: 'font-serif text-lg text-[#191c1e]', calNav: 'flex gap-1', calArrow: 'rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]', calMonth: 'mt-3 text-[13px] font-semibold text-[#191c1e]', calGrid: 'mt-3 grid grid-cols-7 gap-y-1 text-center', calWeekday: 'py-1 text-[10px] font-semibold tracking-[0.025em] text-[#434655]', calDay: 'flex size-9 items-center justify-center rounded-lg text-[13px] text-[#191c1e] transition-colors hover:not-disabled:bg-[#f5f5f3]', calDayMuted: 'cursor-default text-neutral-300 hover:bg-transparent', calDaySelected: 'bg-[#3d4940] font-semibold text-white hover:bg-[#3d4940]', statLabel: 'text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]', statValue: 'mt-1 font-serif text-[28px] text-[#191c1e]', statNote: 'mt-1 text-xs text-[#434655]', statHighlight: 'border-[#f0e6cc] bg-[#faf5e8]', slotHead: 'flex flex-wrap items-start justify-between gap-3', slotDate: 'font-serif text-[22px] text-[#191c1e]', legend: 'flex gap-4 text-[11px] text-[#434655]', legendItem: 'flex items-center gap-1.5', dot: 'size-2.5 rounded-full', dotActive: 'bg-[#3d4940]', dotInactive: 'bg-neutral-300', dotBooked: 'bg-[#e3c97f]', slotGrid: 'mt-5 grid grid-cols-1 gap-4 border-t border-[#e6e6e2] pt-5 sm:grid-cols-2 lg:grid-cols-3', slot: 'flex items-center justify-between rounded-xl border border-[#e6e6e2] bg-white px-4 py-3', slotOff: 'bg-[#f5f5f3]', slotBooked: 'border-[#f0e6cc] bg-[#faf5e8]', slotTime: 'font-serif text-lg text-[#191c1e]', slotTimeOff: 'text-[#a3a3a3]', slotRange: 'text-[11px] text-[#434655]', notice: 'mt-5 rounded-xl bg-[#faf5e8] px-4 py-3 text-xs text-[#8a7745]', noticeStrong: 'font-semibold', footer: 'mt-5 flex items-center justify-end gap-3 border-t border-[#e6e6e2] pt-5', savedNote: 'text-xs font-medium text-emerald-600',
}

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
      className={cx(styles.toggle, checked && styles.toggleOn)}
    >
      <span className={cx(styles.knob, checked && styles.knobOn)} />
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
      <div className={styles.calHead}>
        <h2 className={styles.calTitle}>Kalender</h2>
        <div className={styles.calNav}>
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Bulan sebelumnya"
            className={styles.calArrow}
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Bulan berikutnya"
            className={styles.calArrow}
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className={styles.calMonth}>
        {MONTHS_ID[month]} {year}
      </p>
      <div className={styles.calGrid}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.calWeekday}>
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
                styles.calDay,
                cell.muted && styles.calDayMuted,
                isSelected && styles.calDaySelected,
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
    <Card pad="md" className={highlight ? styles.statHighlight : undefined}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statNote}>{note}</p>
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
    <div className={shared.page}>
      <div>
        <p className={shared.eyebrowGold}>Pengaturan Operasional</p>
        <h1 className={shared.titleSerif}>Kelola Ketersediaan Jadwal</h1>
        <p className={shared.subtitle}>Atur slot praktik dokter pada jam operasional tetap klinik.</p>
      </div>

      <div className={styles.topGrid}>
        <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />

        <div className={styles.rightColumn}>
          <div className={styles.statGrid}>
            <StatBox label="Total Slot" value={TIME_SLOTS.length} note="09.00 sampai 17.00" />
            <StatBox label="Slot Aktif" value={activeCount} note="Dapat dipilih pasien" />
            <StatBox label="Slot Nonaktif" value={inactiveCount} note="Jadwal tidak tersedia" />
            <StatBox label="Sudah Dipesan" value={bookedCount} note="Tidak dapat diubah" highlight />
          </div>
          <div className={styles.bulkGrid}>
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
        <div className={styles.slotHead}>
          <div>
            <h2 className={styles.slotDate}>
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <p className={shared.subtitle}>Aktifkan slot saat dokter tersedia untuk praktik.</p>
          </div>
          <div className={styles.legend}>
            {[
              [styles.dotActive, 'Aktif'],
              [styles.dotInactive, 'Nonaktif'],
              [styles.dotBooked, 'Dipesan'],
            ].map(([dot, label]) => (
              <span key={label} className={styles.legendItem}>
                <span className={cx(styles.dot, dot)} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => {
            const { active, booked } = schedule[slot]
            return (
              <div
                key={slot}
                className={cx(
                  styles.slot,
                  booked && styles.slotBooked,
                  !booked && !active && styles.slotOff,
                )}
              >
                <div>
                  <p className={cx(styles.slotTime, !active && !booked && styles.slotTimeOff)}>
                    {slot}
                  </p>
                  <p className={styles.slotRange}>
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

        <p className={styles.notice}>
          <span className={styles.noticeStrong}>Catatan:</span> Slot yang sudah dipesan tidak dapat
          dinonaktifkan. Batalkan atau jadwalkan ulang reservasi terkait terlebih dahulu.
        </p>

        <div className={styles.footer}>
          {saved && <span className={styles.savedNote}>Jadwal disimpan.</span>}
          <Button variant="outline" onClick={resetSchedule}>
            Batalkan Perubahan
          </Button>
          <Button onClick={flash}>Simpan Jadwal</Button>
        </div>
      </Card>
    </div>
  )
}
