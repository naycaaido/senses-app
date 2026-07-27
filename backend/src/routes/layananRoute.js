import { Router } from "express";
import layananController from "../controller/layananController.js";

const layananRoute = Router();

layananRoute.get("/layanan", layananController.getLayanan);
layananRoute.get("/layanan/:id_layanan", layananController.getLayananById);

export default layananRoute;
