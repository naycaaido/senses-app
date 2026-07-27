export default function Button({
  children,
  variant = "",
  className = "",
  type = "button",
  onClick,
}) {
  const variants = {
    dark: "bg-clinic-dark px-8 py-3.5 text-white hover:bg-[#0c3320]",
    login: "bg-clinic-dark px-[22px] py-2.5 text-white hover:bg-[#0c3320]",
    register: "border border-clinic-border bg-[#fff8f0] px-[22px] py-2.5 text-clinic-dark hover:bg-[#fdeee0]",
    outline: "border border-clinic-dark bg-transparent px-[25px] py-[9px] text-clinic-dark hover:bg-clinic-dark/5",
  };
  const cls = [
    "inline-flex cursor-pointer items-center justify-center rounded-full border-0 font-sans text-[13px] font-semibold tracking-[0.52px]",
    variants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
