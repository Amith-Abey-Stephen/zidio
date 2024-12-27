const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  comments: [
    {
      user: { type: String, required: true }, // Username of the commenter
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],

}, { timestamps: true });


module.exports = mongoose.model('Task', taskSchema);
