const mongoose = require('mongoose');

/* ini ialah untuk section untuk database bagi habits */
const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  streak: { type: Number, default: 0},
  weeklyHistory: [{
    week: String,      // "2024-W10"
    year: Number,      // 2024
    weekNumber: Number, // 10
    completedDays: Number,
    totalDays: { type: Number, default: 7 },
    percentage: Number,
    perfectWeek: Boolean
  }]
});

module.exports = mongoose.model('Habit', habitSchema);

