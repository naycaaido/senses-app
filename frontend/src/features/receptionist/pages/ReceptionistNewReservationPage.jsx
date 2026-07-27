import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconSearch } from '../components/Icons.jsx'
import { Button, Card, Chip, Field, Input, Textarea } from '../components/ui.jsx'
import { formatRupiah, useStore, bookedSlots, TIME_SLOTS } from '../data/store.jsx'
import { cx } from '../utils/cx.js'

function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Avatar42({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-[12px] font-bold text-[#3d4940]">
      {initials}
    </div>
  )
}

export default function ReservasiBaru() {
  const navigate = useNavigate()
  const { patients, services, reservations, addReservation } = useStore()

  const [searchPatient, setSearchPatient] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchService, setSearchService] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')

  const filteredPatients = useMemo(() => {
    const q = searchPatient.trim().toLowerCase()
    if (!q) return []
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
    )
  }, [patients, searchPatient])

  const filteredServices = useMemo(() => {
    const q = searchService.trim().toLowerCase()
    return services.filter(
      (s) => s.status === 'Aktif' && (!q || s.name.toLowerCase().includes(q)),
    )
  }, [services, searchService])

  const bookedForDate = useMemo(() => {
    if (!selectedDate) return []
    return bookedSlots(reservations, selectedDate)
  }, [reservations, selectedDate])

  const canSubmit = selectedPatient && selectedService && selectedDate && selectedTime

  const today = new Date().toISOString().split('T')[0]

  function handleSubmit() {
    if (!canSubmit) return
    const startMinutes = parseInt(selectedTime.split('.')[0]) * 60 + parseInt(selectedTime.split('.')[1])
    const endMinutes = startMinutes + selectedService.duration
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}.${String(endMinutes % 60).padStart(2, '0')}`
    const id = addReservation({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctor: 'Dr. Sarah Wijaya',
      service: selectedService.name,
      price: selectedService.price,
      date: selectedDate,
      time: selectedTime,
      endTime,
      complaint: notes,
    })
    navigate(`/resepsionis/reservasi/${id}`)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          to="/resepsionis/reservasi"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-[#3d4940] hover:underline"
        >
          <IconChevronLeft size={14} />
          Kembali ke Reservasi
        </Link>
        <h1 className="mt-2 font-serif text-[36px] leading-tight text-[#3d4940]">
          Reservasi Baru
        </h1>
        <p className="mt-2 text-[14px] text-[#6b6b6b]">
          Buat reservasi baru dengan memilih pasien, layanan, tanggal, dan jam yang tersedia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-5">
          {/* ── Section 1: Pilih Pasien ── */}
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-[24.8px] shadow-[0_14px_18px_rgba(61,73,64,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-[13px] font-bold text-[#3d4940]">
                1
              </div>
              <div>
                <h2 className="font-serif text-[22px] text-[#3d4940]">Pilih Pasien</h2>
                <p className="mt-[6px] text-[13px] text-[#6b6b6b]">
                  Cari pasien yang sudah terdaftar.
                </p>
              </div>
            </div>

            <div className="mt-[22px]">
              <Field label="Cari pasien">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]">
                    <IconSearch size={16} />
                  </span>
                  <Input
                    hasIcon
                    value={searchPatient}
                    onChange={(e) => {
                      setSearchPatient(e.target.value)
                      if (selectedPatient) setSelectedPatient(null)
                    }}
                    placeholder="Nama, nomor registrasi, email, atau telepon"
                    className="rounded-[11px] border-[#f0ede7] text-[16px]"
                  />
                </div>
              </Field>
            </div>

            {filteredPatients.length > 0 && !selectedPatient && (
              <div className="mt-3 flex flex-col gap-2">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPatient(p)
                      setSearchPatient('')
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#f0ede7] bg-white p-3 text-left transition-colors hover:bg-[#f5f5f3]"
                  >
                    <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-[12px] font-bold text-[#3d4940]">
                      {p.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#2c2c2c]">{p.name}</p>
                      <p className="text-[12px] text-[#6b6b6b]">{p.id} · {p.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedPatient && (
              <div className="mt-[16px] flex items-center gap-3 rounded-xl border border-[#cbd6cd] bg-[#fbfdfb] p-[14.8px]">
                <Avatar42 name={selectedPatient.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#2c2c2c]">{selectedPatient.name}</p>
                  <p className="mt-[4px] text-[12px] text-[#6b6b6b]">
                    {selectedPatient.id} · {selectedPatient.phone}
                  </p>
                </div>
                <Chip className="rounded-full bg-[#ebf0eb] px-[10px] py-[6px] text-[10px] font-bold uppercase text-[#3d4940]">
                  Dipilih
                </Chip>
              </div>
            )}
          </div>

          {/* ── Section 2: Pilih Layanan ── */}
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-[24.8px] shadow-[0_14px_18px_rgba(61,73,64,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-[13px] font-bold text-[#3d4940]">
                2
              </div>
              <div>
                <h2 className="font-serif text-[22px] text-[#3d4940]">Pilih Layanan</h2>
                <p className="mt-[6px] text-[13px] text-[#6b6b6b]">
                  Pilih layanan yang akan dilakukan pasien.
                </p>
              </div>
            </div>

            <div className="mt-[22px]">
              <Field label="Cari Layanan">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]">
                    <IconSearch size={16} />
                  </span>
                  <Input
                    hasIcon
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    placeholder="Nama Layanan"
                    className="rounded-[11px] border-[#f0ede7] text-[16px]"
                  />
                </div>
              </Field>
            </div>

            <div className="mt-[22px] flex flex-col gap-[10px]">
              {filteredServices.map((s) => {
                const picked = selectedService?.id === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s)}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-xl border p-[15.8px] text-left transition-all',
                      picked
                        ? 'border-[#cbd6cd] bg-[#fbfdfb]'
                        : 'border-[#f0ede7] bg-white hover:bg-[#f5f5f3]',
                    )}
                  >
                    <div
                      className={cx(
                        'flex size-[18px] shrink-0 items-center justify-center rounded-full border',
                        picked ? 'border-[#0075ff]' : 'border-[#767676]',
                      )}
                    >
                      {picked && <div className="size-[10px] rounded-full bg-[#0075ff]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#2c2c2c]">{s.name}</p>
                      <p className="mt-[4px] text-[13.3px] text-[#6b6b6b]">± {s.duration} menit</p>
                    </div>
                    <p className="shrink-0 text-[13px] font-bold text-[#3d4940]">
                      {formatRupiah(s.price)}
                    </p>
                  </button>
                )
              })}
              {filteredServices.length === 0 && (
                <p className="py-4 text-center text-[13px] text-[#6b6b6b]">
                  Tidak ada layanan yang cocok.
                </p>
              )}
            </div>
          </div>

          {/* ── Section 3: Pilih Jadwal ── */}
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-[24.8px] shadow-[0_14px_18px_rgba(61,73,64,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] text-[13px] font-bold text-[#3d4940]">
                3
              </div>
              <div>
                <h2 className="font-serif text-[22px] text-[#3d4940]">Pilih Jadwal</h2>
                <p className="mt-[6px] text-[13px] text-[#6b6b6b]">
                  Jam operasional klinik tetap pukul 09.00–17.00.
                </p>
              </div>
            </div>

            <div className="mt-[22px]">
              <Field label="Tanggal reservasi">
                <Input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedTime('')
                  }}
                  className="rounded-[11px] border-[#f0ede7] text-[16px]"
                />
              </Field>
            </div>

            {selectedDate && (
              <>
                <div className="mt-[16px] flex items-center justify-between">
                  <p className="text-[16px] font-bold text-[#2c2c2c]">
                    {formatDateDisplay(selectedDate)}
                  </p>
                  <p className="text-[12px] text-[#6b6b6b]">Interval 30 menit</p>
                </div>

                <div className="mt-[14px] grid grid-cols-5 gap-[10px]">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedForDate.includes(slot)
                    const isSelected = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={cx(
                          'flex min-h-[42px] items-center justify-center rounded-[10px] border text-[13px] font-medium transition-all',
                          isBooked
                            ? 'cursor-not-allowed border-[#e6e6e2] bg-[#f5f5f3] text-[#a3a3a3]'
                            : isSelected
                              ? 'border-[#3d4940] bg-[#3d4940] text-white'
                              : 'border-[#f0ede7] bg-white text-[#191c1e] hover:border-[#3d4940] hover:bg-[#f5f5f3]',
                        )}
                      >
                        {slot.replace('.', ':')}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right Column: Ringkasan Reservasi ── */}
        <div className="lg:sticky lg:top-5">
          <div className="rounded-2xl border border-[#f0ede7] bg-white p-[24.8px] shadow-[0_14px_18px_rgba(61,73,64,0.08)]">
            <h2 className="font-serif text-[22px] text-[#3d4940]">Ringkasan Reservasi</h2>

            <div className="mt-5 space-y-4 border-t border-[#f0ede7] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6b6b6b]">
                  Pasien
                </p>
                {selectedPatient ? (
                  <>
                    <p className="mt-1 text-[14px] font-bold text-[#191c1e]">
                      {selectedPatient.name}
                    </p>
                    <p className="text-[12px] text-[#6b6b6b]">{selectedPatient.id}</p>
                    <p className="text-[12px] text-[#6b6b6b]">{selectedPatient.phone}</p>
                  </>
                ) : (
                  <p className="mt-1 text-[13px] text-[#a3a3a3]">Belum dipilih</p>
                )}
              </div>

              <div className="border-t border-[#f0ede7] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6b6b6b]">
                  Layanan
                </p>
                {selectedService ? (
                  <>
                    <p className="mt-1 text-[14px] font-bold text-[#191c1e]">
                      {selectedService.name}
                    </p>
                    <p className="text-[12px] text-[#6b6b6b]">
                      ± {selectedService.duration} menit
                    </p>
                    <p className="mt-1 text-[14px] font-bold text-[#3d4940]">
                      {formatRupiah(selectedService.price)}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-[13px] text-[#a3a3a3]">Belum dipilih</p>
                )}
              </div>

              <div className="border-t border-[#f0ede7] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6b6b6b]">
                  Jadwal
                </p>
                {selectedDate && selectedTime ? (
                  <>
                    <p className="mt-1 text-[14px] font-bold text-[#191c1e]">
                      {formatDateDisplay(selectedDate)}
                    </p>
                    <p className="text-[12px] text-[#6b6b6b]">
                      {selectedTime.replace('.', ':')}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-[13px] text-[#a3a3a3]">Belum dipilih</p>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-[#f0ede7] pt-4">
              <Field label="Catatan">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan keluhan atau catatan tambahan..."
                  rows={3}
                  className="text-[13px]"
                />
              </Field>
            </div>

            <div className="mt-4 border-t border-[#f0ede7] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-[#191c1e]">Total</span>
                <span className="text-[22px] font-bold text-[#191c1e]">
                  {selectedService ? formatRupiah(selectedService.price) : formatRupiah(0)}
                </span>
              </div>

              <Button
                className="mt-4 w-full"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Buat Reservasi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
