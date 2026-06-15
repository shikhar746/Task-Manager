const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('tasks.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function createUser(username, password) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
  const result = stmt.run(username, passwordHash);
  return { id: result.lastInsertRowid, username };
}
       
function authenticateUser(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);
  if (!user) return null;
  
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return null;
  
  return { id: user.id, username: user.username };
}

function addTask(title, priority = 1) {
  const stmt = db.prepare('INSERT INTO tasks (title, priority) VALUES (?, ?)');
  const result = stmt.run(title, priority);
  return { 
    id: result.lastInsertRowid, 
    title, 
    priority, 
    status: 'pending', 
    created_at: new Date().toISOString() 
  };
}

function getTasks(filters = {}) {//filters are optional but if we hard code them there will be errors coz somethings might not be there so we will use filters as an object and we will check if the filters are there or not and then we will add them to the query
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (filters.priority !== undefined) {
    query += ' AND priority = ?';
    params.push(filters.priority);
  }
  
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function completeTask(id) {
  const stmt = db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
  createUser,
  authenticateUser,
  addTask,
  getTasks,
  completeTask,
  deleteTask
};