import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.patch("/read-all", requireAuth, markAllAsRead);
router.patch("/:notificationId/read", requireAuth, markAsRead);

router.delete("/:notificationId", requireAuth, deleteNotification);

export default router;
