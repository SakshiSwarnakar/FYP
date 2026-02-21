import Campaign from "../models/campaign.model.js";
import { paginate } from "../utils/paginate.js";

export const getCampaignAttendancePaginated = async (campaignId, options) => {
  const { page, limit } = options;

  return paginate({
    model: Campaign,
    query: { _id: campaignId },
    page,
    limit,
    populate: [
      {
        path: "volunteers.volunteer",
        select: "name email",
      },
    ],
    lean: false,
  });
};

export const getVolunteerAttendancePaginated = async (userId, options) => {
  const { page, limit } = options;

  return paginate({
    model: Campaign,
    query: {
      volunteers: {
        $elemMatch: {
          volunteer: userId,
          status: "accepted",
        },
      },
    },
    page,
    limit,
    populate: [
      {
        path: "createdBy",
        select: "name email",
      },
    ],
    lean: false,
  });
};
