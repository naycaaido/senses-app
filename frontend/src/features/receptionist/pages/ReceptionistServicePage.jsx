import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconChevronLeft,
  IconChevronRight,
  IconGrid,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '../components/Icons.jsx'
import { Button, Card, Chip, EmptyRow, Input, Modal, PageHeader, Select } from '../components/ui.jsx'
import { formatRupiah, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'


const PER_PAGE = 5

const noteTones = {
  muted: 'text-[#434655]',
  green: 'text-emerald-600',
  red: 'text-[#a03d4a]',
}

function StatBox({ label, value, note, noteTone = 'muted', icon }) {
  return (
    <Card pad="md">
      <div className="flex items-start justify-between">
        <p className="text-xs text-[#434655]">{label}</p>
        <span className="text-[#434655]">{icon}</span>
      </div>
      <p className="mt-1 text-[26px] font-bold text-[#191c1e]">{value}</p>
      <p className={cx('mt-1 text-xs', noteTones[noteTone])}>{note}</p>
    </Card>
  )
}

export default function Layanan() {
  const { services, removeService } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return services.filter((s) => {
      if (status && s.status !== status) return false
      if (q && !s.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [services, query, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const activeCount = services.filter((s) => s.status === 'Aktif').length
  const draftCount = services.filter((s) => s.status === 'Draft').length
  const avgPrice = services.length
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="Manajemen daftar layanan medis, tarif, dan durasi operasional."
        title="Kelola Layanan"
        action={
          <Button onClick={() => navigate('/resepsionis/layanan/baru')}>
            <IconPlus size={12} />
            Tambah Layanan
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatBox
          label="Total Layanan"
          value={services.length}
          note="Seluruh layanan terdaftar"
          icon={<IconGrid size={16} />}
        />
        <StatBox
          label="Layanan Aktif"
          value={activeCount}
          note={`${services.length ? Math.round((activeCount / services.length) * 100) : 0}% dari total kapasitas`}
          noteTone="green"
          icon={<IconGrid size={16} />}
        />
        <StatBox
          label="Rata-rata Harga"
          value={`Rp ${Math.round(avgPrice / 1000)}k`}
          note="Sesuai standar regional"
          icon={<IconGrid size={16} />}
        />
        <StatBox
          label="Draft Layanan"
          value={draftCount}
          note="Perlu review medis"
          noteTone="red"
          icon={<IconGrid size={16} />}
        />
      </div>

      <Card pad="md">
        <div className="flex flex-wrap gap-4">
          <div className={cx('relative', 'w-72')}>
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]">
              <IconSearch size={16} />
            </span>
            <Input
              hasIcon
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Cari nama layanan..."
            />
          </div>
          <div className="w-44">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
              <option>Draft</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className={cx('w-full', 'min-w-[720px]')}>
            <thead>
              <tr className="border-b border-[#e6e6e2] bg-[#f5f5f3]/60 text-left">
                {['Nama Layanan', 'Harga', 'Estimasi Durasi', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={5} />}
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-[#e6e6e2] last:border-b-0">
                  <td className={cx('px-5 py-4 text-[13px] text-[#191c1e]', 'text-sm font-bold')}>{s.name}</td>
                  <td className={cx('px-5 py-4 text-[13px] text-[#191c1e]', 'font-semibold')}>{formatRupiah(s.price)}</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">{s.duration} Menit</td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <Chip>{s.status}</Chip>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#191c1e]">
                    <div className="flex gap-1">
                      <button
                        aria-label={`Edit ${s.name}`}
                        onClick={() => navigate(`/resepsionis/layanan/${s.id}/edit`)}
                        className="rounded-lg p-2 text-[#434655] transition-colors hover:bg-[#f5f5f3] hover:text-[#191c1e]"
                      >
                        <IconPencil size={16} />
                      </button>
                      <button
                        aria-label={`Hapus ${s.name}`}
                        onClick={() => setPendingDelete(s)}
                        className={cx('rounded-lg p-2 text-[#434655] transition-colors hover:bg-[#f5f5f3] hover:text-[#191c1e]', 'hover:text-[#a03d4a]')}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="text-xs text-[#434655]">
            Showing {rows.length === 0 ? 0 : (current - 1) * PER_PAGE + 1} to{' '}
            {(current - 1) * PER_PAGE + rows.length} of {filtered.length} entries
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
                className={cx('size-8 rounded-lg text-[13px] font-medium text-[#191c1e] transition-colors hover:bg-[#f5f5f3]', n === current && 'bg-[#3d4940] text-white hover:bg-[#3d4940]')}
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

      {pendingDelete && (
        <Modal
          icon={<span className="text-xl font-bold">!</span>}
          iconTone="red"
          title="Hapus Layanan"
          subtitle="Anda akan menghapus layanan berikut:"
          onClose={() => setPendingDelete(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setPendingDelete(null)}>
                Kembali
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  removeService(pendingDelete.id)
                  setPendingDelete(null)
                }}
              >
                Konfirmasi Hapus
              </Button>
            </>
          }
        >
          <div className="rounded-xl bg-[#f5f5f3] px-4 py-3">
            <p className="text-[13px] font-semibold text-[#191c1e]">{pendingDelete.name}</p>
            <p className="text-xs text-[#434655]">
              {formatRupiah(pendingDelete.price)} · {pendingDelete.duration} menit
            </p>
          </div>
          <p className="mt-3 text-xs text-[#434655]">
            Layanan yang dihapus tidak dapat dipilih lagi saat membuat reservasi baru.
          </p>
        </Modal>
      )}
    </div>
  )
}
