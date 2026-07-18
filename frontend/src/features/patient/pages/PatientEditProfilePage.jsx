import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar.jsx";

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
    <div className={"mx-auto max-w-3xl px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6"}>
      <Link to='/pasien/profil' className={"-ml-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium leading-6 text-[#6b6b6b] hover:bg-black/5"}>
        <img
          src='/assets/icon-arrow-left.svg'
          alt=''
          aria-hidden='true'
          className={"size-[16.5px] shrink-0"}
        />
        Kembali ke Profil
      </Link>

      <header className={"mb-6 mt-2"}>
        <h1 className={"m-0 font-serif text-2xl font-bold leading-[30px] text-[#3d4940] md:text-[28px] md:leading-[35px]"}>Ubah Biodata</h1>
        <p className={"mt-1 text-[15px] leading-6 text-[#6b6b6b]"}>
          Perbarui informasi pribadi dan kontak Anda.
        </p>
      </header>

      <div className={"mb-4 flex items-center gap-4 rounded-2xl border border-[#f0ede7] bg-white px-5 py-5 md:px-[25px]"}>
        <ProfileAvatar initials={getInitials(form.name)} size={56} />
        <div className={"min-w-0"}>
          <p className={"m-0 font-serif text-lg font-bold leading-6 text-[#3d4940]"}>{form.name}</p>
          <p className={"mt-1 text-[13px] leading-4 tracking-[0.06em] text-[#6b6b6b]"}>
            No. Registrasi: {form.registrationNumber}
          </p>
        </div>
      </div>

      <form className={"flex flex-col"} onSubmit={handleSubmit} noValidate>
        <section className={"mb-4 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
          <h2 className={"mb-5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>Kontak</h2>
          <div className={"grid grid-cols-1 items-start gap-5 md:grid-cols-2"}>
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='email'>
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='phone'>
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

        <section className={"mb-4 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
          <h2 className={"mb-5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>Biodata Pasien</h2>
          <div className={"grid grid-cols-1 items-start gap-5 md:grid-cols-2"}>
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='gender'>
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='birthPlace'>
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='birthDate'>
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label
                className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"}
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='occupation'>
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label
                className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"}
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
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='religion'>
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

        <section className={"mb-4 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
          <h2 className={"mb-5 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>Alamat</h2>
          <div className={"grid grid-cols-1 items-start gap-5 md:grid-cols-2"}>
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940] md:col-span-2"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='address'>
                Alamat Domisili
              </label>
              <textarea
                id='address'
                required
                value={form.address}
                onChange={update("address")}
              />
            </div>
            <div className={"flex min-w-0 flex-col [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#f0ede7] [&_textarea]:bg-white [&_textarea]:px-[15px] [&_textarea]:py-[11px] [&_textarea]:text-[15px] [&_textarea]:leading-6 [&_textarea]:text-[#2c2c2c] [&_textarea]:outline-none [&_textarea:focus]:border-[#3d4940]"}>
              <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.06em] text-[#6b6b6b]"} htmlFor='city'>
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

        <div className={"mt-2 flex flex-col items-stretch gap-3 md:flex-row md:justify-end"}>
          <Link to='/pasien/profil' className={"inline-flex w-full items-center justify-center rounded-full border border-[#3d4940] px-7 py-3 text-[15px] font-semibold leading-6 text-[#3d4940] hover:bg-[#3d4940]/5 md:w-auto"}>
            Batal
          </Link>
          <button type='submit' className={"inline-flex w-full items-center justify-center rounded-full border border-[#3d4940] bg-[#3d4940] px-7 py-3 text-[15px] font-semibold leading-6 text-[#fbf8f3] shadow-[0_1px_2px_rgba(44,44,44,0.04),0_8px_24px_rgba(61,73,64,0.18)] hover:bg-[#0c3320] md:w-auto"}>
            Simpan Perubahan
          </button>
        </div>
      </form>

      {showNote && (
        <p className={"mt-4 rounded-2xl border border-[#f5edd6] bg-[#f5edd6] p-4 text-sm leading-[22px] text-[#2c2c2c]"} role='status'>
          Ini adalah halaman demo. Perubahan tidak disimpan ke server (mock
          data).
        </p>
      )}
    </div>
  );
}
