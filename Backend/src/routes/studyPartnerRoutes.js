import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createStudyPartnerPost,
  getAllStudyPartnerPosts,
  closeStudyPartnerPost,
  deleteStudyPartnerPost,
} from "../controllers/studyPartnerController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createStudyPartnerPost
);

router.get(
  "/",
  authMiddleware,
  getAllStudyPartnerPosts
);

router.put(
  "/:id/close",
  authMiddleware,
  closeStudyPartnerPost
);

router.delete(
  "/:id",
  authMiddleware,
  deleteStudyPartnerPost
);

export default router;