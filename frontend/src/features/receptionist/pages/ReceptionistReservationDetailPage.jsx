import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Chip,
  Modal,
  NotFound,
  Textarea,
} from "../components/ui.jsx";
import {
  cancelReceptionistReservation,
  getReceptionistReservationDetail,
  updateReceptionistReservationStatus,
} from "../../../shared/services/receptionistApi.js";

const formatRupiah = (value) =>
  `Rp${Number(value || 0).toLocaleString("id-ID")}`;

const cancellationDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

function cancellationErrorMessage(error) {
  if (error?.statusCode === 0)
    return "Koneksi gagal. Periksa jaringan atau server.";
  if (error?.statusCode === 403)
    return "Anda tidak memiliki akses untuk membatalkan reservasi ini.";
  if (error?.statusCode === 404)
    return "Reservasi tidak ditemukan atau sudah tidak tersedia.";
  if (error?.statusCode === 409)
    return "Reservasi sudah berubah atau tidak dapat dibatalkan lagi.";
  if (error?.statusCode === 400)
    return "Reservasi tidak dapat dibatalkan. Periksa alasan atau batas waktu pembatalan.";
  return "Reservasi belum dapat dibatalkan. Silakan coba lagi.";
}

function InfoCard({ title, rows }) {
  return (
    <Card pad='md'>
      <h2 className='text-[15px] font-bold text-[#191c1e]'>{title}</h2>
      <div className='mt-3 border-t border-[#e6e6e2]'>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className='flex items-center justify-between gap-4 border-b border-[#e6e6e2] py-3 last:border-b-0'
          >
            <span className='text-[13px] text-[#434655]'>{label}</span>
            <span className='text-right text-[13px] font-medium text-[#191c1e]'>
              {value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CancelModal({ reservation, onClose, onConfirm, submitting, error }) {
  const [reason, setReason] = useState("");
  return (
    <Modal
      icon={<span className='text-xl font-bold'>!</span>}
      iconTone='red'
      title='Batalkan Reservasi'
      subtitle='Anda akan membatalkan reservasi berikut:'
      onClose={submitting ? undefined : onClose}
      footer={
        <>
          <Button variant='outline' disabled={submitting} onClick={onClose}>
            Kembali
          </Button>
          <Button
            variant='danger'
            disabled={!reason.trim() || submitting}
            onClick={() => onConfirm(reason.trim())}
          >
            {submitting ? "Memproses…" : "Konfirmasi Pembatalan"}
          </Button>
        </>
      }
    >
      <div className='rounded-xl bg-[#f5f5f3] px-4 py-3'>
        <p className='text-[13px] font-semibold text-[#191c1e]'>
          {reservation.id}
        </p>
        <p className='text-[13px] text-[#434655]'>{reservation.patientName}</p>
        <p className='text-xs text-[#434655]'>
          {reservation.date && reservation.date.includes("-")
            ? new Date(`${reservation.date}T00:00:00`).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )
            : reservation.date}{" "}
          · {reservation.time}–{reservation.endTime}
        </p>
      </div>

      <label className='mt-4 block'>
        <span className='text-xs font-semibold text-[#191c1e]'>
          Alasan pembatalan <span className='text-[#a03d4a]'>*</span>
        </span>
        <Textarea
          className='mt-1.5'
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder='Tuliskan alasan pembatalan reservasi...'
          disabled={submitting}
        />
      </label>
      <p className='mt-2 text-xs text-[#434655]'>
        Alasan akan disimpan dan ditampilkan pada detail reservasi.
      </p>
      {error && (
        <p className='mt-3 rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}
    </Modal>
  );
}

function CompleteModal({ reservation, onClose, onConfirm, submitting, error }) {
  return (
    <Modal
      variant='bar'
      size='lg'
      title='Selesaikan Reservasi'
      subtitle='Konfirmasi kehadiran pasien. Pembayaran dicatat setelah reservasi selesai.'
      onClose={submitting ? undefined : onClose}
      footer={
        <>
          <Button variant='ghost' disabled={submitting} onClick={onClose}>
            Batal
          </Button>
          <Button disabled={submitting} onClick={onConfirm}>
            {submitting ? "Memproses…" : "Selesaikan"}
          </Button>
        </>
      }
    >
      <div className='grid grid-cols-2 gap-y-5 rounded-xl bg-[#f5f5f3]/70 px-5 py-4'>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]'>
            Patient Name
          </p>
          <p className='mt-1 text-sm font-bold text-[#191c1e]'>
            {reservation.patientName}
          </p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]'>
            Appointment Type
          </p>
          <Chip tone='gray' className='mt-1'>
            {reservation.service}
          </Chip>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-[0.05em] text-[#434655]'>
            Reservation ID
          </p>
          <p className='mt-1 text-sm font-bold text-[#191c1e]'>
            {reservation.id}
          </p>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-between border-b border-dashed border-[#e6e6e2] pb-3'>
        <span className='text-[13px] text-[#434655]'>
          Service Fee ({reservation.service})
        </span>
        <span className='text-[13px] font-semibold text-[#191c1e]'>
          {formatRupiah(reservation.price)}
        </span>
      </div>
      <div className='mt-3 flex items-center justify-between'>
        <span className='text-sm font-bold text-[#191c1e]'>
          Total Pembayaran
        </span>
        <span className='text-2xl font-bold text-[#191c1e]'>
          {formatRupiah(reservation.price)}
        </span>
      </div>
      {error && (
        <p className='mt-3 rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}
    </Modal>
  );
}

function AttendModal({ reservation, onClose, onConfirm, submitting, error }) {
  return (
    <Modal
      icon={<span className='text-xl font-bold'>!</span>}
      iconTone='brand'
      title='Tandai Pasien Hadir'
      subtitle='Konfirmasi perubahan status reservasi menjadi Hadir.'
      onClose={submitting ? undefined : onClose}
      footer={
        <>
          <Button variant='outline' disabled={submitting} onClick={onClose}>
            Batal
          </Button>
          <Button disabled={submitting} onClick={onConfirm}>
            {submitting ? "Memproses…" : "Tandai Hadir"}
          </Button>
        </>
      }
    >
      {error && (
        <p className='rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}
    </Modal>
  );
}

export default function DetailReservasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

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

  const closePending = () => {
    if (submitting) return;
    setModal(null);
    setModalError("");
  };

  const handleCancel = async (reason) => {
    if (submitting) return;
    if (!reason) {
      setModalError("Alasan pembatalan wajib diisi.");
      return;
    }
    if (reason.length > 255) {
      setModalError("Alasan pembatalan maksimal 255 karakter.");
      return;
    }

    setSubmitting(true);
    setModalError("");
    try {
      await cancelReceptionistReservation(id, reason);
      await load();
      setModal(null);
    } catch (requestError) {
      if ([404, 409].includes(requestError?.statusCode)) {
        await load();
      }
      setModalError(cancellationErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (submitting) return;
    setSubmitting(true);
    setModalError("");
    try {
      await updateReceptionistReservationStatus(id, status);
      await load();
      setModal(null);
    } catch (requestError) {
      setModalError(
        requestError.message || "Status reservasi tidak dapat diubah.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className='py-10 text-center text-sm text-[#434655]'>
        Memuat reservasi…
      </p>
    );
  }

  if (!reservation) {
    return <NotFound>{error || "Reservasi tidak ditemukan."}</NotFound>;
  }

  const closed = ["Selesai", "Dibatalkan"].includes(reservation.status);
  const canAttend = reservation.status === "Terjadwal";
  const canFinish = reservation.status === "Hadir";
  const canRecordPayment =
    reservation.status === "Selesai" && !reservation.pembayaran;
  const canViewPayment =
    reservation.status === "Selesai" && reservation.pembayaran;

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-[22px] font-bold text-[#191c1e]'>
          Detail Reservasi
        </h1>
        <Chip>{reservation.status}</Chip>
      </div>

      {error && (
        <p className='rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}

      <div className='flex flex-wrap gap-3'>
        {canAttend && (
          <Button disabled={closed} onClick={() => setModal("hadir")}>
            Tandai Hadir
          </Button>
        )}
        {canFinish && (
          <Button
            variant='gold'
            disabled={closed}
            onClick={() => setModal("complete")}
          >
            Selesaikan &amp; Pembayaran
          </Button>
        )}
        {canRecordPayment && (
          <Button
            onClick={() =>
              navigate(
                `/resepsionis/pembayaran?reservasi=${encodeURIComponent(
                  reservation.id,
                )}`,
              )
            }
          >
            Catat Pembayaran
          </Button>
        )}
        {canViewPayment && (
          <Button
            onClick={() =>
              navigate(
                `/resepsionis/pembayaran?reservasi=${encodeURIComponent(
                  reservation.id,
                )}`,
              )
            }
          >
            Lihat Pembayaran
          </Button>
        )}
        {canAttend && (
          <Button
            variant='dangerSoft'
            disabled={closed}
            onClick={() => setModal("cancel")}
          >
            Batalkan Reservasi
          </Button>
        )}
        <Button
          variant='outline'
          onClick={() => navigate("/resepsionis/reservasi")}
        >
          Kembali
        </Button>
      </div>

      {reservation.pembatalan && (
        <Card pad='sm' className='border-[#f3d9d9] bg-[#fdf1f1]'>
          <p className='text-xs font-semibold text-[#a03d4a]'>
            Alasan pembatalan
          </p>
          <p className='mt-1 text-[13px] text-[#191c1e]'>
            {reservation.pembatalan?.alasan_pembatalan}
          </p>
          <p className='text-xs font-semibold text-[#a03d4a]'>
            Dibatalkan oleh
          </p>
          <p className='mt-1 text-[13px] text-[#191c1e]'>
            {reservation.pembatalan?.pihak_pembatalan}
          </p>
          <p className='text-xs font-semibold text-[#a03d4a]'>
            Dibatalkan pada
          </p>
          <p className='mt-1 text-[13px] text-[#191c1e]'>
            {reservation.pembatalan?.dibatalkan_pada
              ? `${cancellationDateFormatter.format(
                  new Date(reservation.pembatalan?.dibatalkan_pada),
                )} WIB`
              : null}
          </p>
        </Card>
      )}

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-start'>
        <Card pad='lg' className='text-center'>
          <div className='mx-auto flex size-24 items-center justify-center rounded-full bg-[#f5f5f3] text-[26px] font-bold text-[#3d4940]'>
            {reservation.patientName
              ? reservation.patientName
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
              : "?"}
          </div>
          <p className='mt-4 text-xl font-bold text-[#191c1e]'>
            {reservation.patientName}
          </p>
          <div className='mt-4 border-t border-[#e6e6e2]'>
            <div className='flex items-center justify-between border-b border-[#e6e6e2] py-3 last:border-b-0'>
              <span className='text-xs font-medium text-[#434655]'>Email</span>
              <span className='text-[13px] text-[#191c1e]'>
                {reservation.patientEmail ?? "—"}
              </span>
            </div>
            <div className='flex items-center justify-between border-b border-[#e6e6e2] py-3 last:border-b-0'>
              <span className='text-xs font-medium text-[#434655]'>
                Telepon
              </span>
              <span className='text-[13px] text-[#191c1e]'>
                {reservation.phone ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <div className='flex flex-col gap-5'>
          <InfoCard
            title='Informasi Layanan'
            rows={[
              ["Layanan", reservation.service],
              ["Harga", formatRupiah(reservation.price)],
              ["Estimasi Durasi", `${reservation.duration ?? 60} menit`],
            ]}
          />
          <InfoCard
            title='Detail Jadwal'
            rows={[
              [
                "Tanggal",
                reservation.date && reservation.date.includes("-")
                  ? new Date(`${reservation.date}T00:00:00`).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : reservation.date,
              ],
              ["Jam", `${reservation.time} - ${reservation.endTime}`],
              ["Status", reservation.status],
            ]}
          />
          <Card pad='md'>
            <h2 className='text-[15px] font-bold text-[#191c1e]'>
              Keluhan Awal
            </h2>
            <p className='mt-3 border-t border-[#e6e6e2] pt-3 text-[13px] leading-[1.625] text-[#434655]'>
              {reservation.complaint || "Tidak ada keluhan yang dicatat."}
            </p>
          </Card>
        </div>
      </div>

      {modal === "cancel" && (
        <CancelModal
          reservation={reservation}
          onClose={closePending}
          onConfirm={handleCancel}
          submitting={submitting}
          error={modalError}
        />
      )}
      {modal === "complete" && (
        <CompleteModal
          reservation={reservation}
          onClose={closePending}
          onConfirm={() => handleStatusUpdate("selesai")}
          submitting={submitting}
          error={modalError}
        />
      )}
      {modal === "hadir" && (
        <AttendModal
          reservation={reservation}
          onClose={closePending}
          onConfirm={() => handleStatusUpdate("hadir")}
          submitting={submitting}
          error={modalError}
        />
      )}
    </div>
  );
}
