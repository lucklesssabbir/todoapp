const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper function to get tasks file path
const getTasksFilePath = (username) =>
  path.join(__dirname, '..', 'data', username, 'tasks.json');

// Update task status
router.put('/updateTask', (req, res) => {
  const { username, id, status } = req.body;

  if (!username || !id || !status) {
    return res.status(400).json({ message: 'Invalid request data.' });
  }

  const tasksFile = getTasksFilePath(username);
  if (!fs.existsSync(tasksFile)) {
    return res.status(404).json({ message: 'Tasks file not found.' });
  }

  const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.status = status;
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));

  res.json({ message: 'Task updated successfully.' });
});

// Get specific task for editing
router.get('/getTask', (req, res) => {
  const { username, id } = req.query;

  if (!username || !id) {
    return res.redirect('/');
  }

  const tasksFile = getTasksFilePath(username);
  if (!fs.existsSync(tasksFile)) {
    return res.redirect('/');
  }

  const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.redirect('/');
  }

  res.render('getTask', { username, task });
});

// Delete a task
router.delete('/deleteTask', (req, res) => {
  const { username, id } = req.body;

  if (!username || !id) {
    return res.status(400).json({ message: 'Invalid request data.' });
  }

  const tasksFile = getTasksFilePath(username);
  if (!fs.existsSync(tasksFile)) {
    return res.status(404).json({ message: 'Tasks file not found.' });
  }

  let tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  tasks = tasks.filter((task) => task.id !== id);

  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));

  res.json({ message: 'Task deleted successfully.' });
});

// Export tasks
router.get('/export', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.redirect('/');
  }

  const tasksFile = getTasksFilePath(username);
  if (!fs.existsSync(tasksFile)) {
    return res.redirect('/');
  }

  const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  res.render('export', { username, tasks });
});

// Import tasks
router.get('/import', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.redirect('/');
  }

  res.render('import', { username });
});

// New task creation
router.get('/new', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.redirect('/');
  }

  res.render('new', { username });
});

module.exports = router;
