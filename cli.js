#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { addTask, getTasks, completeTask, deleteTask } = require('./db');

const program = new Command();

program
  .name('task')
  .description('Task Manager CLI')
  .version('1.0.0');

// Add task
program
  .command('add <title>')
  .description('Add a new task')
  .option('-p, --priority <number>', 'task priority (1-3)', '1')
  .action((title, options) => {
    try {
      const priority = parseInt(options.priority, 10);
      if (isNaN(priority) || priority < 1 || priority > 3) {
        console.error(chalk.red('Error: Priority must be a number between 1 and 3'));
        process.exit(1);
      }

      const task = addTask(title, priority);
      console.log(chalk.green(`✓ Task added: "${task.title}" (Priority: ${task.priority})`));
    } catch (err) {
      console.error(chalk.red('Error: Failed to add task'), err.message);
      process.exit(1);
    }
  });

// List tasks
program
  .command('list')
  .description('List all tasks')
  .option('-p, --priority <number>', 'filter by priority')
  .option('-s, --status <status>', 'filter by status (pending/completed)')
  .action((options) => {
    try {
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
    } catch (err) {
      console.error(chalk.red('Error: Failed to list tasks'), err.message);
      process.exit(1);
    }
  });

// Complete task
program
  .command('complete <id>')
  .description('Mark a task as completed')
  .action((id) => {
    try {
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
    } catch (err) {
      console.error(chalk.red('Error: Failed to complete task'), err.message);
      process.exit(1);
    }
  });

// Delete task
program
  .command('delete <id>')
  .description('Delete a task')
  .action((id) => {
    try {
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
    } catch (err) {
      console.error(chalk.red('Error: Failed to delete task'), err.message);
      process.exit(1);
    }
  });

program.parse();