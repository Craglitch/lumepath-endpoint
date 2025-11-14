const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const { gTHabits, addTodayHbt } = require('../ctrl/habitCTR')
const auth = require('../middleware/auth');
const router = express.Router();


// Create new habit
router.post(
  '/add',
  auth,
  [body('title').trim().notEmpty().withMessage('Title required')],
  async (req, res) => {
    try{
     const errors = validationResult(req);
     if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
     const { title } = req.body;
     const habit = await addTodayHbt(req.userId, title)
      res.status(201).json(habit);}
    catch (error) {
      res.status(500).json({error: error.message});
    }
  }
);

// Get all habits /api/habits/show
router.get('/show', auth, async (req, res) => {
  try {
    const habits = await gTHabits(req.userId); // ✅ Add await
    res.json(habits); // ✅ Send response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return {
    year: date.getFullYear(),
    week: Math.ceil((days + 1) / 7)
  };
};

const calculateWeeklyStats = async (userId) => {
  // Get all user's habits
  const habits = await Habit.find({ userId });
  
  const weeklyStats = {};
  
  habits.forEach(habit => {
    const habitDate = new Date(habit.date);
    const weekInfo = getWeekNumber(habitDate);
    const weekKey = `${weekInfo.year}-W${weekInfo.week.toString().padStart(2, '0')}`;
    
    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = {
        week: weekKey,
        year: weekInfo.year,
        weekNumber: weekInfo.week,
        completedDays: 0,
        totalDays: 0
      };
    }
    
    weeklyStats[weekKey].totalDays++;
    if (habit.completed) {
      weeklyStats[weekKey].completedDays++;
    }
  });
  
  // Convert to array and calculate percentages
  return Object.values(weeklyStats).map(week => ({
    ...week,
    percentage: Math.round((week.completedDays / week.totalDays) * 100),
    perfectWeek: week.completedDays === week.totalDays
  })).sort((a, b) => b.weekNumber - a.weekNumber); // Most recent first
};

// NEW ROUTE: Get weekly stats
router.get('/weekly-stats', auth, async (req, res) => {
  try {
    const weeklyHistory = await calculateWeeklyStats(req.userId);
    
    res.json({
      success: true,
      history: weeklyHistory.slice(0, 8), // Last 8 weeks
      totalWeeks: weeklyHistory.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
