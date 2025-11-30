import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { HTTP_STATUS } from "../constants/http.js";
import AppError from "../utils/AppError.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", HTTP_STATUS.UNAUTHORIZED);
  }
};
