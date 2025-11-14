const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Create new task - buat task baru 
router.post(
  '/add', // ini api nya /api/task/add untuk buat task baru
  auth,
  // untuk masukan title
  [body('title').trim().notEmpty().withMessage('Title required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, description } = req.body;
    const task = new Task({ userId: req.userId, title, description });
    await task.save();
    res.status(201).json(task);
  }
);

// Get all task /api/task/show
router.get('/show', auth, async (req, res) => {
  const task = await Task.find({ userId: req.userId });
  res.json(task);
});

// Mark as completed /api/task/done
router.put('/done/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { completed: true },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// server/routes/tasks.js
router.get("/summary", auth, async (req, res) => {
  const total = await Task.countDocuments({ userId: req.userId });
  const done = await Task.countDocuments({ userId: req.userId, completed: true });
  const percent = total ? Math.round((done / total) * 100) : 0;
  res.json({ total, done, percent });
});

module.exports = router;

