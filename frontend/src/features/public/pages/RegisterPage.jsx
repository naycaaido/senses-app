import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPatient, loginPatient } from "../../../shared/services/authApi.js";
import { setAuthSession, clearAuthSession } from "../../../shared/utils/authStorage.js";
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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("pendingProfileEmail")) {
      navigate("/lengkapi-biodata");
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await registerPatient({ email, password, nama_lengkap: name });

      const loginData = await loginPatient({ email, password });

      setAuthSession(loginData.token, loginData.user);

      localStorage.setItem("pendingProfileEmail", email);

      navigate("/lengkapi-biodata", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409 && err.data?.profile_incomplete) {
          setError(
            "Akun dengan email ini sudah terdaftar namun belum melengkapi profil. Silakan login.",
          );
          return;
        }
        setError(err.message);
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={"flex min-h-screen flex-col items-center bg-[#fbf8f3]"}>
      <div className={"flex w-full max-w-[720px] flex-col items-center px-5 pt-6 md:px-12 md:pt-[34px]"}>
        <div className={"flex items-baseline whitespace-nowrap font-serif leading-none"}>
          <span className={"text-2xl font-bold tracking-[0.18em] text-[#3d4940]"}>SENSE&rsquo;S</span>
          <span className={"ml-1.5 text-[18.72px] italic text-[#a8945e]"}>clinic</span>
        </div>

        <div className={"mt-10 flex w-full max-w-[464px] items-center justify-center md:mt-[50px]"}>
          <div className={"flex items-center gap-2"}>
            <div className={"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-[0.06em] bg-[#3d4940] text-[#fbf8f3]"}>
              1
            </div>
            <span className={"whitespace-nowrap text-xs font-semibold tracking-[0.06em] text-[#2c2c2c]"}>
              Buat Akun
            </span>
            <div className={"mx-1 h-px min-w-0 flex-1 bg-[#f0ede7]"} />
          </div>
          <div className={"flex items-center gap-2"}>
            <div className={"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-[0.06em] bg-[#ebf0eb] text-[#6b6b6b]"}>
              2
            </div>
            <span className={"whitespace-nowrap text-xs font-semibold tracking-[0.06em] text-[#6b6b6b]"}>
              Lengkapi Biodata
            </span>
          </div>
        </div>
      </div>

      <div className={"flex w-full max-w-[720px] justify-center px-5 py-6 md:px-12 md:py-10"}>
        <div className={"w-full max-w-md"}>
          <h1 className={"m-0 font-serif text-2xl font-bold leading-[30px] text-[#2c2c2c] md:text-[28px] md:leading-[35px]"}>Buat akun Sense&rsquo;s</h1>
          <p className={"mt-2 text-[15px] leading-6 text-[#6b6b6b]"}>
            Satu akun untuk reservasi, antrean, dan riwayat perawatan Anda.
          </p>

          <form className={"mt-7 flex flex-col"} onSubmit={handleSubmit} noValidate>
            <div className={"mb-4"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor="name">
                Nama Lengkap<span className={"text-[#9e5860]"}>*</span>
              </label>
              <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_input]:pl-[37px]"}>
                <img
                  className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"}
                  src="/assets/icon-user.svg"
                  alt=""
                />
                <input
                  id="name"
                  type="text"
                  placeholder="mis. Annisa Rahmawati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={"mb-4"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor="email">
                Email<span className={"text-[#9e5860]"}>*</span>
              </label>
              <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_input]:pl-[37px]"}>
                <img
                  className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"}
                  src="/assets/icon-mail.svg"
                  alt=""
                />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <p className={"mt-1.5 text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]"}>
                Gunakan email aktif untuk menerima pengingat jadwal.
              </p>
            </div>

            <div className={"mb-4"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor="password">
                Kata Sandi<span className={"text-[#9e5860]"}>*</span>
              </label>
              <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940]"}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  className={"absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#6b6b6b]"}
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
            </div>

            <div className={"mb-4"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor="confirmPassword">
                Konfirmasi Kata Sandi<span className={"text-[#9e5860]"}>*</span>
              </label>
              <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940]"}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan kembali kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={"absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[#6b6b6b]"}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-3 text-center text-sm leading-5 text-[#9e5860]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={"mt-4 h-[54px] w-full rounded-full bg-[#3d4940] px-7 py-3.5 text-base font-medium leading-[26.4px] text-[#fbf8f3] shadow-[0_1px_2px_0_rgba(44,44,44,0.04),0_8px_24px_0_rgba(61,73,64,0.18)] hover:bg-[#0c3320] disabled:opacity-50"}
            >
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>

            <p className={"mt-4 text-center text-xs leading-4 tracking-[0.06em] text-[#6b6b6b]"}>
              Dengan mendaftar, Anda menyetujui ketentuan layanan Sense&rsquo;s
              clinic.
            </p>
          </form>

          <p className={"mt-6 text-center text-[15px] leading-6 text-[#6b6b6b] [&_a]:font-semibold [&_a]:text-[#3d4940] [&_a]:underline"}>
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </p>

          <Link to="/" className={"mt-10 block text-center text-xs leading-4 tracking-[0.06em] text-[#6b6b6b] underline"}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
