export default function ProfileAvatar({ initials, size = 56, className = "" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#ebf0eb] ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      <span className="font-serif text-xl font-bold leading-6 tracking-[0.06em] text-[#3d4940]">{initials}</span>
    </div>
  );
}
