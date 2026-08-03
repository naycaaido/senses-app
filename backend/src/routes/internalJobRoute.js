import { Router } from "express";
import internalJobController from "../controller/internalJobController.js";

const internalJobRoute = Router();

internalJobRoute.post(
  "/internal/jobs/generate-schedule",
  internalJobController.generateSchedule,
);

export default internalJobRoute;
