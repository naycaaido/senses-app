import assert from "node:assert/strict";
import test from "node:test";
import internalJobController from "../src/controller/internalJobController.js";
import jadwalService from "../src/services/jadwalService.js";

const createResponse = () => {
  const response = {};
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (body) => {
    response.body = body;
    return response;
  };
  return response;
};

const requestWithAuthorization = (authorization) => ({
  get: (header) => (header === "authorization" ? authorization : undefined),
});

test("internal schedule job rejects missing or invalid secrets", async () => {
  const previousSecret = process.env.SCHEDULE_CRON_SECRET;
  process.env.SCHEDULE_CRON_SECRET = "test-schedule-secret";

  for (const authorization of [undefined, "Bearer wrong-secret", "Bearer jwt-token"]) {
    const response = createResponse();
    let error;
    await internalJobController.generateSchedule(
      requestWithAuthorization(authorization),
      response,
      (nextError) => { error = nextError; },
    );
    assert.equal(response.statusCode, undefined);
    assert.equal(error?.statusCode, 401);
  }

  if (previousSecret === undefined) delete process.env.SCHEDULE_CRON_SECRET;
  else process.env.SCHEDULE_CRON_SECRET = previousSecret;
});

test("internal schedule job runs the shared generator with a valid secret", async (t) => {
  const previousSecret = process.env.SCHEDULE_CRON_SECRET;
  const originalEnsure = jadwalService.ensureScheduleWindow;
  process.env.SCHEDULE_CRON_SECRET = "test-schedule-secret";
  t.after(() => {
    jadwalService.ensureScheduleWindow = originalEnsure;
    if (previousSecret === undefined) delete process.env.SCHEDULE_CRON_SECRET;
    else process.env.SCHEDULE_CRON_SECRET = previousSecret;
  });

  jadwalService.ensureScheduleWindow = async () => ({
    tanggal_mulai: "2026-08-04",
    tanggal_selesai: "2026-09-02",
    jumlah_hari: 30,
    slot_direncanakan: 480,
    slot_dibuat: 480,
    slot_dilewati: 0,
  });
  const response = createResponse();
  let error;
  await internalJobController.generateSchedule(
    requestWithAuthorization("Bearer test-schedule-secret"),
    response,
    (nextError) => { error = nextError; },
  );

  assert.equal(error, undefined);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.summary.jumlah_hari, 30);
});
