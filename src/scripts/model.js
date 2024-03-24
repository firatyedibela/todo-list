export default class Todo {
  static list = [];

  static addTodo(title, description, dueDate, priority) {
    Todo.list.push({title, description, dueDate, priority});
  }

  static removeTodo(title) {
    const idx = Todo.list.findIndex(todo => todo.title === title);
    Todo.list.splice(idx, 1);
  }
}

