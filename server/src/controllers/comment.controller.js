import {
  addCommentService,
  deleteCommentService,
  getCommentThreadService,
} from "../services/comment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const getCommentThread = asyncHandler(async (req, res) => {
  const { id: campaignId, ratingId } = req.params;
  const userId = req.user.id;

  const thread = await getCommentThreadService(campaignId, ratingId, userId);
  return success(res, "Comment thread fetched successfully", thread);
});

export const addComment = asyncHandler(async (req, res) => {
  const { id: campaignId, ratingId } = req.params;
  const userId = req.user.id;

  const comment = await addCommentService(
    campaignId,
    ratingId,
    userId,
    req.body,
  );
  return success(res, "Comment added successfully", comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id: campaignId, ratingId, commentId } = req.params;
  const userId = req.user.id;

  const result = await deleteCommentService(
    campaignId,
    ratingId,
    commentId,
    userId,
  );
  return success(res, "Comment deleted successfully", result);
});
