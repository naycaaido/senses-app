import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconSearch, IconUsers } from "../components/Icons.jsx";
import {
  Avatar,
  Button,
  Card,
  EmptyRow,
  Input,
  PageHeader,
} from "../components/ui.jsx";
import { useStore } from "../data/store.jsx";
import { getReceptionistPatientProfiles } from "../../../shared/services/receptionistPatientApi.js";

export default function DataPasien() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const result = await getReceptionistPatientProfiles({
        search: query,
        limit: 100,
      });
      setPatients(result.data);
      setTotal(result.pagination?.total || result.data.length);
    } catch (requestError) {
      setError(requestError.message || "Pasien tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  console.log(patients);
  // const { patients } = useStore()
  // const navigate = useNavigate()
  // const [query, setQuery] = useState('')

  // const filtered = useMemo(() => {
  //   const q = query.trim().toLowerCase()
  //   if (!q) return patients
  //   return patients.filter((p) =>
  //     [p.name, p.phone, p.city, p.id].some((f) => f.toLowerCase().includes(q)),
  //   )
  // }, [patients, query])

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='Manajemen Data Pasien'
        title='Data Pasien'
        action={
          <Button onClick={() => navigate("/resepsionis/data-pasien/baru")}>
            <IconPlus size={12} />
            Tambah Pasien
          </Button>
        }
      />

      <Card>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e6e2] p-5'>
          <div className='relative w-80'>
            <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#a3a3a3]'>
              <IconSearch size={16} />
            </span>
            <Input
              hasIcon
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Cari nama, telepon, kota...'
            />
          </div>
          <p className='text-xs text-[#434655]'>
            {patients.length} pasien terdaftar
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[720px]'>
            <thead>
              <tr className='border-b border-[#e6e6e2] bg-[#f5f5f3]/60 text-left'>
                {["Pasien", "Telepon", "Email", "Kota", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className='bg-[#f5f5f3]/60 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 && <EmptyRow colSpan={5} />}
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className='border-b border-[#e6e6e2] last:border-b-0'
                >
                  <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                    <div className='flex items-center gap-3'>
                      <Avatar name={p.name} />
                      <div>
                        <p className='text-[13px] font-semibold text-[#191c1e]'>
                          {p.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                    {p.phone}
                  </td>
                  <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                    {p.email}
                  </td>
                  <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                    {p.city}
                  </td>
                  <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                    <Button
                      variant='outline'
                      onClick={() =>
                        navigate(
                          `/resepsionis/data-pasien/${encodeURIComponent(p.email)}`,
                        )
                      }
                    >
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
  );
}
