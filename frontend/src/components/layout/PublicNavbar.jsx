import styles from "../../styles/public-layout.module.css";
import cx from "../../utils/classNames.js";
import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className={cx(styles, "navbar")}>
      <div className={cx(styles, "navbar__inner")}>
        <Link to='/' className={cx(styles, "brand")}>
          <span className={cx(styles, "brand__name")}>SENSE&rsquo;S</span>
          <span className={cx(styles, "brand__sub")}>clinic</span>
        </Link>

        <nav className={cx(styles, "nav-links")}>
          <Link to='/'>Beranda</Link>
          <NavLink to='/layanan'>Layanan</NavLink>
        </nav>

        <div className={cx(styles, "nav-auth")}>
          <Link to='/login' className={cx(styles, "btn btn--login")}>
            Login
          </Link>
          <Link to='/register' className={cx(styles, "btn btn--register")}>
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
