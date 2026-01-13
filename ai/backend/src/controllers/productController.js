import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendEmail } from "../config/email.js";
import { itemSoldTemplate } from "../utils/emailTemplates.js";

export const createProduct = async (req, res, next) => {
  try {
    const { title, price, category, condition, description, isDraft } = req.body;
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const product = await Product.create({
      title,
      price,
      category,
      condition,
      description,
      images,
      seller: req.user.id,
      college: req.user.college,
      status: isDraft ? "draft" : "pending"
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, price, category, condition, description, isDraft } = req.body;
    if (title) product.title = title;
    if (price) product.price = price;
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (description) product.description = description;
    if (typeof isDraft !== "undefined") {
      product.status = isDraft ? "draft" : "pending";
    }

    if (req.files && req.files.length) {
      product.images = [...product.images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    await product.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name college averageRating");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category,
      condition,
      minPrice,
      maxPrice,
      college
    } = req.query;

    const filter = { status: "approved" };

    if (college) {
      filter.college = college;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .populate("seller", "name averageRating"),
      Product.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

export const markAsSold = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { buyerId } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    product.status = "sold";
    if (buyerId && !product.buyers.includes(buyerId)) {
      product.buyers.push(buyerId);
    }
    await product.save();

    const seller = await User.findById(product.seller);
    if (seller) {
      await sendEmail({
        to: seller.email,
        subject: "Item marked as sold",
        html: itemSoldTemplate(product)
      });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const reportProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isReported = true;
    product.reports.push({
      reporter: req.user.id,
      reason
    });
    await product.save();

    res.json({ message: "Reported" });
  } catch (err) {
    next(err);
  }
};

