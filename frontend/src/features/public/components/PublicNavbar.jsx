import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className='sticky top-0 z-50 border-b border-[#f0ede7] bg-[#fbf8f3]'>
      <div className='relative mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <Link
          to='/'
          onClick={handleClick}
          className='flex items-baseline whitespace-nowrap font-serif leading-none'
        >
          <span className='text-2xl font-bold tracking-[0.18em] text-[#3d4940]'>
            SENSE&rsquo;S
          </span>
          <span className='ml-1.5 text-[18.72px] italic text-[#a8945e]'>
            clinic
          </span>
        </Link>

        <nav className='hidden items-center gap-1 md:flex' aria-label='Public navigation'>
          <NavLink
            to='/'
            onClick={closeMenu}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? "text-[#3f7d58]" : ""}`
            }
          >
            Beranda
          </NavLink>
          <NavLink
            to='/layanan'
            onClick={closeMenu}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? "text-[#3f7d58]" : ""}`
            }
          >
            Layanan
          </NavLink>
        </nav>

        <div className='hidden items-center gap-2 md:flex'>
          <Link
            to='/login'
            className='rounded-full bg-[#082518] px-[22px] py-2.5 text-[13px] font-semibold tracking-[0.04em] text-white hover:bg-[#0c3320]'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='rounded-full border border-[#d8c7b5] bg-[#fff8f0] px-[22px] py-2.5 text-[13px] font-semibold tracking-[0.04em] text-[#082518] hover:bg-[#fdeee0]'
          >
            Register
          </Link>
        </div>

        <button
          type='button'
          className='flex size-10 items-center justify-center rounded-full text-[#3d4940] transition-colors hover:bg-[#f0ede7] md:hidden'
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMenuOpen}
          aria-controls='public-mobile-menu'
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        >
          <span className='sr-only'>Menu</span>
          <svg viewBox='0 0 24 24' className='size-6' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
            {isMenuOpen ? (
              <path strokeLinecap='round' d='m6 6 12 12M18 6 6 18' />
            ) : (
              <path strokeLinecap='round' d='M4 7h16M4 12h16M4 17h16' />
            )}
          </svg>
        </button>

        {isMenuOpen && (
          <nav
            id='public-mobile-menu'
            className='absolute inset-x-4 top-full z-10 flex flex-col gap-2 rounded-2xl border border-[#f0ede7] bg-[#fbf8f3] p-3 shadow-lg md:hidden'
            aria-label='Public mobile navigation'
          >
            <NavLink
              to='/'
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? 'bg-black/5 text-[#3f7d58]' : ''}`
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to='/layanan'
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? 'bg-black/5 text-[#3f7d58]' : ''}`
              }
            >
              Layanan
            </NavLink>
            <div className='mt-1 grid grid-cols-2 gap-2 border-t border-[#f0ede7] pt-3'>
              <Link
                to='/login'
                onClick={closeMenu}
                className='rounded-xl bg-[#082518] px-4 py-3 text-center text-[13px] font-semibold tracking-[0.04em] text-white hover:bg-[#0c3320]'
              >
                Login
              </Link>
              <Link
                to='/register'
                onClick={closeMenu}
                className='rounded-xl border border-[#d8c7b5] bg-[#fff8f0] px-4 py-3 text-center text-[13px] font-semibold tracking-[0.04em] text-[#082518] hover:bg-[#fdeee0]'
              >
                Register
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
