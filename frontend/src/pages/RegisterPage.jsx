import styles from "../styles/register.module.css";
import cx from "../utils/classNames.js";
import { useState } from "react";
import { Link } from "react-router-dom";

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

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className={cx(styles, "register-page")}>
      <div className={cx(styles, "register-header")}>
        <div className={cx(styles, "register-header__logo")}>
          <span className={cx(styles, "register-header__logo-name")}>SENSE&rsquo;S</span>
          <span className={cx(styles, "register-header__logo-sub")}>clinic</span>
        </div>

        <div className={cx(styles, "register-stepper")}>
          <div className={cx(styles, "register-stepper__step")}>
            <div className={cx(styles, "register-stepper__circle register-stepper__circle--active")}>
              1
            </div>
            <span className={cx(styles, "register-stepper__label register-stepper__label--active")}>
              Buat Akun
            </span>
            <div className={cx(styles, "register-stepper__connector")} />
          </div>
          <div className={cx(styles, "register-stepper__step")}>
            <div className={cx(styles, "register-stepper__circle register-stepper__circle--inactive")}>
              2
            </div>
            <span className={cx(styles, "register-stepper__label register-stepper__label--inactive")}>
              Lengkapi Biodata
            </span>
          </div>
        </div>
      </div>

      <div className={cx(styles, "register-card")}>
        <div className={cx(styles, "register-card__inner")}>
          <h1 className={cx(styles, "register-card__heading")}>Buat akun Sense&rsquo;s</h1>
          <p className={cx(styles, "register-card__subtitle")}>
            Satu akun untuk reservasi, antrean, dan riwayat perawatan Anda.
          </p>

          <form className={cx(styles, "register-form")} onSubmit={handleSubmit} noValidate>
            <div className={cx(styles, "register-field")}>
              <label className={cx(styles, "register-field__label")} htmlFor="name">
                Nama Lengkap<span className={cx(styles, "register-field__label-star")}>*</span>
              </label>
              <div className={cx(styles, "register-input register-input--icon")}>
                <img
                  className={cx(styles, "register-input__icon")}
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

            <div className={cx(styles, "register-field")}>
              <label className={cx(styles, "register-field__label")} htmlFor="email">
                Email<span className={cx(styles, "register-field__label-star")}>*</span>
              </label>
              <div className={cx(styles, "register-input register-input--icon")}>
                <img
                  className={cx(styles, "register-input__icon")}
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
              <p className={cx(styles, "register-field__hint")}>
                Gunakan email aktif untuk menerima pengingat jadwal.
              </p>
            </div>

            <div className={cx(styles, "register-field")}>
              <label className={cx(styles, "register-field__label")} htmlFor="password">
                Kata Sandi<span className={cx(styles, "register-field__label-star")}>*</span>
              </label>
              <div className={cx(styles, "register-input")}>
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
                  className={cx(styles, "register-input__toggle")}
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

            <div className={cx(styles, "register-field")}>
              <label className={cx(styles, "register-field__label")} htmlFor="confirmPassword">
                Konfirmasi Kata Sandi<span className={cx(styles, "register-field__label-star")}>*</span>
              </label>
              <div className={cx(styles, "register-input")}>
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
                  className={cx(styles, "register-input__toggle")}
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

            <button type="submit" className={cx(styles, "register-form__btn")}>
              Daftar
            </button>

            <p className={cx(styles, "register-form__disclaimer")}>
              Dengan mendaftar, Anda menyetujui ketentuan layanan Sense&rsquo;s
              clinic.
            </p>
          </form>

          <p className={cx(styles, "register-card__redirect")}>
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </p>

          <Link to="/" className={cx(styles, "register-card__back")}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
