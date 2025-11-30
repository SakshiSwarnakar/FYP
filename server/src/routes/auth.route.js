import express from "express";

import {
  forgotPassword,
  getMe,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerOrganizer,
  registerVolunteer,
  resetPassword,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerOrganizerSchema,
  registerVolunteerSchema,
} from "../validations/auth.validation.js";

import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/register/volunteer",
  upload.single("profilePic"),
  validate(registerVolunteerSchema),
  registerVolunteer
);

router.post(
  "/register/organizer",
  upload.single("organizationLogo"),
  validate(registerOrganizerSchema),
  registerOrganizer
);

router.post("/login", validate(loginSchema), loginUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetToken", resetPassword);

router.post("/logout", requireAuth, logOutUser);

router.get("/me", requireAuth, getMe);

export default router;
