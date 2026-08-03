const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, size = 20, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
      {children}
    </svg>
  )
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </Svg>
)
export const IconCheckCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
)
export const IconUsers = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16.5 20a5.5 5.5 0 0 0-3-4.9" />
  </Svg>
)
export const IconCalendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
)
export const IconGrid = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </Svg>
)
export const IconReceipt = (p) => (
  <Svg {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </Svg>
)
export const IconLogout = (p) => (
  <Svg {...p}>
    <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
    <path d="M9 12h11M16 8.5 20 12l-4 3.5" />
  </Svg>
)
export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
)
export const IconChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m14.5 5-6 7 6 7" />
  </Svg>
)
export const IconChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9.5 5 6 7-6 7" />
  </Svg>
)
export const IconDots = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="5.5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="18.5" r="1.2" fill="currentColor" />
  </Svg>
)
export const IconPencil = (p) => (
  <Svg {...p}>
    <path d="M16.5 4.5 19.5 7.5 8 19H5v-3Z" />
  </Svg>
)
export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4.5 6.5h15M9.5 6.5V4h5v2.5" />
    <path d="M6.5 6.5 7.5 20h9l1-13.5" />
  </Svg>
)
export const IconX = (p) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
)
export const IconEye = (p) => (
  <Svg {...p}>
    <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.75" />
  </Svg>
)
export const IconSave = (p) => (
  <Svg {...p}>
    <path d="M5 4h11l3 3v13H5Z" />
    <path d="M8.5 4v5h7V4M8.5 20v-5h7v5" />
  </Svg>
)
export const IconPhone = (p) => (
  <Svg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 18h2" />
  </Svg>
)
export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
)
export const IconWallet = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
    <path d="M3.5 10h17M16.5 14.5h1.5" />
  </Svg>
)
