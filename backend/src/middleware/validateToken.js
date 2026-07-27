import jwt from "jsonwebtoken";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const validateToken = (req, _res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET NOT FOUND");
    }

    const authHeader = req.get("authorization");
    const [scheme, token] = authHeader?.split(" ") || [];

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Authorization header missing or malformed");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.user?.role) {
      throw new UnauthorizedError("Token payload is invalid");
    }

    req.user = decoded.user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token already expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("User is not authorized"));
    }
    return next(error);
  }
};

export default validateToken;
