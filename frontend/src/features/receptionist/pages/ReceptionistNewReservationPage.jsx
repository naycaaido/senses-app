import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Field, Input } from '../components/ui.jsx'
import { bookedSlots, formatRupiah, TIME_SLOTS, useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'


function Step({ number, title, subtitle, children }) {
  return (
    <Card pad="lg">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f5f5f3] text-xs font-semibold text-[#3d4940]">{number}</span>
        <div>
          <h2 className="font-serif text-xl text-[#191c1e]">{title}</h2>
          <p className="text-[13px] text-[#434655]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
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
    <div className="flex flex-col gap-5">
      <button onClick={() => navigate('/resepsionis/reservasi')} className="self-start text-[13px] font-semibold text-[#434655] transition-colors hover:text-[#191c1e]">
        ← Kembali ke Reservasi
      </button>

      <div>
        <h1 className="font-serif text-[34px] text-[#191c1e]">Reservasi Baru</h1>
        <p className="text-[13px] text-[#434655]">
          Buat reservasi baru dengan memilih pasien, layanan, tanggal, dan jam yang tersedia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px] xl:items-start">
        <div className="flex flex-col gap-5">
          <Step number="1" title="Pilih Pasien" subtitle="Cari pasien yang sudah terdaftar.">
            <Field label="Cari pasien">
              <Input
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Nama, nomor registrasi, email, atau telepon"
              />
            </Field>
            <div className="mt-3 flex flex-col gap-2">
              {filteredPatients.length === 0 && (
                <p className="py-4 text-center text-[13px] text-[#434655]">Pasien tidak ditemukan.</p>
              )}
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatientId(p.id)}
                  className={cx('flex w-full items-center justify-between rounded-xl border border-[#e6e6e2] px-4 py-3 text-left transition-colors hover:bg-[#f5f5f3]/60', patientId === p.id && 'border-[#3d4940] bg-[#f5f5f3] hover:bg-[#f5f5f3]')}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#f5f5f3] text-[11px] font-semibold text-[#3d4940]">{initials(p.name)}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">{p.name}</p>
                      <p className="text-xs text-[#434655]">
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
            <div className="mt-3 flex flex-col gap-2">
              {filteredServices.length === 0 && (
                <p className="py-4 text-center text-[13px] text-[#434655]">Layanan tidak ditemukan.</p>
              )}
              {filteredServices.map((s) => (
                <label
                  key={s.id}
                  className={cx(
                    'flex w-full items-center justify-between rounded-xl border border-[#e6e6e2] px-4 py-3 text-left transition-colors hover:bg-[#f5f5f3]/60',
                    'cursor-pointer',
                    serviceId === s.id && 'border-[#3d4940] bg-[#f5f5f3] hover:bg-[#f5f5f3]',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="layanan"
                      checked={serviceId === s.id}
                      onChange={() => setServiceId(s.id)}
                      className="size-4 accent-[#3d4940]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">{s.name}</p>
                      <p className="text-xs text-[#434655]">± {s.duration} menit</p>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-[#191c1e]">{formatRupiah(s.price)}</p>
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

            <div className="mt-5 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#191c1e]">{formatTanggal(date)}</p>
              <p className="text-xs text-[#434655]">Interval 30 menit</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                      'rounded-xl border border-[#e6e6e2] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#191c1e] transition-colors hover:not-disabled:border-[#3d4940]',
                      time === slot && 'border-[#3d4940] bg-[#3d4940] text-white hover:bg-[#3d4940]',
                      isBooked && 'cursor-not-allowed border-[#f0e6cc] bg-[#faf5e8] text-[#b09a63]',
                      !isBooked && doctorOff && 'cursor-not-allowed bg-[#f5f5f3] text-[#a3a3a3]',
                    )}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-[#434655]">
              {[
                ['border border-[#e6e6e2] bg-white', 'Tersedia'],
                ['bg-[#3d4940]', 'Dipilih'],
                ['bg-[#e3c97f]', 'Dipesan'],
                ['bg-neutral-300', 'Dokter tidak tersedia'],
              ].map(([dot, label]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className={cx('size-2.5 rounded-full', dot)} />
                  {label}
                </span>
              ))}
            </div>
          </Step>
        </div>

        <Card className={cx('overflow-hidden', 'xl:sticky xl:top-0')}>
          <div className="bg-[#3d4940] px-5 py-4">
            <h2 className="font-serif text-xl text-[#fbf8f3]">Ringkasan Reservasi</h2>
            <p className="text-xs text-[#fbf8f3]/60">Pastikan semua data sudah benar.</p>
          </div>
          <div className="flex flex-col gap-3 px-5 py-4">
            {[
              ['Pasien', patient?.name ?? '—'],
              ['Layanan', service?.name ?? '—'],
              ['Tanggal', formatTanggal(date)],
              ['Jam', time && service ? `${time}–${endOf(time, service.duration)}` : '—'],
              ['Durasi', service ? `± ${service.duration} menit` : '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-xs text-[#434655]">{label}</span>
                <span className="text-right text-[13px] font-semibold text-[#191c1e]">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#434655]">Status awal</span>
              <Chip tone="gray">TERJADWAL</Chip>
            </div>

            <div className="flex items-center justify-between border-t border-[#e6e6e2] pt-4">
              <span className="text-xs text-[#434655]">Total biaya</span>
              <span className="font-serif text-[22px] font-bold text-[#191c1e]">
                {service ? formatRupiah(service.price) : '—'}
              </span>
            </div>

            <p className="rounded-lg bg-[#faf5e8] px-3 py-2 text-[11px] text-[#8a7745]">Pembayaran dicatat setelah layanan selesai.</p>

            <div className="flex flex-col gap-2 pt-1">
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
