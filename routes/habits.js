const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');
const router = express.Router();

// Create new habit
router.post(
  '/add',
  auth,
  [body('title').trim().notEmpty().withMessage('Title required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title } = req.body;
    const habit = new Habit({ userId: req.userId, title });
    await habit.save();
    res.status(201).json(habit);
  }
);

// Get all habits /api/habits/show
router.get('/show', auth, async (req, res) => {
  const habits = await Habit.find({ userId: req.userId });
  res.json(habits);
});

// Mark as completed
router.put('/done/:id', auth, async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { completed: true },
    { new: true }
  );
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json(habit);
});


// server/routes/habits.js
router.get("/summary", auth, async (req, res) => {
  const total = await Habit.countDocuments({ userId: req.userId });
  const done = await Habit.countDocuments({ userId: req.userId, completed: true });
  const percent = total ? Math.round((done / total) * 100) : 0;
  res.json({ total, done, percent });
});

module.exports = router;