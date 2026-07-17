import styles from "../../styles/patient-profile.module.css";
import cx from "../../utils/classNames.js";
export default function ProfileSectionCard({ title, iconSrc, children }) {
  return (
    <section className={cx(styles, "profile-card")}>
      <h2 className={cx(styles, "profile-card__title")}>
        {iconSrc && (
          <span className={cx(styles, "profile-card__icon")}>
            <img src={iconSrc} alt="" aria-hidden="true" />
          </span>
        )}
        {title}
      </h2>
      <div className={cx(styles, "profile-card__body")}>{children}</div>
    </section>
  );
}
