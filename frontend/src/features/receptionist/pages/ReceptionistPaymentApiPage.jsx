import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Card, Chip, Field, Select } from "../components/ui.jsx";
import { getReceptionistReservations } from "../../../shared/services/receptionistApi.js";
import {
  createReceptionistPayment,
  getReceptionistInvoice,
  getReceptionistPayments,
} from "../../../shared/services/receptionistPaymentApi.js";
import { PageHeader } from "../components/ui.jsx";
import { IconPlus } from "../components/Icons.jsx";

const methods = ["Tunai", "Debit", "Transfer", "QRIS"];
const rupiah = (value) =>
  `Rp${Number.parseFloat(value || 0).toLocaleString("id-ID")}`;

function paymentErrorMessage(error) {
  if (error?.statusCode === 0)
    return "Koneksi gagal. Periksa jaringan atau server.";
  if (error?.statusCode === 403)
    return "Anda tidak memiliki akses untuk mencatat pembayaran.";
  if (error?.statusCode === 404)
    return "Reservasi atau tagihan tidak ditemukan.";
  if (error?.statusCode === 409)
    return "Pembayaran sudah tercatat atau reservasi belum dapat dibayar.";
  return error?.message || "Pembayaran tidak dapat disimpan.";
}

export default function ReceptionistPaymentApiPage() {
  const [searchParams] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [reservationId, setReservationId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [paymentResult, reservationResult] = await Promise.all([
        getReceptionistPayments({ limit: 100 }),
        getReceptionistReservations({ status: "Selesai", limit: 100 }),
      ]);
      setPayments(paymentResult.data);
      setCompleted(reservationResult.data);
    } catch (requestError) {
      setError(requestError.message || "Data pembayaran tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  const selectReservation = async (value) => {
    setReservationId(value);
    setInvoice(null);
    setError("");
    setNotice("");
    if (!value) return;
    try {
      setInvoice(await getReceptionistInvoice(value));
    } catch (requestError) {
      setError(requestError.message || "Tagihan tidak dapat dimuat.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const requestedReservation = searchParams.get("reservasi")?.trim();
    if (requestedReservation) selectReservation(requestedReservation);
  }, [searchParams]);

  const submit = async (event) => {
    event.preventDefault();
    if (
      saving ||
      !reservationId ||
      !invoice ||
      invoice.sudah_dibayar ||
      !methods.includes(method)
    )
      return;

    setSaving(true);
    setError("");
    setNotice("");
    try {
      await createReceptionistPayment(reservationId, method);
      setNotice("Pembayaran berhasil dicatat.");
      setReservationId("");
      setInvoice(null);
      setMethod("");
      await load();
    } catch (requestError) {
      if (requestError?.statusCode === 409) {
        await Promise.all([load(), selectReservation(reservationId)]);
        setNotice("Pembayaran sudah tercatat. Data telah diperbarui.");
        return;
      }
      setError(paymentErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader title='Pembayaran' />
      <div className='grid gap-5 lg:grid-cols-[1fr_380px]'>
        <Card pad='md'>
          <h2 className='font-bold'>Riwayat Pembayaran</h2>
          {error && (
            <p className='mt-4 rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
              {error}
            </p>
          )}
          {notice && (
            <p className='mt-4 rounded-lg bg-[#ebf0eb] p-3 text-sm text-[#3d4940]'>
              {notice}
            </p>
          )}
          <div className='mt-4 overflow-x-auto'>
            <table className='w-full min-w-[620px]'>
              <thead>
                <tr className='border-b bg-[#f5f5f3]/60 text-left'>
                  {[
                    "No. Reservasi",
                    "Pasien",
                    "Layanan",
                    "Metode",
                    "Total",
                  ].map((label) => (
                    <th
                      key={label}
                      className='px-4 py-3 text-xs text-[#434655]'
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='5' className='p-8 text-center text-sm'>
                      Memuat pembayaran…
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='p-8 text-center text-sm'>
                      Belum ada pembayaran.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.no_reservasi}
                      className='border-b border-[#e6e6e2]'
                    >
                      <td className='px-4 py-3 text-sm font-semibold'>
                        {payment.no_reservasi}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {payment.reservasi?.pasien?.nama_lengkap || "—"}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {payment.reservasi?.layanan?.nama_layanan || "—"}
                      </td>
                      <td className='px-4 py-3'>
                        <Chip>{payment.metode_pembayaran}</Chip>
                      </td>
                      <td className='px-4 py-3 text-sm font-semibold'>
                        {rupiah(payment.total_biaya)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <Card pad='md'>
          <h2 className='font-bold'>Catat Pembayaran</h2>
          <form className='mt-4 space-y-4' onSubmit={submit}>
            <Field label='Reservasi selesai' required>
              <Select
                value={reservationId}
                onChange={(event) => selectReservation(event.target.value)}
              >
                <option value=''>Pilih reservasi</option>
                {completed.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {reservation.id} — {reservation.patientName}
                  </option>
                ))}
              </Select>
            </Field>
            {invoice && (
              <div className='rounded-xl bg-[#f5f5f3] p-4 text-sm'>
                <p className='font-semibold'>{invoice.pasien?.nama_lengkap}</p>
                <p className='mt-1 text-[#434655]'>
                  {invoice.layanan?.nama_layanan}
                </p>
                <p className='mt-3 text-lg font-bold'>
                  {rupiah(invoice.total_biaya)}
                </p>
                {invoice.sudah_dibayar ? (
                  <p className='mt-2 text-xs text-[#a03d4a]'>
                    Reservasi ini sudah dibayar.
                  </p>
                ) : (
                  <p className='mt-2 text-xs text-[#434655]'>
                    Perlu pembayaran.
                  </p>
                )}
              </div>
            )}
            <Field label='Metode pembayaran' required>
              <Select
                value={method}
                onChange={(event) => setMethod(event.target.value)}
              >
                <option value=''>Pilih metode pembayaran</option>
                {methods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Button
              type='submit'
              disabled={
                saving ||
                !invoice ||
                invoice.sudah_dibayar ||
                !methods.includes(method)
              }
            >
              {saving ? "Menyimpan…" : "Simpan Pembayaran"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
