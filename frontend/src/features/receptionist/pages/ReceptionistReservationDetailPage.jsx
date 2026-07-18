import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconPhone, IconWallet } from '../components/Icons.jsx'
import { Button, Card, Chip, Modal, NotFound, Textarea } from '../components/ui.jsx'
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
  head: 'flex items-center justify-between gap-4', actions: 'flex flex-wrap gap-3', layout: 'grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-start', stack: 'flex flex-col gap-5', cancelBanner: 'border-[#f3d9d9] bg-[#fdf1f1]', cancelLabel: 'text-xs font-semibold text-[#a03d4a]', cancelReason: 'mt-1 text-[13px] text-[#191c1e]', profileCard: 'text-center', bigAvatar: 'mx-auto flex size-24 items-center justify-center rounded-full bg-[#f5f5f3] text-[26px] font-bold text-[#3d4940]', profileName: 'mt-4 text-xl font-bold text-[#191c1e]', profileRows: 'mt-4 border-t border-[#e6e6e2]', profileRow: 'flex items-center justify-between border-b border-[#e6e6e2] py-3 last:border-b-0', profileRowLabel: 'text-xs font-medium text-[#434655]', profileRowValue: 'text-[13px] text-[#191c1e]', cardTitle: 'text-[15px] font-bold text-[#191c1e]', rows: 'mt-3 border-t border-[#e6e6e2]', row: 'flex items-center justify-between gap-4 border-b border-[#e6e6e2] py-3 last:border-b-0', rowLabel: 'text-[13px] text-[#434655]', rowValue: 'text-right text-[13px] font-medium text-[#191c1e]', complaint: 'mt-3 border-t border-[#e6e6e2] pt-3 text-[13px] leading-[1.625] text-[#434655]', modalIconMark: 'text-xl font-bold', reasonLabel: 'mt-4 block', reasonLabelText: 'text-xs font-semibold text-[#191c1e]', reasonRequired: 'text-[#a03d4a]', reasonField: 'mt-1.5', reasonNote: 'mt-2 text-xs text-[#434655]', summaryGrid: 'grid grid-cols-2 gap-y-5 rounded-xl bg-[#f5f5f3]/70 px-5 py-4', summaryLabel: 'text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]', summaryValue: 'mt-1 text-sm font-bold text-[#191c1e]', chipSpacing: 'mt-1', methodTitle: 'mt-5 text-[13px] font-semibold text-[#191c1e]', methodGrid: 'mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3', method: 'flex flex-col items-center gap-2 rounded-xl border border-[#e6e6e2] px-4 py-5 transition-colors hover:bg-[#f5f5f3]/40', methodSelected: 'border-2 border-[#191c1e] bg-[#f5f5f3]/60 px-[15px] py-[19px]', methodIcon: 'flex size-9 items-center justify-center rounded-lg bg-[#f5f5f3] text-[#434655]', methodIconSelected: 'bg-[#3d4940] text-white', methodName: 'text-[13px] font-medium text-[#191c1e]', feeRow: 'mt-6 flex items-center justify-between border-b border-dashed border-[#e6e6e2] pb-3', feeLabel: 'text-[13px] text-[#434655]', feeValue: 'text-[13px] font-semibold text-[#191c1e]', totalRow: 'mt-3 flex items-center justify-between', totalLabel: 'text-sm font-bold text-[#191c1e]', totalValue: 'text-2xl font-bold text-[#191c1e]',
}

const PAYMENT_METHODS = [
  { id: 'Tunai (Cash)', icon: <IconWallet size={18} /> },
  { id: 'Debit / Credit', icon: <IconWallet size={18} /> },
  { id: 'QRIS / E-Wallet', icon: <IconPhone size={18} /> },
]

