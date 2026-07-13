export default function ProfileInfoRow({ label, value }) {
  return (
    <div className="profile-info-row">
      <p className="profile-info-row__label">{label}</p>
      <p className="profile-info-row__value">{value}</p>
    </div>
  );
}
