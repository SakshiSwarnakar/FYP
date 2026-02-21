import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title is too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),

  category: z.enum(["Health", "Education", "Environment", "Social Work"], {
    errorMap: () => ({ message: "Invalid campaign category" }),
  }),

  location: z.string().min(2, "Location is required"),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  createdBy: z.string({
    required_error: "Creator (createdBy) is required",
  }),
});

export const updateCampaignSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),

  category: z
    .enum(["Health", "Education", "Environment", "Social Work"])
    .optional(),

  location: z.string().optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  createdBy: z.string({
    required_error: "Creator (createdBy) is required",
  }),
});

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED"], {
    errorMap: () => ({ message: "Invalid campaign status" }),
  }),
});

export const ratingSchema = z.object({
  volunteer: z.string({
    required_error: "Volunteer ID is required",
  }),

  rating: z
    .number({
      required_error: "Rating is required",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z.string().optional(),
});

export const addVolunteerSchema = z.object({
  volunteerRegId: z.string({
    required_error: "Volunteer registration ID is required",
  }),
});
