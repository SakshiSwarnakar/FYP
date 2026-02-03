import express from "express";
import {
  addCampaignRating,
  applyForCampaign,
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  getCampaignVolunteerRequests,
  respondToVolunteerRequest,
  updateCampaign,
  updateCampaignStatus,
} from "../controllers/campaign.controller.js";
import { requireRole } from "../middleware/requireRole.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  createCampaignSchema,
  ratingSchema,
  updateCampaignSchema,
  updateStatusSchema,
} from "../validations/campaign.validation.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post(
  "/",
  upload.array("attachments"),
  validate(createCampaignSchema),
  createCampaign
);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.put(
  "/:id",
  upload.array("attachments"),
  validate(updateCampaignSchema),
  updateCampaign
);
router.delete("/:id", deleteCampaign);

router.patch("/:id/status", validate(updateStatusSchema), updateCampaignStatus);

router.post("/:id/rating", validate(ratingSchema), addCampaignRating);
router.post("/:id/apply", applyForCampaign);

router.get(
  "/:id/volunteers",requireAuth,
  requireRole("ADMIN"),
  getCampaignVolunteerRequests
);
router.patch(
  "/:id/volunteer-requests/:volunteerId",
  requireAuth,
  requireRole("ADMIN"),
  respondToVolunteerRequest
);

export default router;
