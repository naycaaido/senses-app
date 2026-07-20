import bcrypt from "bcrypt";
import pasienRepository, {
  PROFILE_FIELDS,
} from "../repositories/pasienRepository.js";

const registerPasien = async ({ email, password, nama_lengkap }) => {
  const patient = await pasienRepository.findRegistrationByEmail(email);
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

  await pasienRepository.createPasien({
    email,
    password: hashedPassword,
    nama_lengkap,
  });

  return { email, nama_lengkap, profil_lengkap: false };
};

const loginPasien = async ({ email, password }) => {
  const patient = await pasienRepository.findLoginByEmail(email);

  if (!patient) {
    const error = new Error("Password atau email salah");
    error.statusCode = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, patient.password);
  if (!valid) {
    const error = new Error("Password atau email salah");
    error.statusCode = 401;
    throw error;
  }

  return {
    email: patient.email,
    nama_lengkap: patient.nama_lengkap,
    role: "pasien",
    profil_lengkap: patient.profil_lengkap,
  };
};

const completeProfilePasien = async ({ email, ...rest }) => {
  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const patient = await pasienRepository.findByEmail(email);
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

  await pasienRepository.updateProfile(email, rest);

  return pasienRepository.findProfileByEmail(email);
};

export default {
  registerPasien,
  loginPasien,
  completeProfilePasien,
  PROFILE_FIELDS,
};
