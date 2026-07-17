import { useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../components/Icons.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { TIME_SLOTS, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistOperationalSchedulePage.module.css'

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
