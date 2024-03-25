export default class Todo {
  static list = [];
  static projects = [];

  static addTodo(title, description, dueDate, priority, project) {
    Todo.list.push({title, description, dueDate, priority, project});
  }

  static removeTodo(title) {
    const idx = Todo.list.findIndex(todo => todo.title === title);
    Todo.list.splice(idx, 1);
  }

  static addProject(name) {
    Todo.projects.push({name, tasks: []})
  }

  static removeProject(name) {
    const idx = Todo.projects.findIndex(project => project.name === name);
    Todo.projects.splice(idx, 1);
  }
}

