import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#f0ede7] bg-[#fbf8f3]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to='/' className="flex items-baseline whitespace-nowrap font-serif leading-none">
          <span className="text-2xl font-bold tracking-[0.18em] text-[#3d4940]">SENSE&rsquo;S</span>
          <span className="ml-1.5 text-[18.72px] italic text-[#a8945e]">clinic</span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap justify-center gap-1 md:order-none md:w-auto">
          <NavLink
            to='/'
            className={({ isActive }) => `rounded-full px-4 py-2 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? "text-[#3f7d58]" : ""}`}
          >
            Beranda
          </NavLink>
          <NavLink
            to='/layanan'
            className={({ isActive }) => `rounded-full px-4 py-2 text-[15px] font-medium text-[#2c2c2c] hover:bg-black/5 ${isActive ? "text-[#3f7d58]" : ""}`}
          >
            Layanan
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to='/login' className="rounded-full bg-[#082518] px-[22px] py-2.5 text-[13px] font-semibold tracking-[0.04em] text-white hover:bg-[#0c3320]">
            Login
          </Link>
          <Link to='/register' className="rounded-full border border-[#d8c7b5] bg-[#fff8f0] px-[22px] py-2.5 text-[13px] font-semibold tracking-[0.04em] text-[#082518] hover:bg-[#fdeee0]">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
