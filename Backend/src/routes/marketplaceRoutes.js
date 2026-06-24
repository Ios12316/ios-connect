import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createListing,
  getAllListings,
  getSingleListing,
  deleteListing,
} from "../controllers/marketplaceController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createListing
);

router.get(
  "/",
  authMiddleware,
  getAllListings
);

router.get(
  "/:id",
  authMiddleware,
  getSingleListing
);

router.delete(
  "/:id",
  authMiddleware,
  deleteListing
);

export default router;