import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Field, Input } from '../components/ui.jsx'
import { bookedSlots, formatRupiah, TIME_SLOTS, useStore } from '../data/store.jsx'
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
  layout: 'grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px] xl:items-start', summary: 'xl:sticky xl:top-0', steps: 'flex flex-col gap-5', stepHead: 'flex items-start gap-3', stepNumber: 'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f5f5f3] text-xs font-semibold text-[#3d4940]', stepTitle: 'font-serif text-xl text-[#191c1e]', stepSubtitle: 'text-[13px] text-[#434655]', stepBody: 'mt-5', optionList: 'mt-3 flex flex-col gap-2', option: 'flex w-full items-center justify-between rounded-xl border border-[#e6e6e2] px-4 py-3 text-left transition-colors hover:bg-[#f5f5f3]/60', optionSelected: 'border-[#3d4940] bg-[#f5f5f3] hover:bg-[#f5f5f3]', optionMain: 'flex items-center gap-3', optionAvatar: 'flex size-9 items-center justify-center rounded-full bg-[#f5f5f3] text-[11px] font-semibold text-[#3d4940]', optionName: 'text-[13px] font-semibold text-[#191c1e]', optionMeta: 'text-xs text-[#434655]', optionPrice: 'text-[13px] font-semibold text-[#191c1e]', radio: 'size-4 accent-[#3d4940]', emptyNote: 'py-4 text-center text-[13px] text-[#434655]', optionLabel: 'cursor-pointer', slotHead: 'mt-5 flex items-center justify-between', slotDate: 'text-[13px] font-semibold text-[#191c1e]', slotInterval: 'text-xs text-[#434655]', slotGrid: 'mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5', slot: 'rounded-xl border border-[#e6e6e2] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#191c1e] transition-colors hover:not-disabled:border-[#3d4940]', slotSelected: 'border-[#3d4940] bg-[#3d4940] text-white hover:bg-[#3d4940]', slotBooked: 'cursor-not-allowed border-[#f0e6cc] bg-[#faf5e8] text-[#b09a63]', slotOff: 'cursor-not-allowed bg-[#f5f5f3] text-[#a3a3a3]', legend: 'mt-4 flex flex-wrap gap-4 text-[11px] text-[#434655]', legendItem: 'flex items-center gap-1.5', dot: 'size-2.5 rounded-full', dotAvailable: 'border border-[#e6e6e2] bg-white', dotSelected: 'bg-[#3d4940]', dotBooked: 'bg-[#e3c97f]', dotOff: 'bg-neutral-300', summaryCard: 'overflow-hidden', summaryHead: 'bg-[#3d4940] px-5 py-4', summaryTitle: 'font-serif text-xl text-[#fbf8f3]', summarySubtitle: 'text-xs text-[#fbf8f3]/60', summaryBody: 'flex flex-col gap-3 px-5 py-4', summaryRow: 'flex items-center justify-between gap-4', summaryLabel: 'text-xs text-[#434655]', summaryValue: 'text-right text-[13px] font-semibold text-[#191c1e]', summaryTotal: 'flex items-center justify-between border-t border-[#e6e6e2] pt-4', summaryTotalValue: 'font-serif text-[22px] font-bold text-[#191c1e]', summaryNote: 'rounded-lg bg-[#faf5e8] px-3 py-2 text-[11px] text-[#8a7745]', summaryActions: 'flex flex-col gap-2 pt-1',
}

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

