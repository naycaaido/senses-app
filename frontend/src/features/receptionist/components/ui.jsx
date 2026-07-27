import { IconX } from "./Icons.jsx";

const join = (...classes) => classes.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  fullWidth,
  className,
  children,
  ...rest
}) {
  const variantClass =
    variant === "outline"
      ? "border border-[#e6e6e2] bg-white text-[#191c1e] hover:not-disabled:bg-[#f5f5f3]"
      : variant === "soft"
        ? "border border-[#e6e6e2] bg-[#f5f5f3] text-[#191c1e] hover:not-disabled:bg-[#ececea]"
        : variant === "ghost"
          ? "text-[#434655] hover:not-disabled:bg-[#f5f5f3]"
          : variant === "danger"
            ? "bg-[#a03d4a] text-white hover:not-disabled:bg-[#8a3340]"
            : variant === "dangerSoft"
              ? "bg-[#c4726f] text-white hover:not-disabled:brightness-95"
              : variant === "gold"
                ? "bg-[#a8945e] text-white hover:not-disabled:brightness-95"
                : "bg-[#3d4940] text-white shadow-sm hover:not-disabled:bg-[#333d35]";
  return (
    <button
      className={join(
        "inline-flex items-center justify-center gap-2 rounded-[20px] px-5 py-2.5 text-[13px] font-semibold transition-[color,background-color,border-color,opacity,filter] disabled:cursor-not-allowed disabled:opacity-45",
        variantClass,
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ pad, className, children }) {
  const padding =
    pad === "sm"
      ? "p-4"
      : pad === "md"
        ? "p-5"
        : pad === "lg"
          ? "p-6"
          : pad === "xl"
            ? "p-10"
            : "";
  return (
    <div
      className={join(
        "rounded-2xl border border-[#e6e6e2] bg-white",
        padding,
        className,
      )}
    >
      {children}
    </div>
  );
}

export const statusTone = {
  Terkonfirmasi: "green",
  Selesai: "green",
  Aktif: "green",
  ACTIVE: "green",
  COMPLETED: "green",
  Lunas: "green",
  Menunggu: "yellow",
  WAITING: "yellow",
  Baru: "blue",
  NEW: "blue",
  Hadir: "blue",
  UPCOMING: "blue",
  Draft: "gray",
  Nonaktif: "gray",
  Dibatalkan: "red",
  Dipesan: "gold",
};

export function Chip({ tone, children, className }) {
  const resolved = tone ?? statusTone[children] ?? "gray";
  const toneClass =
    resolved === "green"
      ? "bg-[#ecfdf5] text-[#047857]"
      : resolved === "yellow"
        ? "bg-[#fffbeb] text-[#b45309]"
        : resolved === "blue"
          ? "bg-[#eff6ff] text-[#1d4ed8]"
          : resolved === "red"
            ? "bg-[#fef2f2] text-[#b91c1c]"
            : resolved === "gold"
              ? "bg-[#f6f0e2] text-[#8a7745]"
              : "bg-[#f5f5f5] text-[#525252]";
  return (
    <span
      className={join(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.025em]",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({ label, required, children, className }) {
  return (
    <label className={join("flex flex-col gap-1.5", className)}>
      <span className='text-xs font-medium text-[#434655]'>
        {label}
        {required && <span className='text-[#a03d4a]'> *</span>}
      </span>
      {children}
    </label>
  );
}

/* Kontrol form selalu selebar induknya. Untuk melebar-sempitkan, bungkus dengan
   wrapper ber-lebar di halaman pemanggil — jangan oper lebar lewat className. */
export function Input({ hasIcon, className, ...rest }) {
  return (
    <input
      className={join(
        "min-h-[38px] w-full rounded-lg border border-[#e6e6e2] bg-white px-3 py-2 text-[13px] leading-6 text-[#191c1e] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3a3a3] focus:border-[#3d4940] focus:shadow-[0_0_0_2px_rgb(61_73_64_/_0.15)]",
        hasIcon && "pl-9",
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({ className, ...rest }) {
  return (
    <textarea
      className={join(
        "min-h-[38px] w-full resize-y rounded-lg border border-[#e6e6e2] bg-white px-3 py-2 text-[13px] leading-6 text-[#191c1e] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3a3a3] focus:border-[#3d4940] focus:shadow-[0_0_0_2px_rgb(61_73_64_/_0.15)]",
        className,
      )}
      {...rest}
    />
  );
}

export function Select({ className, children, ...rest }) {
  return (
    <select
      className={join(
        "min-h-[38px] w-full appearance-none rounded-lg border border-[#e6e6e2] bg-white bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23434655' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat px-3 py-2 pr-[34px] text-[13px] leading-6 text-[#191c1e] outline-none transition-[border-color,box-shadow] focus:border-[#3d4940] focus:shadow-[0_0_0_2px_rgb(61_73_64_/_0.15)]",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

function Backdrop({ onClose }) {
  return (
    <div
      className='absolute inset-0 bg-black/45'
      onClick={onClose}
      aria-hidden='true'
    />
  );
}

function CloseButton({ onClose, className }) {
  return (
    <button
      onClick={onClose}
      aria-label='Tutup'
      className={join(
        "rounded-full p-1.5 text-[#434655] transition-colors hover:bg-[#f5f5f3]",
        className,
      )}
    >
      <IconX size={18} />
    </button>
  );
}

/* Figma memakai dua gaya modal yang berbeda, keduanya dipertahankan apa adanya:
   - "icon" → Batalkan Reservasi: ikon bulat, judul serif, footer tanpa garis.
   - "bar"  → Selesaikan Reservasi: header bergaris, judul sans bold, footer abu. */
export function Modal({
  variant = "icon",
  icon,
  iconTone = "red",
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "md",
}) {
  const maxWidth = size === "lg" ? "max-w-2xl" : "max-w-lg";
  if (variant === "bar") {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <Backdrop onClose={onClose} />
        <div
          role='dialog'
          aria-modal='true'
          aria-label={title}
          className={join(
            "relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)]",
            maxWidth,
          )}
        >
          <div className='flex items-start justify-between gap-4 border-b border-[#e6e6e2] px-6 py-5'>
            <div>
              <h2 className='text-lg font-bold text-[#191c1e]'>{title}</h2>
              {subtitle && (
                <p className='mt-0.5 text-[13px] text-[#434655]'>{subtitle}</p>
              )}
            </div>
            <CloseButton onClose={onClose} />
          </div>
          <div className='px-6 py-5'>{children}</div>
          {footer && (
            <div className='flex items-center justify-end gap-3 border-t border-[#e6e6e2] bg-[#f5f5f3]/50 px-6 py-4'>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <Backdrop onClose={onClose} />
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className={join(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)]",
          maxWidth,
        )}
      >
        <CloseButton onClose={onClose} className='absolute top-4 right-4' />
        {icon && (
          <div
            className={join(
              "mb-4 flex size-11 items-center justify-center rounded-full",
              iconTone === "gold"
                ? "bg-[#f6f0e2] text-[#a8945e]"
                : iconTone === "brand"
                  ? "bg-[#f5f5f3] text-[#3d4940]"
                  : "bg-[#fbe9ea] text-[#a03d4a]",
            )}
          >
            {icon}
          </div>
        )}
        <h2 className='font-serif text-[22px] text-[#191c1e]'>{title}</h2>
        {subtitle && (
          <p className='mt-1 text-[13px] text-[#434655]'>{subtitle}</p>
        )}
        <div className='mt-4'>{children}</div>
        {footer && <div className='mt-6 flex justify-end gap-3'>{footer}</div>}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }) {
  return (
    <div className='flex items-end justify-between gap-4'>
      <div>
        {eyebrow && (
          <p className='text-[11px] font-bold uppercase tracking-[2px] text-[#b99b57]'>
            {eyebrow}
          </p>
        )}
        <h1 className='mt-2 font-serif text-[44px] font-medium leading-tight text-[#3d4940]'>
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon, label, value, badge, badgeTone = "blue" }) {
  return (
    <Card pad='md'>
      <div className='flex items-start justify-between'>
        <div className='rounded-xl bg-[#f5f5f3] p-2.5 text-[#3d4940]'>
          {icon}
        </div>
        {badge && <Chip tone={badgeTone}>{badge}</Chip>}
      </div>
      <p className='mt-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]'>
        {label}
      </p>
      <p className='mt-1 text-[26px] font-bold text-[#191c1e]'>{value}</p>
    </Card>
  );
}

export function Avatar({ name, className }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={join(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f3] text-[11px] font-semibold text-[#3d4940]",
        className,
      )}
    >
      {initials}
    </div>
  );
}

/* Keadaan kosong untuk halaman detail yang datanya tidak ada (dipakai 4 halaman). */
export function NotFound({ children }) {
  return (
    <Card pad='xl' className='text-center text-[13px] text-[#434655]'>
      {children}
    </Card>
  );
}

export function EmptyRow({ colSpan, children = "Tidak ada data yang cocok." }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className='px-5 py-10 text-center text-[13px] text-[#434655]'
      >
        {children}
      </td>
    </tr>
  );
}
