import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import adminRoutes from "./adminRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/admin", adminRoutes);
router.use("/messages", messageRoutes);

export default router;

