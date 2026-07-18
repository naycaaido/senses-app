export default function Button({
  children,
  variant = "",
  className = "",
  type = "button",
  onClick,
}) {
  const cls = `btn${variant ? ` btn--${variant}` : ""}${className ? ` ${className}` : ""}`;
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
