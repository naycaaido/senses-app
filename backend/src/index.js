import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/", authRoute);

app.get("/", (_req, res) => {
  res.send("Sense Clinic Backend is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Sense Clinic API is running" });
});

app.listen(PORT, () => {
  console.log(`Sense Clinic Backend listening on port ${PORT}`);
});
