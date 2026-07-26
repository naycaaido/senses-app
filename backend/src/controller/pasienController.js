import jwt from "jsonwebtoken";
import authService from "../services/authService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

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

    res.status(200).json({ token, user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { role, email, id_resepsionis, password } = req.body;
    const selectedRole = role || (email ? "pasien" : undefined);

    if (!password || !selectedRole) {
      throw new BadRequestError("role and password are required");
    }

    let user;
    if (selectedRole === "pasien") {
      if (!email) {
        throw new BadRequestError("email is required for patient login");
      }
      user = await authService.loginPasien({ email, password });
    } else if (selectedRole === "resepsionis") {
      const receptionistId = Number(id_resepsionis);
      if (!Number.isSafeInteger(receptionistId) || receptionistId < 1) {
        throw new BadRequestError(
          "id_resepsionis must be a positive integer for receptionist login",
        );
      }
      user = await authService.loginResepsionis({
        id_resepsionis: receptionistId,
        password,
      });
    } else {
      throw new BadRequestError("role must be pasien or resepsionis");
    }

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const completeProfilePasien = async (req, res) => {
  try {
    const { email: _ignoredEmail, ...profile } = req.body;
    const user = await authService.completeProfilePasien({
      email: req.user.email,
      ...profile,
    });

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

const getProfilePasien = async (req, res) => {
  try {
    const user = await authService.getProfilePasien({ email: req.user.email });
    return res.status(200).json({ user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changePasswordPasien = async (req, res) => {
  try {
    const { email: _ignoredEmail, ...passwordPayload } = req.body;
    await authService.changePasswordPasien({
      email: req.user.email,
      ...passwordPayload,
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  registerPasien,
  loginPasien,
  login,
  completeProfilePasien,
  getProfilePasien,
  changePasswordPasien,
};
