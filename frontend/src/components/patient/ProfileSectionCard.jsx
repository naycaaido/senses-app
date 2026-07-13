export default function ProfileSectionCard({ title, iconSrc, children }) {
  return (
    <section className="profile-card">
      <h2 className="profile-card__title">
        {iconSrc && (
          <span className="profile-card__icon">
            <img src={iconSrc} alt="" aria-hidden="true" />
          </span>
        )}
        {title}
      </h2>
      <div className="profile-card__body">{children}</div>
    </section>
  );
}
