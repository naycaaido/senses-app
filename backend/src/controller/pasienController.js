import jwt from "jsonwebtoken";
import authService from "../services/authService.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET NOT FOUND");
}

const JWT_SECRET = process.env.JWT_SECRET;

const registerPasien = async (req, res) => {
  try {
    const { email, password, nama_lengkap } = req.body;

    if (!email || !password || !nama_lengkap) {
      return res
        .status(400)
        .json({ message: "Email, password, and nama_lengkap are required" });
    }

    const user = await authService.registerPasien({
      email,
      password,
      nama_lengkap,
    });

    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    if (error.statusCode) {
      const body = { message: error.message };
      if (error.profile_incomplete) {
        body.profile_incomplete = true;
        body.email = error.email;
      }
      return res.status(error.statusCode).json(body);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginPasien = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await authService.loginPasien({ email, password });

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const completeProfilePasien = async (req, res) => {
  try {
    const user = await authService.completeProfilePasien(req.body);

    res
      .status(200)
      .json({ message: "Profile completed successfully", user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { registerPasien, loginPasien, completeProfilePasien };
