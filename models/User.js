const mongoose = require('mongoose');


/* ini untuk simpan data user  */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

