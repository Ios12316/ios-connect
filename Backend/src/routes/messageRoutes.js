import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendMessage,
  getConversation, getMyChats
} from "../controllers/messageController.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

router.get(
  "/conversation/:userId",
  authMiddleware,
  getConversation
);

router.get(
  "/my-chats",
  authMiddleware,
  getMyChats
);

export default router;