import {
  getConversationsService,
  getMessagesService,
  getOrCreateConversationService,
  uploadAttachmentService,
} from "../services/message.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { HTTP_STATUS } from "../constants/http.js";
import assertOrThrow from "../utils/assertOrThrow.js";

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body);   // remove after confirming fix
  console.log("req.user:", req.user);   // remove after confirming fix

  const { campaignId, volunteerId } = req.body;

  assertOrThrow(
    campaignId,
    HTTP_STATUS.BAD_REQUEST,
    "campaignId is required"
  );

  if (req.user.role === "ADMIN") {
    assertOrThrow(
      volunteerId,
      HTTP_STATUS.BAD_REQUEST,
      "volunteerId is required when an admin initiates a conversation"
    );
  }

  const data = await getOrCreateConversationService(
    campaignId,
    req.user,
    volunteerId,
  );
  return success(res, "Conversation retrieved successfully", data);
});

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user?._id ?? req.user?.id;
assertOrThrow(userId, HTTP_STATUS.INTERNAL_SERVER_ERROR, "User ID missing");
    console.log("========== GET CONVERSATIONS ==========");
    console.log("Authenticated User ID:", userId);

    const conversations = await getConversationsService(userId);

    console.log("Conversations returned to controller:", conversations?.length);

    res.json({
      status: "success",
      data: conversations,
    });
  } catch (error) {
    console.error("Error in getConversations controller:", error);
    next(error);
  }
};

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user?._id ?? req.user?.id;

  assertOrThrow(userId, HTTP_STATUS.INTERNAL_SERVER_ERROR, "User ID missing");

  const data = await getMessagesService(
    conversationId,
    userId.toString(),
    req.query,
  );

  return success(res, "Messages retrieved successfully", data);
});
export const uploadAttachment = asyncHandler(async (req, res) => {
  const data = await uploadAttachmentService(req.file);
  return success(res, "Attachment uploaded successfully", data);
});