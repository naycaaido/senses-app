import ProfileAvatar from "../../components/patient/ProfileAvatar.jsx";
import ProfileInfoRow from "../../components/patient/ProfileInfoRow.jsx";
import ProfileSectionCard from "../../components/patient/ProfileSectionCard.jsx";
import "../../styles/patient-profile.css";

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
    <div className="patient-profile">
      <header className="patient-profile__header">
        <div className="patient-profile__identity">
          <ProfileAvatar initials={profile.initials} size={56} />
          <div className="patient-profile__heading">
            <h1 className="patient-profile__name">{profile.name}</h1>
            <p className="patient-profile__reg">
              No. Registrasi: {profile.registrationNumber}
            </p>
          </div>
        </div>
        <button type="button" className="patient-profile__edit">
          <span className="patient-profile__edit-icon">
            <img src="/assets/icon-edit.svg" alt="" aria-hidden="true" />
          </span>
          Ubah Biodata
        </button>
      </header>

      <ProfileSectionCard title="Kontak">
        <div className="profile-card__grid">
          <ProfileInfoRow label="Nomor Telepon" value={profile.phone} />
          <ProfileInfoRow label="Email" value={profile.email} />
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard title="Biodata Pasien">
        <div className="profile-card__grid">
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
        <div className="profile-card__grid">
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
