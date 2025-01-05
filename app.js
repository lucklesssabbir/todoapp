const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const multer = require('multer');
const port = 3012;
const advanceRoute = require('./routes/advanceRoute');

const tasksRoutes = require('./routes/tasksRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

app.post('/sync', (req, res) => {
  const { username } = req.body;

  if (!username || !/^[a-zA-Z]+$/.test(username)) {
    return res
      .status(400)
      .json({ message: 'Invalid username. Only letters are allowed.' });
  }

  const userDir = path.join(dataDir, username);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const tasksFile = path.join(userDir, 'tasks.json');
  if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
  }

  res.status(200).json({ message: 'User synced successfully!' });
});

///////////     task handler    //////

app.get('/tasks', (req, res) => {
  const username = req.query.username;

  if (!username || !/^[a-zA-Z]+$/.test(username)) {
    return res.redirect('/');
  }

  const tasksFile = path.join(__dirname, 'data', username, 'tasks.json');

  if (fs.existsSync(tasksFile)) {
    const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
    res.render('tasks', { username, tasks });
  } else {
    return res.redirect('/');
  }
});
app.use('/', tasksRoutes);
app.use(advanceRoute);
// app.use((req, res) => {
//   res.status(404).render('error');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
