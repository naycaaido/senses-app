import api from "../utils/api.js";
import { getReceptionistReservations } from "./receptionistApi.js";

const dateInput = (value) =>
  typeof value === "string" ? value.slice(0, 10) : "";

export function mapReceptionistPatientProfile(patient) {
  return {
    email: patient.email,
    name: patient.nama_lengkap,
    phone: patient.telepon || "",
    gender: patient.jenis_kelamin || "",
    birthPlace: patient.tempat_lahir || "",
    birthDate: dateInput(patient.tanggal_lahir),
    education: patient.pendidikan_terakhir || "",
    job: patient.pekerjaan || "",
    maritalStatus: patient.status_perkawinan || "",
    religion: patient.agama || "",
    address: patient.alamat_domisili || "",
    city: patient.kota || "",
    profileComplete: patient.profil_lengkap,
  };
}

function assertData(response, message) {
  if (!Array.isArray(response?.data)) throw new Error(message);
  return {
    data: response.data.map(mapReceptionistPatientProfile),
    pagination: response.pagination,
  };
}

export async function getReceptionistPatientProfiles(params = {}) {
  return assertData(
    await api.get("/resepsionis/pasien", params),
    "Format pasien dari server tidak valid.",
  );
}

export async function getReceptionistPatientProfile(email) {
  const result = await getReceptionistPatientProfiles({
    search: email,
    limit: 100,
  });
  const patient = result.data.find((item) => item.email === email);
  if (!patient) throw new Error("Pasien tidak ditemukan.");
  return patient;
}

const profilePayload = (form) => ({
  nama_lengkap: form.name,
  telepon: form.phone,
  jenis_kelamin: form.gender || null,
  tempat_lahir: form.birthPlace || null,
  tanggal_lahir: form.birthDate || null,
  pendidikan_terakhir: form.education || null,
  pekerjaan: form.job || null,
  status_perkawinan: form.maritalStatus || null,
  agama: form.religion || null,
  alamat_domisili: form.address || null,
  kota: form.city || null,
});

export async function createReceptionistPatient(form) {
  const response = await api.post("/resepsionis/pasien", {
    email: form.email,
    password: form.password,
    ...profilePayload(form),
  });
  if (!response?.patient)
    throw new Error("Format pasien dari server tidak valid.");
  return mapReceptionistPatientProfile(response.patient);
}

export async function updateReceptionistPatient(email, form) {
  const response = await api.put(
    `/resepsionis/pasien/${encodeURIComponent(email)}`,
    profilePayload(form),
  );
  if (!response?.patient)
    throw new Error("Format pasien dari server tidak valid.");
  return mapReceptionistPatientProfile(response.patient);
}

export async function getReceptionistPatientHistory(email) {
  return getReceptionistReservations({ email_pasien: email, limit: 100 });
}

export async function getReceptionistPatientPayments(email) {
  const response = await api.get("/resepsionis/pembayaran", { limit: 100 });
  if (!Array.isArray(response?.data))
    throw new Error("Format pembayaran dari server tidak valid.");

  return response.data.filter(
    (payment) => payment.reservasi?.email_pasien === email,
  );
}
