import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../../shared/utils/authStorage.js";

export default function PatientHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    clearAuthSession();
    navigate("/login");
  }

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-[#f0ede7] bg-[#fbf8f3]'>
      <div className='relative mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <Link
          to='/pasien/beranda'
          className='flex items-baseline whitespace-nowrap font-serif leading-none'
        >
          <span className='text-2xl font-bold tracking-[0.18em] text-[#3d4940]'>
            SENSE&rsquo;S
          </span>
          <span className='ml-1.5 text-[18.72px] italic text-[#a8945e]'>
            clinic
          </span>
        </Link>

        <nav
          className='hidden items-center gap-1 md:flex'
          aria-label='Patient navigation'
        >
          {[
            ["/pasien/beranda", "Beranda"],
            ["/pasien/layanan", "Layanan"],
            ["/pasien/riwayat", "Riwayat"],
            ["/pasien/profil", "Profil"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? "text-[#3f7d58]" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='hidden items-center gap-2 md:flex'>
          <button
            onClick={handleLogout}
            className='flex size-8 items-center justify-center rounded-full text-[#6b6b6b] hover:bg-[#f0ede7] hover:text-[#3d4940] transition-colors'
            aria-label='Keluar'
            title='Keluar'
          >
            <img src='/assets/icon-logout.svg' alt='' />
          </button>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ebf0eb]'>
            <span className='font-serif text-xs font-bold tracking-[0.06em] text-[#3d4940]'>
              AR
            </span>
          </div>
        </div>

        <button
          type='button'
          className='flex size-10 items-center justify-center rounded-full text-[#3d4940] transition-colors hover:bg-[#f0ede7] md:hidden'
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMenuOpen}
          aria-controls='patient-mobile-menu'
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
            id='patient-mobile-menu'
            className='absolute inset-x-4 top-full z-10 flex flex-col gap-2 rounded-2xl border border-[#f0ede7] bg-[#fbf8f3] p-3 shadow-lg md:hidden'
            aria-label='Patient mobile navigation'
          >
            {[
              ['/pasien/beranda', 'Beranda'],
              ['/pasien/layanan', 'Layanan'],
              ['/pasien/riwayat', 'Riwayat'],
              ['/pasien/profil', 'Profil'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? 'bg-black/5 text-[#3f7d58]' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              type='button'
              onClick={handleLogout}
              className='mt-1 rounded-xl border-t border-[#f0ede7] px-4 pt-4 pb-3 text-left text-[15px] font-medium text-[#6b6b6b] hover:text-[#3d4940]'
            >
              Keluar
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
