import jwt from "jsonwebtoken";
import authService from "../services/authService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET NOT FOUND");
}

const JWT_SECRET = process.env.JWT_SECRET;

const loginResepsionis = async (req, res) => {
  try {
    const { id_resepsionis, password } = req.body;

    if (id_resepsionis === undefined || id_resepsionis === null || id_resepsionis === "") {
      throw new BadRequestError("id_resepsionis and password are required");
    }

    if (!password) {
      throw new BadRequestError("id_resepsionis and password are required");
    }

    const parsedId = Number(id_resepsionis);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestError("id_resepsionis must be a positive integer");
    }

    const user = await authService.loginResepsionis({
      id_resepsionis: parsedId,
      password,
    });

    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { loginResepsionis };
