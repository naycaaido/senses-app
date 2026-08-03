import { timingSafeEqual } from "node:crypto";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";
import jadwalService from "../services/jadwalService.js";

const hasValidScheduleSecret = (authorization) => {
  const secret = process.env.SCHEDULE_CRON_SECRET;
  const [scheme, providedSecret] = authorization?.split(" ") || [];
  if (!secret || scheme !== "Bearer" || !providedSecret) return false;

  const expected = Buffer.from(secret);
  const provided = Buffer.from(providedSecret);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
};

const generateSchedule = async (req, res, next) => {
  if (!hasValidScheduleSecret(req.get("authorization"))) {
    return next(new UnauthorizedError("Internal job is not authorized"));
  }

  try {
    const summary = await jadwalService.ensureScheduleWindow();
    return res.status(200).json({
      message: "Schedule window ensured successfully",
      summary,
    });
  } catch (error) {
    console.error("Schedule generation job failed", {
      name: error?.name,
      statusCode: error?.statusCode,
    });
    return next(new Error("Schedule generation failed"));
  }
};

export default { generateSchedule };
