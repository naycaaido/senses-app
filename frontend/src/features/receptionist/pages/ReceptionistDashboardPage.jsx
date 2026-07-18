import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDots,
  IconPhone,
  IconPlus,
  IconUsers,
  IconWallet,
} from '../components/Icons.jsx'
import { Avatar, Card, Chip, PageHeader, StatCard, Button } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
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
  stats: 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4', columns: 'grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]', cardHead: 'flex items-center justify-between px-5 py-4', cardTitle: 'text-[15px] font-bold text-[#191c1e]', actionCell: 'relative', dotsButton: 'rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]', menuScrim: 'fixed inset-0 z-10', menu: 'absolute right-5 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#e6e6e2] bg-white py-1 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]', menuItem: 'block w-full px-4 py-2 text-left text-[13px] text-[#191c1e] hover:bg-[#f5f5f3]', calHead: 'flex items-center justify-between', calTitle: 'text-[15px] font-bold text-[#191c1e]', calNav: 'flex gap-1', calArrow: 'rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]', calGrid: 'mt-4 grid grid-cols-7 gap-y-1 text-center', calWeekday: 'py-1 text-xs font-medium text-[#434655]', calDay: 'flex size-8 items-center justify-center rounded-full text-[13px] text-[#191c1e] transition-colors hover:not-disabled:bg-[#f5f5f3]', calDayMuted: 'cursor-default text-neutral-300 hover:bg-transparent', calDaySelected: 'bg-[#3d4940] font-semibold text-white hover:bg-[#3d4940]',
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function Calendar() {
  const [cursor, setCursor] = useState(new Date(2026, 6, 1))
  const [selected, setSelected] = useState(21)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, muted: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false })
  }

  const shift = (delta) => {
    setCursor(new Date(year, month + delta, 1))
    setSelected(null)
  }

  return (
    <Card pad="md">
      <div className={styles.calHead}>
        <p className={styles.calTitle}>
          {MONTHS[month]} {year}
        </p>
        <div className={styles.calNav}>
          <button onClick={() => shift(-1)} aria-label="Bulan sebelumnya" className={styles.calArrow}>
            <IconChevronLeft size={16} />
          </button>
          <button onClick={() => shift(1)} aria-label="Bulan berikutnya" className={styles.calArrow}>
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.calGrid}>
        {WEEKDAYS.map((d, i) => (
          <span key={i} className={styles.calWeekday}>
            {d}
          </span>
        ))}
        {cells.map((cell, i) => (
          <button
            key={i}
            disabled={cell.muted}
            onClick={() => setSelected(cell.day)}
            className={cx(
              styles.calDay,
              cell.muted && styles.calDayMuted,
              !cell.muted && selected === cell.day && styles.calDaySelected,
            )}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { reservations, patients, payments } = useStore()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(null)

  const recent = reservations.slice(0, 3)
  const todayPayments = payments.reduce((sum, p) => sum + p.amount, 0)
  const waiting = reservations.filter((r) => ['Menunggu', 'Hadir'].includes(r.status)).length

  return (
    <div className={shared.page}>
      <PageHeader
        eyebrow="Sabtu, 21 Juni 2026 | Welcome back, Receptionist Team"
        title="Dashboard"
        action={
          <Button onClick={() => navigate('/resepsionis/reservasi/baru')}>
            <IconPlus size={12} />
            Reservasi Baru
          </Button>
        }
      />

      <div className={styles.stats}>
        <StatCard
          icon={<IconUsers />}
          label="Total Patients"
          value={patients.length.toLocaleString('id-ID')}
          badge="+12%"
          badgeTone="green"
        />
        <StatCard
          icon={<IconPhone />}
          label="Today's Reservations"
          value={reservations.length}
          badge="Today"
          badgeTone="blue"
        />
        <StatCard icon={<IconClock />} label="Waiting Room" value={waiting} badge="Current" badgeTone="yellow" />
        <StatCard
          icon={<IconWallet />}
          label="Today's Payments"
          value={`Rp ${(todayPayments / 1_000_000).toFixed(1)}jt`}
          badge="Real-time"
          badgeTone="green"
        />
      </div>

      <div className={styles.columns}>
        <Card>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Recent Reservations</h2>
            <Link to="/resepsionis/reservasi" className={shared.linkBlue}>
              View All
            </Link>
          </div>
          <table className={shared.table}>
            <thead>
              <tr className={shared.theadRowY}>
                {['Patient Name', 'Doctor', 'Time', 'Status', 'Action'].map((h) => (
                  <th key={h} className={shared.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className={shared.tr}>
                  <td className={shared.td}>
                    <div className={shared.cellPerson}>
                      <Avatar name={r.patientName} />
                      <div>
                        <p className={shared.personName}>{r.patientName}</p>
                        <p className={shared.personMeta}>#{r.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className={shared.td}>{r.doctor}</td>
                  <td className={shared.td}>{r.time}</td>
                  <td className={shared.td}>
                    <Chip>{r.status}</Chip>
                  </td>
                  <td className={cx(shared.td, styles.actionCell)}>
                    <button
                      aria-label={`Aksi untuk ${r.patientName}`}
                      onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className={styles.dotsButton}
                    >
                      <IconDots size={18} />
                    </button>
                    {openMenu === r.id && (
                      <>
                        <div className={styles.menuScrim} onClick={() => setOpenMenu(null)} />
                        <div className={styles.menu}>
                          <button
                            onClick={() => navigate(`/resepsionis/reservasi/${r.id}`)}
                            className={styles.menuItem}
                          >
                            Lihat detail reservasi
                          </button>
                          <button
                            onClick={() => navigate(`/resepsionis/data-pasien/${r.patientId}`)}
                            className={styles.menuItem}
                          >
                            Lihat data pasien
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Calendar />
      </div>
    </div>
  )
}

