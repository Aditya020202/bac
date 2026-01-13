import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  listProducts,
  markAsSold,
  reportProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  protect,
  upload.array("images", 5),
  createProduct
);
router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  updateProduct
);
router.delete("/:id", protect, deleteProduct);
router.post("/:id/mark-sold", protect, markAsSold);
router.post("/:id/report", protect, reportProduct);

export default router;

