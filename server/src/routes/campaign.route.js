import express from "express";
import {
  addCampaignRating,
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
} from "../controllers/campaign.controller.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

/* CREATE campaign */
router.post(
  "/",
  upload.array("attachments"), // 👈 MUST be here
  createCampaign
);

/* GET */
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

/* UPDATE campaign */
router.put(
  "/:id",
  upload.array("attachments"), // 👈 MUST be here
  updateCampaign
);

/* DELETE */
router.delete("/:id", deleteCampaign);

/* UPDATE STATUS */
router.patch("/:id/status", updateCampaignStatus);

export default router;
