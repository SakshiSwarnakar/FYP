import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { HTTP_STATUS } from "../constants/http.js";
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError(
      "Invalid or expired refresh token",
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};
