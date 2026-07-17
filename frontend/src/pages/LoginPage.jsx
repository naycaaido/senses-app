import styles from "../styles/login.module.css";
import cx from "../utils/classNames.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/pasien/beranda");
  }

  return (
    <div className={cx(styles, "login-page")}>
      <div className={cx(styles, "login-brand")}>
        <div className={cx(styles, "login-brand__logo")}>
          <span className={cx(styles, "login-brand__logo-name")}>SENSE&rsquo;S</span>
          <span className={cx(styles, "login-brand__logo-sub")}>clinic</span>
        </div>

        <div className={cx(styles, "login-brand__body")}>
          <h1 className={cx(styles, "login-brand__title")}>
            Memahami dulu,
            <br />
            baru merawat.
          </h1>
          <p className={cx(styles, "login-brand__desc")}>
            Klinik kesehatan kulit &amp; kesejahteraan perempuan. Perawatan
            tenang berbasis bukti, bukan janji instan.
          </p>
          <p className={cx(styles, "login-brand__tagline")}>Healthy Skin. Live Well.</p>
        </div>

        <p className={cx(styles, "login-brand__footer")}>
          Dermatology &middot; Lifestyle Medicine &middot; Women&rsquo;s
          Wellbeing
        </p>
      </div>

      <div className={cx(styles, "login-form")}>
        <div className={cx(styles, "login-form__inner")}>
          <h2 className={cx(styles, "login-form__heading")}>Masuk ke akun Anda</h2>
          <p className={cx(styles, "login-form__subtitle")}>
            Selamat datang kembali di Sense&rsquo;s clinic.
          </p>

          <form
            className={cx(styles, "login-form__body")}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={cx(styles, "login-field")}>
              <label className={cx(styles, "login-field__label")} htmlFor="identifierLogin">
                Email atau ID Resepsionis
              </label>
              <div className={cx(styles, "login-input login-input--email")}>
                <img
                  className={cx(styles, "login-input__icon")}
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

            <div className={cx(styles, "login-field")}>
              <label className={cx(styles, "login-field__label")} htmlFor="password">
                Kata Sandi
              </label>
              <div className={cx(styles, "login-input")}>
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
                  className={cx(styles, "login-input__toggle")}
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
              <p className={cx(styles, "login-field__hint")}>
                Coba kata sandi &quot;salah&quot; untuk melihat state error.
              </p>
            </div>

            <button type="submit" className={cx(styles, "login-form__btn")}>
              Masuk
            </button>
          </form>

          <p className={cx(styles, "login-form__redirect")}>
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>

          <Link to="/" className={cx(styles, "login-form__back")}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
