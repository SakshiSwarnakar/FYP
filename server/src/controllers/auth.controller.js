import {
  forgotPasswordService,
  getMeService,
  loginUserService,
  logoutUserService,
  refreshTokenService,
  registerOrganizerService,
  registerVolunteerService,
  resetPasswordService,
} from "../services/auth.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const registerVolunteer = asyncHandler(async (req, res) => {
  const data = await registerVolunteerService(req.body, req.file);
  return success(res, "Volunteer registered successfully", data);
});

export const registerOrganizer = asyncHandler(async (req, res) => {
  const data = await registerOrganizerService(req.body, req.file);
  return success(res, "Organizer registered successfully", data);
});

export const loginUser = asyncHandler(async (req, res) => {
  const data = await loginUserService(req.body);
  return success(res, "User logged in successfully", data);
});

export const getMe = asyncHandler(async (req, res) => {
  const data = await getMeService(req.user.id);
  return success(res, "User data retrieved successfully", data);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await forgotPasswordService(req.body.email);
  return success(res, "Password reset link sent successfully", data);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = await resetPasswordService(req.params.token, req.body.password);
  return success(res, "Password has been reset successfully", data);
});

export const logOutUser = asyncHandler(async (req, res) => {
  const data = await logoutUserService();
  return success(res, "User logged out successfully", data);
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const data = await refreshTokenService(req.body.refreshToken);
  return success(res, "Access token refreshed successfully", data);
});
