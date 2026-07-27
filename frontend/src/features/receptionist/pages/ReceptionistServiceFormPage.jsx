import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconSave } from '../components/Icons.jsx'
import { Button, Card, Field, Input, NotFound, Select, Textarea } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'

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
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-[22px] font-bold text-[#191c1e]">{editing ? 'Edit Layanan' : 'Tambah Layanan'}</h1>
        <p className="text-[13px] text-[#434655]">
          Lengkapi detail layanan medis, tarif, dan durasi operasional.
        </p>
      </div>

      <Card pad="lg">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Layanan" required className="sm:col-span-2">
            <Input value={form.name} onChange={set('name')} placeholder="Contoh: Facial Premium" />
          </Field>

          <Field label="Harga (IDR)" required>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#434655]">Rp</span>
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
            </Select>
          </Field>

          <Field label="Deskripsi" className="sm:col-span-2">
            <Textarea
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Jelaskan layanan ini secara singkat..."
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {touched && !valid && (
          <span className="text-xs text-[#a03d4a]">Nama, harga, dan durasi wajib diisi.</span>
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
