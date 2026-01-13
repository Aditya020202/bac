import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getMyListings,
  getPurchaseHistory,
  toggleWishlist,
  getWishlist,
  addRecentlyViewed,
  getRecentlyViewed,
  rateSeller
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.get("/me/listings", protect, getMyListings);
router.get("/me/purchases", protect, getPurchaseHistory);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);
router.post("/recently-viewed/:productId", protect, addRecentlyViewed);
router.get("/recently-viewed", protect, getRecentlyViewed);
router.post("/rate/:sellerId", protect, rateSeller);

export default router;

