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
          <input type="text" name="title" id="title">
        </div>
        <div>
          <label for="description">Description</label>
          <input type="text" name="description" id="description">
        </div>
        <div>
          <label for="dueDate">Due Date</label>
          <input type="text" name="dueDate" id="dueDate">
        </div>
        <div>
          <label for="priority">Priority</label>
          <select name="priority" id="priority">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label for="task-project">Project</label>
          <select name="task-project" id="task-project">
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
        handleSubmitTask()
      }
    );

    formContainer.querySelector('.cancel-task-button')
      .addEventListener('click', (e) => {
        e.preventDefault();
        handleCancelTask();
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
}