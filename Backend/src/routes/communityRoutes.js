import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCommunityPost,
  getCommunityFeed,
  deleteCommunityPost,
} from "../controllers/communityController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createCommunityPost
);

router.get(
  "/feed",
  authMiddleware,
  getCommunityFeed
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCommunityPost
);

export default router;