import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconPhone, IconWallet } from '../components/Icons.jsx'
import { Button, Card, Chip, Modal, NotFound, Textarea } from '../components/ui.jsx'
import { formatRupiah, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistReservationDetailPage.module.css'

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
