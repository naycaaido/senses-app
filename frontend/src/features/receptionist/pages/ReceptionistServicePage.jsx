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
  stats: 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4',
  statTop: 'flex items-start justify-between',
  statLabel: 'text-xs text-[#434655]',
  statIcon: 'text-[#434655]',
  statValue: 'mt-1 text-[26px] font-bold text-[#191c1e]',
  statNote: 'mt-1 text-xs',
  noteMuted: 'text-[#434655]',
  noteGreen: 'text-emerald-600',
  noteRed: 'text-[#a03d4a]',
  filters: 'flex flex-wrap gap-4',
  search: 'w-72',
  statusFilter: 'w-44',
  nameCell: 'text-sm font-bold',
  priceCell: 'font-semibold',
  modalIconMark: 'text-xl font-bold',
}

const PER_PAGE = 5

const noteTones = {
  muted: styles.noteMuted,
  green: styles.noteGreen,
  red: styles.noteRed,
}

function StatBox({ label, value, note, noteTone = 'muted', icon }) {
  return (
    <Card pad="md">
      <div className={styles.statTop}>
        <p className={styles.statLabel}>{label}</p>
        <span className={styles.statIcon}>{icon}</span>
      </div>
      <p className={styles.statValue}>{value}</p>
      <p className={cx(styles.statNote, noteTones[noteTone])}>{note}</p>
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
    <div className={shared.page}>
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

      <div className={styles.stats}>
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
        <div className={styles.filters}>
          <div className={cx(shared.searchWrap, styles.search)}>
            <span className={shared.searchIcon}>
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
          <div className={styles.statusFilter}>
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
        <div className={shared.tableWrap}>
          <table className={cx(shared.table, shared.tableMin720)}>
            <thead>
              <tr className={shared.theadRow}>
                {['Nama Layanan', 'Harga', 'Estimasi Durasi', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className={shared.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={5} />}
              {rows.map((s) => (
                <tr key={s.id} className={shared.tr}>
                  <td className={cx(shared.td, styles.nameCell)}>{s.name}</td>
                  <td className={cx(shared.td, styles.priceCell)}>{formatRupiah(s.price)}</td>
                  <td className={shared.td}>{s.duration} Menit</td>
                  <td className={shared.td}>
                    <Chip>{s.status}</Chip>
                  </td>
                  <td className={shared.td}>
                    <div className={shared.iconActions}>
                      <button
                        aria-label={`Edit ${s.name}`}
                        onClick={() => navigate(`/resepsionis/layanan/${s.id}/edit`)}
                        className={shared.iconButton}
                      >
                        <IconPencil size={16} />
                      </button>
                      <button
                        aria-label={`Hapus ${s.name}`}
                        onClick={() => setPendingDelete(s)}
                        className={cx(shared.iconButton, shared.iconButtonDanger)}
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

        <div className={shared.pagination}>
          <p className={shared.paginationInfo}>
            Showing {rows.length === 0 ? 0 : (current - 1) * PER_PAGE + 1} to{' '}
            {(current - 1) * PER_PAGE + rows.length} of {filtered.length} entries
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

      {pendingDelete && (
        <Modal
          icon={<span className={styles.modalIconMark}>!</span>}
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
          <div className={shared.infoBox}>
            <p className={shared.infoBoxTitle}>{pendingDelete.name}</p>
            <p className={shared.infoBoxMeta}>
              {formatRupiah(pendingDelete.price)} · {pendingDelete.duration} menit
            </p>
          </div>
          <p className={shared.modalNote}>
            Layanan yang dihapus tidak dapat dipilih lagi saat membuat reservasi baru.
          </p>
        </Modal>
      )}
    </div>
  )
}
