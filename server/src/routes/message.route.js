import express from "express";
import {
  getConversations,
  getMessages,
  getOrCreateConversation,
  uploadAttachment,
} from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { getOrCreateConversationSchema } from "../validations/message.validaton.js";

const router = express.Router();

router.use(requireAuth);

router.post(
  "/conversation",
  validate(getOrCreateConversationSchema),
  getOrCreateConversation,
);

router.get("/conversations", getConversations);

router.get("/conversation/:conversationId/messages", getMessages);

router.post(
  "/conversation/:conversationId/attachment",
  upload.single("file"),
  uploadAttachment,
);

export default router;
