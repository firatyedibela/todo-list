import { format, isSameWeek } from 'date-fns';

const date = format(new Date(), 'yyyy-MM-dd');

export default class Todo {
  static init() {
    if (localStorage.getItem('todoList')) {
      Todo.list = JSON.parse(localStorage.getItem('todoList'));
    }

    if (localStorage.getItem('projects')) {
      Todo.projects = JSON.parse(localStorage.getItem('projects'));
    }
  }

  static list = [];
  static projects = [];

  static addTodo(title, description, dueDate, priority, project) {
    Todo.list.push({ title, description, dueDate, priority, project });
    updateTodoStorage();
  }

  static removeTodo(title) {
    const idx = Todo.list.findIndex((todo) => todo.title === title);
    Todo.list.splice(idx, 1);
    updateTodoStorage();
  }

  static editTodo(
    title,
    newTitle,
    newDescription,
    newDueDate,
    newPriority,
    newProject
  ) {
    // Find the todo index
    const idx = Todo.list.findIndex((todo) => todo.title === title);
    // Update it
    Todo.list.splice(idx, 1, {
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate,
      priority: newPriority,
      project: newProject,
    });
    updateTodoStorage();
  }

  static addProject(name) {
    Todo.projects.push({ name, tasks: [] });
    updateProjectStorage();
  }

  static removeProject(name) {
    const idx = Todo.projects.findIndex((project) => project.name === name);
    Todo.projects.splice(idx, 1);
    updateProjectStorage();
  }

  static getTodaysTasks() {
    return this.list.filter((task) => task.dueDate === date);
  }

  static getWeeksTasks() {
    return this.list.filter((task) => {
      // Create a new date with due date's parsed values and compare it with today
      const [year, month, day] = task.dueDate
        .split('-')
        .map((num) => parseInt(num));
      return isSameWeek(new Date(year, month - 1, day), new Date());
    });
  }

  static getCustomProjectsTasks(projectName) {
    return this.list.filter((task) => task.project === projectName);
  }
}

function updateTodoStorage() {
  localStorage.setItem('todoList', JSON.stringify(Todo.list));
}

function updateProjectStorage() {
  localStorage.setItem('projects', JSON.stringify(Todo.projects));
}

Todo.init();
