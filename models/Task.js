const mongoose = require('mongoose');


/*  
 *  ini untuk data bagi task organizer bagi user 
 *  tolong jangan ubah suai apa yang ada disini please
 */
const taskScheme = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true},
    description: { type: String, required: false},
    completed: { type: Boolean, default: false},
    date: { type: Date, default: Date.now } 

});

module.exports = mongoose.model("Task", taskScheme);
