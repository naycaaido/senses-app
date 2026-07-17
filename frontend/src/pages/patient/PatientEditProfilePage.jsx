import styles from "../../styles/patient-edit-profile.module.css";
import cx from "../../utils/classNames.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileAvatar from "../../components/patient/ProfileAvatar.jsx";

const initialPatientProfile = {
  registrationNumber: "REG-2406-001",
  name: "Annisa Rahmawati",
  email: "annisa.rahma@gmail.com",
  phone: "0812-3344-5566",
  gender: "Perempuan",
  birthPlace: "Bandung",
  birthDate: "1995-03-14",
  lastEducation: "D4/S1",
  occupation: "Guru",
  maritalStatus: "Menikah",
  religion: "Islam",
  address: "Jl. Cihampelas No. 121, Coblong",
  city: "Bandung",
};

const GENDER_OPTIONS = ["Perempuan", "Laki-laki"];

const EDUCATION_OPTIONS = [
  "SD",
  "SMP",
  "SMA/SMK",
  "D1/D2/D3",
  "D4/S1",
  "S2",
  "S3",
];

const MARITAL_OPTIONS = ["Belum Menikah", "Menikah"];

const RELIGION_OPTIONS = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
  "Lainnya",
];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PatientEditProfilePage() {
  const [form, setForm] = useState(initialPatientProfile);
  const [showNote, setShowNote] = useState(false);

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowNote(true);
  };

  return (
    <div className={cx(styles, "patient-edit-profile")}>
      <Link to='/pasien/profil' className={cx(styles, "patient-edit-profile__back")}>
        <img
          src='/assets/icon-arrow-left.svg'
          alt=''
          aria-hidden='true'
          className={cx(styles, "patient-edit-profile__back-icon")}
        />
        Kembali ke Profil
      </Link>

      <header className={cx(styles, "patient-edit-profile__header")}>
        <h1 className={cx(styles, "patient-edit-profile__title")}>Ubah Biodata</h1>
        <p className={cx(styles, "patient-edit-profile__subtitle")}>
          Perbarui informasi pribadi dan kontak Anda.
        </p>
      </header>

      <div className={cx(styles, "patient-edit-profile__identity")}>
        <ProfileAvatar initials={getInitials(form.name)} size={56} />
        <div className={cx(styles, "patient-edit-profile__identity-text")}>
          <p className={cx(styles, "patient-edit-profile__name")}>{form.name}</p>
          <p className={cx(styles, "patient-edit-profile__reg")}>
            No. Registrasi: {form.registrationNumber}
          </p>
        </div>
      </div>

      <form className={cx(styles, "profile-form")} onSubmit={handleSubmit} noValidate>
        <section className={cx(styles, "profile-form-section")}>
          <h2 className={cx(styles, "profile-form-section__title")}>Kontak</h2>
          <div className={cx(styles, "profile-form-grid")}>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='email'>
                Email
              </label>
              <input
                id='email'
                type='email'
                required
                value={form.email}
                onChange={update("email")}
              />
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='phone'>
                Nomor Telepon
              </label>
              <input
                id='phone'
                type='tel'
                required
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
          </div>
        </section>

        <section className={cx(styles, "profile-form-section")}>
          <h2 className={cx(styles, "profile-form-section__title")}>Biodata Pasien</h2>
          <div className={cx(styles, "profile-form-grid")}>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='gender'>
                Jenis Kelamin
              </label>
              <select
                id='gender'
                required
                value={form.gender}
                onChange={update("gender")}
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='birthPlace'>
                Tempat Lahir
              </label>
              <input
                id='birthPlace'
                type='text'
                required
                value={form.birthPlace}
                onChange={update("birthPlace")}
              />
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='birthDate'>
                Tanggal Lahir
              </label>
              <input
                id='birthDate'
                type='date'
                required
                value={form.birthDate}
                onChange={update("birthDate")}
              />
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label
                className={cx(styles, "profile-form-field__label")}
                htmlFor='lastEducation'
              >
                Pendidikan Terakhir
              </label>
              <select
                id='lastEducation'
                required
                value={form.lastEducation}
                onChange={update("lastEducation")}
              >
                {EDUCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='occupation'>
                Pekerjaan
              </label>
              <input
                id='occupation'
                type='text'
                required
                value={form.occupation}
                onChange={update("occupation")}
              />
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label
                className={cx(styles, "profile-form-field__label")}
                htmlFor='maritalStatus'
              >
                Status Perkawinan
              </label>
              <select
                id='maritalStatus'
                required
                value={form.maritalStatus}
                onChange={update("maritalStatus")}
              >
                {MARITAL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='religion'>
                Agama
              </label>
              <select
                id='religion'
                required
                value={form.religion}
                onChange={update("religion")}
              >
                {RELIGION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className={cx(styles, "profile-form-section")}>
          <h2 className={cx(styles, "profile-form-section__title")}>Alamat</h2>
          <div className={cx(styles, "profile-form-grid")}>
            <div className={cx(styles, "profile-form-field profile-form-field--full")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='address'>
                Alamat Domisili
              </label>
              <textarea
                id='address'
                required
                value={form.address}
                onChange={update("address")}
              />
            </div>
            <div className={cx(styles, "profile-form-field")}>
              <label className={cx(styles, "profile-form-field__label")} htmlFor='city'>
                Kota
              </label>
              <input
                id='city'
                type='text'
                required
                value={form.city}
                onChange={update("city")}
              />
            </div>
          </div>
        </section>

        <div className={cx(styles, "profile-form-actions")}>
          <Link to='/pasien/profil' className={cx(styles, "profile-form-actions__cancel")}>
            Batal
          </Link>
          <button type='submit' className={cx(styles, "profile-form-actions__save")}>
            Simpan Perubahan
          </button>
        </div>
      </form>

      {showNote && (
        <p className={cx(styles, "patient-edit-profile__note")} role='status'>
          Ini adalah halaman demo. Perubahan tidak disimpan ke server (mock
          data).
        </p>
      )}
    </div>
  );
}
