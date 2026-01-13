import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

