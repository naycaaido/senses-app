import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip } from "../components/ui.jsx";
import { PageHeader } from "../components/ui.jsx";
import { IconPlus } from "../components/Icons.jsx";
import {
  getReceptionistPatients,
  getReceptionistReservations,
} from "../../../shared/services/receptionistApi.js";

function Stat({ label, value, note }) {
  return (
    <Card pad='md'>
      <p className='text-xs text-[#434655]'>{label}</p>
      <p className='mt-1 text-3xl font-bold text-[#191c1e]'>{value}</p>
      <p className='mt-1 text-xs text-[#747873]'>{note}</p>
    </Card>
  );
}

export default function ReceptionistDashboardApiPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const [patientResult, reservationResult] = await Promise.all([
          getReceptionistPatients({ limit: 1 }),
          getReceptionistReservations({ limit: 20 }),
        ]);
        setPatients(patientResult.pagination?.total || 0);
        setReservations(reservationResult.data);
      } catch (requestError) {
        setError(requestError.message || "Dashboard tidak dapat dimuat.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const present = reservations.filter((item) => item.status === "Hadir").length;
  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        title='Dashboard'
        action={
          <Button onClick={() => navigate("/resepsionis/reservasi/baru")}>
            <IconPlus size={12} />
            Reservasi baru
          </Button>
        }
      />
      {error && (
        <p className='rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
        <Stat
          label='Total Pasien'
          value={loading ? "—" : patients}
          note='Data dari backend'
        />
        <Stat
          label='Reservasi Terbaru'
          value={loading ? "—" : reservations.length}
          note='20 data terbaru'
        />
        <Stat
          label='Pasien Hadir'
          value={loading ? "—" : present}
          note='Status saat ini'
        />
      </div>
      <Card>
        <div className='flex items-center justify-between px-5 py-4'>
          <h2 className='font-bold'>Reservasi Terbaru</h2>
          <Link
            to='/resepsionis/reservasi'
            className='text-sm font-semibold text-blue-600 hover:underline'
          >
            Lihat Semua
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[620px]'>
            <thead>
              <tr className='border-y bg-[#f5f5f3]/60 text-left'>
                {["Pasien", "Layanan", "Tanggal", "Status"].map((label) => (
                  <th key={label} className='px-5 py-3 text-xs text-[#434655]'>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='4' className='p-8 text-center text-sm'>
                    Memuat dashboard…
                  </td>
                </tr>
              ) : (
                reservations.slice(0, 5).map((item) => (
                  <tr key={item.id} className='border-b border-[#e6e6e2]'>
                    <td className='px-5 py-4'>
                      <p className='font-semibold'>{item.patientName}</p>
                      <p className='text-xs text-[#434655]'>
                        {item.patientEmail}
                      </p>
                    </td>
                    <td className='px-5 py-4 text-sm'>{item.service}</td>
                    <td className='px-5 py-4 text-sm'>
                      {item.date} · {item.time}
                    </td>
                    <td className='px-5 py-4'>
                      <Chip>{item.status}</Chip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
