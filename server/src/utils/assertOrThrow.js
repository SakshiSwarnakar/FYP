import AppError from "./AppError.js";

const assertOrThrow = (condition, statusCode, message, errors = null) => {
  if (!condition) {
    throw new AppError(message, statusCode, errors);
  }
};

export default assertOrThrow;
