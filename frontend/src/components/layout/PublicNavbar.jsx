import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='brand'>
          <span className='brand__name'>SENSE&rsquo;S</span>
          <span className='brand__sub'>clinic</span>
        </Link>

        <nav className='nav-links'>
          <Link to='/'>Beranda</Link>
          <NavLink to='/layanan'>Layanan</NavLink>
        </nav>

        <div className='nav-auth'>
          <Link to='/login' className='btn btn--login'>
            Login
          </Link>
          <Link to='/register' className='btn btn--register'>
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
