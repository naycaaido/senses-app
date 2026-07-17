import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCalendar, IconDots, IconPlus, IconReceipt, IconUsers } from '../components/Icons.jsx'
import { Button, Card, Chip, EmptyRow, NotFound } from '../components/ui.jsx'
import { formatRupiah, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistPatientDetailPage.module.css'

const headerTones = {
  blue: styles.toneBlue,
  gold: styles.toneGold,
  green: styles.toneGreen,
}

function CardHeader({ icon, tone, title }) {
  return (
    <div className={styles.cardHeader}>
      <span className={cx(styles.cardHeaderIcon, headerTones[tone])}>{icon}</span>
      <h2 className={styles.cardTitle}>{title}</h2>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value || '—'}</span>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DetailPasien() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPatient, reservations, payments } = useStore()
  const [openMenu, setOpenMenu] = useState(null)

  const patient = getPatient(id)
  if (!patient) {
    return <NotFound>Pasien tidak ditemukan.</NotFound>
  }

  const history = reservations.filter((r) => r.patientId === patient.id)
  const invoices = payments.filter((p) => p.patientId === patient.id)

  return (
    <div className={shared.page}>
      <div className={styles.head}>
        <div>
          <h1 className={shared.titleSans}>Detail Pasien</h1>
          <p className={shared.subtitle}>
            Ringkasan biodata, riwayat reservasi, dan pembayaran.
          </p>
        </div>
        <Button onClick={() => navigate(`/resepsionis/data-pasien/${patient.id}/edit`)}>
          <IconPlus size={12} />
          Edit Pasien
        </Button>
      </div>

      <div className={styles.layout}>
        <Card pad="lg" className={styles.profileCard}>
          <div className={styles.bigAvatar}>
            {patient.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
          </div>
          <p className={styles.profileName}>{patient.name}</p>
          <div className={styles.profileRows}>
            <Row label="Gender" value={patient.gender} />
            <Row label="Tanggal Lahir" value={formatDate(patient.birthDate)} />
            <div className={cx(styles.row, styles.rowPlain)}>
              <span className={styles.rowLabel}>Status</span>
              <Chip>{patient.status}</Chip>
            </div>
          </div>
        </Card>

        <div className={styles.stack}>
          <Card>
            <CardHeader icon={<IconUsers size={16} />} tone="blue" title="Personal Information" />
            <div className={styles.rowsWrap}>
              <Row label="Email" value={patient.email} />
              <Row label="Telepon" value={patient.phone} />
              <Row label="Alamat" value={patient.address} />
              <Row label="Kota" value={patient.city} />
              <Row label="Kode Pos" value={patient.postalCode} />
            </div>
          </Card>

          <Card>
            <CardHeader icon={<IconCalendar size={16} />} tone="gold" title="Reservation History" />
            <div className={shared.tableWrap}>
              <table className={cx(shared.table, shared.tableMin600)}>
                <thead>
                  <tr className={shared.theadRowY}>
                    {['No Reservasi', 'Service', 'Date & Time', 'Status', 'Action'].map((h) => (
                      <th key={h} className={shared.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && <EmptyRow colSpan={5}>Belum ada reservasi.</EmptyRow>}
                  {history.map((r) => (
                    <tr key={r.id} className={shared.tr}>
                      <td className={cx(shared.td, styles.idCell)}>{r.id}</td>
                      <td className={cx(shared.td, styles.serviceCell)}>{r.service}</td>
                      <td className={shared.td}>
                        {formatDate(r.date)} · {r.time}
                      </td>
                      <td className={shared.td}>
                        <Chip>{r.status}</Chip>
                      </td>
                      <td className={cx(shared.td, styles.actionCell)}>
                        <button
                          aria-label={`Aksi untuk ${r.id}`}
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
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader icon={<IconReceipt size={16} />} tone="green" title="Payment History" />
            <div className={shared.tableWrap}>
              <table className={cx(shared.table, shared.tableMin600)}>
                <thead>
                  <tr className={shared.theadRowY}>
                    {['No Pembayaran', 'Layanan', 'Tanggal', 'Total', 'Method'].map((h) => (
                      <th key={h} className={shared.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 && <EmptyRow colSpan={5}>Belum ada pembayaran.</EmptyRow>}
                  {invoices.map((p) => (
                    <tr key={p.id} className={shared.tr}>
                      <td className={shared.td}>
                        {p.reservationId ? (
                          <button
                            onClick={() => navigate(`/resepsionis/reservasi/${p.reservationId}`)}
                            className={shared.linkBlue}
                          >
                            #{p.id}
                          </button>
                        ) : (
                          <span className={shared.linkBlue}>#{p.id}</span>
                        )}
                      </td>
                      <td className={shared.td}>{p.service}</td>
                      <td className={shared.td}>{formatDate(p.date)}</td>
                      <td className={cx(shared.td, styles.totalCell)}>{formatRupiah(p.amount)}</td>
                      <td className={cx(shared.td, styles.methodCell)}>{p.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
