import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginPatient } from "../../../shared/services/authApi.js";
import {
  setAuthSession,
  getAuthUser,
  getToken,
  clearAuthSession,
} from "../../../shared/utils/authStorage.js";
import { ApiError } from "../../../shared/utils/api.js";

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8a3 3 0 110-6 3 3 0 010 6z"
          fill="currentColor"
        />
        <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8a3 3 0 110-6 3 3 0 010 6z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M3 3l10 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifierLogin, setIdentifierLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    const user = getAuthUser();
    if (token && user && user.role === "pasien") {
      if (user.profil_lengkap) {
        navigate("/pasien/beranda", { replace: true });
      } else {
        navigate("/lengkapi-biodata", { replace: true });
      }
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifierLogin || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginPatient({
        email: identifierLogin,
        password,
      });

      if (data.user.role !== "pasien") {
        clearAuthSession();
        setError("Akun ini bukan akun pasien.");
        return;
      }

      setAuthSession(data.token, data.user);

      if (data.user.profil_lengkap) {
        navigate("/pasien/beranda", { replace: true });
      } else {
        navigate("/lengkapi-biodata", { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8f3] md:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-6 bg-[#3d4940] p-6 md:p-12">
        <div className="flex items-baseline whitespace-nowrap font-serif leading-none">
          <span className="text-2xl font-bold tracking-[0.18em] text-[#fbf8f3]">SENSE&rsquo;S</span>
          <span className="ml-1.5 text-[18.72px] italic text-[#a8945e]">clinic</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="m-0 font-serif text-[28px] font-bold leading-9 text-[#fbf8f3] md:text-[32px] md:leading-10 lg:text-[40px] lg:leading-[50px]">
            Memahami dulu,
            <br />
            baru merawat.
          </h1>
          <p className="mt-4 max-w-96 text-base leading-[26.4px] text-[#fbf8f3]/80">
            Klinik kesehatan kulit &amp; kesejahteraan perempuan. Perawatan
            tenang berbasis bukti, bukan janji instan.
          </p>
          <p className="mt-8 font-serif text-[22px] italic leading-[28.6px] text-[#a8945e]">Healthy Skin. Live Well.</p>
        </div>

        <p className="text-xs leading-4 tracking-[0.06em] text-[#fbf8f3]/50">
          Dermatology &middot; Lifestyle Medicine &middot; Women&rsquo;s
          Wellbeing
        </p>
      </div>

      <div className="flex flex-1 items-start justify-center px-6 py-8 md:items-center md:px-12 md:py-10">
        <div className="w-full max-w-md">
          <h2 className="m-0 font-serif text-[28px] font-bold leading-[35px] text-[#2c2c2c]">Masuk ke akun Anda</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#6b6b6b]">
            Selamat datang kembali di Sense&rsquo;s clinic.
          </p>

          <form
            className="mt-7 flex flex-col"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]" htmlFor="identifierLogin">
                Email atau ID Resepsionis
              </label>
              <div className="relative">
                <img
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                  src="/assets/icon-mail.svg"
                  alt=""
                />
                <input className="h-[46px] w-full rounded-xl border border-[#f0ede7] bg-white py-[11px] pl-[37px] pr-[15px] text-[15px] leading-6 text-[#2c2c2c] outline-none placeholder:text-[#6b6b6b] focus:border-[#3d4940]"
                  id="identifierLogin"
                  type="text"
                  placeholder="Masukkan email atau ID resepsionis"
                  value={identifierLogin}
                  onChange={(e) => setIdentifierLogin(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <input className="h-[46px] w-full rounded-xl border border-[#f0ede7] bg-white px-[15px] py-[11px] text-[15px] leading-6 text-[#2c2c2c] outline-none placeholder:text-[#6b6b6b] focus:border-[#3d4940]"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#6b6b6b]"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              <p className="mt-1.5 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]">
                Coba kata sandi &quot;salah&quot; untuk melihat state error.
              </p>
            </div>

            {error && (
              <p className="mb-3 text-center text-sm leading-5 text-[#9e5860]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-[54px] w-full rounded-full bg-[#3d4940] px-7 py-3.5 text-base font-medium leading-[26.4px] text-[#fbf8f3] shadow-[0_1px_2px_0_rgba(44,44,44,0.04),0_8px_24px_0_rgba(61,73,64,0.18)] hover:bg-[#0c3320] disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-6 text-center text-[15px] leading-6 text-[#6b6b6b]">
            Belum punya akun? <Link className="font-semibold text-[#3d4940] underline" to="/register">Daftar sekarang</Link>
          </p>

          <Link to="/" className="mt-10 block text-center text-xs leading-4 tracking-[0.06em] text-[#6b6b6b] underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
