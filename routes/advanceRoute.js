const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
router.use(express.json());

router.use(express.urlencoded({ extended: true })); // Parses form data
// File storage path
const dataPath = (username) =>
  path.join(__dirname, `../data/${username}/tasks.json`);

// Multer setup for JSON file upload
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed.'));
    }
  },
});

// Helper function to read/write JSON file
const readTasks = (username) => {
  const filePath = dataPath(username);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeTasks = (username, tasks) => {
  const filePath = dataPath(username);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Route: /editsave
router.post('/editsave', (req, res) => {
  const { id, headline, status, details, username } = req.body;

  if (!id || !headline || !status || !details || !username) {
    return res.status(400).send('Invalid request. Missing required fields.');
  }

  const tasks = readTasks(username);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).send('Task not found.');
  }

  tasks[taskIndex] = { ...tasks[taskIndex], headline, status, details };
  writeTasks(username, tasks);

  res.status(200).send('Task updated successfully.');
});

// Route: /download
router.get('/download', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Invalid request. Missing username.');
  }

  const filePath = dataPath(username);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('No tasks found for this user.');
  }

  res.download(filePath, `${username}-tasks.json`);
});

// Route: /createnew
router.post('/createnew', (req, res) => {
  const { headline, status, details, username } = req.body;

  if (!headline || !status || !details || !username) {
    return res.status(400).send('Invalid request. Missing required fields.');
  }

  const newTask = {
    id: `${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    headline,
    details,
    status,
    createdAt: new Date().toISOString(),
  };

  const tasks = readTasks(username);
  tasks.push(newTask);
  writeTasks(username, tasks);

  res.status(201).send('Task created successfully.');
});

// Route: /upload
router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // Should log file metadata
  console.log(req.body); // Should log { username: '...' }
  const { username } = req.query;
  // let username = 'a';
  if (!username) {
    return res.status(400).send('Invalid request. Missing username.');
  }

  const filePath = req.file.path;

  try {
    const uploadedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!Array.isArray(uploadedData)) {
      throw new Error('Uploaded JSON must be an array.');
    }

    uploadedData.forEach((task, index) => {
      if (
        !task.id ||
        !task.headline ||
        !task.details ||
        !['done', 'not done', 'not-done'].includes(task.status) ||
        !task.createdAt
      ) {
        console.log(
          task.id +
            task.headline +
            task.details +
            ['done', 'not done', 'not-done'].includes(task.status) +
            +task.createdAt
        );
        throw new Error(`Invalid task format at index ${index + 1}.`);
      }
    });

    writeTasks(username, uploadedData);

    res.status(200).send('Tasks imported successfully.');
  } catch (error) {
    res.status(400).send(`Error in processing uploaded file: ${error.message}`);
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file: ${err.message}`);
    }
  }
});

module.exports = router;
