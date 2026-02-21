import express from "express";
import {
  addCampaignRating,
  applyForCampaign,
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  getCampaignVolunteerRequests,
  publishCampaign,
  respondToVolunteerRequest,
  updateCampaign,
} from "../controllers/campaign.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  createCampaignSchema,
  ratingSchema,
  updateCampaignSchema,
} from "../validations/campaign.validation.js";

const router = express.Router();

router.post(
  "/",
  upload.array("attachments"),
  validate(createCampaignSchema),
  createCampaign,
);
router.get("/", optionalAuth, getAllCampaigns);
router.get("/:id", optionalAuth, getCampaignById);
router.put(
  "/:id",
  upload.array("attachments"),
  validate(updateCampaignSchema),
  updateCampaign,
);
router.delete("/:id", deleteCampaign);

router.patch("/:id/publish", requireAuth, publishCampaign);

router.post("/:id/rating", validate(ratingSchema), addCampaignRating);
router.post("/:id/apply", requireAuth, applyForCampaign);

router.get(
  "/:id/volunteers",
  requireAuth,
  requireRole("ADMIN"),
  getCampaignVolunteerRequests,
);
router.patch(
  "/:id/volunteer-requests/:volunteerId",
  requireAuth,
  requireRole("ADMIN"),
  respondToVolunteerRequest,
);

export default router;
