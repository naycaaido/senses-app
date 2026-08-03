export default function QueueCard({ time, status, service, estimatedWait }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-[#3d4940] shadow-[0_1px_3px_rgba(44,44,44,0.06),0_12px_32px_-16px_rgba(61,73,64,0.22)] min-[1025px]:w-[360px]">
      <div className="flex flex-col items-center gap-2 px-6 pb-5 pt-8">
        <p className="m-0 text-center text-xs font-semibold uppercase leading-4 tracking-[0.18em] text-[#fbf8f3]/70">Jam reservasi</p>
        <p className="m-0 text-center font-serif text-[64px] font-bold leading-[64px] text-[#fbf8f3] min-[1025px]:text-[88px] min-[1025px]:leading-[88px]">{time}</p>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#a8945e]/40 bg-[#f5edd6] px-[11px] py-[5px]">
          <img
            src="/assets/icon-clock-gold.svg"
            alt=""
            className="size-3.5"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap text-xs font-semibold tracking-[0.06em] text-[#6b5a28]">{status}</span>
        </div>
        <p className="m-0 text-center text-[15px] leading-6 text-[#fbf8f3]/80">{service}</p>
      </div>

      <div className="flex min-h-[123px] border-t border-[#fbf8f3]/15 bg-[#5c6b5e]/40">
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-6">
          <img
            src="/assets/icon-clock-estimate.svg"
            alt=""
            className="h-5 w-[19.17px]"
            aria-hidden="true"
          />
          <span className="text-[15px] uppercase leading-4 tracking-[0.025em] text-[#fbf8f3]/60">Estimasi</span>
          <span className="text-[15px] uppercase leading-4 tracking-[0.025em] text-[#fbf8f3]/60">Menunggu</span>
        </div>
        <div className="flex flex-1 items-center justify-center border-l border-[#fbf8f3]/15 px-4 py-6">
          <span className="text-center font-serif text-[28px] font-bold leading-[35px] text-[#a8945e]">&plusmn; {estimatedWait}</span>
        </div>
      </div>
    </div>
  );
}
