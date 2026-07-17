import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconPlus, IconSearch, IconUsers } from '../components/Icons.jsx'
import { Avatar, Button, Card, EmptyRow, Input, PageHeader } from '../components/ui.jsx'
import { useStore } from '../data/store.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistPatientDataPage.module.css'

export default function DataPasien() {
  const { patients } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) =>
      [p.name, p.phone, p.city, p.id].some((f) => f.toLowerCase().includes(q)),
    )
  }, [patients, query])

  return (
    <div className={shared.page}>
      <PageHeader
        eyebrow="Manajemen Data Pasien"
        title="Data Pasien"
        action={
          <Button onClick={() => navigate('/resepsionis/data-pasien/baru')}>
            <IconPlus size={12} />
            Tambah Pasien
          </Button>
        }
      />

      <Card>
        <div className={shared.toolbar}>
          <div className={cx(shared.searchWrap, styles.search)}>
            <span className={shared.searchIcon}>
              <IconSearch size={16} />
            </span>
            <Input
              hasIcon
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, telepon, kota..."
            />
          </div>
          <p className={shared.toolbarNote}>{filtered.length} pasien terdaftar</p>
        </div>

        <div className={shared.tableWrap}>
          <table className={cx(shared.table, shared.tableMin720)}>
            <thead>
              <tr className={shared.theadRow}>
                {['Pasien', 'Telepon', 'Email', 'Kota', 'Aksi'].map((h) => (
                  <th key={h} className={shared.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <EmptyRow colSpan={5} />}
              {filtered.map((p) => (
                <tr key={p.id} className={shared.tr}>
                  <td className={shared.td}>
                    <div className={shared.cellPerson}>
                      <Avatar name={p.name} />
                      <div>
                        <p className={shared.personName}>{p.name}</p>
                        <p className={shared.personMeta}>#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={shared.td}>{p.phone}</td>
                  <td className={shared.td}>{p.email}</td>
                  <td className={shared.td}>{p.city}</td>
                  <td className={shared.td}>
                    <Button variant="outline" onClick={() => navigate(`/resepsionis/data-pasien/${p.id}`)}>
                      <IconUsers size={14} />
                      Lihat
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
