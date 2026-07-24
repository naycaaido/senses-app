import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoute from "./routes/authRoute.js";
import pasienRoute from "./routes/pasienRoute.js";
import resepsionisRoute from "./routes/resepsionisRoute.js";
import layananRoute from "./routes/layananRoute.js";
import jadwalRoute from "./routes/jadwalRoute.js";
import reservasiRoute from "./routes/reservasiRoute.js";
import swaggerSpec from "./config/swagger.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", authRoute);
app.use("/", pasienRoute);
app.use("/", resepsionisRoute);
app.use("/", layananRoute);
app.use("/", jadwalRoute);
app.use("/", reservasiRoute);

app.get("/", (_req, res) => {
  res.send("Sense Clinic Backend is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Sense Clinic API is running" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Sense Clinic Backend listening on port ${PORT}`);
});
