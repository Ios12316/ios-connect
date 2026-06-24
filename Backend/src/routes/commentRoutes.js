import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createComment,
  getPostComments,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createComment
);

router.get(
  "/:postId",
  authMiddleware,
  getPostComments
);

router.delete(
  "/:id",
  authMiddleware,
  deleteComment
);

export default router;