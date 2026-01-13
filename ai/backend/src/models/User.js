import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rater: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    college: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    ratingsReceived: [ratingSchema],
    averageRating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.methods.updateAverageRating = function () {
  if (!this.ratingsReceived.length) {
    this.averageRating = 0;
    return;
  }
  const sum = this.ratingsReceived.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = sum / this.ratingsReceived.length;
};

const User = mongoose.model("User", userSchema);

export default User;

