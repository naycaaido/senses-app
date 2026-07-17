import styles from "../styles/biodata.module.css";
import cx from "../utils/classNames.js";
import { useState } from "react";

export default function BiodataPage() {
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [lastEducation, setLastEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [religion, setReligion] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className={cx(styles, "biodata-page")}>
      <div className={cx(styles, "biodata-header")}>
        <div className={cx(styles, "biodata-header__logo")}>
          <span className={cx(styles, "biodata-header__logo-name")}>SENSE&rsquo;S</span>
          <span className={cx(styles, "biodata-header__logo-sub")}>clinic</span>
        </div>

        <div className={cx(styles, "biodata-stepper")}>
          <div className={cx(styles, "biodata-stepper__step")}>
            <div className={cx(styles, "biodata-stepper__circle biodata-stepper__circle--completed")}>
              1
            </div>
            <span className={cx(styles, "biodata-stepper__label biodata-stepper__label--completed")}>
              Buat Akun
            </span>
            <div className={cx(styles, "biodata-stepper__connector")} />
          </div>
          <div className={cx(styles, "biodata-stepper__step")}>
            <div className={cx(styles, "biodata-stepper__circle biodata-stepper__circle--active")}>
              2
            </div>
            <span className={cx(styles, "biodata-stepper__label biodata-stepper__label--active")}>
              Lengkapi Biodata
            </span>
          </div>
        </div>
      </div>

      <div className={cx(styles, "biodata-content")}>
        <h1 className={cx(styles, "biodata-heading")}>Lengkapi Biodata</h1>
        <p className={cx(styles, "biodata-subtitle")}>
          Satu langkah lagi sebelum masuk. Data ini membantu kami memahami
          kondisi Anda sebelum merawat.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={cx(styles, "biodata-card")}>
            <h2 className={cx(styles, "biodata-card__title")}>Kontak</h2>
            <div className={cx(styles, "biodata-card__body")}>
              <div className={cx(styles, "biodata-grid")}>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='phone'>
                    Nomor Telepon
                  </label>
                  <div className={cx(styles, "biodata-input biodata-input--icon")}>
                    <img
                      className={cx(styles, "biodata-input__icon")}
                      src='/assets/icon-phone.svg'
                      alt=''
                    />
                    <input
                      id='phone'
                      type='tel'
                      placeholder='08xx-xxxx-xxxx'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete='tel'
                    />
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='email'>
                    Email
                  </label>
                  <div className={cx(styles, "biodata-input biodata-input--icon biodata-input--email")}>
                    <img
                      className={cx(styles, "biodata-input__icon")}
                      src='/assets/icon-mail.svg'
                      alt=''
                    />
                    <input
                      id='email'
                      type='email'
                      value='nama@email.com'
                      readOnly
                      tabIndex={-1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles, "biodata-card")}>
            <h2 className={cx(styles, "biodata-card__title")}>Biodata Pasien</h2>
            <div className={cx(styles, "biodata-card__body")}>
              <div className={cx(styles, "biodata-grid")}>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='gender'>
                    Jenis Kelamin
                  </label>
                  <div className={cx(styles, "biodata-input biodata-input--icon biodata-input--icon--right")}>
                    <img
                      className={cx(styles, "biodata-input__icon biodata-input__icon--right")}
                      src='/assets/icon-chevron-down.svg'
                      alt=''
                    />
                    <select
                      id='gender'
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value='' disabled>
                        Pilih jenis kelamin
                      </option>
                      <option value='laki-laki'>Laki-laki</option>
                      <option value='perempuan'>Perempuan</option>
                    </select>
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='birthPlace'>
                    Tempat Lahir
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='birthPlace'
                      type='text'
                      placeholder='mis. Bandung'
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      autoComplete='off'
                    />
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='birthDate'>
                    Tanggal Lahir
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='birthDate'
                      type='date'
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      autoComplete='bday'
                    />
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label
                    className={cx(styles, "biodata-field__label")}
                    htmlFor='lastEducation'
                  >
                    Pendidikan Terakhir
                  </label>
                  <div className={cx(styles, "biodata-input biodata-input--icon biodata-input--icon--right")}>
                    <img
                      className={cx(styles, "biodata-input__icon biodata-input__icon--right")}
                      src='/assets/icon-chevron-down.svg'
                      alt=''
                    />
                    <select
                      id='lastEducation'
                      value={lastEducation}
                      onChange={(e) => setLastEducation(e.target.value)}
                    >
                      <option value='' disabled>
                        Pilih pendidikan
                      </option>
                      <option value='sd'>SD</option>
                      <option value='smp'>SMP</option>
                      <option value='sma-smk'>SMA/SMK</option>
                      <option value='d1-d3'>D1/D2/D3</option>
                      <option value='d4-s1'>D4/S1</option>
                      <option value='s2'>S2</option>
                      <option value='s3'>S3</option>
                    </select>
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='occupation'>
                    Pekerjaan
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='occupation'
                      type='text'
                      placeholder='mis. Guru'
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      autoComplete='organization'
                    />
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label
                    className={cx(styles, "biodata-field__label")}
                    htmlFor='maritalStatus'
                  >
                    Status Perkawinan
                  </label>
                  <div className={cx(styles, "biodata-input biodata-input--icon biodata-input--icon--right")}>
                    <img
                      className={cx(styles, "biodata-input__icon biodata-input__icon--right")}
                      src='/assets/icon-chevron-down.svg'
                      alt=''
                    />
                    <select
                      id='maritalStatus'
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                      <option value='' disabled>
                        Pilih status
                      </option>
                      <option value='belum-kawin'>Belum Kawin</option>
                      <option value='kawin'>Kawin</option>
                    </select>
                  </div>
                </div>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='religion'>
                    Agama
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='religion'
                      type='text'
                      placeholder='Islam'
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      autoComplete='off'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles, "biodata-card")}>
            <h2 className={cx(styles, "biodata-card__title")}>
              <span className={cx(styles, "biodata-card__title-icon")}>
                <img src='/assets/icon-location.svg' alt='' />
              </span>
              Alamat
            </h2>
            <div className={cx(styles, "biodata-card__body")}>
              <div className={cx(styles, "biodata-grid biodata-grid--full")}>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='address'>
                    Alamat Domisili
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='address'
                      type='text'
                      placeholder='Jalan, nomor, kecamatan'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete='street-address'
                    />
                  </div>
                </div>
              </div>
              <div className={cx(styles, "biodata-grid")} style={{ marginTop: 16 }}>
                <div className={cx(styles, "biodata-field")}>
                  <label className={cx(styles, "biodata-field__label")} htmlFor='city'>
                    Kota
                  </label>
                  <div className={cx(styles, "biodata-input")}>
                    <input
                      id='city'
                      type='text'
                      placeholder='mis. Bandung'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete='address-level2'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles, "biodata-actions")}>
            <button type='submit' className={cx(styles, "biodata-actions__btn")}>
              <span className={cx(styles, "biodata-actions__btn-icon")}>
                <img src='/assets/icon-check.svg' alt='' />
              </span>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
