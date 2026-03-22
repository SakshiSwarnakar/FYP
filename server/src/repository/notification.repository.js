import Notification from "../models/notification.model.js";

export const createNotification = (data) => {
  const notification = new Notification(data);
  return notification.save();
};

export const getNotificationsByUser = (userId, page = 1, limit = 20) => {
  return Notification.find({ recipient: userId })
    .populate("sender", "firstName lastName profilePic")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const getUnreadCount = (userId) => {
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

export const markNotificationAsRead = (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true },
  );
};

export const markAllNotificationsAsRead = (userId) => {
  return Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true },
  );
};

export const deleteNotification = (notificationId, userId) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });
};
