import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight, IconPlus, IconSearch } from '../components/Icons.jsx'
import { Button, Card, Chip, EmptyRow, Field, Input, PageHeader, Select } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistReservationPage.module.css'

const PER_PAGE = 6
const STATUSES = ['Baru', 'Menunggu', 'Terkonfirmasi', 'Hadir', 'Selesai', 'Dibatalkan']

export default function Reservasi() {
  const { reservations } = useStore()
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reservations.filter((r) => {
      if (date && r.date !== date) return false
      if (status && r.status !== status) return false
      if (q && ![r.patientName, r.patientId, r.id].some((f) => f.toLowerCase().includes(q))) return false
      return true
    })
  }, [reservations, date, status, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const resetTo = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className={shared.page}>
      <PageHeader
        eyebrow="Sabtu, 21 Juni 2026 | Welcome back, Receptionist Team"
        title="Reservasi"
        action={
          <Button onClick={() => navigate('/resepsionis/reservasi/baru')}>
            <IconPlus size={12} />
            Reservasi baru
          </Button>
        }
      />

      <Card>
        <div className={styles.filters}>
          <Field label="Tanggal">
            <Input type="date" value={date} onChange={(e) => resetTo(setDate)(e.target.value)} />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => resetTo(setStatus)(e.target.value)}>
              <option value="">Semua Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cari Pasien">
            <div className={shared.searchWrap}>
              <span className={shared.searchIcon}>
                <IconSearch size={16} />
              </span>
              <Input
                hasIcon
                value={query}
                onChange={(e) => resetTo(setQuery)(e.target.value)}
                placeholder="Nama atau ID pasien..."
              />
            </div>
          </Field>
        </div>

        <div className={shared.tableWrap}>
          <table className={cx(shared.table, shared.tableMin720)}>
            <thead>
              <tr className={shared.theadRow}>
                {['ID Reservasi', 'Pasien', 'Dokter', 'Tanggal', 'Jam', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className={shared.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={7} />}
              {rows.map((r) => (
                <tr key={r.id} className={shared.tr}>
                  <td className={cx(shared.td, styles.idCell)}>{r.id}</td>
                  <td className={shared.td}>
                    <p className={shared.personName}>{r.patientName}</p>
                    <p className={shared.personMeta}>#{r.patientId}</p>
                  </td>
                  <td className={shared.td}>{r.doctor}</td>
                  <td className={shared.td}>
                    {new Date(`${r.date}T00:00:00`).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className={shared.td}>{r.time}</td>
                  <td className={shared.td}>
                    <Chip>{r.status}</Chip>
                  </td>
                  <td className={shared.td}>
                    <Link to={`/resepsionis/reservasi/${r.id}`} className={shared.linkBlue}>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={shared.pagination}>
          <p className={shared.paginationInfo}>
            Menampilkan {rows.length === 0 ? 0 : (current - 1) * PER_PAGE + 1}-
            {(current - 1) * PER_PAGE + rows.length} dari {filtered.length} reservasi
          </p>
          <div className={shared.pager}>
            <button
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              aria-label="Halaman sebelumnya"
              className={shared.pagerArrow}
            >
              <IconChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cx(shared.pagerPage, n === current && shared.pagerPageActive)}
              >
                {n}
              </button>
            ))}
            <button
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
              aria-label="Halaman berikutnya"
              className={shared.pagerArrow}
            >
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
