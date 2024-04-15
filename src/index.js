import './styles/main.css';
import Todo from './scripts/data.js';
import View from './scripts/view.js';
import { format } from 'date-fns';

const date = format(new Date(), 'yyyy-MM-dd');

// Render all tasks and custom projects at page load
View.renderTasks(Todo.list, Todo.projects);
View.renderProjects(Todo.projects);

// Render date
document.querySelector('.date').textContent = format(new Date(), 'PPPP');

// Display all tasks
document.querySelector('.all-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.list, Todo.projects);
});

// Display today's tasks
document.querySelector('.todays-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.getTodaysTasks(), Todo.projects);
});

// Display this week's tasks
document.querySelector('.weeks-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.getWeeksTasks(), Todo.projects);
});

// Create new task
document.querySelector('.new-task-btn').addEventListener('click', () => {
  View.renderTaskForm(Todo.projects);
});

// Create new project
document.querySelector('.new-project-btn').addEventListener('click', () => {
  View.renderProjectForm();
});

export function submitTask() {
  // Get data from task form
  const data = [];
  const inputs = document.querySelectorAll('.task-input');
  inputs.forEach((input) => {
    data.push(input.value);
  });
  // Pass that data to addTodo function of Todo,
  Todo.addTodo(...data);
  updateCurrentContent();
}

export function submitEditTask(taskName, newData) {
  console.log(newData);
  Todo.editTodo(taskName, ...newData);
  updateCurrentContent();
}

export function handleAddProject() {
  // Get data from form and call addProject
  const data = document.querySelector('.project-name-input').value;
  Todo.addProject(data);
  View.removeProjectForm();
  View.renderProjects(Todo.projects);
  View.renderTasks(Todo.list, Todo.projects);
}

export function handleRemoveProject(e) {
  const projectName = e.target.dataset['name'];
  Todo.removeProject(projectName);
  View.renderProjects(Todo.projects);
}

export function handleRemoveTask(e) {
  const taskName = e.target.dataset['name'];
  Todo.removeTodo(taskName);
  updateCurrentContent();
}

export function toggleEditTaskForm(e) {
  const containerName = e.target.dataset['name'];
  const container = document.getElementById(containerName);
  container.classList.toggle('visible');
}

export function renderCustomProjectTasks(e) {
  const custom = true;
  const projectName = e.target.dataset['name'];
  View.renderTasks(
    Todo.getCustomProjectsTasks(projectName),
    Todo.projects,
    custom
  );
}

export function toggleClass(customClass, element) {
  element.classList.contains(customClass)
    ? element.classList.remove(customClass)
    : element.classList.add(customClass);
}

function updateCurrentContent() {
  // Find the current content first
  const allProjects = Array.from(document.querySelectorAll('.project'));
  const activeProject = allProjects.find((project) =>
    project.classList.contains('active')
  );

  // Update the content based on the active project's name
  const projectName = activeProject.dataset['name'];
  if (projectName === 'all-tasks') {
    View.renderTasks(Todo.list, Todo.projects);
  } else if (projectName === 'todays-tasks') {
    View.renderTasks(Todo.getTodaysTasks(), Todo.projects);
  } else if (projectName === 'weeks-tasks') {
    View.renderTasks(Todo.getWeeksTasks(), Todo.projects);
  } else {
    View.renderTasks(Todo.getCustomProjectsTasks(projectName), Todo.projects);
  }
}
