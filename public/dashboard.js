// // Fetch and display current user
// fetch('/api/user')
//   .then(res => res.json())
//   .then(user => {
//     document.getElementById('username').textContent = user.username;
//   });

// // DOM elements
// const addTaskForm = document.getElementById('addTaskForm');
// const taskTitle = document.getElementById('taskTitle');
// const taskPriority = document.getElementById('taskPriority');
// const filterPriority = document.getElementById('filterPriority');
// const filterStatus = document.getElementById('filterStatus');
// const clearFiltersBtn = document.getElementById('clearFilters');
// const tasksTableBody = document.getElementById('tasksTableBody');
// const emptyState = document.getElementById('emptyState');

// // Priority badge colors
// function getPriorityColor(priority) {
//   if (priority === 1) return 'bg-red-100 text-red-800';
//   if (priority === 2) return 'bg-yellow-100 text-yellow-800';
//   return 'bg-green-100 text-green-800';
// }

// function getPriorityLabel(priority) {
//   if (priority === 1) return 'Low';
//   if (priority === 2) return 'Medium';
//   return 'High';
// }

// // Fetch and render tasks
// function loadTasks() {
//   const params = new URLSearchParams();
//   if (filterPriority.value) params.append('priority', filterPriority.value);
//   if (filterStatus.value) params.append('status', filterStatus.value);

//   const url = '/api/tasks' + (params.toString() ? '?' + params.toString() : '');

//   fetch(url)
//     .then(res => res.json())
//     .then(tasks => {
//       tasksTableBody.innerHTML = '';
      
//       if (tasks.length === 0) {
//         emptyState.classList.remove('hidden');
//         return;
//       }
//       emptyState.classList.add('hidden');

//       tasks.forEach(task => {
//         const row = document.createElement('tr');
//         row.className = 'hover:bg-gray-50';
        
//         const statusClass = task.status === 'completed' 
//           ? 'bg-green-100 text-green-800' 
//           : 'bg-gray-100 text-gray-800';
        
//         const completeBtn = task.status === 'completed' 
//           ? '<span class="text-green-600 text-sm">✓ Done</span>'
//           : `<button onclick="completeTask(${task.id})" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">Complete</button>`;

//         row.innerHTML = `
//           <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.id}</td>
//           <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.title}</td>
//           <td class="px-6 py-4 whitespace-nowrap">
//             <span class="px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}">
//               ${getPriorityLabel(task.priority)}
//             </span>
//           </td>
//           <td class="px-6 py-4 whitespace-nowrap">
//             <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
//               ${task.status}
//             </span>
//           </td>
//           <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(task.created_at).toLocaleDateString()}</td>
//           <td class="px-6 py-4 whitespace-nowrap text-sm">
//             <div class="flex gap-2">
//               ${completeBtn}
//               <button onclick="deleteTask(${task.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">Delete</button>
//             </div>
//           </td>
//         `;
        
//         tasksTableBody.appendChild(row);
//       });
//     });
// }

// // Add task
// addTaskForm.addEventListener('submit', (e) => {
//   e.preventDefault();
  
//   fetch('/api/tasks', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       title: taskTitle.value,
//       priority: parseInt(taskPriority.value)
//     })
//   })
//   .then(res => res.json())
//   .then(() => {
//     taskTitle.value = '';
//     taskPriority.value = '2';
//     loadTasks();
//   });
// });

// // Complete task
// function completeTask(id) {
//   fetch(`/api/tasks/${id}/complete`, { method: 'POST' })
//     .then(() => loadTasks());
// }

// // Delete task
// function deleteTask(id) {
//   if (!confirm('Delete this task?')) return;
  
//   fetch(`/api/tasks/${id}`, { method: 'DELETE' })
//     .then(() => loadTasks());
// }

// // Filter handlers
// filterPriority.addEventListener('change', loadTasks);
// filterStatus.addEventListener('change', loadTasks);

// clearFiltersBtn.addEventListener('click', () => {
//   filterPriority.value = '';
//   filterStatus.value = '';
//   loadTasks();
// });

// // Initial load
// loadTasks();

// Fetch and display current user
fetch('/api/user')
  .then(res => res.json())
  .then(user => {
    document.getElementById('username').textContent = user.username;
  });

// DOM elements
const addTaskForm = document.getElementById('addTaskForm');
const taskTitle = document.getElementById('taskTitle');
const taskPriority = document.getElementById('taskPriority');
const filterPriority = document.getElementById('filterPriority');
const filterStatus = document.getElementById('filterStatus');
const clearFiltersBtn = document.getElementById('clearFilters');
const tasksTableBody = document.getElementById('tasksTableBody');
const emptyState = document.getElementById('emptyState');

// Priority badge colors
function getPriorityColor(priority) {
  if (priority === 1) return 'bg-red-100 text-red-800';
  if (priority === 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

function getPriorityLabel(priority) {
  if (priority === 1) return 'Low';
  if (priority === 2) return 'Medium';
  return 'High';
}

// Fetch and render tasks
function loadTasks() {
  const params = new URLSearchParams();
  if (filterPriority.value) params.append('priority', filterPriority.value);
  if (filterStatus.value) params.append('status', filterStatus.value);

  const url = '/api/tasks' + (params.toString() ? '?' + params.toString() : '');

  fetch(url)
    .then(res => res.json())
    .then(tasks => {
      tasksTableBody.innerHTML = '';
      
      if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
      }
      emptyState.classList.add('hidden');

      tasks.forEach(task => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusClass = task.status === 'completed' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800';
        
        const completeBtn = task.status === 'completed' 
          ? '<span class="text-green-600 text-sm">✓ Done</span>'
          : `<button onclick="completeTask(${task.id})" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">Complete</button>`;

        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.title}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}">
              ${getPriorityLabel(task.priority)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
              ${task.status}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(task.created_at).toLocaleDateString()}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="flex gap-2">
              ${completeBtn}
              <button onclick="deleteTask(${task.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">Delete</button>
            </div>
          </td>
        `;
        
        tasksTableBody.appendChild(row);
      });
    });
}

// Add task
addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: taskTitle.value,
      priority: parseInt(taskPriority.value)
    })
  })
  .then(res => res.json())
  .then(() => {
    taskTitle.value = '';
    taskPriority.value = '2';
    loadTasks();
  });
});

// Complete task
function completeTask(id) {
  fetch(`/api/tasks/${id}/complete`, { method: 'POST' })
    .then(() => loadTasks());
}

// Delete task
function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  
  fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    .then(() => loadTasks());
}

// Filter handlers
filterPriority.addEventListener('change', loadTasks);
filterStatus.addEventListener('change', loadTasks);

clearFiltersBtn.addEventListener('click', () => {
  filterPriority.value = '';
  filterStatus.value = '';
  loadTasks();
});

// Export to CSV
document.getElementById('exportBtn').addEventListener('click', () => {
  fetch('/api/tasks/export')
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
});

// Initial load
loadTasks();