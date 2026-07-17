import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconCheckCircle } from '../components/Icons.jsx'
import { Button, Card, Field, Input, NotFound, Select } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistPatientRegistrationPage.module.css'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  birthPlace: '',
  birthDate: '',
  education: '',
  job: '',
  maritalStatus: '',
  religion: '',
  address: '',
  city: '',
  postalCode: '',
}

function Section({ title, children }) {
  return (
    <Card pad="lg">
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>{children}</div>
    </Card>
  )
}

export default function PendaftaranPasien() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPatient, addPatient, updatePatient } = useStore()

  const editing = Boolean(id)
  const existing = editing ? getPatient(id) : null
  const [form, setForm] = useState(existing ? { ...EMPTY, ...existing } : EMPTY)
  const [touched, setTouched] = useState(false)

  if (editing && !existing) {
    return <NotFound>Pasien tidak ditemukan.</NotFound>
  }

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const valid = form.name.trim() && form.phone.trim() && form.email.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    if (editing) {
      updatePatient(id, form)
      navigate(`/resepsionis/data-pasien/${id}`)
    } else {
      const newId = addPatient(form)
      navigate(`/resepsionis/data-pasien/${newId}`)
    }
  }

  const backTo = editing ? `/resepsionis/data-pasien/${id}` : '/resepsionis/data-pasien'

  return (
    <form onSubmit={handleSubmit} className={cx(shared.page, shared.narrow4xl)}>
      <button type="button" onClick={() => navigate(backTo)} className={shared.backLink}>
        ‹ Kembali
      </button>

      <div>
        <h1 className={shared.titleSans}>{editing ? 'Edit Pasien' : 'Pendaftaran Pasien Baru'}</h1>
        <p className={shared.subtitle}>
          {editing
            ? 'Perbarui data pasien yang sudah terdaftar.'
            : 'Lengkapi data pasien untuk membuat rekam baru.'}
        </p>
      </div>

      <Section title="Akun & Kontak">
        <Field label="Nama Lengkap" required>
          <Input value={form.name} onChange={set('name')} placeholder="Nama lengkap pasien" />
        </Field>
        <Field label="Nomor Telepon" required>
          <Input value={form.phone} onChange={set('phone')} placeholder="08xx-xxxx-xxxx" />
        </Field>
        <Field label="Email" required className={styles.span2}>
          <Input type="email" value={form.email} onChange={set('email')} placeholder="nama@email.com" />
        </Field>
      </Section>

      <Section title="Biodata Pasien">
        <Field label="Jenis Kelamin">
          <Select value={form.gender} onChange={set('gender')}>
            <option value="">Pilih jenis kelamin</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </Select>
        </Field>
        <Field label="Tempat Lahir">
          <Input value={form.birthPlace} onChange={set('birthPlace')} placeholder="Kota kelahiran" />
        </Field>
        <Field label="Tanggal Lahir">
          <Input type="date" value={form.birthDate} onChange={set('birthDate')} />
        </Field>
        <Field label="Pendidikan Terakhir">
          <Select value={form.education} onChange={set('education')}>
            <option value="">Pilih pendidikan</option>
            {['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Pekerjaan">
          <Input value={form.job} onChange={set('job')} placeholder="Pekerjaan pasien" />
        </Field>
        <Field label="Status Perkawinan">
          <Select value={form.maritalStatus} onChange={set('maritalStatus')}>
            <option value="">Pilih status</option>
            {['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Agama">
          <Input value={form.religion} onChange={set('religion')} placeholder="Agama" />
        </Field>
      </Section>

      <Section title="Alamat">
        <Field label="Alamat Domisili" className={styles.span2}>
          <Input value={form.address} onChange={set('address')} placeholder="Nama jalan, nomor, kelurahan" />
        </Field>
        <Field label="Kota">
          <Input value={form.city} onChange={set('city')} placeholder="Kota" />
        </Field>
        <Field label="Kode Pos">
          <Input value={form.postalCode} onChange={set('postalCode')} placeholder="12345" />
        </Field>
      </Section>

      <div className={styles.actions}>
        {touched && !valid && (
          <span className={styles.error}>Nama, telepon, dan email wajib diisi.</span>
        )}
        <Button type="button" variant="ghost" onClick={() => navigate(backTo)}>
          Batal
        </Button>
        <Button type="submit">
          <IconCheckCircle size={14} />
          {editing ? 'Simpan Perubahan' : 'Simpan Pasien'}
        </Button>
      </div>
    </form>
  )
}
