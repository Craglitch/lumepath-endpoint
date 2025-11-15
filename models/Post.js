// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, maxlength: 280 }, // X-style limit
  images: [{ type: String }], // Array of image URLs
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // For replies
  hashtags: [String],
  isRepost: { type: Boolean, default: false },
  originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } // For reposts
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
