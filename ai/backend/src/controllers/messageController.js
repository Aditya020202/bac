import Message from "../models/Message.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { productId, receiverId, content } = req.body;
    const message = await Message.create({
      product: productId,
      sender: req.user.id,
      receiver: receiverId,
      content
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const { productId, otherUserId } = req.query;
    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    }).sort("createdAt");
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

