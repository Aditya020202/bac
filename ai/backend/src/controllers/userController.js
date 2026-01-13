import User from "../models/User.js";
import Product from "../models/Product.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      averageRating: user.averageRating
    });
  } catch (err) {
    next(err);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort("-createdAt");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getPurchaseHistory = async (req, res, next) => {
  try {
    const products = await Product.find({ buyers: req.user.id }).sort("-updatedAt");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    const exists = user.wishlist.find((id) => id.toString() === productId);
    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

export const addRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    user.recentlyViewed = user.recentlyViewed.filter(
      (id) => id.toString() !== productId
    );
    user.recentlyViewed.unshift(productId);
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    await user.save();
    res.json(user.recentlyViewed);
  } catch (err) {
    next(err);
  }
};

export const getRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("recentlyViewed");
    res.json(user.recentlyViewed);
  } catch (err) {
    next(err);
  }
};

export const rateSeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.ratingsReceived.push({
      rater: req.user.id,
      rating,
      comment
    });
    seller.updateAverageRating();
    await seller.save();

    res.json({ averageRating: seller.averageRating, ratings: seller.ratingsReceived });
  } catch (err) {
    next(err);
  }
};

