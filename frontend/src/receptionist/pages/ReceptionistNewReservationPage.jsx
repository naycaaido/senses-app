import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Field, Input } from '../components/ui.jsx'
import { bookedSlots, formatRupiah, TIME_SLOTS, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistNewReservationPage.module.css'

function Step({ number, title, subtitle, children }) {
  return (
    <Card pad="lg">
      <div className={styles.stepHead}>
        <span className={styles.stepNumber}>{number}</span>
        <div>
          <h2 className={styles.stepTitle}>{title}</h2>
          <p className={styles.stepSubtitle}>{subtitle}</p>
        </div>
      </div>
      <div className={styles.stepBody}>{children}</div>
    </Card>
  )
}

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function formatTanggal(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function endOf(time, duration) {
  const [h, m] = time.split('.').map(Number)
  const total = h * 60 + m + duration
  return `${String(Math.floor(total / 60)).padStart(2, '0')}.${String(total % 60).padStart(2, '0')}`
}

export default function ReservasiBaru() {
  const navigate = useNavigate()
  const { patients, services, reservations, schedule, addReservation } = useStore()

  const [patientQuery, setPatientQuery] = useState('')
  const [patientId, setPatientId] = useState(null)
  const [serviceQuery, setServiceQuery] = useState('')
  const [serviceId, setServiceId] = useState(null)
  const [date, setDate] = useState('2026-07-20')
  const [time, setTime] = useState(null)

  const activeServices = services.filter((s) => s.status === 'Aktif')

  const filteredPatients = useMemo(() => {
    const q = patientQuery.trim().toLowerCase()
    if (!q) return patients.slice(0, 3)
    return patients.filter((p) =>
      [p.name, p.id, p.email, p.phone].some((f) => f.toLowerCase().includes(q)),
    )
  }, [patients, patientQuery])

  const filteredServices = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase()
    if (!q) return activeServices.slice(0, 3)
    return activeServices.filter((s) => s.name.toLowerCase().includes(q))
  }, [activeServices, serviceQuery])

  const patient = patients.find((p) => p.id === patientId)
  const service = services.find((s) => s.id === serviceId)
  const booked = bookedSlots(reservations, date)

  const complete = patient && service && date && time

  const handleSave = () => {
    if (!complete) return
    addReservation({
      patientId: patient.id,
      patientName: patient.name,
      doctor: 'Dr. Sarah Wijaya',
      service: service.name,
      price: service.price,
      date,
      time,
      endTime: endOf(time, service.duration),
      complaint: '',
    })
    navigate('/resepsionis/reservasi')
  }

  return (
    <div className={shared.page}>
      <button onClick={() => navigate('/resepsionis/reservasi')} className={shared.backLink}>
        ← Kembali ke Reservasi
      </button>

      <div>
        <h1 className={shared.titleSerif}>Reservasi Baru</h1>
        <p className={shared.subtitle}>
          Buat reservasi baru dengan memilih pasien, layanan, tanggal, dan jam yang tersedia.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.steps}>
          <Step number="1" title="Pilih Pasien" subtitle="Cari pasien yang sudah terdaftar.">
            <Field label="Cari pasien">
              <Input
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Nama, nomor registrasi, email, atau telepon"
              />
            </Field>
            <div className={styles.optionList}>
              {filteredPatients.length === 0 && (
                <p className={styles.emptyNote}>Pasien tidak ditemukan.</p>
              )}
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatientId(p.id)}
                  className={cx(styles.option, patientId === p.id && styles.optionSelected)}
                >
                  <div className={styles.optionMain}>
                    <span className={styles.optionAvatar}>{initials(p.name)}</span>
                    <div>
                      <p className={styles.optionName}>{p.name}</p>
                      <p className={styles.optionMeta}>
                        {p.id} · {p.phone}
                      </p>
                    </div>
                  </div>
                  {patientId === p.id && <Chip tone="gray">DIPILIH</Chip>}
                </button>
              ))}
            </div>
          </Step>

          <Step number="2" title="Pilih Layanan" subtitle="Pilih layanan yang akan dilakukan pasien.">
            <Field label="Cari Layanan">
              <Input
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
                placeholder="Nama Layanan"
              />
            </Field>
            <div className={styles.optionList}>
              {filteredServices.length === 0 && (
                <p className={styles.emptyNote}>Layanan tidak ditemukan.</p>
              )}
              {filteredServices.map((s) => (
                <label
                  key={s.id}
                  className={cx(
                    styles.option,
                    styles.optionLabel,
                    serviceId === s.id && styles.optionSelected,
                  )}
                >
                  <div className={styles.optionMain}>
                    <input
                      type="radio"
                      name="layanan"
                      checked={serviceId === s.id}
                      onChange={() => setServiceId(s.id)}
                      className={styles.radio}
                    />
                    <div>
                      <p className={styles.optionName}>{s.name}</p>
                      <p className={styles.optionMeta}>± {s.duration} menit</p>
                    </div>
                  </div>
                  <p className={styles.optionPrice}>{formatRupiah(s.price)}</p>
                </label>
              ))}
            </div>
          </Step>

          <Step
            number="3"
            title="Pilih Jadwal"
            subtitle="Jam operasional klinik tetap pukul 09.00–17.00."
          >
            <Field label="Tanggal reservasi">
              <Input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setTime(null)
                }}
              />
            </Field>

            <div className={styles.slotHead}>
              <p className={styles.slotDate}>{formatTanggal(date)}</p>
              <p className={styles.slotInterval}>Interval 30 menit</p>
            </div>

            <div className={styles.slotGrid}>
              {TIME_SLOTS.map((slot) => {
                const isBooked = booked.includes(slot)
                const doctorOff = !schedule[slot].active
                const disabled = isBooked || doctorOff
                return (
                  <button
                    key={slot}
                    disabled={disabled}
                    onClick={() => setTime(slot)}
                    title={isBooked ? 'Sudah dipesan' : doctorOff ? 'Dokter tidak tersedia' : 'Tersedia'}
                    className={cx(
                      styles.slot,
                      time === slot && styles.slotSelected,
                      isBooked && styles.slotBooked,
                      !isBooked && doctorOff && styles.slotOff,
                    )}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>

            <div className={styles.legend}>
              {[
                [styles.dotAvailable, 'Tersedia'],
                [styles.dotSelected, 'Dipilih'],
                [styles.dotBooked, 'Dipesan'],
                [styles.dotOff, 'Dokter tidak tersedia'],
              ].map(([dot, label]) => (
                <span key={label} className={styles.legendItem}>
                  <span className={cx(styles.dot, dot)} />
                  {label}
                </span>
              ))}
            </div>
          </Step>
        </div>

        <Card className={cx(styles.summaryCard, styles.summary)}>
          <div className={styles.summaryHead}>
            <h2 className={styles.summaryTitle}>Ringkasan Reservasi</h2>
            <p className={styles.summarySubtitle}>Pastikan semua data sudah benar.</p>
          </div>
          <div className={styles.summaryBody}>
            {[
              ['Pasien', patient?.name ?? '—'],
              ['Layanan', service?.name ?? '—'],
              ['Tanggal', formatTanggal(date)],
              ['Jam', time && service ? `${time}–${endOf(time, service.duration)}` : '—'],
              ['Durasi', service ? `± ${service.duration} menit` : '—'],
            ].map(([label, value]) => (
              <div key={label} className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{label}</span>
                <span className={styles.summaryValue}>{value}</span>
              </div>
            ))}
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Status awal</span>
              <Chip tone="gray">TERJADWAL</Chip>
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.summaryLabel}>Total biaya</span>
              <span className={styles.summaryTotalValue}>
                {service ? formatRupiah(service.price) : '—'}
              </span>
            </div>

            <p className={styles.summaryNote}>Pembayaran dicatat setelah layanan selesai.</p>

            <div className={styles.summaryActions}>
              <Button variant="outline" fullWidth onClick={() => navigate('/resepsionis/reservasi')}>
                Batal
              </Button>
              <Button fullWidth disabled={!complete} onClick={handleSave}>
                Simpan Reservasi
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
