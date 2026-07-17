import pool from "../config/db";
const registerPasien = async (data) => {
  const query =
    "INSERT INTO pasien (email, password, nama_lengkap) VALUES ($1, $2, $3)";
  const values = [data.email, data.password, data.nama];
  const result = pool.query(query, values);
  console.log((await result).rows[0]);
};

export default { registerPasien };
