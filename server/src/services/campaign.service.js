import { HTTP_STATUS } from "../constants/http.js";
import assertOrThrow from "../utils/assertOrThrow.js";


import {
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  getCampaignWithVolunteerRequests,
  updateCampaign,
  updateCampaignStatus,
} from "../repository/campaign.repository.js";

export const createCampaignService = async (data) => {
  const { title, description, category, location, date, createdBy, files } =
    data;

  let attachments = [];

  

  const campaignData = {
    title,
    description,
    category,
    location,
    date,
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

export const getCampaignsService = async (filters = {}) => {
  const campaigns = await getCampaigns(filters);

  return campaigns.map(
    ({
      _id,
      title,
      location,
      date,
      category,
      status,
      createdBy,
      createdAt,
      attachments,
    }) => ({
      id: _id,
      title,
      location,
      date,
      category,
      status,
      createdBy,
      createdAt,
      attachments,
    })
  );
};

export const getCampaignByIdService = async (id) => {
  const campaign = await getCampaignById(id);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const {
    _id,
    title,
    description,
    category,
    location,
    date,
    status,
    attachments,
    volunteers,
    ratings,
    createdBy,
    createdAt,
    updatedAt,
  } = campaign;

  return {
    id: _id,
    title,
    description,
    category,
    location,
    date,
    status,
    attachments: attachments.map((att) => ({
      url: att.url,
      public_id: att.public_id,
      type: att.type,
      id: att._id,
    })),
    volunteers,
    ratings: ratings.map((rating) => ({
      volunteer: rating.volunteer,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
    })),
    createdBy,
    createdAt,
    updatedAt,
  };
};

export const respondToVolunteerRequestService = async (
  campaignId,
  volunteerId,
  organizerId,
  status
) => {
  assertOrThrow(
    ["accepted", "rejected"].includes(status),
    HTTP_STATUS.BAD_REQUEST,
    "Invalid status"
  );

  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "You are not authorized to manage volunteers for this campaign"
  );

  const volunteerRequest = campaign.volunteers.find(
    (v) => v.volunteer.toString() === volunteerId
  );

  assertOrThrow(
    volunteerRequest,
    HTTP_STATUS.NOT_FOUND,
    "Volunteer request not found"
  );

  assertOrThrow(
    volunteerRequest.status === "pending",
    HTTP_STATUS.BAD_REQUEST,
    "Volunteer request already processed"
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
  const { title, description, category, location, date, status, files } = data;

  let updateData = {
    title,
    description,
    category,
    location,
    date,
    status,
  };

  
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
  console.log("here");
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() !== userId.toString(),
    HTTP_STATUS.BAD_REQUEST,
    "Organizers cannot apply as volunteers"
  );

  const alreadyApplied = campaign.volunteers?.some(
    (v) => v.volunteer.toString() === userId.toString()
  );

  assertOrThrow(
    !alreadyApplied,
    HTTP_STATUS.BAD_REQUEST,
    "You have already applied as a volunteer"
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
  organizerId
) => {
  const campaign = await getCampaignWithVolunteerRequests(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  assertOrThrow(
    campaign.createdBy.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "You are not authorized to view volunteer requests for this campaign"
  );

  const pendingRequests = campaign.volunteers.filter(
    (v) => v.status === "pending"
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

export const updateCampaignStatusService = async (id, status) => {
  const updated = await updateCampaignStatus(id, status);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { _id, status: newStatus } = updated;

  return {
    id: _id,
    status: newStatus,
  };
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