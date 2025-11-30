import {
  addCampaignAttachmentService,
  addCampaignRatingService,
  addCampaignVolunteerService,
  createCampaignService,
  deleteCampaignService,
  getCampaignByIdService,
  getCampaignsService,
  updateCampaignService,
  updateCampaignStatusService,
} from "../services/campaign.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

/**
 * CREATE CAMPAIGN
 */
export const createCampaign = asyncHandler(async (req, res) => {
  const data = await createCampaignService(req.body);
  return success(res, "Campaign created successfully", data);
});

/**
 * GET ALL CAMPAIGNS
 */
export const getAllCampaigns = asyncHandler(async (req, res) => {
  const data = await getCampaignsService(req.query); // supports filters
  return success(res, "Campaigns fetched successfully", data);
});

/**
 * GET CAMPAIGN BY ID
 */
export const getCampaignById = asyncHandler(async (req, res) => {
  const data = await getCampaignByIdService(req.params.id);
  return success(res, "Campaign fetched successfully", data);
});

/**
 * UPDATE CAMPAIGN
 */
export const updateCampaign = asyncHandler(async (req, res) => {
  const data = await updateCampaignService(req.params.id, req.body);
  return success(res, "Campaign updated successfully", data);
});

/**
 * DELETE CAMPAIGN
 */
export const deleteCampaign = asyncHandler(async (req, res) => {
  const data = await deleteCampaignService(req.params.id);
  return success(res, "Campaign deleted successfully", data);
});

/**
 * UPDATE STATUS
 */
export const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const data = await updateCampaignStatusService(req.params.id, status);
  return success(res, "Campaign status updated successfully", data);
});

/**
 * UPLOAD ATTACHMENT (FILE → CLOUDINARY)
 */
export const uploadCampaignAttachment = asyncHandler(async (req, res) => {
  const data = await addCampaignAttachmentService(req.params.id, req.file);
  return success(res, "Attachment uploaded successfully", data);
});

/**
 * ADD VOLUNTEER REGISTRATION TO CAMPAIGN
 */
export const addCampaignVolunteer = asyncHandler(async (req, res) => {
  const { volunteerRegId } = req.body;
  const data = await addCampaignVolunteerService(req.params.id, volunteerRegId);
  return success(res, "Volunteer added to campaign", data);
});

/**
 * ADD RATING & REVIEW
 */
export const addCampaignRating = asyncHandler(async (req, res) => {
  const data = await addCampaignRatingService(req.params.id, req.body);
  return success(res, "Rating submitted successfully", data);
});
