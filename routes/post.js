const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// Create a post
router.post('/create', auth, async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user.id,
      thread: req.body.threadId
    });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts in a thread
router.get('/thread/:threadId', async (req, res) => {
  try {
    const posts = await Post.find({ thread: req.params.threadId }).populate('author', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

