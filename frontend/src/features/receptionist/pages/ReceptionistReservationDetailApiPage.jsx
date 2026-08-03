import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Chip, Modal, Textarea } from "../components/ui.jsx";
import {
  cancelReceptionistReservation,
  getReceptionistReservationDetail,
  updateReceptionistReservationStatus,
} from "../../../shared/services/receptionistApi.js";

const rupiah = (value) => `Rp${Number(value || 0).toLocaleString("id-ID")}`;
const cancellationDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

function cancellationErrorMessage(error) {
  if (error?.statusCode === 0) return "Koneksi gagal. Periksa jaringan atau server.";
  if (error?.statusCode === 403) return "Anda tidak memiliki akses untuk membatalkan reservasi ini.";
  if (error?.statusCode === 404) return "Reservasi tidak ditemukan atau sudah tidak tersedia.";
  if (error?.statusCode === 409) return "Reservasi sudah berubah atau tidak dapat dibatalkan lagi.";
  if (error?.statusCode === 400) return "Reservasi tidak dapat dibatalkan. Periksa alasan atau batas waktu pembatalan.";
  return "Reservasi belum dapat dibatalkan. Silakan coba lagi.";
}

function cancellationSummary(pembatalan) {
  if (!pembatalan) return null;
  return [
    pembatalan?.alasan_pembatalan
      ? `Alasan pembatalan: ${pembatalan?.alasan_pembatalan}`
      : null,
    pembatalan?.pihak_pembatalan
      ? `Dibatalkan oleh: ${pembatalan?.pihak_pembatalan}`
      : null,
    pembatalan?.dibatalkan_pada
      ? `Dibatalkan pada: ${cancellationDateFormatter.format(new Date(pembatalan?.dibatalkan_pada))} WIB`
      : null,
  ].filter(Boolean).join(" • ");
}

export default function ReceptionistReservationDetailApiPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setReservation(await getReceptionistReservationDetail(id));
    } catch (requestError) {
      setError(requestError.message || "Reservasi tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const openPending = (action) => {
    setError("");
    setPending(action);
  };

  const closePending = () => {
    if (submitting) return;
    setPending(null);
    setReason("");
    setError("");
  };

  const update = async () => {
    if (!pending || submitting) return;

    const trimmedReason = reason.trim();
    if (pending === "batal" && !trimmedReason) {
      setError("Alasan pembatalan wajib diisi.");
      return;
    }
    if (pending === "batal" && trimmedReason.length > 255) {
      setError("Alasan pembatalan maksimal 255 karakter.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (pending === "batal") {
        await cancelReceptionistReservation(id, trimmedReason);
      } else {
        await updateReceptionistReservationStatus(id, pending);
      }
      await load();
      setPending(null);
      setReason("");
    } catch (requestError) {
      if (pending === "batal" && [404, 409].includes(requestError?.statusCode)) {
        await load();
      }
      setError(
        pending === "batal"
          ? cancellationErrorMessage(requestError)
          : requestError.message || "Status reservasi tidak dapat diubah.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="py-10 text-center text-sm text-[#434655]">Memuat reservasi…</p>;
  if (!reservation) return <Card pad="md"><p className="text-[#a03d4a]">{error || "Reservasi tidak ditemukan."}</p></Card>;

  const canAttend = reservation.status === "Terjadwal";
  const canFinish = reservation.status === "Hadir";
  const detailContent = reservation.pembatalan
    ? cancellationSummary(reservation.pembatalan)
    : reservation.complaint || "Tidak ada keluhan yang dicatat.";

  return <div className="flex flex-col gap-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-[28px] font-bold text-[#191c1e]">Detail Reservasi</h1><p className="mt-1 text-sm text-[#434655]">{reservation.id}</p></div><Chip>{reservation.status}</Chip></div>{error && <p className="rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]">{error}</p>}<div className="flex flex-wrap gap-3">{canAttend && <Button onClick={() => openPending("hadir")}>Tandai Hadir</Button>}{canFinish && <Button onClick={() => openPending("selesai")}>Tandai Selesai</Button>}{canAttend && <Button variant="dangerSoft" onClick={() => openPending("batal")}>Batalkan</Button>}<Button variant="outline" onClick={() => navigate("/resepsionis/reservasi")}>Kembali</Button></div><div className="grid gap-5 lg:grid-cols-2"><Card pad="md"><h2 className="font-bold">Pasien</h2><p className="mt-3 font-semibold">{reservation.patientName}</p><p className="text-sm text-[#434655]">{reservation.patientEmail}</p><p className="text-sm text-[#434655]">{reservation.phone}</p></Card><Card pad="md"><h2 className="font-bold">Layanan dan Jadwal</h2><p className="mt-3 font-semibold">{reservation.service}</p><p className="text-sm text-[#434655]">{rupiah(reservation.price)} · {reservation.duration} menit</p><p className="mt-3 text-sm">{reservation.date} · {reservation.time} – {reservation.endTime}</p></Card><Card pad="md" className="lg:col-span-2"><h2 className="font-bold">{reservation.pembatalan ? "Detail Pembatalan" : "Keluhan Awal"}</h2><p className="mt-3 text-sm text-[#434655]">{detailContent}</p></Card></div>{pending && <Modal icon={<span className="text-xl font-bold">!</span>} iconTone={pending === "batal" ? "red" : "brand"} title={pending === "batal" ? "Batalkan Reservasi" : pending === "hadir" ? "Tandai Pasien Hadir" : "Selesaikan Reservasi"} subtitle="Konfirmasi perubahan status reservasi." onClose={closePending} footer={<><Button variant="outline" disabled={submitting} onClick={closePending}>Batal</Button><Button variant={pending === "batal" ? "danger" : "primary"} disabled={submitting} onClick={update}>{submitting ? "Memproses…" : "Konfirmasi"}</Button></>}>{pending === "batal" && <><Textarea rows={4} maxLength={255} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Alasan pembatalan" />{error && <p className="rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]">{error}</p>}</>}</Modal>}</div>;
}
