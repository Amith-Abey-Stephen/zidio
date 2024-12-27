const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

const checkRole = require('../middleware/roleMiddleware');


// Add a new task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protect task creation for Editors and Admins
router.post('/', checkRole('Editor'), async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a comment to a task
router.post('/:taskId/comments', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user, message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ user, message });
    await task.save();
    res.status(201).json(task.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const io = require('../server').io; // Export io instance from server.js

router.post('/:taskId/comments', async (req, res) => {
  // ... existing code
  io.emit('new-comment', task.comments); // Notify all clients
});


// Get comments for a task
router.get('/:taskId/comments', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
