import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight, IconPlus, IconSearch } from '../components/Icons.jsx'
import { Button, Card, Chip, EmptyRow, Field, Input, PageHeader, Select } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'

const PER_PAGE = 6
const STATUSES = ['Baru', 'Terkonfirmasi', 'Hadir', 'Selesai', 'Dibatalkan']

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
    <div className="flex flex-col gap-5">
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
        <div className="grid grid-cols-1 gap-4 border-b border-[#e6e6e2] p-5 sm:grid-cols-3">
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
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]">
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#e6e6e2] bg-[#f5f5f3]/60 text-left">
                {['ID Reservasi', 'Pasien', 'Dokter', 'Tanggal', 'Jam', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={7} />}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[#e6e6e2] last:border-b-0">
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#191c1e]">{r.id}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <p className="text-[13px] font-semibold text-[#191c1e]">{r.patientName}</p>
                    <p className="text-xs text-[#434655]">#{r.patientId}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">{r.doctor}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    {new Date(`${r.date}T00:00:00`).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">{r.time}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <Chip>{r.status}</Chip>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <Link to={`/resepsionis/reservasi/${r.id}`} className="text-[13px] font-semibold text-[#2563eb] hover:underline">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="text-xs text-[#434655]">
            Menampilkan {rows.length === 0 ? 0 : (current - 1) * PER_PAGE + 1}-
            {(current - 1) * PER_PAGE + rows.length} dari {filtered.length} reservasi
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              aria-label="Halaman sebelumnya"
              className="rounded-lg p-1.5 text-[#434655] transition-colors hover:not-disabled:bg-[#f5f5f3] disabled:opacity-35"
            >
              <IconChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`size-8 rounded-lg text-[13px] font-medium transition-colors ${n === current ? 'bg-[#3d4940] text-white' : 'text-[#191c1e] hover:bg-[#f5f5f3]'}`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
              aria-label="Halaman berikutnya"
              className="rounded-lg p-1.5 text-[#434655] transition-colors hover:not-disabled:bg-[#f5f5f3] disabled:opacity-35"
            >
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
