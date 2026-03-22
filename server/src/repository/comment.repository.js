import Comment from "../models/comment.model.js";

export const createComment = (data) => {
  const comment = new Comment(data);
  return comment.save();
};

export const getCommentById = (id) => {
  return Comment.findById(id).populate(
    "author",
    "firstName lastName profilePic",
  );
};

export const getCommentsByRating = (campaignId, ratingId) => {
  return Comment.find({ campaign: campaignId, rating: ratingId })
    .populate("author", "firstName lastName profilePic")
    .populate("mentions", "firstName lastName")
    .sort({ createdAt: 1 });
};

export const deleteComment = (id) => {
  return Comment.findByIdAndDelete(id);
};

export const deleteCommentsByRating = (campaignId, ratingId) => {
  return Comment.deleteMany({ campaign: campaignId, rating: ratingId });
};

export const deleteCommentsByCampaign = (campaignId) => {
  return Comment.deleteMany({ campaign: campaignId });
};
