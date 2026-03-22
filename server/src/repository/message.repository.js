import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const findConversation = (campaignId, participantA, participantB) => {
  return Conversation.findOne({
    campaignId,
    participants: { $all: [participantA, participantB] },
  })
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage");
};

export const createConversation = (campaignId, participantA, participantB) => {
  const conversation = new Conversation({
    campaignId,
    participants: [participantA, participantB],
    unreadCount: {
      [participantA.toString()]: 0,
      [participantB.toString()]: 0,
    },
  });
  return conversation.save();
};

export const getConversationById = (conversationId) => {
  return Conversation.findById(conversationId)
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage");
};

export const getConversationsByUser = async (userId) => {
  console.log("========== DB QUERY ==========");
  console.log("UserId received:", userId);
  console.log("UserId type:", typeof userId);

  const objectId = new mongoose.Types.ObjectId(userId);

  console.log("Converted ObjectId:", objectId);

  const conversations = await Conversation.find({
    participants: { $in: [objectId] },
  })
    .populate("participants", "firstName lastName profilePic role")
    .populate("lastMessage")
    .populate("campaignId", "title")
    .sort({ updatedAt: -1 });

  console.log("Conversations found:", conversations.length);

  return conversations;
};

export const updateConversationLastMessage = (conversationId, messageId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { lastMessage: messageId },
    { new: true },
  );
};

export const incrementUnreadCount = (conversationId, userId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { $inc: { [`unreadCount.${userId}`]: 1 } },
    { new: true },
  );
};

export const resetUnreadCount = (conversationId, userId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    { $set: { [`unreadCount.${userId}`]: 0 } },
    { new: true },
  );
};

export const createMessage = (data) => {
  const message = new Message(data);
  return message.save();
};

export const getMessagesByConversation = (
  conversationId,
  page = 1,
  limit = 30,
) => {
  return Message.find({ conversationId })
    .populate("sender", "firstName lastName profilePic role")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

export const markMessagesAsRead = (conversationId, recipientId) => {
  return Message.updateMany(
    {
      conversationId,
      sender: { $ne: recipientId },
      readAt: null,
    },
    { readAt: new Date() },
  );
};

export const getUnreadMessageCount = (conversationId, userId) => {
  return Message.countDocuments({
    conversationId,
    sender: { $ne: userId },
    readAt: null,
  });
};
