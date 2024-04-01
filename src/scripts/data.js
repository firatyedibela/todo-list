import { format, isSameWeek } from 'date-fns';

const date = format(new Date(), 'yyyy-MM-dd');

export default class Todo {
  static list = [
    {
      title: 'Make Exercise',
      description:
        'Run at least 4 kilometers. Do stretching before the exercise and afterwards.',
      dueDate: '2024-04-25',
      priority: 'normal',
      project: 'none',
    },
    {
      title: 'Code Page Layout',
      description: 'Create page layout and code it with basic html and css.',
      dueDate: '2024-04-1',
      priority: 'high',
      project: 'Create a WebPage',
    },
  ];
  static projects = [
    { name: 'Learn To Code' },
    {
      name: 'Finish the home',
    },
  ];

  static addTodo(title, description, dueDate, priority, project) {
    Todo.list.push({ title, description, dueDate, priority, project });
  }

  static removeTodo(title) {
    const idx = Todo.list.findIndex((todo) => todo.title === title);
    Todo.list.splice(idx, 1);
  }

  static addProject(name) {
    Todo.projects.push({ name, tasks: [] });
  }

  static removeProject(name) {
    const idx = Todo.projects.findIndex((project) => project.name === name);
    Todo.projects.splice(idx, 1);
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
}
