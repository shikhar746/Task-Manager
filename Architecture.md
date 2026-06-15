task-manager/
│
├── node_modules/          # Created automatically by npm
├── public/                # Web frontend files
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── dashboard.js       # Frontend logic (Fetch API)
│
├── db.js                  # SHARED: Database setup & functions (Phase 1)
├── db.test.js             # SHARED: Jest tests for database (Phase 1)
├── cli.js                 # CLI: Terminal app entry point (Phase 2)
├── server.js              # WEB: Express server & API routes (Phase 3 & 4)
│
├── package.json           # Project config & dependencies
├── .gitignore             # Ignores node_modules, tasks.db, .env
└── README.md              # Documentation (Phase 5)


terminal commands
# Link CLI globally (run once from project root)
npm link

# Or run without linking
node cli.js add "Buy milk" -p 2
node cli.js list
node cli.js complete 1

# After linking, use the 'task' command globally:
task add "Buy milk" -p 2
task add "Write report" -p 3
task add "Check email" -p 1

task list
task list -p 3
task list -s completed
task list -p 2 -s pending

task complete 1
task delete 2

# Test error handling
task complete 99999
task add "Test" -p 5
task list -s invalid

# 1. Start server
node server.js

# 2. Open browser
# http://localhost:3000/

# 3. Register a new account at /register.html
# 4. Login redirects to /dashboard.html
# 5. Test dashboard features:
#    - Add tasks with different priorities
#    - Use priority/status filters
#    - Click "Complete" to mark done
#    - Click "Delete" to remove
#    - Logout and verify redirect to login