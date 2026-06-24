import express from "express";
import { getCommunityMembers } from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/community-members",
  authMiddleware,
  getCommunityMembers
);

export default router;