
# 📝 TodoApp

A simple and powerful **Task Management Application** built with Node.js, Express.js and EJS. Manage your tasks efficiently with features like task creation, updates, file imports and exports.

---

## ✨ Features

- **🗂️ Task Management**
  - Create, update, delete and view tasks.
  - Mark tasks as ✅ completed or ❌ pending.

- **👤 User-Specific Data**
  - Store tasks per user in JSON files.
  - Retrieve and manage tasks based on username.

- **📁 File Import/Export**
  - Import tasks via JSON file uploads.
  - Export your tasks as JSON files.

- **⚠️ Error Handling**
  - Custom error pages for seamless user experience.

- **🎨 Interactive Frontend**
  - Stylish UI with modular CSS files.

- **🌐 Server-Side Rendering**
  - EJS templates for rendering dynamic web pages.

---

## 🛠️ Project Structure

```plaintext
todoapp/
├── app.js               # Main server file
├── package.json         # Project metadata and dependencies
├── public/              # Static assets (CSS, JS, HTML)
├── routes/              # API route handlers
│   ├── tasksRoutes.js   # Task management routes
│   └── advanceRoute.js  # Advanced features (import/export)
├── views/               # EJS templates
└── data/                # User-specific task storage (JSON files)
```

---

## 🚀 Getting Started

### Prerequisites
- Install [Node.js](https://nodejs.org) and npm.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/lucklesssabbir/todoapp.git
   ```
2. Navigate to the project folder:
   ```bash
   cd todoapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start the server:
   ```bash
   npm start
   ```
   Or, for development with live reload:
   ```bash
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3012`.

---

## 🛠️ API Endpoints

### Task Routes
- **`PUT /updateTask`**: Update the status of a task.
- Other CRUD operations dynamically handled via `tasksRoutes.js`.

### Advanced Routes
- File import/export functionality through `advanceRoute.js`.

---

## 🧑‍💻 Contributing

We ❤️ contributions! Feel free to fork this repo and submit pull requests. Ensure you follow the coding standards and add necessary tests for your changes.

---

## 📄 License

null

---

### Author
Developed by **MD Sabbir Hossen**.
