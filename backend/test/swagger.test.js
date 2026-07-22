import assert from "node:assert/strict";
import test from "node:test";
import swaggerSpec from "../src/config/swagger.js";

test("Swagger documents every implemented API group", () => {
  const expectedPaths = [
    "/auth/register",
    "/auth/login",
    "/auth/profile",
    "/pasien/password",
    "/layanan",
    "/jadwal/tersedia",
    "/reservasi",
    "/resepsionis/pasien",
    "/resepsionis/layanan",
    "/resepsionis/jadwal",
    "/resepsionis/reservasi",
    "/resepsionis/pembayaran",
  ];

  for (const path of expectedPaths) {
    assert.ok(swaggerSpec.paths[path], `Missing Swagger path: ${path}`);
  }
  assert.ok(swaggerSpec.components.securitySchemes.bearerAuth);
});
