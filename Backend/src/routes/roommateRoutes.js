import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoommatePost,
  getAllRoommatePosts,
  markRoommateFound,
  deleteRoommatePost,
} from "../controllers/roommateController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createRoommatePost
);

router.get(
  "/",
  authMiddleware,
  getAllRoommatePosts
);

router.put(
  "/:id/found",
  authMiddleware,
  markRoommateFound
);

router.delete(
  "/:id",
  authMiddleware,
  deleteRoommatePost
);

export default router;