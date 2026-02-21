import { HTTP_STATUS } from "../constants/http.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

import campaignModel from "../models/campaign.model.js";
import {
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  getCampaignWithVolunteerRequests,
  updateCampaign,
} from "../repository/campaign.repository.js";
import { getCampaignPhase } from "../utils/campaignPhase.js";

export const createCampaignService = async (data) => {
  const {
    title,
    description,
    category,
    location,
    startDate,
    endDate,
    createdBy,
    files,
  } = data;

  let attachments = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "campaign_attachments",
      );

      return {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        type: uploaded.resource_type,
      };
    });

    attachments = await Promise.all(uploadPromises);
  }

  const campaignData = {
    title,
    description,
    category,
    location,
    startDate,
    endDate,
    createdBy,
    attachments,
  };

  const campaign = await createCampaign(campaignData);

  return {
    id: campaign._id,
    title: campaign.title,
    status: campaign.status,
    attachments: campaign.attachments,
    createdAt: campaign.createdAt,
  };
};

export const getCampaignsService = async (filters = {}, userId, role) => {
  const { page = 1, limit = 10, ...queryFilters } = filters;

  if (role === "ADMIN") {
    queryFilters.createdBy = userId;
  }

  if (!role || role === "VOLUNTEER") {
    queryFilters.status = "PUBLISHED";
  }

  const result = await getCampaigns(queryFilters, {
    page: Number(page),
    limit: Number(limit),
  });

  const campaigns = result.data.map((campaign) => {
    let myVolunteerStatus = null;

    if (userId) {
      const myVolunteer = campaign.volunteers.find(
        (v) => v.volunteer?._id.toString() === userId.toString(),
      );
      myVolunteerStatus = myVolunteer?.status ?? null;
    }
    const phase = getCampaignPhase(campaign);
    console.log("Campaign Phase:", phase);

    return {
      id: campaign._id,
      title: campaign.title,
      location: campaign.location,
      category: campaign.category,
      status: campaign.status,
      phase,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      createdBy: campaign.createdBy,
      createdAt: campaign.createdAt,
      attachments: campaign.attachments,
      volunteers: campaign.volunteers,
      myVolunteerStatus,
    };
  });

  return {
    campaigns,
    pagination: result.pagination,
  };
};

export const getCampaignByIdService = async (id, userId) => {
  const campaign = await getCampaignById(id);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const myVolunteer = campaign.volunteers.find(
    (v) => v.volunteer?._id.toString() === userId?.toString(),
  );
  if (
    campaign.status === "DRAFT" &&
    campaign.createdBy._id.toString() !== userId?.toString()
  ) {
    assertOrThrow(false, HTTP_STATUS.FORBIDDEN, "Campaign not accessible");
  }
  const phase = getCampaignPhase(campaign);

  return {
    id: campaign._id,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    location: campaign.location,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    phase,

    status: campaign.status,
    attachments: campaign.attachments,
    volunteers: campaign.volunteers,
    ratings: campaign.ratings,
    createdBy: campaign.createdBy,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    myVolunteerStatus: myVolunteer ? myVolunteer.status : null,
  };
};

export const respondToVolunteerRequestService = async (
  campaignId,
  volunteerId,
  organizerId,
  status,
) => {
  assertOrThrow(
    ["accepted", "rejected"].includes(status),
    HTTP_STATUS.BAD_REQUEST,
    "Invalid status",
  );

  const campaign = await getCampaignById(campaignId);

  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy._id.equals(organizerId),
    HTTP_STATUS.FORBIDDEN,
    "You are not authorized to manage volunteers for this campaign",
  );
  const phase = getCampaignPhase(campaign);

  assertOrThrow(
    phase === "ONGOING" || phase === "UPCOMING",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot manage volunteers for completed campaigns",
  );

  const volunteerRequest = campaign.volunteers.find(({ volunteer }) =>
    volunteer._id.equals(volunteerId),
  );

  assertOrThrow(
    volunteerRequest,
    HTTP_STATUS.NOT_FOUND,
    "Volunteer request not found",
  );

  assertOrThrow(
    volunteerRequest.status === "pending",
    HTTP_STATUS.BAD_REQUEST,
    "Volunteer request already processed",
  );

  volunteerRequest.status = status;
  volunteerRequest.respondedAt = new Date();

  await campaign.save();

  return {
    campaignId,
    volunteerId,
    status,
    respondedAt: volunteerRequest.respondedAt,
  };
};

