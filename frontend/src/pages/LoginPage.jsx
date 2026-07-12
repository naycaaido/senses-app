import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

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
  const [identifierLogin, setIdentifierLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand__logo">
          <span className="login-brand__logo-name">SENSE&rsquo;S</span>
          <span className="login-brand__logo-sub">clinic</span>
        </div>

        <div className="login-brand__body">
          <h1 className="login-brand__title">
            Memahami dulu,
            <br />
            baru merawat.
          </h1>
          <p className="login-brand__desc">
            Klinik kesehatan kulit &amp; kesejahteraan perempuan. Perawatan
            tenang berbasis bukti, bukan janji instan.
          </p>
          <p className="login-brand__tagline">Healthy Skin. Live Well.</p>
        </div>

        <p className="login-brand__footer">
          Dermatology &middot; Lifestyle Medicine &middot; Women&rsquo;s
          Wellbeing
        </p>
      </div>

      <div className="login-form">
        <div className="login-form__inner">
          <h2 className="login-form__heading">Masuk ke akun Anda</h2>
          <p className="login-form__subtitle">
            Selamat datang kembali di Sense&rsquo;s clinic.
          </p>

          <form
            className="login-form__body"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="login-field">
              <label className="login-field__label" htmlFor="identifierLogin">
                Email atau ID Resepsionis
              </label>
              <div className="login-input login-input--email">
                <img
                  className="login-input__icon"
                  src="/assets/icon-mail.svg"
                  alt=""
                />
                <input
                  id="identifierLogin"
                  type="text"
                  placeholder="Masukkan email atau ID resepsionis"
                  value={identifierLogin}
                  onChange={(e) => setIdentifierLogin(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-field__label" htmlFor="password">
                Kata Sandi
              </label>
              <div className="login-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-input__toggle"
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
              <p className="login-field__hint">
                Coba kata sandi &quot;salah&quot; untuk melihat state error.
              </p>
            </div>

            <button type="submit" className="login-form__btn">
              Masuk
            </button>
          </form>

          <p className="login-form__redirect">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>

          <Link to="/" className="login-form__back">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
