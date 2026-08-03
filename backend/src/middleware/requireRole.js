import ForbiddenError from "../exceptions/ForbiddenError.js";

const requireRole = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ForbiddenError("You do not have access to this resource"));
  }

  return next();
};

export default requireRole;
