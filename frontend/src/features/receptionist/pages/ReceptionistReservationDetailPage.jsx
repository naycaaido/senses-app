import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconPhone, IconWallet } from '../components/Icons.jsx'
import { Button, Card, Chip, Modal, NotFound, Textarea } from '../components/ui.jsx'
import { formatRupiah, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'


const PAYMENT_METHODS = [
  { id: 'Tunai (Cash)', icon: <IconWallet size={18} /> },
  { id: 'Debit / Credit', icon: <IconWallet size={18} /> },
  { id: 'QRIS / E-Wallet', icon: <IconPhone size={18} /> },
]

function InfoCard({ title, rows }) {
  return (
    <Card pad="md">
      <h2 className="text-[15px] font-bold text-[#191c1e]">{title}</h2>
      <div className="mt-3 border-t border-[#e6e6e2]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-[#e6e6e2] py-3 last:border-b-0">
            <span className="text-[13px] text-[#434655]">{label}</span>
            <span className="text-right text-[13px] font-medium text-[#191c1e]">{value}</span>
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
      icon={<span className="text-xl font-bold">!</span>}
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
      <div className="rounded-xl bg-[#f5f5f3] px-4 py-3">
        <p className="text-[13px] font-semibold text-[#191c1e]">{reservation.id}</p>
        <p className="text-[13px] text-[#434655]">{reservation.patientName}</p>
        <p className="text-xs text-[#434655]">
          {new Date(`${reservation.date}T00:00:00`).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · {reservation.time}–{reservation.endTime}
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold text-[#191c1e]">
          Alasan pembatalan <span className="text-[#a03d4a]">*</span>
        </span>
        <Textarea
          className="mt-1.5"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan pembatalan reservasi..."
        />
      </label>
      <p className="mt-2 text-xs text-[#434655]">
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
      <div className="grid grid-cols-2 gap-y-5 rounded-xl bg-[#f5f5f3]/70 px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]">Patient Name</p>
          <p className="mt-1 text-sm font-bold text-[#191c1e]">{reservation.patientName}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]">Appointment Type</p>
          <Chip tone="gray" className="mt-1">
            {reservation.service}
          </Chip>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]">Reservation ID</p>
          <p className="mt-1 text-sm font-bold text-[#191c1e]">{reservation.id}</p>
        </div>
      </div>

      <p className="mt-5 text-[13px] font-semibold text-[#191c1e]">Metode Pembayaran</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cx('flex flex-col items-center gap-2 rounded-xl border border-[#e6e6e2] px-4 py-5 transition-colors hover:bg-[#f5f5f3]/40', method === m.id && 'border-2 border-[#191c1e] bg-[#f5f5f3]/60 px-[15px] py-[19px]')}
          >
            <span className={cx('flex size-9 items-center justify-center rounded-lg bg-[#f5f5f3] text-[#434655]', method === m.id && 'bg-[#3d4940] text-white')}>
              {m.icon}
            </span>
            <span className="text-[13px] font-medium text-[#191c1e]">{m.id}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-dashed border-[#e6e6e2] pb-3">
        <span className="text-[13px] text-[#434655]">Service Fee ({reservation.service})</span>
        <span className="text-[13px] font-semibold text-[#191c1e]">{formatRupiah(reservation.price)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#191c1e]">Total Pembayaran</span>
        <span className="text-2xl font-bold text-[#191c1e]">{formatRupiah(reservation.price)}</span>
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[22px] font-bold text-[#191c1e]">Detail Reservasi</h1>
        <Chip>{reservation.status}</Chip>
      </div>

      <div className="flex flex-wrap gap-3">
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
        <Card pad="sm" className="border-[#f3d9d9] bg-[#fdf1f1]">
          <p className="text-xs font-semibold text-[#a03d4a]">Alasan pembatalan</p>
          <p className="mt-1 text-[13px] text-[#191c1e]">{reservation.cancelReason}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-start">
        <Card pad="lg" className="text-center">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#f5f5f3] text-[26px] font-bold text-[#3d4940]">
            {reservation.patientName.split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </div>
          <p className="mt-4 text-xl font-bold text-[#191c1e]">{reservation.patientName}</p>
          <div className="mt-4 border-t border-[#e6e6e2]">
            <div className="flex items-center justify-between border-b border-[#e6e6e2] py-3 last:border-b-0">
              <span className="text-xs font-medium text-[#434655]">Email</span>
              <span className="text-[13px] text-[#191c1e]">{patient?.email ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#e6e6e2] py-3 last:border-b-0">
              <span className="text-xs font-medium text-[#434655]">Telepon</span>
              <span className="text-[13px] text-[#191c1e]">{patient?.phone ?? '—'}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
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
            <h2 className="text-[15px] font-bold text-[#191c1e]">Keluhan Awal</h2>
            <p className="mt-3 border-t border-[#e6e6e2] pt-3 text-[13px] leading-[1.625] text-[#434655]">
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
