import Message from "../models/Message.js";
import User from "../models/userModel.js";
import Notification from "../models/Notification.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    res.status(201).json({
      message,
    });

    if (receiverId.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: receiverId,
        sender: req.user._id,
        type: "message",
        message: "Sent you a message",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: req.params.userId,
        },
        {
          sender: req.params.userId,
          receiver: req.user._id,
        },
      ],
    })
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyChats = async (req, res) => {
  try {

    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "fullName profilePicture")
      .populate("receiver", "fullName profilePicture")
      .sort({ createdAt: -1 });

    const chatsMap = new Map();

    messages.forEach((message) => {

      const otherUser =
        message.sender._id.toString() === userId.toString()
          ? message.receiver
          : message.sender;

      if (!chatsMap.has(otherUser._id.toString())) {
        chatsMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: message.content,
          lastMessageAt: message.createdAt,
        });
      }
    });

    const chats = Array.from(chatsMap.values());

    res.status(200).json({
      count: chats.length,
      chats,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};