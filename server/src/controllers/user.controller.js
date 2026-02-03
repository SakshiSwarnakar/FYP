import {
  getUserProfileService,
  updateUserProfileService,
} from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const data = await getUserProfileService(req.user.id);
  return success(res, "User profile retrieved successfully", data);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const data = await updateUserProfileService(
    req.user,
    req.user.id,
    req.body,
    req.file
  );

  return success(res, "User profile updated successfully", data);
});
