import { submitTask, handleAddProject, handleRemoveProject } from '../index.js';
import x from '../images/x.svg';

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
          <input class="task-input" type="text" name="title" id="title" required>
        </div>
        <div>
          <label for="description">Description</label>
          <input class="task-input" type="text" name="description" id="description" required>
        </div>
        <div>
          <label for="dueDate">Due Date</label>
          <input class="task-input" type="date" name="dueDate" id="dueDate" required>
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
      <form>
        <input type="text" class="project-name-input" placeholder="Project Name" required>
        <div class="project-form-btn-container">
          <button class="add-project-btn">Add</button>
          <button class="cancel-project-btn">Cancel</button>
        </div>
      </form>
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

  static renderProjects(projects) {
    const container = document.querySelector('.custom-projects-section');
    // Clear the container first to avoid duplication
    container.innerHTML = '';
    projects.forEach(project => {
      const projectNode = document.createElement('div');
      projectNode.classList.add('custom-project');
      projectNode.innerHTML = `
        <p class="project-name">${project.name}</p>
        <img 
          src="${x}" 
          class="remove-project-btn"
          data-name="${project.name}"
        >
      `;
      container.appendChild(projectNode);

      document.querySelector('.remove-project-btn').addEventListener('click', handleRemoveProject);
    });
  }
}