export const updateCampaignService = async (id, data) => {
  const campaign = await getCampaignById(id);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.status === "DRAFT",
    HTTP_STATUS.BAD_REQUEST,
    "Published campaigns cannot be edited",
  );

  const { title, description, category, location, startDate, endDate, files } =
    data;

  let updateData = {
    title,
    description,
    category,
    location,
    startDate,
    endDate,
  };

  if (files && files.length > 0) {
    const newAttachments = await Promise.all(
      files.map(async (file) => {
        const uploaded = await uploadToCloudinary(
          file.buffer,
          "campaign_attachments",
        );

        return {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
          type: uploaded.resource_type,
        };
      }),
    );

    updateData.attachments = newAttachments;
  }

  const updated = await updateCampaign(id, updateData);

  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    updatedAt: updated.updatedAt,
    attachments: updated.attachments,
  };
};

export const deleteCampaignService = async (id) => {
  const deleted = await deleteCampaign(id);
  assertOrThrow(deleted, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id,
    message: "Campaign deleted successfully",
  };
};

export const applyForCampaignService = async (campaignId, userId) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.status === "PUBLISHED",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot apply to an unpublished campaign",
  );

  const phase = getCampaignPhase(campaign);

  assertOrThrow(
    phase === "ONGOING" || phase === "UPCOMING",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot apply to a completed campaign",
  );

  assertOrThrow(
    campaign.createdBy.toString() !== userId.toString(),
    HTTP_STATUS.BAD_REQUEST,
    "Organizers cannot apply as volunteers",
  );

  const alreadyApplied = campaign.volunteers.some(
    (v) => v.volunteer._id.toString() === userId.toString(),
  );

  assertOrThrow(
    !alreadyApplied,
    HTTP_STATUS.BAD_REQUEST,
    "You have already applied as a volunteer",
  );

  const updated = await addCampaignVolunteer(campaignId, {
    volunteer: userId,
  });

  return {
    message: "Volunteer request submitted successfully",
    volunteers: updated.volunteers,
  };
};

export const getCampaignVolunteerRequestsService = async (
  campaignId,
  organizerId,
) => {
  const campaign = await getCampaignWithVolunteerRequests(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "You are not authorized to view volunteer requests for this campaign",
  );
  const phase = getCampaignPhase(campaign);

  assertOrThrow(
    phase === "ONGOING" || phase === "UPCOMING",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot view volunteer requests for completed campaigns",
  );

  const pendingRequests = campaign.volunteers.filter(
    (v) => v.status === "pending",
  );

  return {
    id: campaign._id,
    title: campaign.title,
    volunteerRequests: pendingRequests.map((v) => ({
      id: v._id,
      volunteer: v.volunteer,
      appliedAt: v.appliedAt,
    })),
  };
};

export const publishCampaignService = async (campaignId, userId) => {
  const campaign = await campaignModel.findById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");
  const phase = getCampaignPhase(campaign);

  assertOrThrow(
    phase !== "COMPLETED",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot publish a completed campaign",
  );

  assertOrThrow(
    campaign.createdBy.toString() === userId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "You are not allowed to publish this campaign",
  );

  assertOrThrow(
    campaign.status === "DRAFT",
    HTTP_STATUS.BAD_REQUEST,
    "Campaign is already published",
  );

  assertOrThrow(
    campaign.startDate && campaign.endDate,
    HTTP_STATUS.BAD_REQUEST,
    "Campaign must have start and end dates before publishing",
  );

  campaign.status = "PUBLISHED";
  await campaign.save();

  return campaign;
};

export const addCampaignRatingService = async (campaignId, data) => {
  const { volunteer, rating, comment } = data;

  const ratingData = {
    volunteer,
    rating,
    comment: comment || null,
    createdAt: new Date(),
  };

  const updated = await addCampaignRating(campaignId, ratingData);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, ratings } = updated;

  return {
    id: _id,
    ratings,
  };
};
