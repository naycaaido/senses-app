import bcrypt from "bcrypt";
import pool from "../config/db.js";

const PROFILE_FIELDS = [
  "telepon",
  "jenis_kelamin",
  "tempat_lahir",
  "tanggal_lahir",
  "pendidikan_terakhir",
  "pekerjaan",
  "status_perkawinan",
  "agama",
  "alamat_domisili",
  "kota",
];

const registerPasien = async ({ email, password, nama_lengkap }) => {
  const existing = await pool.query(
    "SELECT email, profil_lengkap FROM pasien WHERE email = $1",
    [email],
  );
  if (existing.rows.length > 0) {
    const patient = existing.rows[0];
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

  await pool.query(
    "INSERT INTO pasien (email, password, nama_lengkap) VALUES ($1, $2, $3)",
    [email, hashedPassword, nama_lengkap],
  );

  return { email, nama_lengkap, profil_lengkap: false };
};

const loginPasien = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT email, password, nama_lengkap, profil_lengkap FROM pasien WHERE email = $1",
    [email],
  );

  if (result.rows.length === 0) {
    const error = new Error("Password atau email salah");
    error.statusCode = 401;
    throw error;
  }

  const patient = result.rows[0];

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

  const found = await pool.query("SELECT email FROM pasien WHERE email = $1", [
    email,
  ]);
  if (found.rows.length === 0) {
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

  const setClauses = PROFILE_FIELDS.map((field, i) => `${field} = $${i + 2}`);
  const values = [email, ...PROFILE_FIELDS.map((field) => rest[field])];

  await pool.query(
    `UPDATE pasien SET ${setClauses.join(", ")}, profil_lengkap = true WHERE email = $1`,
    values,
  );

  const updated = await pool.query(
    `SELECT email, nama_lengkap, ${PROFILE_FIELDS.join(
      ", ",
    )}, profil_lengkap FROM pasien WHERE email = $1`,
    [email],
  );

  return updated.rows[0];
};

export default {
  registerPasien,
  loginPasien,
  completeProfilePasien,
  PROFILE_FIELDS,
};
