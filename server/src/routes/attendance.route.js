import express from "express";
import {
  getCampaignAttendance,
  getMyAttendance,
  markCampaignAttendance,
} from "../controllers/attendance.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
const router = express.Router();

router.patch(
  "/:id/attendance/:volunteerId",
  requireAuth,
  requireRole("ADMIN"),
  markCampaignAttendance,
);
router.get(
  "/campaigns/:id/attendance",
  requireAuth,
  requireRole("ADMIN"),
  getCampaignAttendance,
);

router.get(
  "/volunteers/me/attendance",
  requireAuth,
  requireRole("VOLUNTEER"),
  getMyAttendance,
);

export default router;
