import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    req.user = payload;
  } catch (err) {}

  next();
};
