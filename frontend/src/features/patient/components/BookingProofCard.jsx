import BookingInfoRow from "./BookingInfoRow.jsx";

export default function BookingProofCard({ booking }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#f0ede7] bg-white shadow-[0_1px_3px_rgba(44,44,44,0.06),0_12px_32px_-16px_rgba(61,73,64,0.22)]">
      <div className="flex flex-col items-center bg-[#3d4940] px-6 py-8 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#ebf0eb] [&_img]:size-9">
          <img src="/assets/icon-booking-success.svg" alt="" aria-hidden="true" />
        </div>
        <h1 className="m-0 font-serif text-[28px] font-bold leading-[34px] text-[#fbf8f3] min-[481px]:text-[40px] min-[481px]:leading-[46px]">Reservasi Berhasil Dibuat</h1>
        <p className="mt-2 text-base leading-[26.4px] text-[#ebf0eb]">
          Terima kasih. Berikut bukti reservasi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-[#f0ede7] min-[481px]:grid-cols-2">
        <BookingInfoRow
          icon="/assets/icon-reservation-doctor.svg"
          label="Dokter"
          value={booking.doctor}
        />
        <BookingInfoRow
          icon="/assets/icon-booking-service.svg"
          label="Layanan"
          value={booking.serviceName}
        />
        <BookingInfoRow
          icon="/assets/icon-reservation-calendar.svg"
          label="Tanggal"
          value={booking.date}
        />
        <BookingInfoRow
          icon="/assets/icon-booking-clock.svg"
          label="Jam"
          value={booking.time}
        />
      </div>

      <div className="flex items-center justify-between bg-white px-5 py-4">
        <span className="text-[15px] text-[#6b6b6b]">Total Biaya</span>
        <span className="font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]">{booking.totalPrice}</span>
      </div>
    </div>
  );
}