function InfoCard({ title, rows }) {
  return (
    <Card pad="md">
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.rows}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.row}>
            <span className={styles.rowLabel}>{label}</span>
            <span className={styles.rowValue}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CancelModal({ reservation, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  return (
    <Modal
      icon={<span className={styles.modalIconMark}>!</span>}
      iconTone="red"
      title="Batalkan Reservasi"
      subtitle="Anda akan membatalkan reservasi berikut:"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Kembali
          </Button>
          <Button variant="danger" disabled={!reason.trim()} onClick={() => onConfirm(reason.trim())}>
            Konfirmasi Pembatalan
          </Button>
        </>
      }
    >
      <div className={shared.infoBox}>
        <p className={shared.infoBoxTitle}>{reservation.id}</p>
        <p className={styles.rowLabel}>{reservation.patientName}</p>
        <p className={shared.infoBoxMeta}>
          {new Date(`${reservation.date}T00:00:00`).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · {reservation.time}–{reservation.endTime}
        </p>
      </div>

      <label className={styles.reasonLabel}>
        <span className={styles.reasonLabelText}>
          Alasan pembatalan <span className={styles.reasonRequired}>*</span>
        </span>
        <Textarea
          className={styles.reasonField}
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan pembatalan reservasi..."
        />
      </label>
      <p className={styles.reasonNote}>
        Alasan akan disimpan dan ditampilkan pada detail reservasi.
      </p>
    </Modal>
  )
}

function CompleteModal({ reservation, onClose, onConfirm }) {
  const [method, setMethod] = useState('Tunai (Cash)')
  return (
    <Modal
      variant="bar"
      size="lg"
      title="Selesaikan Reservasi & Catat Pembayaran"
      subtitle="Konfirmasi kehadiran pasien dan proses detail pembayaran."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={() => onConfirm(method)}>Selesaikan</Button>
        </>
      }
    >
      <div className={styles.summaryGrid}>
        <div>
          <p className={styles.summaryLabel}>Patient Name</p>
          <p className={styles.summaryValue}>{reservation.patientName}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Appointment Type</p>
          <Chip tone="gray" className={styles.chipSpacing}>
            {reservation.service}
          </Chip>
        </div>
        <div>
          <p className={styles.summaryLabel}>Reservation ID</p>
          <p className={styles.summaryValue}>{reservation.id}</p>
        </div>
      </div>

      <p className={styles.methodTitle}>Metode Pembayaran</p>
      <div className={styles.methodGrid}>
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cx(styles.method, method === m.id && styles.methodSelected)}
          >
            <span className={cx(styles.methodIcon, method === m.id && styles.methodIconSelected)}>
              {m.icon}
            </span>
            <span className={styles.methodName}>{m.id}</span>
          </button>
        ))}
      </div>

      <div className={styles.feeRow}>
        <span className={styles.feeLabel}>Service Fee ({reservation.service})</span>
        <span className={styles.feeValue}>{formatRupiah(reservation.price)}</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Pembayaran</span>
        <span className={styles.totalValue}>{formatRupiah(reservation.price)}</span>
      </div>
    </Modal>
  )
}

export default function DetailReservasi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getReservation, getPatient, cancelReservation, completeReservation, services } = useStore()
  const [modal, setModal] = useState(null)

  const reservation = getReservation(id)
  if (!reservation) {
    return <NotFound>Reservasi tidak ditemukan.</NotFound>
  }

  const patient = getPatient(reservation.patientId)
  const service = services.find((s) => s.name === reservation.service)
  const closed = ['Selesai', 'Dibatalkan'].includes(reservation.status)

  return (
    <div className={shared.page}>
      <div className={styles.head}>
        <h1 className={shared.titleSans}>Detail Reservasi</h1>
        <Chip>{reservation.status}</Chip>
      </div>

      <div className={styles.actions}>
        <Button variant="gold" disabled={closed} onClick={() => setModal('complete')}>
          Selesaikan &amp; Pembayaran
        </Button>
        <Button variant="dangerSoft" disabled={closed} onClick={() => setModal('cancel')}>
          Batalkan Reservasi
        </Button>
        <Button variant="outline" onClick={() => navigate('/resepsionis/reservasi')}>
          Kembali
        </Button>
      </div>

      {reservation.cancelReason && (
        <Card pad="sm" className={styles.cancelBanner}>
          <p className={styles.cancelLabel}>Alasan pembatalan</p>
          <p className={styles.cancelReason}>{reservation.cancelReason}</p>
        </Card>
      )}

      <div className={styles.layout}>
        <Card pad="lg" className={styles.profileCard}>
          <div className={styles.bigAvatar}>
            {reservation.patientName.split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </div>
          <p className={styles.profileName}>{reservation.patientName}</p>
          <div className={styles.profileRows}>
            <div className={styles.profileRow}>
              <span className={styles.profileRowLabel}>Email</span>
              <span className={styles.profileRowValue}>{patient?.email ?? '—'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileRowLabel}>Telepon</span>
              <span className={styles.profileRowValue}>{patient?.phone ?? '—'}</span>
            </div>
          </div>
        </Card>

        <div className={styles.stack}>
          <InfoCard
            title="Informasi Layanan"
            rows={[
              ['Layanan', reservation.service],
              ['Harga', formatRupiah(reservation.price)],
              ['Estimasi Durasi', `${service?.duration ?? 60} menit`],
            ]}
          />
          <InfoCard
            title="Detail Jadwal"
            rows={[
              [
                'Tanggal',
                new Date(`${reservation.date}T00:00:00`).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
              ],
              ['Jam', `${reservation.time} - ${reservation.endTime}`],
              ['Status', reservation.status],
            ]}
          />
          <Card pad="md">
            <h2 className={styles.cardTitle}>Keluhan Awal</h2>
            <p className={styles.complaint}>
              {reservation.complaint || 'Tidak ada keluhan yang dicatat.'}
            </p>
          </Card>
        </div>
      </div>

      {modal === 'cancel' && (
        <CancelModal
          reservation={reservation}
          onClose={() => setModal(null)}
          onConfirm={(reason) => {
            cancelReservation(reservation.id, reason)
            setModal(null)
          }}
        />
      )}
      {modal === 'complete' && (
        <CompleteModal
          reservation={reservation}
          onClose={() => setModal(null)}
          onConfirm={(method) => {
            completeReservation(reservation.id, method)
            setModal(null)
          }}
        />
      )}
    </div>
  )
}
