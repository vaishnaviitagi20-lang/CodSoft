const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
router.get("/conversations", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "name email role")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("GET Conversations Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
router.get("/:conversationId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("GET Messages Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
router.post("/", protect, async (req, res) => {
  const { recipientId, content, conversationId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Message content is required" });
  }

  try {
    let convId = conversationId;

    // If no conversationId, check if one exists or create it
    if (!convId) {
      if (!recipientId) {
        return res.status(400).json({ message: "Recipient ID is required" });
      }

      let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, recipientId],
        });
      }
      convId = conversation._id;
    }

    const message = await Message.create({
      conversationId: convId,
      sender: req.user._id,
      content,
    });

    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    const populatedMessage = await Message.findById(message._id).populate("sender", "name email");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("POST Message Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Find or create conversation with a user
// @route   POST /api/messages/start
// @access  Private
router.post("/start", protect, async (req, res) => {
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(400).json({ message: "Recipient ID is required" });
  }

  if (recipientId.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "Cannot start a conversation with yourself" });
  }

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error("POST Start Conversation Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

