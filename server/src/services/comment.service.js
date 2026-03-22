import { HTTP_STATUS } from "../constants/http.js";

import { getCampaignById } from "../repository/campaign.repository.js";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByRating,
} from "../repository/comment.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { extractMentions } from "../utils/extractMentions.js";
import {
  notifyCommentReceived,
  notifyMention,
} from "./notification.service.js";

const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    map[c._id.toString()] = { ...c.toObject(), replies: [] };
  });

  comments.forEach((c) => {
    if (c.parentId) {
      const parent = map[c.parentId.toString()];
      if (parent) {
        parent.replies.push(map[c._id.toString()]);
      }
    } else {
      roots.push(map[c._id.toString()]);
    }
  });

  return roots;
};

const getRatingFromCampaign = (campaign, ratingId) => {
  return campaign.ratings.find((r) => r._id.toString() === ratingId.toString());
};

const isOrganizer = (campaign, userId) => {
  return campaign.createdBy._id.toString() === userId.toString();
};

const isRatingAuthor = (rating, userId) => {
  return rating.volunteer._id.toString() === userId.toString();
};

const isThreadParticipant = (campaign, rating, userId) => {
  return isOrganizer(campaign, userId) || isRatingAuthor(rating, userId);
};

export const getCommentThreadService = async (campaignId, ratingId, userId) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const rating = getRatingFromCampaign(campaign, ratingId);
  assertOrThrow(rating, HTTP_STATUS.NOT_FOUND, "Rating not found");

  const volunteerRecord = campaign.volunteers.find(
    (v) => v.volunteer._id.toString() === userId.toString(),
  );
  const isVolunteerOfCampaign =
    volunteerRecord?.status === "accepted" &&
    volunteerRecord?.attendanceStatus === "present";

  assertOrThrow(
    isVolunteerOfCampaign || isOrganizer(campaign, userId),
    HTTP_STATUS.FORBIDDEN,
    "You do not have access to this campaign's feedback",
  );

  const comments = await getCommentsByRating(campaignId, ratingId);
  return buildCommentTree(comments);
};

export const addCommentService = async (campaignId, ratingId, userId, data) => {
  const { comment, parentId } = data;

  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const rating = getRatingFromCampaign(campaign, ratingId);
  assertOrThrow(rating, HTTP_STATUS.NOT_FOUND, "Rating not found");

  assertOrThrow(
    isThreadParticipant(campaign, rating, userId),
    HTTP_STATUS.FORBIDDEN,
    "You are not allowed to reply in this thread",
  );

  if (parentId) {
    const parentComment = await getCommentById(parentId);
    assertOrThrow(
      parentComment,
      HTTP_STATUS.NOT_FOUND,
      "Parent comment not found",
    );
    assertOrThrow(
      parentComment.campaign.toString() === campaignId.toString() &&
        parentComment.rating.toString() === ratingId.toString(),
      HTTP_STATUS.BAD_REQUEST,
      "Parent comment does not belong to this thread",
    );
  }

  const mentions = await extractMentions(comment);

  const newComment = await createComment({
    campaign: campaignId,
    rating: ratingId,
    author: userId,
    comment,
    parentId: parentId || null,
    mentions,
  });

  const isAuthorOrganizer = isOrganizer(campaign, userId);
  const otherParticipant = isAuthorOrganizer
    ? rating.volunteer._id
    : campaign.createdBy._id;

  await notifyCommentReceived({
    sender: userId,
    recipient: otherParticipant,
    campaign,
    ratingId,
    commentId: newComment._id,
  });

  for (const mentionedUserId of mentions) {
    if (mentionedUserId.toString() !== otherParticipant.toString()) {
      await notifyMention({
        sender: userId,
        recipient: mentionedUserId,
        campaign,
        ratingId,
        commentId: newComment._id,
      });
    }
  }

  return getCommentById(newComment._id);
};

export const deleteCommentService = async (
  campaignId,
  ratingId,
  commentId,
  userId,
) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const rating = getRatingFromCampaign(campaign, ratingId);
  assertOrThrow(rating, HTTP_STATUS.NOT_FOUND, "Rating not found");

  const comment = await getCommentById(commentId);
  assertOrThrow(comment, HTTP_STATUS.NOT_FOUND, "Comment not found");

  const isAuthor = comment.author._id.toString() === userId.toString();
  assertOrThrow(
    isAuthor || isOrganizer(campaign, userId),
    HTTP_STATUS.FORBIDDEN,
    "You are not allowed to delete this comment",
  );

  await Comment.deleteMany({ parentId: commentId });
  await deleteComment(commentId);

  return { message: "Comment deleted successfully" };
};
