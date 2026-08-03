export default function BookingInfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-white px-5 py-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] [&_img]:size-4">
        <img src={icon} alt="" aria-hidden="true" />
      </div>
      <div>
        <p className="mb-0.5 text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]">{label}</p>
        <p className="m-0 text-[15px] font-semibold leading-6 text-[#2c2c2c]">{value}</p>
      </div>
    </div>
  );
}
