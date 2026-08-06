import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconCalendar,
  IconDots,
  IconPlus,
  IconReceipt,
  IconUsers,
} from "../components/Icons.jsx";
import { Button, Card, Chip, EmptyRow, NotFound } from "../components/ui.jsx";
import { formatRupiah, useStore } from "../data/store.jsx";
import {
  getReceptionistPatientHistory,
  getReceptionistPatientPayments,
  getReceptionistPatientProfile,
  getReceptionistPatientProfiles,
} from "../../../shared/services/receptionistPatientApi.js";
import { getReceptionistReservationDetail } from "../../../shared/services/receptionistApi.js";

const rupiah = (value) => `Rp${Number(value || 0).toLocaleString("id-ID")}`;
function Row({ label, value }) {
  return (
    <div className='flex justify-between gap-4 border-b border-[#e6e6e2] py-3 text-sm'>
      <span className='text-[#434655]'>{label}</span>
      <span className='text-right'>{value || "—"}</span>
    </div>
  );
}

function CardHeader({ icon, tone, title }) {
  return (
    <div className='flex items-center gap-3 px-5 py-4'>
      <span
        className={`flex size-8 items-center justify-center rounded-lg ${tone === "blue" ? "bg-[#eff6ff] text-[#2563eb]" : tone === "gold" ? "bg-[#f6f0e2] text-[#a8945e]" : "bg-[#ecfdf5] text-[#059669]"}`}
      >
        {icon}
      </span>
      <h2 className='text-[15px] font-bold text-[#191c1e]'>{title}</h2>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DetailPasien() {
  // const { id } = useParams();
  // const navigate = useNavigate();
  // const { getPatient, reservations, payments } = useStore();
  const [openMenu, setOpenMenu] = useState(null);

  // const patient = getPatient(id);
  // if (!patient) {
  //   return <NotFound>Pasien tidak ditemukan.</NotFound>;
  // }

  // const history = reservations.filter((r) => r.patientId === patient.id);
  // const invoices = payments.filter((p) =>
  //   reservations.some(
  //     (r) => r.id === p.no_reservasi && r.patientId === patient.id,
  //   ),
  // );

  const { id } = useParams();
  const email = decodeURIComponent(id);
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const [profile, reservationResult, paymentResult] = await Promise.all([
          getReceptionistPatientProfile(email),
          getReceptionistPatientHistory(email),
          getReceptionistPatientPayments(email),
        ]);
        setPatient(profile);
        setHistory(reservationResult.data);
        setPayments(paymentResult);
      } catch (requestError) {
        setError(requestError.message || "Detail pasien tidak dapat dimuat.");
      }
    })();
  }, [email]);
  if (error)
    return (
      <Card pad='md'>
        <p className='text-[#a03d4a]'>{error}</p>
      </Card>
    );
  if (!patient)
    return <p className='py-10 text-center text-sm'>Memuat pasien…</p>;

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-[22px] font-bold text-[#191c1e]'>
            Detail Pasien
          </h1>
          <p className='text-[13px] text-[#434655]'>
            Ringkasan biodata, riwayat reservasi, dan pembayaran.
          </p>
        </div>
        <Button
          onClick={() =>
            navigate(`/resepsionis/data-pasien/${patient.id}/edit`)
          }
        >
          <IconPlus size={12} />
          Edit Pasien
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-start'>
        <Card pad='lg' className='text-center'>
          <div className='mx-auto flex size-24 items-center justify-center rounded-full bg-[#f5f5f3] text-[26px] font-bold text-[#3d4940]'>
            {patient.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <p className='mt-4 text-xl font-bold text-[#191c1e]'>
            {patient.name}
          </p>
          <div className='mt-4 text-left'>
            <Row label='Gender' value={patient.gender} />
            <Row label='Tanggal Lahir' value={formatDate(patient.birthDate)} />
            <div className='flex items-center justify-between gap-4 py-3'>
              <span className='text-xs font-medium text-[#434655]'>Status</span>
              <Chip>{patient.status}</Chip>
            </div>
          </div>
        </Card>

        <div className='flex flex-col gap-5'>
          <Card>
            <CardHeader
              icon={<IconUsers size={16} />}
              tone='blue'
              title='Personal Information'
            />
            <div className='border-t border-[#e6e6e2] px-5'>
              <Row label='Email' value={patient.email} />
              <Row label='Telepon' value={patient.phone} />
              <Row label='Alamat' value={patient.address} />
              <Row label='Kota' value={patient.city} />
              <Row label='Kode Pos' value={patient.postalCode} />
            </div>
          </Card>

          <Card>
            <CardHeader
              icon={<IconCalendar size={16} />}
              tone='gold'
              title='Reservation History'
            />
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[600px]'>
                <thead>
                  <tr className='border-y border-[#e6e6e2] bg-[#f5f5f3]/60 text-left'>
                    {[
                      "No Reservasi",
                      "Service",
                      "Date & Time",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className='px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && (
                    <EmptyRow colSpan={5}>Belum ada reservasi.</EmptyRow>
                  )}
                  {history.map((r) => (
                    <tr
                      key={r.id}
                      className='border-b border-[#e6e6e2] last:border-b-0'
                    >
                      <td className='px-5 py-4 text-[13px] font-bold text-[#191c1e]'>
                        {r.id}
                      </td>
                      <td className='px-5 py-4 text-[13px] font-semibold text-[#191c1e]'>
                        {r.service}
                      </td>
                      <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                        {formatDate(r.date)} · {r.time}
                      </td>
                      <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                        <Chip>{r.status}</Chip>
                      </td>
                      <td className='relative px-5 py-4 text-[13px] text-[#191c1e]'>
                        <button
                          aria-label={`Aksi untuk ${r.id}`}
                          onClick={() =>
                            setOpenMenu(openMenu === r.id ? null : r.id)
                          }
                          className='rounded-lg p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]'
                        >
                          <IconDots size={18} />
                        </button>
                        {openMenu === r.id && (
                          <>
                            <div
                              className='fixed inset-0 z-10'
                              onClick={() => setOpenMenu(null)}
                            />
                            <div className='absolute right-5 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-[#e6e6e2] bg-white py-1 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)]'>
                              <button
                                onClick={() =>
                                  navigate(`/resepsionis/reservasi/${r.id}`)
                                }
                                className='block w-full px-4 py-2 text-left text-[13px] text-[#191c1e] hover:bg-[#f5f5f3]'
                              >
                                Lihat detail reservasi
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader
              icon={<IconReceipt size={16} />}
              tone='green'
              title='Payment History'
            />
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[600px]'>
                <thead>
                  <tr className='border-y border-[#e6e6e2] bg-[#f5f5f3]/60 text-left'>
                    {[
                      "No Reservasi",
                      "Layanan",
                      "Tanggal",
                      "Total",
                      "Method",
                    ].map((h) => (
                      <th
                        key={h}
                        className='px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <EmptyRow colSpan={5}>Belum ada pembayaran.</EmptyRow>
                  )}
                  {payments.map((p) => (
                    <tr
                      key={p.no_reservasi}
                      className='border-b border-[#e6e6e2] last:border-b-0'
                    >
                      <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                        {p.no_reservasi ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/resepsionis/reservasi/${p.no_reservasi}`,
                              )
                            }
                            className='text-[13px] font-semibold text-[#2563eb] hover:underline'
                          >
                            {p.no_reservasi}
                          </button>
                        ) : (
                          <span className='text-[13px] font-semibold text-[#2563eb]'>
                            {p.no_reservasi}
                          </span>
                        )}
                      </td>
                      <td className='px-5 py-4 text-[13px] text-[#191c1e]'>
                        {formatDate(p.tanggal_bayar)}
                      </td>
                      <td className='px-5 py-4 text-[13px] font-bold text-[#191c1e]'>
                        {formatRupiah(Number(p.total_biaya))}
                      </td>
                      <td className='px-5 py-4 text-[13px] text-[#434655]'>
                        {p.metode_pembayaran}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
