import { submitTask, handleAddProject } from '../index.js';

export default class View {
  static renderTaskForm(projects) {
    // Remove the existing task form
    View.removeTaskForm();

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');  
    formContainer.innerHTML = `
      <form class="task-form" action="">
        <div>
          <label for="title">Title</label>
          <input class="task-input" type="text" name="title" id="title">
        </div>
        <div>
          <label for="description">Description</label>
          <input class="task-input" type="text" name="description" id="description">
        </div>
        <div>
          <label for="dueDate">Due Date</label>
          <input class="task-input" type="date" name="dueDate" id="dueDate">
        </div>
        <div>
          <label for="priority">Priority</label>
          <select class="task-input" name="priority" id="priority">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label for="task-project">Project</label>
          <select class="task-input" name="task-project" id="task-project">
            <option value="none" selected>Select a project</option>
          </select>
        </div>
        
        <button class="submit-new-task-btn">Add</button>
        <button class="cancel-task-button">Cancel</button>
      </form>
    `;
    
    // Add event listeners to form buttons
    formContainer.querySelector('.submit-new-task-btn')
      .addEventListener('click', (e) => {
        e.preventDefault();
        submitTask()
        View.removeTaskForm();
      }
    );

    formContainer.querySelector('.cancel-task-button')
      .addEventListener('click', (e) => {
        e.preventDefault();
        View.removeTaskForm();
      }
    );

    // Render project options if there is any
    if(projects) {
      const projectOptions = formContainer.querySelector('#task-project');
      projects.forEach(project => {
        const optionHTML = `
          <option value="${project.name}">${project.name}</option>
        `; 
        projectOptions.innerHTML += optionHTML;
      });
    } 
    
    document.body.appendChild(formContainer);
  }

  static removeTaskForm() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      document.body.removeChild(formContainer);
    }   
  }

  static renderProjectForm() {
    // Remove existing project form
    View.removeProjectForm();

    const container = document.createElement('div');
    container.classList.add('project-form-container');
    container.innerHTML = `
      <input type="text" class="project-input" placeholder="Project Name">
      <div class="project-form-btn-container">
        <button class="add-project-btn">Add</button>
        <button class="cancel-project-btn">Cancel</button>
      </div>
    `;

    container.querySelector('.add-project-btn').addEventListener('click', handleAddProject);
    container.querySelector('.cancel-project-btn').addEventListener('click', () => {
      View.removeProjectForm();
    });

    document.querySelector('.main-nav').appendChild(container);

  }

  static removeProjectForm() {
    const projectContainer = document.querySelector('.project-form-container');
    if (projectContainer) {
      document.querySelector('.main-nav').removeChild(projectContainer);
    }
  }
}