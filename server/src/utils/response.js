import { HTTP_STATUS } from "../constants/http.js";

export const success = (res, message, data = null, status = HTTP_STATUS.OK) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

export const error = (
  res,
  message,
  status = HTTP_STATUS.BAD_REQUEST,
  errors = null
) => {
  return res.status(status).json({
    status: "error",
    message,
    errors,
  });
};
