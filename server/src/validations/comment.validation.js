import { z } from "zod";

export const addCommentSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot exceed 500 characters"),

  parentId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "parentId must be a valid MongoDB ObjectId")
    .nullable()
    .optional(),
});
