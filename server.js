// const express = require('express');
// const session = require('express-session');
// const path = require('path');
// const { createUser, authenticateUser } = require('./db');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Session setup
// app.use(session({
//   secret: 'supersecret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 24 * 60 * 60 * 1000 }
// }));

// // Auth middleware
// function requireAuth(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect('/login.html');
//   }
//   next();
// }

// // Redirect root to login
// app.get('/', (req, res) => {
//   res.redirect('/login.html');
// });

// // Auth routes
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
  
//   if (!username || !password) {
//     return res.status(400).send('Username and password required');
//   }

//   try {
//     createUser(username, password);
//     res.redirect('/login.html');
//   } catch (err) {
//     if (err.message.includes('UNIQUE constraint failed')) {
//       return res.status(400).send('Username already exists');
//     }
//     res.status(500).send('Registration failed');
//   }
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
  
//   if (!username || !password) {
//     return res.status(400).send('Username and password required');
//   }

//   const user = authenticateUser(username, password);
  
//   if (user) {
//     req.session.userId = user.id;
//     req.session.username = user.username;
//     res.redirect('/dashboard.html');
//   } else {
//     res.status(401).send('Invalid username or password');
//   }
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.redirect('/login.html');
// });

// // Protected API routes
// app.get('/api/user', requireAuth, (req, res) => {
//   res.json({ id: req.session.userId, username: req.session.username });
// });

// // Protect dashboard route
// app.get('/dashboard.html', requireAuth);

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
const express = require('express');
const session = require('express-session');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const { createUser, authenticateUser, addTask, getTasks, completeTask, deleteTask } = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
}

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Auth routes
app.post('/register', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send('Username and password required');
    }

    createUser(username, password);
    res.redirect('/login.html');
  } catch (err) {
    console.error('Registration error:', err.message);
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).send('Username already exists');
    }
    res.status(500).send('Registration failed');
  }
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).send('Username and password required');
    }

    const user = authenticateUser(username, password);
    
    if (user) {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard.html');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Login failed');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// User info API
app.get('/api/user', requireAuth, (req, res) => {
  res.json({ id: req.session.userId, username: req.session.username });
});

// Task API routes (protected)
app.get('/api/tasks', requireAuth, (req, res) => {
  try {
    const filters = {};
    if (req.query.priority) filters.priority = parseInt(req.query.priority);
    if (req.query.status) filters.status = req.query.status;
    
    const tasks = getTasks(filters);
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', requireAuth, (req, res) => {
  try {
    const { title, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = addTask(title, priority || 1);
    res.status(201).json(task);
  } catch (err) {
    console.error('Add task error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.post('/api/tasks/:id/complete', requireAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = completeTask(id);
    
    if (success) {
      res.json({ message: 'Task completed' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Complete task error:', err.message);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = deleteTask(id);
    
    if (success) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// CSV Export route
app.get('/api/tasks/export', requireAuth, (req, res) => {
  try {
    const tasks = getTasks({});
    
    const csvStringifier = createCsvWriter({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'priority', title: 'Priority' },
        { id: 'status', title: 'Status' },
        { id: 'created_at', title: 'Created At' }
      ]
    });

    const header = csvStringifier.getHeaderString();
    const records = csvStringifier.stringifyRecords(tasks);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"');
    res.send(header + records);
  } catch (err) {
    console.error('Export error:', err.message);
    res.status(500).json({ error: 'Failed to export tasks' });
  }
});

// Protect dashboard route
app.get('/dashboard.html', requireAuth);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// const express = require('express');
// const session = require('express-session');
// const path = require('path');
// const { createUser, authenticateUser, addTask, getTasks, completeTask, deleteTask } = require('./db');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Session setup
// app.use(session({
//   secret: 'supersecret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 24 * 60 * 60 * 1000 }
// }));

// // Auth middleware
// function requireAuth(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect('/login.html');
//   }
//   next();
// }

// // Redirect root to login
// app.get('/', (req, res) => {
//   res.redirect('/login.html');
// });

// // Auth routes
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
  
//   if (!username || !password) {
//     return res.status(400).send('Username and password required');
//   }

//   try {
//     createUser(username, password);
//     res.redirect('/login.html');
//   } catch (err) {
//     if (err.message.includes('UNIQUE constraint failed')) {
//       return res.status(400).send('Username already exists');
//     }
//     res.status(500).send('Registration failed');
//   }
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
  
//   if (!username || !password) {
//     return res.status(400).send('Username and password required');
//   }

//   const user = authenticateUser(username, password);
  
//   if (user) {
//     req.session.userId = user.id;
//     req.session.username = user.username;
//     res.redirect('/dashboard.html');
//   } else {
//     res.status(401).send('Invalid username or password');
//   }
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.redirect('/login.html');
// });

// // User info API
// app.get('/api/user', requireAuth, (req, res) => {
//   res.json({ id: req.session.userId, username: req.session.username });
// });

// // Task API routes (protected)
// app.get('/api/tasks', requireAuth, (req, res) => {
//   const filters = {};
//   if (req.query.priority) filters.priority = parseInt(req.query.priority);
//   if (req.query.status) filters.status = req.query.status;
  
//   const tasks = getTasks(filters);
//   res.json(tasks);
// });

// app.post('/api/tasks', requireAuth, (req, res) => {
//   const { title, priority } = req.body;
  
//   if (!title) {
//     return res.status(400).json({ error: 'Title is required' });
//   }
  
//   const task = addTask(title, priority || 1);
//   res.status(201).json(task);
// });

// app.post('/api/tasks/:id/complete', requireAuth, (req, res) => {
//   const id = parseInt(req.params.id);
//   const success = completeTask(id);
  
//   if (success) {
//     res.json({ message: 'Task completed' });
//   } else {
//     res.status(404).json({ error: 'Task not found' });
//   }
// });

// app.delete('/api/tasks/:id', requireAuth, (req, res) => {
//   const id = parseInt(req.params.id);
//   const success = deleteTask(id);
  
//   if (success) {
//     res.json({ message: 'Task deleted' });
//   } else {
//     res.status(404).json({ error: 'Task not found' });
//   }
// });

// // Protect dashboard route
// app.get('/dashboard.html', requireAuth);

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });