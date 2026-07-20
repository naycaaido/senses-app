import pool from "../config/db.js";

export const PROFILE_FIELDS = [
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

const findRegistrationByEmail = async (email) => {
  const result = await pool.query(
    "SELECT email, profil_lengkap FROM pasien WHERE email = $1",
    [email],
  );

  return result.rows[0];
};

const createPasien = async ({ email, password, nama_lengkap }) => {
  await pool.query(
    "INSERT INTO pasien (email, password, nama_lengkap) VALUES ($1, $2, $3)",
    [email, password, nama_lengkap],
  );
};

const findLoginByEmail = async (email) => {
  const result = await pool.query(
    "SELECT email, password, nama_lengkap, profil_lengkap FROM pasien WHERE email = $1",
    [email],
  );

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query("SELECT email FROM pasien WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
};

const updateProfile = async (email, profile) => {
  const setClauses = PROFILE_FIELDS.map((field, i) => `${field} = $${i + 2}`);
  const values = [email, ...PROFILE_FIELDS.map((field) => profile[field])];

  await pool.query(
    `UPDATE pasien SET ${setClauses.join(", ")}, profil_lengkap = true WHERE email = $1`,
    values,
  );
};

const findProfileByEmail = async (email) => {
  const result = await pool.query(
    `SELECT email, nama_lengkap, ${PROFILE_FIELDS.join(
      ", ",
    )}, profil_lengkap FROM pasien WHERE email = $1`,
    [email],
  );

  return result.rows[0];
};

export default {
  findRegistrationByEmail,
  createPasien,
  findLoginByEmail,
  findByEmail,
  updateProfile,
  findProfileByEmail,
};
