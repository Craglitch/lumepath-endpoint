const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const auth = require("../middleware/auth");

// Search or list groups (optional ?q=keyword)
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q ? { name: new RegExp(q, "i") } : {};
    const groups = await Group.find(filter).lean();
    res.json(groups);
  } catch (err) {
    console.error("GET groups error:", err);
    res.status(500).json({ error: "Failed to load groups" });
  }
});

// Create a new group
router.post("/create", auth, async (req, res) => {
  try {
    const { name, description, picture } = req.body;
    const group = await Group.create({
      name,
      description,
      picture,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.json(group);
  } catch (err) {
    console.error("CREATE group error:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Join an existing group
router.post("/:id/join", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    const already = group.members.find((m) => String(m) === String(req.user.id));
    if (!already) {
      group.members.push(req.user.id);
      await group.save();
    }
    res.json({ success: true, group });
  } catch (err) {
    console.error("JOIN group error:", err);
    res.status(500).json({ error: "Failed to join group" });
  }
});

// Get a specific group by ID
router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("members", "name email").lean();
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json({ ...group, memberCount: group.members.length });
  } catch (err) {
    console.error("GET group error:", err);
    res.status(500).json({ error: "Failed to load group" });
  }
});

module.exports = router;

