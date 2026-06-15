const db = require('./db');

// Clean up before each test
beforeEach(() => {
  const Database = require('better-sqlite3');
  const testDb = new Database('tasks.db');
  testDb.exec('DELETE FROM tasks; DELETE FROM users;');
  testDb.close();
});

describe('User Management', () => {
  test('createUser creates a user with hashed password', () => {
    const user = db.createUser('alice', 'secret123');
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('alice');
  });

  test('authenticateUser returns user on valid credentials', () => {
    db.createUser('bob', 'password456');
    const user = db.authenticateUser('bob', 'password456');
    expect(user).toBeTruthy();
    expect(user.username).toBe('bob');
  });

  test('authenticateUser returns null on invalid password', () => {
    db.createUser('charlie', 'mypass');
    const user = db.authenticateUser('charlie', 'wrongpass');
    expect(user).toBeNull();
  });

  test('authenticateUser returns null for non-existent user', () => {
    const user = db.authenticateUser('nobody', 'nopass');
    expect(user).toBeNull();
  });
});

describe('Task CRUD', () => {
  test('addTask creates a task with default status', () => {
    const task = db.addTask('Buy groceries', 2);
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Buy groceries');
    expect(task.priority).toBe(2);
    expect(task.status).toBe('pending');
  });

  test('getTasks returns all tasks when no filters', () => {
    db.addTask('Task A', 1);
    db.addTask('Task B', 2);
    const tasks = db.getTasks();
    expect(tasks.length).toBe(2);
  });

  test('getTasks filters by priority', () => {
    db.addTask('Low priority', 1);
    db.addTask('High priority', 3);
    const highTasks = db.getTasks({ priority: 3 });
    expect(highTasks.length).toBe(1);
    expect(highTasks[0].title).toBe('High priority');
  });

  test('getTasks filters by status', () => {
    const task = db.addTask('Complete me', 1);
    db.completeTask(task.id);
    const completed = db.getTasks({ status: 'completed' });
    expect(completed.length).toBe(1);
    expect(completed[0].status).toBe('completed');
  });

  test('completeTask updates status to completed', () => {
    const task = db.addTask('Finish project', 2);
    const success = db.completeTask(task.id);
    expect(success).toBe(true);
    
    const tasks = db.getTasks({ status: 'completed' });
    expect(tasks[0].title).toBe('Finish project');
  });

  test('completeTask returns false for non-existent id', () => {
    const success = db.completeTask(99999);
    expect(success).toBe(false);
  });

  test('deleteTask removes a task', () => {
    const task = db.addTask('Delete me', 1);
    const success = db.deleteTask(task.id);
    expect(success).toBe(true);
    
    const tasks = db.getTasks();
    expect(tasks.length).toBe(0);
  });

  test('deleteTask returns false for non-existent id', () => {
    const success = db.deleteTask(99999);
    expect(success).toBe(false);
  });

  test('combined filter by priority and status', () => {
    db.addTask('Low pending', 1);
    db.addTask('High pending', 3);
    const highCompleted = db.addTask('High completed', 3);
    db.completeTask(highCompleted.id);
    
    const result = db.getTasks({ priority: 3, status: 'completed' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('High completed');
  });
});