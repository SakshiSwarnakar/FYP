import { z } from "zod";

const baseUserFields = {
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50)
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50)
    .trim(),

  email: z.string().email("Invalid email format").toLowerCase().trim(),

  phoneNumber: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number format")
    .trim(),

  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain upper, lower, and a number"
    ),
};

export const registerVolunteerSchema = z.object({
  ...baseUserFields,

  skills: z.array(z.string().trim().min(1)).max(20).default([]),

  interests: z.array(z.string().trim().min(1)).max(20).default([]),
});

export const registerOrganizerSchema = z.object({
  ...baseUserFields,

  role: z.literal("ADMIN"),

  organizationName: z.string().min(2).max(100).trim(),

  organizationDescription: z.string().max(500).optional().nullable(),

  organizationType: z
    .enum(["NGO", "Charity", "Club", "Community", "Other"])
    .optional()
    .nullable(),

  organizationPhone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,20}$/)
    .optional()
    .nullable(),

  organizationEmail: z
    .string()
    .email("Invalid organization email")
    .toLowerCase()
    .trim(),

  organizationLocation: z
    .object({
      address: z.string().optional().nullable(),
      city: z.string().min(2).optional().nullable(),
      state: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});
