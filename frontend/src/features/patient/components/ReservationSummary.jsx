export default function ReservationSummary({
  doctor,
  service,
  selectedDate,
  selectedTime,
}) {
  return (
    <aside className='w-full shrink-0 overflow-hidden rounded-2xl border border-[#ebf0eb] bg-[#ebf0eb] min-[1025px]:w-[340px]'>
      <div className='bg-[#3d4940] px-5 py-4'>
        <h2 className='m-0 font-serif text-base font-bold leading-[26.4px] text-[#fbf8f3]'>
          Ringkasan Reservasi
        </h2>
      </div>

      <div className='bg-white p-5'>
        <div className='flex items-start gap-3'>
          <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white'>
            <img src='/assets/icon-reservation-doctor.svg' alt='' />
          </div>
          <div>
            <p className='mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]'>
              Dokter
            </p>
            <p className='m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]'>
              {doctor.name}
            </p>
            <p className='m-0 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]'>
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-start gap-3'>
          <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white'>
            <img src='/assets/icon-reservation-check.svg' alt='' />
          </div>
          <div>
            <p className='mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]'>
              Layanan
            </p>
            <p className='m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]'>
              {service.name}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-start gap-3'>
          <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white'>
            <img src='/assets/icon-clock.svg' alt='' />
          </div>
          <div>
            <p className='mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]'>
              Estimasi
            </p>
            <p className='m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]'>
              {service.duration}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-start gap-3'>
          <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white'>
            <img src='/assets/icon-reservation-calendar.svg' alt='' />
          </div>
          <div>
            <p className='mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]'>
              Tanggal
            </p>
            <p className='m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]'>
              {selectedDate
                ? `${selectedDate.date} · ${selectedDate.day}`
                : "Belum dipilih"}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-start gap-3'>
          <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white'>
            <img src='/assets/icon-clock.svg' alt='' />
          </div>
          <div>
            <p className='mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]'>
              Jam
            </p>
            <p className='m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]'>
              {selectedTime || "Belum dipilih"}
            </p>
          </div>
        </div>

        <div className='mt-4 border-t border-[#3d4940]/15 pt-[17px]'>
          <div className='flex items-center justify-between'>
            <span className='text-[15px] text-[#6b6b6b]'>Total Biaya</span>
            <span className='text-[22px] font-bold leading-[28.6px] text-[#3d4940]'>
              {service.price}
            </span>
          </div>
          <p className='mt-1 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]'>
            Pembayaran dilakukan di kasir setelah kunjungan.
          </p>
        </div>
      </div>
    </aside>
  );
}
