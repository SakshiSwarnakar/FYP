import userModel from "../models/user.model.js";

export const extractMentions = async (comment) => {
  if (!comment) return [];

  const mentionMatches = comment.match(/@([a-zA-Z]+)/g) || [];

  if (mentionMatches.length === 0) return [];

  const fullNames = mentionMatches.map((m) => m.slice(1).toLowerCase());

  const users = await userModel
    .find({
      $or: fullNames.map((name) => ({
        $expr: {
          $eq: [{ $toLower: { $concat: ["$firstName", "$lastName"] } }, name],
        },
      })),
    })
    .select("_id");

  return users.map((u) => u._id);
};
