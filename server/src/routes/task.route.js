import express from "express";
import {
  createTask,
  getTasksByCampaign,
  getTaskSubmissions,
  reviewTaskSubmission,
  submitTask,
} from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/campaigns/:campaignId/tasks",
  requireAuth,
  requireRole("ADMIN"),
  upload.array("attachments"),

  createTask,
);

router.get(
  "/tasks/:taskId/submissions",
  requireAuth,
  requireRole("ADMIN"),
  getTaskSubmissions,
);

router.patch(
  "/tasks/submissions/:submissionId/review",
  requireAuth,
  requireRole("ADMIN"),

  reviewTaskSubmission,
);

router.get("/campaigns/:campaignId/tasks", requireAuth, getTasksByCampaign);

router.post(
  "/tasks/:taskId/submissions",
  requireAuth,
  upload.array("proof"),
  submitTask,
);

export default router;
