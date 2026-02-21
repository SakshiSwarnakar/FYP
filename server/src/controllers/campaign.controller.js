import {
  addCampaignRatingService,
  applyForCampaignService,
  createCampaignService,
  deleteCampaignService,
  getCampaignByIdService,
  getCampaignsService,
  getCampaignVolunteerRequestsService,
  publishCampaignService,
  respondToVolunteerRequestService,
  updateCampaignService,
} from "../services/campaign.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const createCampaign = asyncHandler(async (req, res) => {
  const data = await createCampaignService({
    ...req.body,
    files: req.files || [],
  });
  return success(res, "Campaign created successfully", data);
});

export const getAllCampaigns = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  const data = await getCampaignsService(req.query, userId, role);

  return success(res, "Campaigns fetched successfully", data);
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const data = await getCampaignByIdService(req.params.id, userId);
  return success(res, "Campaign fetched successfully", data);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const data = await updateCampaignService(req.params.id, {
    ...req.body,
    files: req.files || [],
  });
  return success(res, "Campaign updated successfully", data);
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const data = await deleteCampaignService(req.params.id);
  return success(res, "Campaign deleted successfully", data);
});

export const publishCampaign = asyncHandler(async (req, res) => {
  const data = await publishCampaignService(req.params.id, req.user.id);
  return success(res, "Campaign published successfully", data);
});

export const addCampaignRating = asyncHandler(async (req, res) => {
  const data = await addCampaignRatingService(req.params.id, req.body);
  return success(res, "Rating submitted successfully", data);
});

export const applyForCampaign = asyncHandler(async (req, res) => {
  console.log("user is", req.user);
  const userId = req.user.id;
  const campaignId = req.params.id;
  const data = await applyForCampaignService(campaignId, userId);
  return success(res, "Volunteer request submitted successfully", data);
});

export const getCampaignVolunteerRequests = asyncHandler(async (req, res) => {
  const organizerId = req.user.id;
  const campaignId = req.params.id;
  const data = await getCampaignVolunteerRequestsService(
    campaignId,
    organizerId,
  );

  return success(res, "Volunteer requests fetched successfully", data);
});

export const respondToVolunteerRequest = asyncHandler(async (req, res) => {
  const organizerId = req.user.id;
  const { status } = req.body;
  const { id: campaignId, volunteerId } = req.params;

  const data = await respondToVolunteerRequestService(
    campaignId,
    volunteerId,
    organizerId,
    status,
  );

  return success(res, `Volunteer request ${status}`, data);
});
