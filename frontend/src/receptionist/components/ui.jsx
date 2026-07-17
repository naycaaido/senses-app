import { IconX } from './Icons.jsx'
import { cx } from '../utils/cx.js'
import styles from '../styles/ReceptionistUi.module.css'

/* Prop `className` di komponen-komponen ini hanya untuk properti tata letak yang
   TIDAK didefinisikan di ReceptionistUi.module.css (margin, grid-column, position, overflow).
   Ukuran, padding, dan warna diatur lewat prop semantik agar tidak ada tabrakan. */

export function Button({ variant = 'primary', fullWidth, className, children, ...rest }) {
  return (
    <button
      className={cx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...rest}
    >
      {children}
    </button>
  )
}

const pads = { sm: styles.padSm, md: styles.padMd, lg: styles.padLg, xl: styles.padXl }

export function Card({ pad, className, children }) {
  return <div className={cx(styles.card, pad && pads[pad], className)}>{children}</div>
}

const tones = {
  green: styles.toneGreen,
  yellow: styles.toneYellow,
  blue: styles.toneBlue,
  gray: styles.toneGray,
  red: styles.toneRed,
  gold: styles.toneGold,
}

/* Peta status → warna chip, disamakan dengan badge di Figma. */
export const statusTone = {
  Terkonfirmasi: 'green',
  Selesai: 'green',
  Aktif: 'green',
  ACTIVE: 'green',
  COMPLETED: 'green',
  Lunas: 'green',
  Menunggu: 'yellow',
  WAITING: 'yellow',
  Baru: 'blue',
  NEW: 'blue',
  Hadir: 'blue',
  UPCOMING: 'blue',
  Draft: 'gray',
  Nonaktif: 'gray',
  Dibatalkan: 'red',
  Dipesan: 'gold',
}

export function Chip({ tone, children, className }) {
  const resolved = tone ?? statusTone[children] ?? 'gray'
  return <span className={cx(styles.chip, tones[resolved], className)}>{children}</span>
}

export function Field({ label, required, children, className }) {
  return (
    <label className={cx(styles.field, className)}>
      <span className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </span>
      {children}
    </label>
  )
}

/* Kontrol form selalu selebar induknya. Untuk melebar-sempitkan, bungkus dengan
   wrapper ber-lebar di halaman pemanggil — jangan oper lebar lewat className. */
export function Input({ hasIcon, className, ...rest }) {
  return <input className={cx(styles.control, hasIcon && styles.hasIcon, className)} {...rest} />
}

export function Textarea({ className, ...rest }) {
  return <textarea className={cx(styles.control, styles.textarea, className)} {...rest} />
}

export function Select({ className, children, ...rest }) {
  return (
    <select className={cx(styles.control, className)} {...rest}>
      {children}
    </select>
  )
}

const iconTones = {
  red: styles.iconToneRed,
  gold: styles.iconToneGold,
  brand: styles.iconToneBrand,
}

const sizes = { md: styles.sizeMd, lg: styles.sizeLg }

function Backdrop({ onClose }) {
  return <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
}

function CloseButton({ onClose, className }) {
  return (
    <button onClick={onClose} aria-label="Tutup" className={cx(styles.closeButton, className)}>
      <IconX size={18} />
    </button>
  )
}

/* Figma memakai dua gaya modal yang berbeda, keduanya dipertahankan apa adanya:
   - "icon" → Batalkan Reservasi: ikon bulat, judul serif, footer tanpa garis.
   - "bar"  → Selesaikan Reservasi: header bergaris, judul sans bold, footer abu. */
export function Modal({
  variant = 'icon',
  icon,
  iconTone = 'red',
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'md',
}) {
  if (variant === 'bar') {
    return (
      <div className={styles.overlay}>
        <Backdrop onClose={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cx(styles.shell, sizes[size])}
        >
          <div className={styles.barHeader}>
            <div>
              <h2 className={styles.barTitle}>{title}</h2>
              {subtitle && <p className={styles.barSubtitle}>{subtitle}</p>}
            </div>
            <CloseButton onClose={onClose} />
          </div>
          <div className={styles.barBody}>{children}</div>
          {footer && <div className={styles.barFooter}>{footer}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay}>
      <Backdrop onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(styles.shell, sizes[size], styles.shellIcon)}
      >
        <CloseButton onClose={onClose} className={styles.closeFloating} />
        {icon && <div className={cx(styles.modalIcon, iconTones[iconTone])}>{icon}</div>}
        <h2 className={styles.modalTitleSerif}>{title}</h2>
        {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}

export function PageHeader({ eyebrow, title, action }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      {action}
    </div>
  )
}

export function StatCard({ icon, label, value, badge, badgeTone = 'blue' }) {
  return (
    <Card pad="md">
      <div className={styles.statTop}>
        <div className={styles.statIcon}>{icon}</div>
        {badge && <Chip tone={badgeTone}>{badge}</Chip>}
      </div>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
    </Card>
  )
}

export function Avatar({ name, className }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return <div className={cx(styles.avatar, className)}>{initials}</div>
}

/* Keadaan kosong untuk halaman detail yang datanya tidak ada (dipakai 4 halaman). */
export function NotFound({ children }) {
  return (
    <Card pad="xl" className={styles.notFound}>
      {children}
    </Card>
  )
}

export function EmptyRow({ colSpan, children = 'Tidak ada data yang cocok.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.emptyCell}>
        {children}
      </td>
    </tr>
  )
}
