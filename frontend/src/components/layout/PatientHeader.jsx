import { Link, NavLink } from "react-router-dom";

export default function PatientHeader() {
  return (
    <header className='patient-header'>
      <div className='patient-header__inner'>
        <Link to='/pasien/dashboard' className='brand'>
          <span className='brand__name'>SENSE&rsquo;S</span>
          <span className='brand__sub'>clinic</span>
        </Link>

        <nav className='nav-links' aria-label='Patient navigation'>
          <NavLink to='/pasien/beranda'>Beranda</NavLink>
          <NavLink to='/pasien/layanan'>Layanan</NavLink>
          <NavLink to='/pasien/riwayat'>Riwayat</NavLink>
          <NavLink to='/pasien/profil'>Profil</NavLink>
        </nav>

        <div className='patient-header__avatar'>
          <span className='patient-header__initials'>AR</span>
        </div>
      </div>
    </header>
  );
}
