import {
  getCampaignAttendanceService,
  getMyAttendanceService,
  markCampaignAttendanceService,
} from "../services/attendance.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const markCampaignAttendance = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { id: campaignId, volunteerId } = req.params;
  const { attendanceStatus } = req.body;
  const data = await markCampaignAttendanceService(
    campaignId,
    volunteerId,
    adminId,
    attendanceStatus,
  );
  return success(res, `Volunteer marked as ${attendanceStatus}`, data);
});

export const getCampaignAttendance = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { id: campaignId } = req.params;
  const { page, limit } = req.query;

  const data = await getCampaignAttendanceService(campaignId, adminId, {
    page,
    limit,
  });

  return success(res, "Campaign attendance fetched successfully", data);
});

export const getMyAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page, limit } = req.query;

  const data = await getMyAttendanceService(userId, {
    page,
    limit,
  });

  return success(res, "Attendance history fetched", data);
});
