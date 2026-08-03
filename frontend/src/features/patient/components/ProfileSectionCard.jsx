export default function ProfileSectionCard({ title, iconSrc, children }) {
  return (
    <section className="mb-4 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]">
      <h2 className="mb-5 flex items-center gap-2 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]">
        {iconSrc && (
          <span className="flex size-5 items-center justify-center [&_img]:size-5">
            <img src={iconSrc} alt="" aria-hidden="true" />
          </span>
        )}
        {title}
      </h2>
      <div className="-mt-1">{children}</div>
    </section>
  );
}
