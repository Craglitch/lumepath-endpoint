const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const Group = require("../models/Group");
const auth = require("../middleware/auth");

// Get threads for a specific group
router.get("/:groupId", async (req, res) => {
  try {
    const threads = await Thread.find({ group: req.params.groupId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(threads);
  } catch (err) {
    console.error("GET threads error:", err);
    res.status(500).json({ error: "Failed to load threads" });
  }
});

// Create a new thread
router.post("/:groupId/create", auth, async (req, res) => {
  try {
    const { content, title } = req.body;
    const thread = await Thread.create({
      group: req.params.groupId,
      author: req.user.id,
      title,
      content,
    });
    res.json(thread);
  } catch (err) {
    console.error("CREATE thread error:", err);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// Like / Unlike a thread (toggle)
router.post("/:id/like", auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const idx = thread.likes.findIndex((u) => String(u) === String(req.user.id));
    if (idx === -1) thread.likes.push(req.user.id);
    else thread.likes.splice(idx, 1);

    await thread.save();
    res.json({ likes: thread.likes.length });
  } catch (err) {
    console.error("LIKE thread error:", err);
    res.status(500).json({ error: "Failed to like thread" });
  }
});

// Comment on a thread
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    thread.comments.push({ user: req.user.id, text });
    await thread.save();
    res.json(thread.comments);
  } catch (err) {
    console.error("COMMENT thread error:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;

