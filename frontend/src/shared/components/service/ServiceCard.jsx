import { Link } from "react-router-dom";

export default function ServiceCard({
  service,
  reservationPath,
  actionLabel = "Reservasi",
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#f0ede7] bg-white shadow-[0_1px_2px_rgba(44,44,44,0.04),0_8px_24px_-12px_rgba(61,73,64,0.18)]">
      <div className="flex flex-col items-start gap-3 bg-[#ebf0eb] px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex flex-col items-start gap-1">
          <h2 className="m-0 font-serif text-2xl font-bold leading-[30px] text-[#3d4940] md:text-[28px] md:leading-[35px]">{service.name}</h2>
          <span className="inline-flex items-center gap-1.5 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]">
            <img
              src="/assets/icon-clock.svg"
              alt=""
              className="size-3.5 shrink-0"
              aria-hidden="true"
            />
            {service.duration}
          </span>
        </div>
        <span className="rounded-full bg-white px-4 py-1.5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940] shadow-[0_1px_2px_rgba(44,44,44,0.04),0_8px_24px_rgba(61,73,64,0.18)]">{service.price}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="m-0 flex-1 text-[15px] leading-6 text-[#6b6b6b]">{service.description}</p>
        <div className="pt-5">
          <Link to={reservationPath} className="inline-flex items-center gap-2 rounded-full bg-[#3d4940] px-5 py-2.5 text-[15px] font-medium leading-6 text-[#fbf8f3] shadow-[0_1px_2px_rgba(44,44,44,0.04),0_8px_24px_rgba(61,73,64,0.18)] hover:bg-[#0c3320]">
            {actionLabel}
            <img
              src="/assets/icon-arrow.svg"
              alt=""
              className="size-[16.5px] shrink-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
