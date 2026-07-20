import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BiodataPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    () => localStorage.getItem("pendingProfileEmail") || "",
  );
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!email) {
    navigate("/register");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            telepon: phone,
            jenis_kelamin: gender,
            tempat_lahir: birthPlace,
            tanggal_lahir: birthDate,
            pendidikan_terakhir: lastEducation,
            pekerjaan: occupation,
            status_perkawinan: maritalStatus,
            agama: religion,
            alamat_domisili: address,
            kota: city,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal menyimpan biodata.");
        return;
      }

      setSuccess(true);
      localStorage.removeItem("pendingProfileEmail");
      navigate("/login");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={"flex min-h-screen flex-col items-center bg-[#fbf8f3]"}>
      <div className={"flex w-full max-w-3xl flex-col items-center px-5 pt-6 md:pt-10"}>
        <div className={"flex items-baseline whitespace-nowrap font-serif leading-none"}>
          <span className={"text-2xl font-bold tracking-[0.18em] text-[#3d4940]"}>SENSE&rsquo;S</span>
          <span className={"ml-1.5 text-[18.72px] italic text-[#a8945e]"}>clinic</span>
        </div>

        <div className={"mt-10 flex w-full max-w-[464px] items-center justify-center gap-2 md:mt-[50px]"}>
          <div className={"flex items-center gap-2"}>
            <div className={"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-4 tracking-[0.06em] bg-[#ebf0eb] text-[#3d4940]"}>
              1
            </div>
            <span className={"whitespace-nowrap text-xs font-semibold leading-4 tracking-[0.06em] text-[#2c2c2c]"}>
              Buat Akun
            </span>
            <div className={"mx-1 h-px min-w-0 flex-1 bg-[#f0ede7]"} />
          </div>
          <div className={"flex items-center gap-2"}>
            <div className={"flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-4 tracking-[0.06em] bg-[#3d4940] text-white"}>
              2
            </div>
            <span className={"whitespace-nowrap text-xs font-semibold leading-4 tracking-[0.06em] text-[#6b6b6b]"}>
              Lengkapi Biodata
            </span>
          </div>
        </div>
      </div>

      <div className={"w-full max-w-3xl px-5 pb-8 md:pb-10"}>
        <h1 className={"mt-6 font-serif text-[28px] font-bold leading-[35px] text-[#3d4940]"}>Lengkapi Biodata</h1>
        <p className={"mt-1 text-[15px] leading-6 text-[#6b6b6b]"}>
          Satu langkah lagi sebelum masuk. Data ini membantu kami memahami
          kondisi Anda sebelum merawat.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={"mt-6 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
            <h2 className={"m-0 flex items-center gap-2 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>Kontak</h2>
            <div className={"pt-4"}>
              <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='phone'>
                    Nomor Telepon
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_input]:pl-[37px] [&_select]:pl-[37px]"}>
                    <img
                      className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"}
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
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='email'>
                    Email
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_input]:pl-[37px] [&_select]:pl-[37px] [&_input]:cursor-default [&_input]:bg-[#f9f7f4] [&_input]:text-[#6b6b6b]"}>
                    <img
                      className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"}
                      src='/assets/icon-mail.svg'
                      alt=''
                    />
                    <input
                      id='email'
                      type='email'
                      placeholder='nama@email.com'
                      value={email}
                      readOnly
                      tabIndex={-1}
                      autoComplete='email'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={"mt-6 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
            <h2 className={"m-0 flex items-center gap-2 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>Biodata Pasien</h2>
            <div className={"pt-4"}>
              <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='gender'>
                    Jenis Kelamin
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_input]:pl-[37px] [&_select]:pl-[37px] [&_select]:pr-10"}>
                    <img
                      className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 left-auto right-3"}
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
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='birthPlace'>
                    Tempat Lahir
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
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
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='birthDate'>
                    Tanggal Lahir
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
                    <input
                      id='birthDate'
                      type='date'
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      autoComplete='bday'
                    />
                  </div>
                </div>
                <div className={"flex flex-col"}>
                  <label
                    className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"}
                    htmlFor='lastEducation'
                  >
                    Pendidikan Terakhir
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_input]:pl-[37px] [&_select]:pl-[37px] [&_select]:pr-10"}>
                    <img
                      className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 left-auto right-3"}
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
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='occupation'>
                    Pekerjaan
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
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
                <div className={"flex flex-col"}>
                  <label
                    className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"}
                    htmlFor='maritalStatus'
                  >
                    Status Perkawinan
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940] [&_input]:pl-[37px] [&_select]:pl-[37px] [&_select]:pr-10"}>
                    <img
                      className={"pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 left-auto right-3"}
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
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='religion'>
                    Agama
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
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

          <div className={"mt-6 rounded-2xl border border-[#f0ede7] bg-white p-5 md:p-[25px]"}>
            <h2 className={"m-0 flex items-center gap-2 font-serif text-[22px] font-bold leading-[28.6px] text-[#3d4940]"}>
              <span className={"size-5 shrink-0 [&_img]:size-5"}>
                <img src='/assets/icon-location.svg' alt='' />
              </span>
              Alamat
            </h2>
            <div className={"pt-4"}>
              <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 grid-cols-1"}>
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='address'>
                    Alamat Domisili
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
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
              <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"} style={{ marginTop: 16 }}>
                <div className={"flex flex-col"}>
                  <label className={"mb-1.5 block text-xs font-semibold uppercase leading-4 tracking-[0.025em] text-[#6b6b6b]"} htmlFor='city'>
                    Kota
                  </label>
                  <div className={"relative [&_input]:h-[46px] [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#f0ede7] [&_input]:bg-white [&_input]:px-[15px] [&_input]:py-[11px] [&_input]:text-[15px] [&_input]:leading-6 [&_input]:text-[#2c2c2c] [&_input]:outline-none [&_input]:placeholder:text-[#6b6b6b] [&_input:focus]:border-[#3d4940] [&_select]:h-[46px] [&_select]:w-full [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:rounded-xl [&_select]:border [&_select]:border-[#f0ede7] [&_select]:bg-white [&_select]:px-[15px] [&_select]:py-[11px] [&_select]:text-[15px] [&_select]:leading-6 [&_select]:text-[#2c2c2c] [&_select]:outline-none [&_select:focus]:border-[#3d4940]"}>
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

          {error && (
            <p className="mb-4 text-center text-sm leading-5 text-[#9e5860]">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 text-center text-sm leading-5 text-[#3d4940]">
              Biodata berhasil disimpan.
            </p>
          )}

          <div className={"mt-6 flex justify-end"}>
            <button type='submit' disabled={loading} className={"inline-flex h-[54px] items-center gap-2 rounded-full bg-[#3d4940] px-7 py-3.5 text-base font-medium leading-[26.4px] text-[#fbf8f3] shadow-[0_1px_2px_0_rgba(44,44,44,0.04),0_8px_24px_0_rgba(61,73,64,0.18)] hover:bg-[#0c3320] disabled:opacity-50"}>
              <span className={"size-[18px] shrink-0 [&_img]:size-[18px]"}>
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
