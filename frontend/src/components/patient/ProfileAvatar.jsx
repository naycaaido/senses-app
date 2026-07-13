export default function ProfileAvatar({ initials, size = 56, className = "" }) {
  return (
    <div
      className={`profile-avatar ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      <span className="profile-avatar__initials">{initials}</span>
    </div>
  );
}
