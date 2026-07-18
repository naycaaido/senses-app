import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconSave } from '../components/Icons.jsx'
import { Button, Card, Field, Input, NotFound, Select, Textarea } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistServiceFormPage.module.css'

const EMPTY = { name: '', price: '', duration: '', status: 'Aktif', description: '' }

export default function FormLayanan() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getService, addService, updateService } = useStore()

  const editing = Boolean(id)
  const existing = editing ? getService(id) : null
  const [form, setForm] = useState(existing ? { ...EMPTY, ...existing } : EMPTY)
  const [touched, setTouched] = useState(false)

  if (editing && !existing) {
    return <NotFound>Layanan tidak ditemukan.</NotFound>
  }

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const valid = form.name.trim() && form.price !== '' && form.duration !== ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    const payload = {
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
    }
    if (editing) updateService(id, payload)
    else addService(payload)
    navigate('/resepsionis/layanan')
  }

  return (
    <form onSubmit={handleSubmit} className={cx(shared.page, shared.narrow3xl)}>
      <div>
        <h1 className={shared.titleSans}>{editing ? 'Edit Layanan' : 'Tambah Layanan'}</h1>
        <p className={shared.subtitle}>
          Lengkapi detail layanan medis, tarif, dan durasi operasional.
        </p>
      </div>

      <Card pad="lg">
        <div className={styles.grid}>
          <Field label="Nama Layanan" required className={styles.span2}>
            <Input value={form.name} onChange={set('name')} placeholder="Contoh: Facial Premium" />
          </Field>

          <Field label="Harga (IDR)" required>
            <div className={styles.prefixWrap}>
              <span className={styles.prefix}>Rp</span>
              <Input
                hasIcon
                type="number"
                min="0"
                value={form.price}
                onChange={set('price')}
                placeholder="0"
              />
            </div>
          </Field>

          <Field label="Estimasi Durasi (menit)" required>
            <Input type="number" min="0" value={form.duration} onChange={set('duration')} placeholder="30" />
          </Field>

          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Aktif</option>
              <option>Nonaktif</option>
              <option>Draft</option>
            </Select>
          </Field>

          <Field label="Deskripsi" className={styles.span2}>
            <Textarea
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Jelaskan layanan ini secara singkat..."
            />
          </Field>
        </div>
      </Card>

      <div className={styles.actions}>
        {touched && !valid && (
          <span className={styles.error}>Nama, harga, dan durasi wajib diisi.</span>
        )}
        <Button type="button" variant="outline" onClick={() => navigate('/resepsionis/layanan')}>
          Cancel
        </Button>
        <Button type="submit">
          <IconSave size={14} />
          Save Service
        </Button>
      </div>
    </form>
  )
}
