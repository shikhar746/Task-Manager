#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { addTask, getTasks, completeTask, deleteTask } = require('./db');

const program = new Command();

program
  .name('task')
  .description('Task Manager CLI')// in bash task --help to get the description of the cli
  .version('1.0.0');// in bash task --version to get the version of the cli

// Add task
program
  .command('add <title>') // allows task add "Buy groceries" -p 2 to add a task with title "Buy groceries" and priority 2
  .description('Add a new task')
  .option('-p, --priority <number>', 'task priority (1-3)', '1')// allows both -p and --priority 
  .action((title, options) => {
    const priority = parseInt(options.priority, 10);
    if (isNaN(priority) || priority < 1 || priority > 3) {
      console.error(chalk.red('Error: Priority must be a number between 1 and 3'));
      process.exit(1);
    }

    const task = addTask(title, priority);
    console.log(chalk.green(`✓ Task added: "${task.title}" (Priority: ${task.priority})`));
  });

// List tasks
program
  .command('list')
  .description('List all tasks')
  .option('-p, --priority <number>', 'filter by priority')
  .option('-s, --status <status>', 'filter by status (pending/completed)')
  .action((options) => {
    const filters = {};
    
    if (options.priority !== undefined) {
      const p = parseInt(options.priority, 10);
      if (isNaN(p)) {
        console.error(chalk.red('Error: Priority must be a number'));
        process.exit(1);
      }
      filters.priority = p;
    }
    
    if (options.status) {
      if (!['pending', 'completed'].includes(options.status)) {
        console.error(chalk.red("Error: Status must be 'pending' or 'completed'"));
        process.exit(1);
      }
      filters.status = options.status;
    }

    const tasks = getTasks(filters);

    if (tasks.length === 0) {
      console.log(chalk.yellow('No tasks found.'));
      return;
    }

    console.log(chalk.bold('\n  ID  |  Title                          |  Priority  |  Status     |  Created'));
    console.log(chalk.gray('  ----+---------------------------------+------------+-------------+---------------------'));

    tasks.forEach(task => {
      const priorityColor = task.priority === 1 ? chalk.red : task.priority === 2 ? chalk.yellow : chalk.green;
      const statusColor = task.status === 'completed' ? chalk.green : chalk.gray;
      const statusIcon = task.status === 'completed' ? '✓' : '○';

      console.log(
        `  ${String(task.id).padEnd(3)} |  ${task.title.padEnd(30)} |  ${priorityColor(String(task.priority).padEnd(8))} |  ${statusColor(statusIcon + ' ' + task.status.padEnd(8))} |  ${task.created_at}`
      );
    });
    console.log('');
  });

// Complete task
program
  .command('complete <id>')
  .description('Mark a task as completed')
  .action((id) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.error(chalk.red('Error: ID must be a number'));
      process.exit(1);
    }

    const success = completeTask(taskId);
    if (success) {
      console.log(chalk.green(`✓ Task ${taskId} marked as completed`));
    } else {
      console.error(chalk.red(`Error: Task ${taskId} not found`));
      process.exit(1);
    }
  });

// Delete task
program
  .command('delete <id>')
  .description('Delete a task')
  .action((id) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.error(chalk.red('Error: ID must be a number'));
      process.exit(1);
    }

    const success = deleteTask(taskId);
    if (success) {
      console.log(chalk.green(`✓ Task ${taskId} deleted`));
    } else {
      console.error(chalk.red(`Error: Task ${taskId} not found`));
      process.exit(1);
    }
  });

program.parse();