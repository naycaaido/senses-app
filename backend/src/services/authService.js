import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { PROFILE_FIELDS } from "../constants/pasien.js";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";
import BadRequestError from "../exceptions/BadRequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const invalidCredentials = () =>
  new UnauthorizedError("Password atau identitas login salah");

const PATIENT_PROFILE_SELECT = {
  email: true,
  nama_lengkap: true,
  telepon: true,
  jenis_kelamin: true,
  tempat_lahir: true,
  tanggal_lahir: true,
  pendidikan_terakhir: true,
  pekerjaan: true,
  status_perkawinan: true,
  agama: true,
  alamat_domisili: true,
  kota: true,
  profil_lengkap: true,
};

const registerPasien = async ({ email, password, nama_lengkap }) => {
  const patient = await prisma.pasien.findUnique({
    where: { email },
    select: { email: true, profil_lengkap: true },
  });
  if (patient) {
    if (!patient.profil_lengkap) {
      const error = new Error(
        "Account already registered but profile is incomplete",
      );
      error.statusCode = 409;
      error.profile_incomplete = true;
      error.email = patient.email;
      throw error;
    }
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.pasien.create({
    data: { email, password: hashedPassword, nama_lengkap },
  });

  return { email, nama_lengkap, profil_lengkap: false };
};

const loginPasien = async ({ email, password }) => {
  const patient = await prisma.pasien.findUnique({
    where: { email },
    select: {
      email: true,
      password: true,
      nama_lengkap: true,
      profil_lengkap: true,
    },
  });

  if (!patient) {
    throw invalidCredentials();
  }

  const valid = await bcrypt.compare(password, patient.password);
  if (!valid) {
    throw invalidCredentials();
  }

  return {
    email: patient.email,
    nama_lengkap: patient.nama_lengkap,
    role: "pasien",
    profil_lengkap: patient.profil_lengkap,
  };
};

const loginResepsionis = async ({ id_resepsionis, password }) => {
  const resepsionis = await prisma.resepsionis.findUnique({
    where: { id_resepsionis },
    select: {
      id_resepsionis: true,
      nama_lengkap: true,
      password: true,
    },
  });

  if (!resepsionis) {
    throw invalidCredentials();
  }

  const valid = await bcrypt.compare(password, resepsionis.password);
  if (!valid) {
    throw invalidCredentials();
  }

  return {
    id_resepsionis: resepsionis.id_resepsionis,
    nama_lengkap: resepsionis.nama_lengkap,
    role: "resepsionis",
  };
};

const completeProfilePasien = async ({ email, ...rest }) => {
  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const patient = await prisma.pasien.findUnique({
    where: { email },
    select: { email: true },
  });
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  const missing = PROFILE_FIELDS.filter((field) => !rest[field]);
  if (missing.length > 0) {
    const error = new Error("All profile fields are required");
    error.statusCode = 400;
    throw error;
  }

  await prisma.pasien.update({
    where: { email },
    data: {
      ...Object.fromEntries(PROFILE_FIELDS.map((field) => [field, rest[field]])),
      profil_lengkap: true,
    },
  });

  return prisma.pasien.findUnique({
    where: { email },
    select: PATIENT_PROFILE_SELECT,
  });
};

const changePasswordPasien = async ({
  email,
  password_lama,
  password_baru,
  konfirmasi_password,
}) => {
  if (!password_lama || !password_baru || !konfirmasi_password) {
    throw new BadRequestError(
      "password_lama, password_baru, and konfirmasi_password are required",
    );
  }

  if (password_baru !== konfirmasi_password) {
    throw new BadRequestError("Password baru dan konfirmasi password tidak cocok");
  }

  const pasien = await prisma.pasien.findUnique({
    where: { email },
    select: { email: true, password: true },
  });
  if (!pasien) {
    throw new NotFoundError("Patient not found");
  }

  const oldPasswordMatches = await bcrypt.compare(password_lama, pasien.password);
  if (!oldPasswordMatches) {
    throw new UnauthorizedError("Password lama salah");
  }

  const newPasswordMatchesOld = await bcrypt.compare(
    password_baru,
    pasien.password,
  );
  if (newPasswordMatchesOld) {
    throw new BadRequestError("Password baru harus berbeda dari password lama");
  }

  const hashedPassword = await bcrypt.hash(password_baru, 10);
  await prisma.pasien.update({
    where: { email },
    data: { password: hashedPassword },
  });
};

export default {
  registerPasien,
  loginPasien,
  loginResepsionis,
  completeProfilePasien,
  changePasswordPasien,
  PROFILE_FIELDS,
};
