import './styles/main.css';
import Todo from './scripts/model.js';
import View from './scripts/view.js';
import { format } from 'date-fns';

const date = format(new Date(), 'yyyy-MM-dd');

// Display all tasks
document.querySelector('.all-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.list);
});

// Display today's tasks
document.querySelector('.todays-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.getTodaysTasks());
});

// Display this week's tasks
document.querySelector('.weeks-tasks').addEventListener('click', () => {
  View.renderTasks(Todo.getWeeksTasks());
});

// Create new task
document.querySelector('.new-task-btn').addEventListener('click', () => {
  View.renderTaskForm(Todo.projects);
});

// Create new project
document.querySelector('.new-project-btn').addEventListener('click', () => {
  View.renderProjectForm();
});

export function submitTask(e) {
  // Get data from task form
  const data = [];
  const inputs = document.querySelectorAll('.task-input');
  inputs.forEach((input) => {
    data.push(input.value);
  });
  // Pass that data to addTodo function of Todo,
  Todo.addTodo(...data);
  console.table(Todo.list);
}

export function handleAddProject() {
  // Get data from form and call addProject
  const data = document.querySelector('.project-name-input').value;
  Todo.addProject(data);
  View.removeProjectForm();
  View.renderProjects(Todo.projects);
}

export function handleRemoveProject(e) {
  const projectName = e.target.dataset['name'];
  Todo.removeProject(projectName);
  View.renderProjects(Todo.projects);
}
