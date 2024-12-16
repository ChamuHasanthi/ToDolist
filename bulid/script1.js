const addButton = document.querySelector('.add_button');
const todosContainer = document.querySelector('.todos');
const taskInput = document.querySelector('.todoinput');
const dateInput = document.querySelector('.date');
const priorityInput = document.querySelector('.priority');
const progress = document.querySelector('#progress');
const numbers = document.querySelector('#numbers');
const showCompleteBtn = document.querySelector('#show-complete');
const showIncompleteBtn = document.querySelector('#show-incomplete');

let tasks = [];

function updateProgress() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  progress.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
  numbers.textContent = `${completedTasks}/${totalTasks}`;
}

// Sort tasks by deadline and priority
function sortTasks(tasksToSort) {
  return tasksToSort.sort((a, b) => {
    // Sort by deadline first (earliest date first)
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    // If deadlines are the same, sort by priority (High > Medium > Low)
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function addTaskToTable(task) {
  const tableBody = document.querySelector('#taskTable tbody');

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <input type="checkbox" class="complete-task" ${task.completed ? 'checked' : ''} />
      <span>${task.task}</span>
    </td>
    <td>${task.priority}</td>
    <td>${task.date}</td>
    <td class="actions">
      <button class="edit-task"><i class="fa fa-pen-to-square"></i></button>
      <button class="delete-task"><i class="fa fa-trash"></i></button>
    </td>
  `;

  const checkbox = row.querySelector('.complete-task');
  const deleteButton = row.querySelector('.delete-task');
  const editButton = row.querySelector('.edit-task');

  // Mark task as completed
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    updateDisplayedTasks();
    updateProgress();
  });

  // Delete task
  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter(t => t.task !== task.task);
    row.remove();
    updateProgress();
  });

  // Edit task
  editButton.addEventListener('click', () => {
    taskInput.value = task.task;
    dateInput.value = task.date;
    priorityInput.value = task.priority;
    tasks = tasks.filter(t => t.task !== task.task);
    row.remove();
    updateProgress();
  });

  tableBody.appendChild(row);
  updateProgress();
}

function updateDisplayedTasks() {
  const tableBody = document.querySelector('#taskTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const showCompleted = showCompleteBtn.classList.contains('active');
  const filteredTasks = tasks.filter(task => task.completed === showCompleted);

  const sortedTasks = sortTasks(filteredTasks);

  sortedTasks.forEach(task => {
    addTaskToTable(task);
  });
}

addButton.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;

  if (task && date) {
    const newTask = { task, date, priority, completed: false };
    tasks.push(newTask);
    updateDisplayedTasks(); // Update the table
    taskInput.value = '';
    dateInput.value = '';
    priorityInput.value = 'High';
  }
});

showCompleteBtn.addEventListener('click', () => {
  showCompleteBtn.classList.add('active');
  showIncompleteBtn.classList.remove('active');
  updateDisplayedTasks(); // Update tasks to show only completed tasks
});

showIncompleteBtn.addEventListener('click', () => {
  showIncompleteBtn.classList.add('active');
  showCompleteBtn.classList.remove('active');
  updateDisplayedTasks(); // Update tasks to show only incomplete tasks
});

// Default behavior: Set "Incomplete" tab as active when page loads
document.addEventListener('DOMContentLoaded', () => {
  showIncompleteBtn.classList.add('active');
  showCompleteBtn.classList.remove('active');
  updateDisplayedTasks(); // Ensure incomplete tasks are displayed
});
