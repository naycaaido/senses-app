import { Link } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar.jsx";
import ProfileInfoRow from "../components/ProfileInfoRow.jsx";
import ProfileSectionCard from "../components/ProfileSectionCard.jsx";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatBirthDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

const patientProfile = {
  registrationNumber: "REG-2406-001",
  name: "Annisa Rahmawati",
  initials: "AR",
  email: "annisa.rahma@gmail.com",
  phone: "0812-3344-5566",
  gender: "Perempuan",
  birthPlace: "Bandung",
  birthDate: "1995-03-14",
  lastEducation: "S1",
  occupation: "Guru",
  maritalStatus: "Menikah",
  religion: "Islam",
  address: "Jl. Cihampelas No. 121, Coblong",
  city: "Bandung",
};

export default function PatientProfilePage() {
  const profile = patientProfile;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <ProfileAvatar initials={profile.initials} size={56} />
          <div className="min-w-0">
            <h1 className="m-0 font-serif text-2xl font-bold leading-[30px] text-[#3d4940] md:text-[28px] md:leading-[35px]">{profile.name}</h1>
            <p className="mt-1 text-[13px] leading-4 tracking-[0.06em] text-[#6b6b6b]">
              No. Registrasi: {profile.registrationNumber}
            </p>
          </div>
        </div>
        <Link to="/pasien/profil/ubah" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#d8c7b5] bg-white px-5 py-[11px] text-sm font-semibold leading-6 tracking-[0.02em] text-[#3d4940] hover:bg-[#faf7f2]">
          <span className="flex size-4 items-center justify-center [&_img]:size-4">
            <img src="/assets/icon-edit.svg" alt="" aria-hidden="true" />
          </span>
          Ubah Biodata
        </Link>
      </header>

      <ProfileSectionCard title="Kontak">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <ProfileInfoRow label="Nomor Telepon" value={profile.phone} />
          <ProfileInfoRow label="Email" value={profile.email} />
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard title="Biodata Pasien">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <ProfileInfoRow label="Jenis Kelamin" value={profile.gender} />
          <ProfileInfoRow label="Tempat Lahir" value={profile.birthPlace} />
          <ProfileInfoRow
            label="Tanggal Lahir"
            value={formatBirthDate(profile.birthDate)}
          />
          <ProfileInfoRow
            label="Pendidikan Terakhir"
            value={profile.lastEducation}
          />
          <ProfileInfoRow label="Pekerjaan" value={profile.occupation} />
          <ProfileInfoRow
            label="Status Perkawinan"
            value={profile.maritalStatus}
          />
          <ProfileInfoRow label="Agama" value={profile.religion} />
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard title="Alamat" iconSrc="/assets/icon-location.svg">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <ProfileInfoRow
            label="Alamat Domisili"
            value={profile.address}
          />
          <ProfileInfoRow label="Kota" value={profile.city} />
        </div>
      </ProfileSectionCard>
    </div>
  );
}
