// routes/posts.js
const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Create post - similar to habits/add
router.post('/create', auth, async (req, res) => {
  try {
    const { content, images, hashtags } = req.body;
    const post = new Post({
      author: req.userId,
      content,
      images: images || [],
      hashtags: hashtags || []
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts - similar to habits/show
router.get('/feed', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username') // Populate author info
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Like/Unlike post
router.put('/like/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.userId;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({ 
      liked: !alreadyLiked, 
      likesCount: post.likes.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Repost
router.post('/repost/:postId', auth, async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.postId);
    if (!originalPost) return res.status(404).json({ error: 'Post not found' });

    const repost = new Post({
      author: req.userId,
      content: req.body.content || '', // Optional comment on repost
      isRepost: true,
      originalPost: originalPost._id,
      hashtags: req.body.hashtags || []
    });

    // Add to original post's reposts
    originalPost.reposts.push(req.userId);
    await originalPost.save();
    await repost.save();

    res.status(201).json(repost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Reply to post
router.post('/reply/:postId', auth, async (req, res) => {
  try {
    const { content, images, hashtags } = req.body;
    const parentPost = await Post.findById(req.params.postId);
    if (!parentPost) return res.status(404).json({ error: 'Post not found' });

    const reply = new Post({
      author: req.userId,
      content,
      images: images || [],
      hashtags: hashtags || [],
      replyTo: parentPost._id
    });

    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get replies for a post
router.get('/replies/:postId', auth, async (req, res) => {
  try {
    const replies = await Post.find({ replyTo: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // export cok error tadi man
