import { HTTP_STATUS } from "../constants/http.js";
import {
  createNotification,
  deleteNotification,
  getNotificationsByUser,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../repository/notification.repository.js";
import { getIO, getOnlineUsers } from "../socket/socket.js";
import assertOrThrow from "../utils/assertOrThrow.js";

const emitNotification = (notification) => {
  try {
    const onlineUsers = getOnlineUsers();
    const recipientSocketId = onlineUsers.get(
      notification.recipient.toString(),
    );

    if (recipientSocketId) {
      getIO().to(recipientSocketId).emit("notification", notification);
    }
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }
};

export const notifyVolunteerApplied = async ({
  sender,
  recipient,
  campaign,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type: "VOLUNTEER_APPLIED",
    message: "A volunteer has applied to your campaign",
    redirectLink: `/campaigns/${campaign._id}/volunteers`,
    metadata: { campaignId: campaign._id },
  });
  emitNotification(notification);
};

export const notifyApplicationResponse = async ({
  sender,
  recipient,
  campaign,
  status,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type:
      status === "accepted" ? "APPLICATION_ACCEPTED" : "APPLICATION_REJECTED",
    message: `Your application to "${campaign.title}" has been ${status}`,
    redirectLink: `/campaigns/${campaign._id}`,
    metadata: { campaignId: campaign._id },
  });
  emitNotification(notification);
};

export const notifyTaskSubmissionReviewed = async ({
  sender,
  recipient,
  campaign,
  task,
  status,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type: "TASK_SUBMISSION_REVIEWED",
    message: `Your submission for "${task.title}" has been ${status}`,
    redirectLink: `/campaigns/${campaign._id}`,
    metadata: { campaignId: campaign._id, taskId: task._id },
  });
  emitNotification(notification);
};

export const notifyRatingSubmitted = async ({
  sender,
  recipient,
  campaign,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type: "RATING_SUBMITTED",
    message: `A volunteer has rated your campaign "${campaign.title}"`,
    redirectLink: `/campaigns/${campaign._id}`,
    metadata: { campaignId: campaign._id },
  });
  emitNotification(notification);
};

export const notifyCommentReceived = async ({
  sender,
  recipient,
  campaign,
  ratingId,
  commentId,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type: "COMMENT_RECEIVED",
    message: "Someone replied in a feedback thread",
    redirectLink: `/campaigns/${campaign._id}/ratings/${ratingId}/comments`,
    metadata: {
      campaignId: campaign._id,
      ratingId,
      commentId,
    },
  });
  emitNotification(notification);
};

export const notifyMention = async ({
  sender,
  recipient,
  campaign,
  ratingId,
  commentId,
}) => {
  const notification = await createNotification({
    recipient,
    sender,
    type: "MENTION_IN_COMMENT",
    message: "You were mentioned in a feedback thread",
    redirectLink: `/campaigns/${campaign._id}/ratings/${ratingId}/comments`,
    metadata: {
      campaignId: campaign._id,
      ratingId,
      commentId,
    },
  });
  emitNotification(notification);
};

export const getNotificationsService = async (userId, query) => {
  const { page = 1, limit = 20 } = query;
  const [notifications, unreadCount] = await Promise.all([
    getNotificationsByUser(userId, page, limit),
    getUnreadCount(userId),
  ]);

  return { notifications, unreadCount };
};

export const markAsReadService = async (notificationId, userId) => {
  const notification = await markNotificationAsRead(notificationId, userId);
  assertOrThrow(notification, HTTP_STATUS.NOT_FOUND, "Notification not found");
  return notification;
};

export const markAllAsReadService = async (userId) => {
  await markAllNotificationsAsRead(userId);
  return { message: "All notifications marked as read" };
};

export const deleteNotificationService = async (notificationId, userId) => {
  const notification = await deleteNotification(notificationId, userId);
  assertOrThrow(notification, HTTP_STATUS.NOT_FOUND, "Notification not found");
  return { message: "Notification deleted" };
};
