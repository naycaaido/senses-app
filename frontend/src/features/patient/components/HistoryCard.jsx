import StatusBadge from "./StatusBadge.jsx";

export default function HistoryCard({ visit, onCancel }) {
  const {
    serviceName,
    reservationId,
    status,
    date,
    time,
    duration,
    paymentMethod,
    noteLabel,
    note,
    totalPayment,
  } = visit;

  return (
    <article
      className={`flex flex-col gap-6 rounded-[18px] border border-[#f9fafb] bg-white p-5 shadow-[0_12px_30px_rgba(45,53,45,0.06)] md:p-6 ${status === "Dibatalkan" ? "opacity-80" : ""}`}
    >
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='flex min-w-0 items-center'>
          <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#b99b57]/10'>
            <img
              src='/assets/icon-history-service.svg'
              alt=''
              className='size-6'
              aria-hidden='true'
            />
          </div>
          <div className='min-w-0 pl-4'>
            <h3 className='m-0 text-lg font-bold leading-7 text-[#3d4940]'>
              {serviceName}
            </h3>
            <p className='m-0 text-sm leading-5 text-[#9ca3af]'>
              ID: {reservationId}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className='flex flex-wrap justify-center gap-4 md:gap-6'>
        <div className='min-w-0 flex-[1_1_40%] md:flex-1'>
          <p className='mb-1 text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#9ca3af]'>
            TANGGAL
          </p>
          <p className='m-0 text-sm font-semibold leading-5 text-[#3d4940]'>
            {date}
          </p>
        </div>
        <div className='min-w-0 flex-[1_1_40%] md:flex-1'>
          <p className='mb-1 text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#9ca3af]'>
            WAKTU
          </p>
          <p className='m-0 text-sm font-semibold leading-5 text-[#3d4940]'>
            {time}
          </p>
        </div>
        <div className='min-w-0 flex-[1_1_40%] md:flex-1'>
          <p className='mb-1 text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#9ca3af]'>
            DURASI
          </p>
          <p className='m-0 text-sm font-semibold leading-5 text-[#3d4940]'>
            {duration}
          </p>
        </div>
        <div className='min-w-0 flex-[1_1_40%] md:flex-1'>
          <p className='mb-1 text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#9ca3af]'>
            METODE BAYAR
          </p>
          <p className='m-0 text-sm font-semibold leading-5 text-[#3d4940]'>
            {paymentMethod || "—"}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-1 rounded-lg bg-[#faf7f2] p-4'>
        <p className='m-0 text-xs font-bold uppercase leading-4 text-[#9ca3af]'>
          {noteLabel}
        </p>
        <p className='m-0 text-sm italic leading-5 text-[#4b5563]'>{note}</p>
      </div>

      <div className='flex justify-between items-end border-t border-[#f3f4f6] pt-[25px]'>
        <div>
          <p className='m-0 text-xs leading-4 text-[#9ca3af]'>
            Total Pembayaran
          </p>
          <p className='m-0 text-xl font-bold leading-7 text-[#3d4940]'>
            {totalPayment ? `Rp ${totalPayment}` : "—"}
          </p>
        </div>
        {status === "Terjadwal" && (
          <button
            type='button'
            onClick={() => onCancel?.(visit)}
            className='mt-5 text-sm rounded-2xl bg-[#a03d4a] hover:bg-[#7d2432] p-4 font-semibold text-white'
          >
            Batalkan reservasi
          </button>
        )}
      </div>
    </article>
  );
}
