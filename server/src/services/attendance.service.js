import { HTTP_STATUS } from "../constants/http.js";
import {
  getCampaignAttendancePaginated,
  getVolunteerAttendancePaginated,
} from "../repository/attendance.repository.js";
import { getCampaignById } from "../repository/campaign.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { getCampaignPhase } from "../utils/campaignPhase.js";

export const markCampaignAttendanceService = async (
  campaignId,
  volunteerId,
  adminId,
  status,
) => {
  assertOrThrow(
    ["present", "absent"].includes(status),
    HTTP_STATUS.BAD_REQUEST,
    "Invalid attendance status",
  );

  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.equals(adminId),
    HTTP_STATUS.FORBIDDEN,
    "Not authorized to mark attendance",
  );

  const phase = getCampaignPhase(campaign);

  assertOrThrow(
    phase === "ONGOING" || phase === "COMPLETED",
    HTTP_STATUS.BAD_REQUEST,
    "Attendance can only be marked for ongoing or completed campaigns",
  );

  const volunteerEntry = campaign.volunteers.find((v) =>
    v.volunteer.equals(volunteerId),
  );

  assertOrThrow(
    volunteerEntry,
    HTTP_STATUS.NOT_FOUND,
    "Volunteer not found in this campaign",
  );

  assertOrThrow(
    volunteerEntry.status === "accepted",
    HTTP_STATUS.BAD_REQUEST,
    "Only accepted volunteers can have attendance marked",
  );

  assertOrThrow(
    !volunteerEntry.attendanceStatus,
    HTTP_STATUS.BAD_REQUEST,
    "Attendance already marked",
  );

  volunteerEntry.attendanceStatus = status;
  volunteerEntry.attendanceMarkedAt = new Date();

  await campaign.save();

  return {
    campaignId,
    volunteerId,
    attendanceStatus: status,
    attendanceMarkedAt: volunteerEntry.attendanceMarkedAt,
  };
};

export const getCampaignAttendanceService = async (
  campaignId,
  adminId,
  filters = {},
) => {
  const { page = 1, limit = 10 } = filters;

  const result = await getCampaignAttendancePaginated(campaignId, {
    page: Number(page),
    limit: Number(limit),
  });

  const campaign = result.data[0];

  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.equals(adminId),
    HTTP_STATUS.FORBIDDEN,
    "Not authorized to view attendance",
  );

  const acceptedVolunteers = campaign.volunteers.filter(
    (v) => v.status === "accepted",
  );

  const attendance = acceptedVolunteers.map((v) => ({
    volunteerId: v.volunteer._id,
    volunteer: v.volunteer,
    attendanceStatus: v.attendanceStatus ?? null,
    attendanceMarkedAt: v.attendanceMarkedAt ?? null,
  }));

  return {
    campaignId: campaign._id,
    title: campaign.title,
    attendance,
    pagination: result.pagination,
  };
};

export const getMyAttendanceService = async (userId, filters = {}) => {
  const { page = 1, limit = 10 } = filters;

  const result = await getVolunteerAttendancePaginated(userId, {
    page: Number(page),
    limit: Number(limit),
  });

  const attendanceHistory = result.data.map((campaign) => {
    const volunteerEntry = campaign.volunteers.find(
      (v) =>
        v.volunteer.toString() === userId.toString() && v.status === "accepted",
    );

    return {
      campaignId: campaign._id,
      title: campaign.title,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      attendanceStatus: volunteerEntry?.attendanceStatus ?? null,
      attendanceMarkedAt: volunteerEntry?.attendanceMarkedAt ?? null,
      organizer: campaign.createdBy,
    };
  });

  return {
    attendance: attendanceHistory,
    pagination: result.pagination,
  };
};
