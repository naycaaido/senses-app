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
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistDashboardPage.module.css'

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
