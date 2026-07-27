import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Chip, Field, Input, Select } from "../components/ui.jsx";
import { getReceptionistReservations } from "../../../shared/services/receptionistApi.js";

const statuses = ["Terjadwal", "Hadir", "Selesai", "Dibatalkan", "Tidak Hadir"];

export default function ReceptionistReservationApiPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: "", email_pasien: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setData((await getReceptionistReservations({ ...filters, limit: 100 })).data); }
    catch (requestError) { setError(requestError.message || "Reservasi tidak dapat dimuat."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filters.status]);

  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-[#434655]">Pengelolaan reservasi klinik</p><h1 className="text-[28px] font-bold text-[#191c1e]">Reservasi</h1></div><Button onClick={() => navigate("/resepsionis/reservasi/baru")}>Reservasi Baru</Button></div>
    <Card pad="md"><div className="grid gap-4 sm:grid-cols-3"><Field label="Status"><Select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">Semua Status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</Select></Field><Field label="Email pasien"><Input value={filters.email_pasien} onChange={(event) => setFilters((current) => ({ ...current, email_pasien: event.target.value }))} placeholder="nama@email.com" /></Field><div className="flex items-end"><Button variant="outline" onClick={load}>Terapkan Filter</Button></div></div></Card>
    <Card>{error && <p className="m-5 rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]">{error}</p>}<div className="overflow-x-auto"><table className="w-full min-w-[720px]"><thead><tr className="border-b bg-[#f5f5f3]/60 text-left">{["ID", "Pasien", "Layanan", "Tanggal", "Jam", "Status", "Aksi"].map((label) => <th key={label} className="px-5 py-3 text-xs text-[#434655]">{label}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan="7" className="p-8 text-center text-sm text-[#434655]">Memuat reservasi…</td></tr> : data.length === 0 ? <tr><td colSpan="7" className="p-8 text-center text-sm text-[#434655]">Tidak ada reservasi.</td></tr> : data.map((reservation) => <tr key={reservation.id} className="border-b border-[#e6e6e2]"><td className="px-5 py-4 text-sm font-semibold">{reservation.id}</td><td className="px-5 py-4 text-sm"><p className="font-semibold">{reservation.patientName}</p><p className="text-xs text-[#434655]">{reservation.patientEmail}</p></td><td className="px-5 py-4 text-sm">{reservation.service}</td><td className="px-5 py-4 text-sm">{reservation.date}</td><td className="px-5 py-4 text-sm">{reservation.time}</td><td className="px-5 py-4"><Chip>{reservation.status}</Chip></td><td className="px-5 py-4"><Link className="text-sm font-semibold text-blue-600 hover:underline" to={`/resepsionis/reservasi/${reservation.id}`}>Detail</Link></td></tr>)}</tbody></table></div></Card>
  </div>;
}
