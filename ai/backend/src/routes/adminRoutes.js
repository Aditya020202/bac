import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  removeReportedProduct,
  banUser,
  getStats
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/products/pending", getPendingProducts);
router.post("/products/:id/approve", approveProduct);
router.post("/products/:id/reject", rejectProduct);
router.delete("/products/:id", removeReportedProduct);
router.post("/users/:userId/ban", banUser);
router.get("/stats", getStats);

export default router;

