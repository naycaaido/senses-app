import { createContext, useContext, useMemo, useState } from 'react'

/* Data awal disalin dari isi layar di Figma (Resepsionis Final). */

const initialPatients = [
  {
    id: 'P-9021',
    name: 'Amanda Putri',
    phone: '0812-3456-7890',
    email: 'amanda.putri@email.com',
    gender: 'Perempuan',
    birthPlace: 'Bandung',
    birthDate: '1995-04-12',
    education: 'S1',
    job: 'Desainer',
    maritalStatus: 'Belum Menikah',
    religion: 'Islam',
    address: 'Jl. Merdeka No. 12',
    city: 'Bandung',
    postalCode: '40115',
    status: 'ACTIVE',
  },
  {
    id: 'P-8954',
    name: 'Budi Kusuma',
    phone: '0813-2211-8890',
    email: 'budi.kusuma@email.com',
    gender: 'Laki-laki',
    birthPlace: 'Jakarta',
    birthDate: '1990-09-02',
    education: 'S1',
    job: 'Wiraswasta',
    maritalStatus: 'Menikah',
    religion: 'Islam',
    address: 'Jl. Kenanga No. 5',
    city: 'Jakarta',
    postalCode: '12160',
    status: 'ACTIVE',
  },
  {
    id: 'P-9042',
    name: 'Lina Marlina',
    phone: '0857-9988-1122',
    email: 'lina.marlina@email.com',
    gender: 'Perempuan',
    birthPlace: 'Surabaya',
    birthDate: '1998-01-25',
    education: 'D3',
    job: 'Perawat',
    maritalStatus: 'Belum Menikah',
    religion: 'Kristen',
    address: 'Jl. Melati No. 30',
    city: 'Surabaya',
    postalCode: '60271',
    status: 'ACTIVE',
  },
  {
    id: 'P-9077',
    name: 'Annisa Rahmawati',
    phone: '0821-4455-6677',
    email: 'annisa.rahma@email.com',
    gender: 'Perempuan',
    birthPlace: 'Yogyakarta',
    birthDate: '1993-07-19',
    education: 'S1',
    job: 'Guru',
    maritalStatus: 'Menikah',
    religion: 'Islam',
    address: 'Jl. Kaliurang No. 8',
    city: 'Yogyakarta',
    postalCode: '55281',
    status: 'ACTIVE',
  },
  {
    id: 'P-9103',
    name: 'Rizky Ramadhan',
    phone: '0838-7766-5544',
    email: 'rizky.rmd@email.com',
    gender: 'Laki-laki',
    birthPlace: 'Medan',
    birthDate: '1996-11-30',
    education: 'S1',
    job: 'Programmer',
    maritalStatus: 'Belum Menikah',
    religion: 'Islam',
    address: 'Jl. Gatot Subroto No. 44',
    city: 'Medan',
    postalCode: '20112',
    status: 'ACTIVE',
  },
]

const initialServices = [
  { id: 'SVC-01', name: 'Konsultasi Kulit', price: 195000, duration: 30, status: 'Aktif', description: 'Konsultasi awal bersama dokter spesialis kulit.' },
  { id: 'SVC-02', name: 'Acne Starter Pack', price: 450000, duration: 60, status: 'Aktif', description: 'Paket perawatan awal untuk kulit berjerawat.' },
  { id: 'SVC-03', name: 'Essential Facial', price: 525000, duration: 60, status: 'Aktif', description: 'Facial dasar untuk membersihkan dan menyegarkan kulit.' },
  { id: 'SVC-04', name: 'Chemical Peeling', price: 450000, duration: 60, status: 'Nonaktif', description: 'Eksfoliasi kimia untuk meratakan tekstur kulit.' },
  { id: 'SVC-05', name: 'Laser Rejuvenation', price: 900000, duration: 90, status: 'Nonaktif', description: 'Peremajaan kulit dengan teknologi laser.' },
]

const initialReservations = [
  { id: 'RSV-2026-001', patientId: 'P-9077', patientName: 'Annisa Rahmawati', doctor: 'Dr. Sarah Wijaya', service: 'Konsultasi Kulit', price: 150000, date: '2026-07-20', time: '10.00', endTime: '10.30', status: 'Terkonfirmasi', complaint: 'Muncul kemerahan di area pipi sejak 2 minggu terakhir.' },
  { id: 'RSV-2026-002', patientId: 'P-9021', patientName: 'Amanda Putri', doctor: 'Dr. Sarah Wijaya', service: 'General Checkup', price: 450000, date: '2026-07-20', time: '09.30', endTime: '10.00', status: 'Terkonfirmasi', complaint: 'Pemeriksaan rutin bulanan.' },
  { id: 'RSV-2026-003', patientId: 'P-8954', patientName: 'Budi Kusuma', doctor: 'Dr. Andi Pratama', service: 'Acne Starter Pack', price: 350000, date: '2026-07-20', time: '10.15', endTime: '11.15', status: 'Terkonfirmasi', complaint: 'Jerawat meradang di dahi.' },
  { id: 'RSV-2026-004', patientId: 'P-9042', patientName: 'Lina Marlina', doctor: 'Dr. Sarah Wijaya', service: 'Essential Facial', price: 250000, date: '2026-07-21', time: '11.00', endTime: '11.45', status: 'Baru', complaint: 'Kulit kusam.' },
  { id: 'RSV-2026-005', patientId: 'P-9103', patientName: 'Rizky Ramadhan', doctor: 'Dr. Andi Pratama', service: 'Chemical Peeling', price: 450000, date: '2026-07-21', time: '13.00', endTime: '14.00', status: 'Hadir', complaint: 'Bekas jerawat membandel.' },
  { id: 'RSV-2026-006', patientId: 'P-9021', patientName: 'Amanda Putri', doctor: 'Dr. Sarah Wijaya', service: 'Konsultasi Kulit', price: 150000, date: '2026-06-14', time: '14.30', endTime: '15.00', status: 'Selesai', complaint: 'Kontrol lanjutan.' },
]

