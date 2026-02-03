import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", requireAuth, getUserProfile);

router.put(
  "/profile",
  requireAuth,
  upload.single("profilePic"),
  updateUserProfile
);

export default router;
