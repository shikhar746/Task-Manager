📦 Prompt 1: Project Setup, Database Schema & Core Logic (Hours 1-5)
Goal: Initialize the project, set up the shared SQLite database, and write/test the core data logic.
Act as an expert Node.js developer. We are building a Task Manager with a CLI and a Web Dashboard that share the same SQLite database.
Tech Stack for this phase: Node.js, npm, better-sqlite3, Jest, bcrypt.
Please guide me through the following steps. Provide the exact terminal commands and the complete code for each file:
Initialization: Commands to run npm init -y and install all required dependencies (better-sqlite3, bcrypt, jest, and dev dependencies).
Database Setup: Create a db.js file using better-sqlite3. It should initialize a tasks.db file and create two tables if they don't exist:
users (id, username, password_hash)
tasks (id, title, priority INTEGER, status TEXT DEFAULT 'pending', created_at)
Core Functions: In db.js, export the following functions:
createUser(username, password) -> hashes password with bcrypt (salt rounds: 10) and inserts user.
authenticateUser(username, password) -> returns user object if valid, else null.
addTask(title, priority) -> inserts and returns the new task.
getTasks(filters) -> accepts an optional object { priority, status } and returns filtered tasks.
completeTask(id) -> updates status to 'completed'.
deleteTask(id) -> deletes the task.
Testing: Create a db.test.js file using Jest. Write tests to verify that tasks can be added, filtered by priority/status, completed, and deleted. Include a test for user creation and authentication.
Provide the code in clear, copy-pasteable blocks. Explain how to run the Jest tests to verify everything works.


💻 Prompt 2: CLI Application Development (Hours 6-10)
Goal: Build the terminal interface using commander and chalk that interacts with the database functions from Phase 1.
Act as an expert Node.js developer. We are continuing the Task Manager project. The database logic (db.js) is already complete and tested. Now we need to build the CLI.
Tech Stack for this phase: commander, chalk, and our existing db.js.
Please guide me through creating a cli.js file (or index.js configured as a bin in package.json). Provide the complete code and terminal commands for:
Setup: Update package.json to include a "bin" entry pointing to our CLI file, and install commander and chalk.
CLI Commands: Implement the following using commander:
task add "<title>" -p <priority>: Adds a task. Priority defaults to 1 if not provided. Print a success message in green using chalk.
task list: Shows all tasks in a formatted table. Use chalk to color-code priorities (e.g., Priority 1 = Red, 2 = Yellow, 3 = Green) and status.
task list -p <priority>: Filters the list by priority.
task list -s <status>: Filters the list by status (e.g., 'pending', 'completed').
task complete <id>: Marks the task as completed. Print a success message.
task delete <id>: Removes the task. Print a success message.
Error Handling: Ensure that if a user tries to complete/delete a non-existent ID, or provides invalid arguments, the CLI outputs a helpful, red-colored error message.
Provide the full code for the CLI file, the updated package.json, and the exact commands to link the CLI globally (or run it via node cli.js) so I can test it in my terminal.


🌐 Prompt 3: Web Server Setup & Authentication (Hours 11-15)
Goal: Set up the Express server, session management, and the Login/Register flow with Tailwind CSS.
Act as an expert Full-Stack Node.js developer. We are now building the Web Dashboard for the Task Manager. The db.js logic is ready.
Tech Stack for this phase: Express, express-session, bcrypt, Plain HTML, Tailwind CSS (via CDN).
Please guide me through creating the server and auth flow. Provide complete code for:
Server Setup: Create server.js. Set up Express, express-session (use a simple secret for now, e.g., 'supersecret'), and serve static files from a public/ directory.
is ready.
Auth Routes:
POST /register: Accepts username/password, uses db.createUser, and redirects to /login.
POST /login: Accepts username/password, uses db.authenticateUser. If successful, save userId in req.session and redirect to /dashboard. If failed, show an error.
GET /logout: Destroys the session and redirects to /login.
Auth Middleware: Create a simple requireAuth middleware that checks req.session.userId. If not present, redirect to /login.
Frontend Pages: Create public/login.html and public/register.html. Style them cleanly using Tailwind CSS (via CDN script tag). Include forms that POST to the respective routes.
Provide the full server.js code, the HTML files, and instructions on how to run the server (node server.js) and test the registration/login flow in the browser.

📊 Prompt 4: Web Dashboard & Task API (Hours 16-20)
Goal: Build the protected dashboard, the REST API for tasks, and connect the frontend to the API using vanilla JavaScript.
Act as an expert Full-Stack Node.js developer. The Express server and auth are working. Now we need to build the main Dashboard and the Task API.
Tech Stack for this phase: Express, vanilla JavaScript (Fetch API), Tailwind CSS (CDN), and our existing db.js.
Please guide me through the following:
Task API Routes (in server.js): All protected by requireAuth middleware.
GET /api/tasks: Accepts optional query params ?priority=X or ?status=Y. Returns JSON array of tasks using db.getTasks.
POST /api/tasks: Accepts JSON { title, priority }. Creates task using db.addTask and returns the new task.
POST /api/tasks/:id/complete: Updates status using db.completeTask.
DELETE /api/tasks/:id: Deletes task using db.deleteTask.
Dashboard Page: Create public/dashboard.html. It must include:
A header with a "Logout" button.
An "Add Task" form (Title input, Priority dropdown, Submit button).
Filter dropdowns for Priority and Status that trigger a re-fetch of the table.
A table displaying: ID, Title, Priority, Status, and Action buttons ("Complete", "Delete").
Frontend Logic: Create public/dashboard.js. Write vanilla JS to:
Fetch and render the tasks on load.
Handle the "Add Task" form submission (prevent default, fetch POST, re-render).
Handle "Complete" and "Delete" button clicks (fetch POST/DELETE, re-render).
Handle filter dropdown changes (fetch with query params, re-render).
Provide the complete updated server.js, dashboard.html, and dashboard.js. Explain how to test the full web flow.

🚀 Prompt 5: CSV Export, Polish, and GitHub Deployment (Hours 21-25)
Goal: Add the CSV export feature, clean up the code, write documentation, and push to GitHub.
Act as an expert Node.js developer. The CLI and Web Dashboard are fully functional. We are in the final phase: adding CSV export, polishing, and preparing for GitHub.
Tech Stack for this phase: csv-writer (or json2csv), npm, git, GitHub.
Please guide me through these final steps with exact code and commands:
CSV Export API: Install a CSV library (e.g., csv-writer). Add a new protected route GET /api/tasks/export in server.js that fetches all tasks for the user and returns them as a downloadable .csv file with headers: ID, Title, Priority, Status, Created At.
Frontend Export Button: Add an "Export to CSV" button to public/dashboard.html and the corresponding fetch logic in dashboard.js to trigger the download.
Code Polish: Review the code. Add basic try/catch error handling to all API routes, returning 500 status codes and console errors if something fails. Ensure the CLI also handles DB errors gracefully.
Documentation: Generate a comprehensive README.md for the project. It must include:
Project Title and Description
Tech Stack used
Installation instructions (npm install)
How to run the CLI (with examples of all commands)
How to run the Web Server and access the dashboard
GitHub Setup: Provide the exact terminal commands to initialize a git repository, create a .gitignore (ignoring node_modules and tasks.db), make the first commit, and push to a new GitHub repository.
Provide all updated files, the new README, and the step-by-step git commands.
