import express from "express";
import {
  addCampaignRating,
  addCampaignVolunteer,
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  uploadCampaignAttachment,
} from "../controllers/campaign.controller.js";

import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";

import {
  createCampaignSchema,
  ratingSchema,
  updateCampaignSchema,
  updateStatusSchema,
} from "../validations/campaign.schema.js";
import { addVolunteerSchema } from "../validations/campaign.validation.js";

const router = express.Router();

router.post("/", validate(createCampaignSchema), createCampaign);

router.get("/", getAllCampaigns);

router.get("/:id", getCampaignById);

router.put("/:id", validate(updateCampaignSchema), updateCampaign);
router.delete("/:id", deleteCampaign);

router.patch("/:id/status", validate(updateStatusSchema), updateCampaignStatus);

router.post(
  "/:id/attachment",
  upload.single("file"),

  uploadCampaignAttachment
);

router.post(
  "/:id/volunteer",
  validate(addVolunteerSchema),
  addCampaignVolunteer
);

router.post("/:id/rating", validate(ratingSchema), addCampaignRating);

export default router;
