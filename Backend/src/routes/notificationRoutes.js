import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.put(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

export default router;