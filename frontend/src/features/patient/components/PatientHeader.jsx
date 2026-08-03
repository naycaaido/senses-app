import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../../shared/utils/authStorage.js";

export default function PatientHeader() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    navigate("/login");
  }

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-[#f0ede7] bg-[#fbf8f3]'>
      <div className='mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6'>
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
          className='order-3 flex w-full flex-wrap justify-center gap-1 md:order-none md:w-auto'
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

        <div className='flex items-center gap-2'>
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
      </div>
    </header>
  );
}
