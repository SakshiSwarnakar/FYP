import {
  deleteNotificationService,
  getNotificationsService,
  markAllAsReadService,
  markAsReadService,
} from "../services/notification.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await getNotificationsService(userId, req.query);
  return success(res, "Notifications fetched successfully", result);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;
  const result = await markAsReadService(notificationId, userId);
  return success(res, "Notification marked as read", result);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await markAllAsReadService(userId);
  return success(res, "All notifications marked as read", result);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;
  const result = await deleteNotificationService(notificationId, userId);
  return success(res, "Notification deleted successfully", result);
});
