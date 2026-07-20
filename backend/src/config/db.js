import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL == "") {
  throw new Error("DATABASE URL NOT FOUND");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