const initialPayments = [
  { id: 'INV-98211', patientId: 'P-9021', reservationId: 'RSV-2026-006', service: 'Konsultasi Kulit', amount: 150000, method: 'Tunai (Cash)', date: '2026-06-14', status: 'Lunas' },
  { id: 'INV-98455', patientId: 'P-8954', reservationId: null, service: 'Acne Starter Pack', amount: 350000, method: 'Debit / Credit', date: '2026-06-28', status: 'Lunas' },
  { id: 'INV-98702', patientId: 'P-9042', reservationId: null, service: 'Essential Facial', amount: 250000, method: 'QRIS / E-Wallet', date: '2026-07-05', status: 'Lunas' },
]

/* 16 slot 09.00–16.30, sesuai grid di layar Pengaturan Jadwal Operasional. */
export const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const minutes = 9 * 60 + i * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}.${String(minutes % 60).padStart(2, '0')}`
})

/* Sesuai layar Pengaturan Jadwal: 16 slot, 4 nonaktif, 3 sudah dipesan (terkunci). */
const INACTIVE_SLOTS = ['10.30', '11.00', '12.30', '16.30']
const BOOKED_SLOTS = ['09.30', '13.30', '15.00']

const initialSchedule = TIME_SLOTS.reduce((acc, slot) => {
  acc[slot] = { active: !INACTIVE_SLOTS.includes(slot), booked: BOOKED_SLOTS.includes(slot) }
  return acc
}, {})

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients)
  const [services, setServices] = useState(initialServices)
  const [reservations, setReservations] = useState(initialReservations)
  const [payments, setPayments] = useState(initialPayments)
  const [schedule, setSchedule] = useState(initialSchedule)

  const value = useMemo(() => {
    const nextId = (prefix, list, pad = 3) =>
      `${prefix}${String(list.length + 1).padStart(pad, '0')}`

    return {
      patients,
      services,
      reservations,
      payments,
      schedule,

      addPatient(data) {
        const id = `P-${9200 + patients.length}`
        setPatients((prev) => [...prev, { ...data, id, status: 'ACTIVE' }])
        return id
      },
      updatePatient(id, data) {
        setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      },
      getPatient(id) {
        return patients.find((p) => p.id === id)
      },

      addService(data) {
        const id = nextId('SVC-', services, 2)
        setServices((prev) => [...prev, { ...data, id }])
      },
      updateService(id, data) {
        setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
      },
      setServiceStatus(id, status) {
        setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
      },
      getService(id) {
        return services.find((s) => s.id === id)
      },

      addReservation(data) {
        const id = `RSV-2026-${String(reservations.length + 1).padStart(3, '0')}`
        setReservations((prev) => [...prev, { ...data, id, status: 'Baru' }])
        return id
      },
      getReservation(id) {
        return reservations.find((r) => r.id === id)
      },
      cancelReservation(id, reason) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'Dibatalkan', cancelReason: reason } : r)),
        )
      },
      completeReservation(id, method) {
        const reservation = reservations.find((r) => r.id === id)
        if (!reservation) return
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'Selesai' } : r)),
        )
        setPayments((prev) => [
          ...prev,
          {
            id: `INV-${99000 + prev.length}`,
            patientId: reservation.patientId,
            reservationId: reservation.id,
            service: reservation.service,
            amount: reservation.price,
            method,
            date: reservation.date,
            status: 'Lunas',
          },
        ])
      },

      /* Slot yang sudah dipesan terkunci — lihat catatan di layar Pengaturan Jadwal. */
      toggleSlot(slot) {
        setSchedule((prev) =>
          prev[slot].booked
            ? prev
            : { ...prev, [slot]: { ...prev[slot], active: !prev[slot].active } },
        )
      },
      setAllSlots(active) {
        setSchedule((prev) =>
          Object.fromEntries(
            Object.entries(prev).map(([slot, v]) => [slot, v.booked ? v : { ...v, active }]),
          ),
        )
      },
      resetSchedule() {
        setSchedule(initialSchedule)
      },
    }
  }, [patients, services, reservations, payments, schedule])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore harus dipakai di dalam StoreProvider')
  return ctx
}

export function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`
}

export function bookedSlots(reservations, date) {
  return reservations.filter((r) => r.date === date && r.status !== 'Dibatalkan').map((r) => r.time)
}
