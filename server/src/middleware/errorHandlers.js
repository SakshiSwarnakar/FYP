import { ZodError } from "zod";
import { HTTP_STATUS } from "../constants/http.js";
import AppError from "../utils/AppError.js";
import { error } from "../utils/response.js";

export const notFound = (req, res) => {
  return error(
    res,
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const formatted = err.issues.map((issue) => ({
      field: issue.path.join(".") || "unknown",
      message: issue.message,
    }));
    return error(res, "Validation failed", HTTP_STATUS.BAD_REQUEST, formatted);
  }

  if (err.name === "ValidationError") {
    const formatted = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return error(res, "Validation failed", HTTP_STATUS.BAD_REQUEST, formatted);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0] || "field";
    return error(
      res,
      `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (err instanceof AppError && err.isOperational) {
    return error(res, err.message, err.statusCode, err.errors || null);
  }

  console.error("UNEXPECTED ERROR:", err);
  return error(res, "Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
};
