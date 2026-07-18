import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconSave } from '../components/Icons.jsx'
import { Button, Card, Field, Input, NotFound, Select, Textarea } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
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
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  span2: 'sm:col-span-2',
  prefixWrap: 'relative',
  prefix: 'pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-[#434655]',
  actions: 'flex items-center justify-end gap-3',
  error: 'text-xs text-[#a03d4a]',
}

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

