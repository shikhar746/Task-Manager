# PROJECT CONTEXT: Task Manager CLI + Web Dashboard

## 1. Core Goal
Build a task manager with a CLI and Web Dashboard sharing a single SQLite database.

## 2. Strict Tech Stack (DO NOT DEVIATE)
- Runtime: Node.js
- Database: `better-sqlite3` (File: `tasks.db`)
- CLI: `commander`, `chalk`
- Web Backend: `Express`, `express-session`, `bcrypt`
- Web Frontend: Plain HTML, Tailwind CSS (CDN), Vanilla JS (Fetch API)
- Testing: `Jest`

## 3. Current Architecture & File Structure
- `db.js`: Exports `createUser`, `authenticateUser`, `addTask`, `getTasks(filters)`, `completeTask(id)`, `deleteTask(id)`.
- `cli.js`: Handles terminal commands. Imports `db.js`.
- `server.js`: Express server. Handles auth sessions and `/api/*` routes. Imports `db.js`.
- `public/`: Contains `login.html`, `register.html`, `dashboard.html`, `dashboard.js`.

## 4. Strict Rules for AI
1. ALWAYS use the exact function names listed in `db.js` above. Do not invent new database functions.
2. Keep frontend vanilla (no React/Vue). Use Tailwind via CDN.
3. If you need to modify an existing file, output the COMPLETE updated file, not just snippets.
4. Assume I am using free tiers: keep responses concise and focused only on the requested task.

## 5. Current Phase Status
[UPDATE THIS LINE BEFORE EVERY PROMPT, e.g., "Phase 1 Complete. Starting Phase 2: Building cli.js"]