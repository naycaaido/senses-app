import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession } from '../../../shared/utils/authStorage.js'
import {
  IconCalendar,
  IconCheckCircle,
  IconGrid,
  IconHome,
  IconLogout,
  IconReceipt,
  IconUsers,
} from './Icons.jsx'

const navItems = [
  { to: '/resepsionis/dashboard', label: 'Dashboard', icon: IconHome },
  { to: '/resepsionis/reservasi', label: 'Reservasi', icon: IconCheckCircle },
  { to: '/resepsionis/data-pasien', label: 'Data Pasien', icon: IconUsers },
  { to: '/resepsionis/jadwal', label: 'Jadwal', icon: IconCalendar },
  { to: '/resepsionis/layanan', label: 'Layanan', icon: IconGrid },
  { to: '/resepsionis/pembayaran', label: 'Pembayaran', icon: IconReceipt },
]

function Sidebar({ onLogout }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#3d4940] px-4 py-5">
      <div className="px-2">
        <span className="font-serif text-lg font-bold tracking-[2.16px] text-[#fbf8f3]">SENSE&rsquo;S</span>
        <span className="ml-2 font-serif text-sm italic text-[#a8945e]">clinic</span>
      </div>
      <p className="mt-2 px-2 text-xs uppercase tracking-[0.3px] text-[#fbf8f3]/50">Panel Resepsionis</p>

      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#fbf8f3]'
                  : 'text-[#fbf8f3]/50 hover:bg-white/5 hover:text-[#fbf8f3]/80'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-[#fbf8f3]/15 pt-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-[#fbf8f3]/75 transition-colors hover:bg-white/5"
        >
          <IconLogout />
          Keluar
        </button>
      </div>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="flex h-[67px] shrink-0 items-center justify-between border-b border-[#e6e6e2] bg-white px-5">
      <p className="text-sm text-[#434655]">
        Sabtu, 21 Juni 2026 · <span className="font-semibold text-[#191c1e]">Front Office</span>
      </p>
      <div className="flex items-center gap-3 rounded-full border border-[#e6e6e2] py-1 pr-4 pl-1">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#f5f5f3] text-[11px] font-semibold text-[#3d4940]">NR</div>
        <div className="leading-[1.25]">
          <p className="text-[13px] font-semibold text-[#191c1e]">Nadia P.</p>
          <p className="text-[11px] text-[#434655]">Resepsionis</p>
        </div>
      </div>
    </header>
  )
}

export default function ReceptionistLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    navigate("/resepsionis/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen font-sans text-[#191c1e]">
      <Sidebar onLogout={handleLogout} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#f5f5f3] px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

