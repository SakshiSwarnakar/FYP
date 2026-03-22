import { HTTP_STATUS } from "../constants/http.js";
import { getCampaignById } from "../repository/campaign.repository.js";
import {
  createConversation,
  createMessage,
  findConversation,
  getConversationById,
  getConversationsByUser,
  getMessagesByConversation,
  incrementUnreadCount,
  markMessagesAsRead,
  resetUnreadCount,
  updateConversationLastMessage,
} from "../repository/message.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const assertParticipant = (conversation, userId) => {
  console.log("The conversation and user id dis", conversation, userId);

  assertOrThrow(userId, HTTP_STATUS.INTERNAL_SERVER_ERROR, "User ID is missing");

  const uid = userId.toString();

  const isParticipant = conversation.participants.some((p) => {
    if (!p) return false;

    // if populated document
    if (p._id) return p._id.toString() === uid;

    // if just an ObjectId
    return p.toString() === uid;
  });

  assertOrThrow(isParticipant, HTTP_STATUS.FORBIDDEN, "Access denied");
};

const resolveParticipants = (campaign, requestingUser, targetVolunteerId) => {
  const campaignOwnerId =
    campaign.createdBy?._id?.toString() ?? campaign.createdBy?.toString();

  assertOrThrow(
    campaignOwnerId,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "Campaign has no valid creator"
  );

  // Support both id (JWT payload) and _id (Mongoose document)
  const requestingUserId = (requestingUser._id ?? requestingUser.id)?.toString();

  assertOrThrow(
    requestingUserId,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "Requesting user has no valid ID"
  );

  if (requestingUser.role === "ADMIN") {
    assertOrThrow(
      targetVolunteerId != null,
      HTTP_STATUS.BAD_REQUEST,
      "volunteerId is required when an admin initiates a conversation"
    );
    return {
      adminId: requestingUserId,
      participantId: targetVolunteerId.toString(),
    };
  }

  return {
    adminId: campaignOwnerId,
    participantId: requestingUserId,
  };
};

export const getOrCreateConversationService = async (
  campaignId,
  requestingUser,
  volunteerId
) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const { adminId, participantId } = resolveParticipants(
    campaign,
    requestingUser,
    volunteerId
  );

  const volunteerRecord = campaign.volunteers?.find((v) => {
    const volId = v.volunteer?._id?.toString() ?? v.volunteer?.toString();
    return volId === participantId;
  });

  assertOrThrow(
    volunteerRecord,
    HTTP_STATUS.FORBIDDEN,
    "Volunteer has not applied to this campaign"
  );

  assertOrThrow(
    volunteerRecord.status === "accepted",
    HTTP_STATUS.FORBIDDEN,
    "Only accepted volunteers can use campaign chat"
  );

  let conversation = await findConversation(campaignId, adminId, participantId);

  if (!conversation) {
    conversation = await createConversation(campaignId, adminId, participantId);
    conversation = await getConversationById(conversation._id);
  }

  return conversation;
};

export const getConversationsService = async (userId) => {
  console.log("----- SERVICE: getConversationsService -----");
  console.log("User ID received:", userId);

  const conversations = await getConversationsByUser(userId);

  console.log("Conversations fetched from DB:", conversations.length);
  console.log("Conversations:", JSON.stringify(conversations, null, 2));

  return conversations;
};

export const getMessagesService = async (conversationId, userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 30;

  const conversation = await getConversationById(conversationId);
  console.log("The conversations are as folow", conversation)
  assertOrThrow(conversation, HTTP_STATUS.NOT_FOUND, "Conversation not found");

  assertParticipant(conversation, userId);

  const messages = await getMessagesByConversation(conversationId, page, limit);

  markMessagesAsRead(conversationId, userId).catch(() => {});
  resetUnreadCount(conversationId, userId).catch(() => {});

  return { messages, conversation };
};

export const sendMessageService = async ({
  conversationId,
  senderId,
  text,
  attachment,
}) => {
  const conversation = await getConversationById(conversationId);
  assertOrThrow(conversation, HTTP_STATUS.NOT_FOUND, "Conversation not found");

  assertParticipant(conversation, senderId);

  const message = await createMessage({
    conversationId,
    sender: senderId,
    text: text || null,
    attachment: attachment ?? null,
  });

  await updateConversationLastMessage(conversationId, message._id);

  const recipient = conversation.participants.find(
    (p) => p._id.toString() !== senderId.toString()
  );

  if (recipient) {
    await incrementUnreadCount(conversationId, recipient._id);
  }

  const populated = await message.populate(
    "sender",
    "firstName lastName profilePic role"
  );

  return {
    message: populated,
    recipientId: recipient?._id?.toString() ?? null,
  };
};

export const uploadAttachmentService = async (file) => {
  assertOrThrow(file, HTTP_STATUS.BAD_REQUEST, "No file provided");

  const uploaded = await uploadToCloudinary(file.buffer, "chat_attachments");

  return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    type: uploaded.resource_type,
    originalName: file.originalname,
  };
};

export const markAsReadService = async (conversationId, userId) => {
  await markMessagesAsRead(conversationId, userId);
  await resetUnreadCount(conversationId, userId);
};