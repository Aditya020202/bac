import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: { type: String, enum: ["new", "like-new", "good", "fair"], required: true },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "sold"],
      default: "pending"
    },
    isReported: { type: Boolean, default: false },
    reports: [
      {
        reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

