import User from "../models/User.js";
import Product from "../models/Product.js";
import { sendEmail } from "../config/email.js";
import { productApprovedTemplate } from "../utils/emailTemplates.js";

export const getPendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: "pending" }).populate(
      "seller",
      "name email college"
    );
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "email"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "approved";
    await product.save();

    if (product.seller?.email) {
      await sendEmail({
        to: product.seller.email,
        subject: "Your product has been approved",
        html: productApprovedTemplate(product)
      });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const rejectProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "rejected";
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const removeReportedProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isBanned = true;
    await user.save();
    res.json({ message: "User banned" });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [usersByCollege, productsByCollege] = await Promise.all([
      User.aggregate([
        { $match: { role: "student" } },
        { $group: { _id: "$college", count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $group: { _id: "$college", total: { $sum: 1 } } }
      ])
    ]);

    res.json({ usersByCollege, productsByCollege });
  } catch (err) {
    next(err);
  }
};

