import { HTTP_STATUS } from "../constants/http.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

import {
  addCampaignAttachment,
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  updateCampaign,
  updateCampaignStatus,
} from "../repositories/campaign.repository.js";

export const createCampaignService = async (data) => {
  const campaign = await createCampaign({
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    date: data.date,
    createdBy: data.createdBy,
  });

  return {
    id: campaign._id,
    title: campaign.title,
    status: campaign.status,
    createdAt: campaign.createdAt,
  };
};

export const getCampaignsService = async (filters = {}) => {
  const campaigns = await getCampaigns(filters);

  return campaigns.map((c) => ({
    id: c._id,
    title: c.title,
    category: c.category,
    status: c.status,
    createdAt: c.createdAt,
  }));
};

export const getCampaignByIdService = async (id) => {
  const campaign = await getCampaignById(id);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: campaign._id,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    location: campaign.location,
    date: campaign.date,
    status: campaign.status,
    attachments: campaign.attachments,
    volunteers: campaign.volunteers,
    ratings: campaign.ratings,
    createdBy: campaign.createdBy,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
};

export const updateCampaignService = async (id, updateData) => {
  const updated = await updateCampaign(id, updateData);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    title: updated.title,
    status: updated.status,
    updatedAt: updated.updatedAt,
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

export const updateCampaignStatusService = async (id, status) => {
  const updated = await updateCampaignStatus(id, status);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    status: updated.status,
  };
};

/**
 * ADD ATTACHMENT TO CAMPAIGN
 */
export const addCampaignAttachmentService = async (id, file) => {
  assertOrThrow(file, HTTP_STATUS.BAD_REQUEST, "No file uploaded");

  // Upload to Cloudinary
  const uploaded = await uploadToCloudinary(
    file.buffer,
    "campaign_attachments"
  );

  const attachment = {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    type: uploaded.resource_type,
  };

  const updated = await addCampaignAttachment(id, attachment);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    attachments: updated.attachments,
  };
};

/**
 * ADD VOLUNTEER TO CAMPAIGN
 */
export const addCampaignVolunteerService = async (
  campaignId,
  volunteerRegId
) => {
  const updated = await addCampaignVolunteer(campaignId, volunteerRegId);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    volunteers: updated.volunteers,
  };
};

/**
 * ADD RATING TO CAMPAIGN
 */
export const addCampaignRatingService = async (campaignId, data) => {
  const ratingData = {
    volunteer: data.volunteer,
    rating: data.rating,
    comment: data.comment || null,
    createdAt: new Date(),
  };

  const updated = await addCampaignRating(campaignId, ratingData);
  assertOrThrow(updated, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  return {
    id: updated._id,
    ratings: updated.ratings,
  };
};
