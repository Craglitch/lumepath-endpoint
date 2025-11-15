const Habit = require('../models/Habit');

// day start end
const gTRange = () => { //get today range
  const a = new Date();
  a.setHours(0, 0, 0, 0);
  const x = new Date();
  x.setHours(23, 59, 59, 999);
  return {a, x};
};

// get habit 
const gTHabits = async (userId) =>{
  const {a, x} = gTRange();
  return await Habit.find({
    userId,
    date: {
      $gte: a,
      $lte: x,
    }
  });
};

const addTodayHbt = async (userId, title) => {
  const { a, x } = gTRange();

  const existing = await Habit.findOne({
    userId, title,
    date: {$gte: a, $lte: x}
  });

  if (existing) return existing;

  const habit = new Habit({
    userId,
    title,
    date: new Date()
  });
  await habit.save();
  return habit;
};

module.exports = {
  gTHabits,
  addTodayHbt
}
