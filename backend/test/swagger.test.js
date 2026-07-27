import assert from "node:assert/strict";
import test from "node:test";
import swaggerSpec from "../src/config/swagger.js";

const getOperation = (method, path) => swaggerSpec.paths[path]?.[method.toLowerCase()];

const expectedOperations = [
  ["GET", "/"],
  ["GET", "/api/health"],
  ["POST", "/auth/register"],
  ["POST", "/auth/login"],
  ["GET", "/auth/profile"],
  ["PUT", "/auth/profile"],
  ["PUT", "/pasien/password"],
  ["GET", "/layanan"],
  ["GET", "/layanan/{id_layanan}"],
  ["GET", "/jadwal/tersedia"],
  ["POST", "/reservasi"],
  ["GET", "/reservasi/me"],
  ["GET", "/reservasi/{no_reservasi}"],
  ["PATCH", "/reservasi/{no_reservasi}/batal"],
  ["GET", "/resepsionis/pasien"],
  ["POST", "/resepsionis/pasien"],
  ["PUT", "/resepsionis/pasien/{email}"],
  ["GET", "/resepsionis/layanan"],
  ["POST", "/resepsionis/layanan"],
  ["PUT", "/resepsionis/layanan/{id_layanan}"],
  ["PATCH", "/resepsionis/layanan/{id_layanan}/nonaktif"],
  ["PATCH", "/resepsionis/layanan/{id_layanan}/aktif"],
  ["GET", "/resepsionis/jadwal"],
  ["POST", "/resepsionis/jadwal"],
  ["PATCH", "/resepsionis/jadwal/batch-status"],
  ["PATCH", "/resepsionis/jadwal/{id_jadwal}/aktif"],
  ["PATCH", "/resepsionis/jadwal/{id_jadwal}/nonaktif"],
  ["GET", "/resepsionis/reservasi"],
  ["POST", "/resepsionis/reservasi"],
  ["PATCH", "/resepsionis/reservasi/{no_reservasi}/hadir"],
  ["PATCH", "/resepsionis/reservasi/{no_reservasi}/selesai"],
  ["PATCH", "/resepsionis/reservasi/{no_reservasi}/tidak-hadir"],
  ["PATCH", "/resepsionis/reservasi/{no_reservasi}/batal"],
  ["GET", "/resepsionis/reservasi/{no_reservasi}/tagihan"],
  ["GET", "/resepsionis/pembayaran"],
  ["POST", "/resepsionis/pembayaran"],
  ["GET", "/resepsionis/pembayaran/{id_pembayaran}"],
];

const publicOperations = new Set([
  "GET /",
  "GET /api/health",
  "POST /auth/register",
  "POST /auth/login",
  "GET /layanan",
  "GET /layanan/{id_layanan}",
]);

const parameterName = (parameter) => {
  if (parameter.name) {
    return parameter.name;
  }

  const reference = parameter.$ref;
  const parameterKey = reference?.split("/").at(-1);
  return swaggerSpec.components.parameters[parameterKey]?.name;
};

test("Swagger documents every implemented operation with an API contract", () => {
  assert.equal(swaggerSpec.openapi, "3.0.0");
  assert.ok(swaggerSpec.components.securitySchemes.bearerAuth);

  for (const [method, path] of expectedOperations) {
    const operation = getOperation(method, path);
    const operationKey = method + " " + path;

    assert.ok(operation, "Missing Swagger operation: " + operationKey);
    assert.ok(operation.summary, "Missing summary: " + operationKey);
    assert.ok(operation.tags?.length, "Missing tags: " + operationKey);
    assert.ok(
      Object.keys(operation.responses || {}).length > 0,
      "Missing responses: " + operationKey,
    );

    const contentTypes = Object.values(operation.responses).flatMap((response) =>
      Object.keys(response.content || {}),
    );
    const expectedContentType = path === "/" ? "text/plain" : "application/json";
    assert.ok(
      contentTypes.includes(expectedContentType),
      "Missing " + expectedContentType + " response contract: " + operationKey,
    );

    if (!publicOperations.has(operationKey)) {
      assert.deepEqual(
        operation.security,
        [{ bearerAuth: [] }],
        "Missing Bearer auth contract: " + operationKey,
      );
    }
  }
});

test("Swagger documents request bodies and query parameters enforced by controllers", () => {
  const bodyOperations = [
    ["PUT", "/auth/profile"],
    ["PUT", "/resepsionis/pasien/{email}"],
    ["PUT", "/resepsionis/layanan/{id_layanan}"],
    ["PATCH", "/resepsionis/jadwal/batch-status"],
    ["POST", "/resepsionis/reservasi"],
    ["POST", "/resepsionis/pembayaran"],
  ];

  for (const [method, path] of bodyOperations) {
    assert.ok(
      getOperation(method, path).requestBody?.content?.["application/json"],
      "Missing JSON request body: " + method + " " + path,
    );
  }

  const queryExpectations = [
    ["GET", "/reservasi/me", ["page", "limit"]],
    ["GET", "/resepsionis/pasien", ["page", "limit", "search"]],
    ["GET", "/resepsionis/layanan", ["page", "limit", "search", "status"]],
    ["GET", "/resepsionis/jadwal", ["tanggal"]],
    [
      "GET",
      "/resepsionis/reservasi",
      ["page", "limit", "status", "email_pasien"],
    ],
    ["GET", "/resepsionis/pembayaran", ["page", "limit", "metode_pembayaran"]],
  ];

  for (const [method, path, expectedNames] of queryExpectations) {
    const names = getOperation(method, path).parameters.map(parameterName);
    for (const expectedName of expectedNames) {
      assert.ok(
        names.includes(expectedName),
        "Missing query parameter " + expectedName + ": " + method + " " + path,
      );
    }
  }

  const profileRequest = swaggerSpec.components.schemas.ProfileRequest;
  assert.equal(profileRequest.required.includes("email"), false);
  assert.match(profileRequest.description, /JWT/);
});

test("Swagger exposes schemas for API resources and pagination", () => {
  const schemas = swaggerSpec.components.schemas;
  for (const schema of [
    "Pasien",
    "Layanan",
    "Jadwal",
    "Reservasi",
    "Pembayaran",
    "Tagihan",
    "Pagination",
  ]) {
    assert.ok(schemas[schema], "Missing resource schema: " + schema);
  }

  const reservationListResponse =
    getOperation("GET", "/resepsionis/reservasi").responses[200].content[
      "application/json"
    ].schema;
  assert.ok(reservationListResponse.properties.data);
  assert.ok(reservationListResponse.properties.pagination);
});
