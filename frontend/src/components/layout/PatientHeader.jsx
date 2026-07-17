import styles from "../../styles/patient-layout.module.css";
import cx from "../../utils/classNames.js";
import { Link, NavLink } from "react-router-dom";

export default function PatientHeader() {
  return (
    <header className={cx(styles, "patient-header")}>
      <div className={cx(styles, "patient-header__inner")}>
        <Link to='/pasien/dashboard' className={cx(styles, "brand")}>
          <span className={cx(styles, "brand__name")}>SENSE&rsquo;S</span>
          <span className={cx(styles, "brand__sub")}>clinic</span>
        </Link>

        <nav className={cx(styles, "nav-links")} aria-label='Patient navigation'>
          <NavLink to='/pasien/beranda'>Beranda</NavLink>
          <NavLink to='/pasien/layanan'>Layanan</NavLink>
          <NavLink to='/pasien/riwayat'>Riwayat</NavLink>
          <NavLink to='/pasien/profil'>Profil</NavLink>
        </nav>

        <div className={cx(styles, "patient-header__avatar")}>
          <span className={cx(styles, "patient-header__initials")}>AR</span>
        </div>
      </div>
    </header>
  );
}
