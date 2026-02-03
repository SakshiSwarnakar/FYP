import { HTTP_STATUS } from "../constants/http.js";
import AppError from "../utils/AppError.js";

export const requireRole = (...allowedRoles) => {
  
  return (req, res, next) => {
    console.log("the user is", req);
    if (!req.user || !req.user.role) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
    }

    next();
  };
};
