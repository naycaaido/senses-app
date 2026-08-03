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
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-[#191c1e]">
          {MONTHS[month]} {year}
        </p>
        <div className="flex gap-1">
          <button onClick={() => shift(-1)} aria-label="Bulan sebelumnya" className="rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]">
            <IconChevronLeft size={16} />
          </button>
          <button onClick={() => shift(1)} aria-label="Bulan berikutnya" className="rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]">
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="py-1 text-xs font-medium text-[#434655]">
            {d}
          </span>
        ))}
        {cells.map((cell, i) => (
          <button
            key={i}
            disabled={cell.muted}
            onClick={() => setSelected(cell.day)}
            className={cx(
              'flex size-8 items-center justify-center rounded-full text-[13px] text-[#191c1e] transition-colors hover:not-disabled:bg-[#f5f5f3]',
              cell.muted && 'cursor-default text-neutral-300 hover:bg-transparent',
              !cell.muted && selected === cell.day && 'bg-[#3d4940] font-semibold text-white hover:bg-[#3d4940]',
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
  const presentPatients = reservations.filter((r) => r.status === 'Hadir').length

  return (
    <div className="flex flex-col gap-5">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
        <StatCard icon={<IconClock />} label="Pasien Hadir" value={presentPatients} badge="Saat Ini" badgeTone="yellow" />
        <StatCard
          icon={<IconWallet />}
          label="Today's Payments"
          value={`Rp ${(todayPayments / 1_000_000).toFixed(1)}jt`}
          badge="Real-time"
          badgeTone="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Recent Reservations</h2>
            <Link to="/resepsionis/reservasi" className="text-[13px] font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-y border-[#e6e6e2] bg-[#f5f5f3]/60 text-left">
                {['Patient Name', 'Doctor', 'Time', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-[#e6e6e2] last:border-b-0">
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.patientName} />
                      <div>
                        <p className="text-[13px] font-semibold text-[#191c1e]">{r.patientName}</p>
                        <p className="text-xs text-[#434655]">#{r.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">{r.doctor}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">{r.time}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <Chip>{r.status}</Chip>
                  </td>
                  <td className={cx('px-5 py-4 text-[13px] text-[#191c1e]', 'relative')}>
                    <button
                      aria-label={`Aksi untuk ${r.patientName}`}
                      onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className="rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]"
                    >
                      <IconDots size={18} />
                    </button>
                    {openMenu === r.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-5 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#e6e6e2] bg-white py-1 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]">
                          <button
                            onClick={() => navigate(`/resepsionis/reservasi/${r.id}`)}
                            className="block w-full px-4 py-2 text-left text-[13px] text-[#191c1e] hover:bg-[#f5f5f3]"
                          >
                            Lihat detail reservasi
                          </button>
                          <button
                            onClick={() => navigate(`/resepsionis/data-pasien/${r.patientId}`)}
                            className="block w-full px-4 py-2 text-left text-[13px] text-[#191c1e] hover:bg-[#f5f5f3]"
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
