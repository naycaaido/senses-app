import { NavLink, Outlet } from 'react-router-dom'
import {
  IconCalendar,
  IconCheckCircle,
  IconGrid,
  IconHome,
  IconLogout,
  IconReceipt,
  IconUsers,
} from './Icons.jsx'
import { cx } from '../utils/cx.js'
import '../styles/receptionist-global.css'
import styles from '../styles/ReceptionistLayout.module.css'

const navItems = [
  { to: '/resepsionis/dashboard', label: 'Dashboard', icon: IconHome },
  { to: '/resepsionis/reservasi', label: 'Reservasi', icon: IconCheckCircle },
  { to: '/resepsionis/data-pasien', label: 'Data Pasien', icon: IconUsers },
  { to: '/resepsionis/jadwal', label: 'Jadwal', icon: IconCalendar },
  { to: '/resepsionis/layanan', label: 'Layanan', icon: IconGrid },
  { to: '/resepsionis/pembayaran', label: 'Pembayaran', icon: IconReceipt },
]

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandName}>SENSE&rsquo;S</span>
        <span className={styles.brandSuffix}>clinic</span>
      </div>
      <p className={styles.panelLabel}>Panel Resepsionis</p>

      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cx(styles.navLink, isActive && styles.navLinkActive)}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <NavLink to="/resepsionis/keluar" className={styles.logout}>
          <IconLogout />
          Keluar
        </NavLink>
      </div>
    </aside>
  )
}

function Topbar() {
  return (
    <header className={styles.topbar}>
      <p className={styles.topbarDate}>
        Sabtu, 21 Juni 2026 · <span className={styles.topbarDateStrong}>Front Office</span>
      </p>
      <div className={styles.profile}>
        <div className={styles.profileAvatar}>NR</div>
        <div className={styles.profileMeta}>
          <p className={styles.profileName}>Nadia P.</p>
          <p className={styles.profileRole}>Resepsionis</p>
        </div>
      </div>
    </header>
  )
}

export default function ReceptionistLayout() {
  return (
    <div className={`${styles.shell} receptionist-shell`}>
      <Sidebar />
      <div className={styles.body}>
        <Topbar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
