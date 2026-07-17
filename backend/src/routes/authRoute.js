import { Router } from "express";
import pasienController from "../controller/pasienController.js";

const authRoute = Router();

authRoute.post("/auth/pasien/register", pasienController.registerPasien);
authRoute.post("/auth/pasien/login", () => {});
authRoute.post("/auth/resepsionis/login", () => {});
authRoute.post("/auth/logout", () => {});

export default authRoute;
