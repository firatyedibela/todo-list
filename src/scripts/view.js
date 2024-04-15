import {
  submitTask,
  submitEditTask,
  handleAddProject,
  handleRemoveProject,
  handleRemoveTask,
  toggleEditTaskForm,
  renderCustomProjectTasks,
  toggleClass,
} from '../index.js';
import x from '../images/x.svg';
import checkSvg from '../images/check.svg';
import deleteSvg from '../images/delete.svg';
import editSvg from '../images/edit.svg';
import { format, differenceInDays, differenceInHours } from 'date-fns';

export default class View {
  static renderTaskForm(projects) {
    // Remove the existing task form
    View.removeTaskForm();

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    formContainer.innerHTML = `
      <form novalidate class="task-form" action="">
        <div>
          <label for="title">Title*</label>
          <div class="input-container">
            <input
              minlength=3
              maxlength=20 
              class="task-input" 
              type="text" 
              name="title" 
              id="title" 
              required>
            <span class="title-error input-error hidden"></span>
          </div>         
        </div>
        <div>
          <label for="description">Description</label>
          <textarea
            maxlength=60
            class="task-input" 
            type="text" 
            name="description" 
            id="description" 
          ></textarea>
        </div>
        <div>
          <label for="dueDate">Due Date*</label>
          <div class="input-container">
            <input
            min="${format(new Date(), 'yyyy-MM-dd')}" 
            class="task-input" 
            type="date" 
            name="dueDate" 
            id="dueDate" >
            <span class="date-error input-error hidden"></span>
          </div>          
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
        
        <div class="form-buttons-container">
          <button type="submit" class="submit-new-task-btn">Add</button>
          <button class="cancel-task-button">Cancel</button>
        </div>
      </form>
    `;

    const taskForm = formContainer.querySelector('.task-form');
    const titleInput = formContainer.querySelector('#title');
    const titleError = formContainer.querySelector('.title-error');
    const dateInput = formContainer.querySelector('#dueDate');
    const dateError = formContainer.querySelector('.date-error');

    // TITLE Form validation while user typing
    titleInput.addEventListener('input', () => {
      if (titleInput.validity.valid) {
        titleError.className = 'title-error input-error hidden';
        // This is for resetting border radius style and adding valid style
        titleInput.className = 'task-input valid';
      } else {
        titleError.textContent = `Title should be at least ${titleInput.minLength} characters.`;
        titleError.className = 'input-error active';
        titleInput.className = 'task-input failed';
      }
    });

    // No need to check if date is valid because only valid dates are available to user
    dateInput.addEventListener('input', () => {
      dateError.className = 'date-error input-error hidden';
      // This is for resetting border radius style and adding valid style
      dateInput.className = 'task-input valid';
    });

    // TITLE And DATE Form validation while user submitting
    taskForm.addEventListener('submit', (event) => {
      if (!titleInput.validity.valid) {
        event.preventDefault();
        titleError.textContent = `Title should be at least ${titleInput.minLength} characters.`;
        titleError.className = 'input-error active';
        // This is for styling border-radius
        titleInput.className = 'task-input failed';
      } else if (!dateInput.validity.valid) {
        event.preventDefault();
        dateError.textContent = 'You should enter a due date.';
        dateError.className = 'input-error active';
        // This is for styling border-radius
        dateInput.className = 'task-input failed';
      } else {
        // Submit task and prevent page from being reloaded, then remove form from page
        submitTask();
        event.preventDefault();
        View.removeTaskForm();
      }
    });

    formContainer
      .querySelector('.cancel-task-button')
      .addEventListener('click', (e) => {
        e.preventDefault();
        View.removeTaskForm();
      });

    // Render project options if there is any
    if (projects) {
      const projectOptions = formContainer.querySelector('#task-project');
      projects.forEach((project) => {
        const optionHTML = `
          <option value="${project.name}">${project.name}</option>
        `;
        projectOptions.innerHTML += optionHTML;
      });
    }

    // Add form-active class to .main in order to make it faded when form is active
    document.querySelector('.main').classList.add('form-active');

    document.body.appendChild(formContainer);
  }

  static removeTaskForm() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      document.body.removeChild(formContainer);
    }

    // Remove form-active class from page
    document.querySelector('.main').classList.remove('form-active');
  }

  static renderProjectForm() {
    // Remove existing project form
    View.removeProjectForm();

    const container = document.createElement('div');
    container.classList.add('project-form-container');
    container.innerHTML = `
      <form novalidate class="project-form">
        <input 
          type="text" 
          class="project-name-input" 
          placeholder="Project Name"
          minlength="3" 
          maxlength="20"
          required
        >
        <div class="project-form-btn-container">
          <button type="submit" class="add-project-btn">Add</button>
          <button class="cancel-project-btn">Cancel</button>
        </div>
      </form>
    `;

    const projectName = container.querySelector('.project-name-input');

    // Avoid displaying error msg as the input becomes valid
    projectName.addEventListener('input', (e) => {
      projectName.setCustomValidity('');
      if (!projectName.validity.valid) {
        projectName.setCustomValidity(
          'Project Name needs to be atleast 3 characters long.'
        );
      }
    });
    // Validation when submitting
    container.querySelector('.project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!projectName.validity.valid) {
        projectName.setCustomValidity(
          'Project Name needs to be atleast 3 characters long.'
        );
        projectName.reportValidity();
      } else {
        handleAddProject();
      }
    });

    container
      .querySelector('.cancel-project-btn')
      .addEventListener('click', () => {
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
    projects.forEach((project) => {
      const customProjectContainer = document.createElement('div');
      customProjectContainer.classList.add('custom-project', 'project');

      const projectNameSection = document.createElement('div');
      projectNameSection.classList.add('project-name-section', 'project');
      projectNameSection.textContent = `${project.name}`;
      projectNameSection.dataset.name = project.name;
      customProjectContainer.appendChild(projectNameSection);

      const removeProjectBtn = document.createElement('img');
      removeProjectBtn.classList.add('remove-project-btn');
      removeProjectBtn.dataset.name = project.name;
      removeProjectBtn.src = x;
      customProjectContainer.appendChild(removeProjectBtn);

      container.appendChild(customProjectContainer);
    });

    document.querySelectorAll('.remove-project-btn').forEach((button) => {
      button.addEventListener('click', handleRemoveProject);
    });

    document.querySelectorAll('.project-name-section').forEach((project) => {
      project.addEventListener('click', renderCustomProjectTasks);
    });

    // Active page's nav decoration
    const allProjects = document.querySelectorAll('.project');
    allProjects.forEach((project) => {
      project.addEventListener('click', (e) => {
        // Once a project is clicked remove every project's active class and add active class to the clicked one
        allProjects.forEach((project) => {
          project.classList.remove('active');
        });
        e.target.classList.add('active');
      });
    });
  }

  static renderTasks(taskList, projects) {
    const container = document.querySelector('.content');
    container.textContent = '';

    taskList.forEach((task) => {
      // Create outer container that will contain both the task data section
      // and edit task form section
      const taskContainer = document.createElement('div');
      taskContainer.className = 'task-container';

      // Create data container and edit form container for tasks
      const taskDataContainer = document.createElement('div');
      taskDataContainer.classList.add('task-data-container');

      // Create edit button and make interactive
      const editBtn = document.createElement('img');
      editBtn.className = 'edit-task-btn task-btn';
      editBtn.src = editSvg;
      editBtn.dataset.name = task.title;

      editBtn.addEventListener('click', toggleEditTaskForm);

      // EDIT HTML
      const taskEditFormContainer = document.createElement('div');
      taskEditFormContainer.className = `task-edit-form-container`;
      taskEditFormContainer.id = task.title;
      taskEditFormContainer.innerHTML = `
        <form novalidate class="edit-task-form">
          <input 
            type="text"
            id="edit-title"
            class="edit-task-input"
            value="${task.title}"
            minlength=3
            maxlength=20
            autocomplete="off"
            required
          >
          <textarea
            type="text"
            id="edit-description"
            class="edit-task-input"
            maxlength=60
          >${task.description}</textarea>
          <input
            type="date"
            id="edit-date"
            class="edit-task-input"
            min="${format(new Date(), 'yyyy-MM-dd')}"
            value="${task.dueDate}"
          >
          <select 
            class="edit-task-input" 
            id="edit-priority" 
            value="${task.priority}"
          >
            <option class="priority-opt" value="low">Low</option>
            <option class="priority-opt" value="normal">Normal</option>
            <option class="priority-opt" value="high">High</option>
          </select>
          <select 
            class="edit-task-input" 
            id="edit-project"
          >
            <option value="none" selected>Select a project
            </option>
          </select>
          <button type="submit">Save</button>
        </form>
      `;

      // Make current priority selected
      const currentPriority = task.priority;
      const priorityOptions =
        taskEditFormContainer.querySelectorAll('.priority-opt');
      priorityOptions.forEach((option) => {
        if (option.value === currentPriority) {
          option.selected = true;
        }
      });

      // Render the projects and make current one selected if it is not none
      const projectsContainer =
        taskEditFormContainer.querySelector('#edit-project');
      projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        // Make the option selected if it is current task's project
        if (project.name === task.project) {
          option.selected = true;
        }
        projectsContainer.appendChild(option);
      });

      // Validate edit form and submit
      const editForm = taskEditFormContainer.querySelector('form');
      editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!editForm.checkValidity()) {
          editForm.reportValidity();
        } else {
          // Get data from edit task form
          const newData = [];
          const inputs =
            taskEditFormContainer.querySelectorAll('.edit-task-input');
          inputs.forEach((input) => {
            newData.push(input.value);
          });
          submitEditTask(task.title, newData);
        }
      });

      // Create X button for closing edit-task-form and add it to
      // edit task form container
      const closeEditFormBtn = document.createElement('img');
      closeEditFormBtn.className = 'close-edit-form-btn';
      closeEditFormBtn.src = x;
      closeEditFormBtn.dataset.name = task.title;
      closeEditFormBtn.addEventListener('click', toggleEditTaskForm);
      taskEditFormContainer.appendChild(closeEditFormBtn);

      // Create check button and make interactive
      const checkBtn = document.createElement('img');
      checkBtn.className = 'check-task-btn task-btn';
      checkBtn.src = checkSvg;
      checkBtn.dataset.name = task.title;

      checkBtn.addEventListener('click', () => {
        toggleClass('checked', checkBtn);
      });

      // Create remove button and make interactive
      const removeBtn = document.createElement('img');
      removeBtn.className = 'remove-task-btn task-btn';
      removeBtn.src = deleteSvg;
      removeBtn.dataset.name = task.title;

      removeBtn.addEventListener('click', handleRemoveTask);

      // Create task elements for task properties
      const title = document.createElement('div');
      title.classList.add('task-title');
      title.textContent =
        task.project !== 'none'
          ? `${task.title} (${task.project})`
          : `${task.title}`;

      const description = document.createElement('div');
      description.classList.add('task-description');
      description.textContent = task.description;

      const dueDate = document.createElement('div');
      dueDate.classList.add('task-due-date');

      if (task.dueDate) {
        const [year, month, day] = task.dueDate
          .split('-')
          .map((num) => parseInt(num));
        let daysLeft = differenceInDays(
          new Date(year, month - 1, day),
          new Date()
        );
        if (daysLeft < 0) {
          daysLeft = 0;
        }
        dueDate.textContent = `${daysLeft} days left`;
      }

      // Add a class to container based on priority
      taskDataContainer.classList.add(task.priority);

      taskDataContainer.appendChild(checkBtn);
      taskDataContainer.appendChild(removeBtn);
      taskDataContainer.appendChild(title);
      taskDataContainer.appendChild(description);
      taskDataContainer.appendChild(dueDate);
      taskDataContainer.appendChild(editBtn);

      taskContainer.appendChild(taskDataContainer);
      taskContainer.appendChild(taskEditFormContainer);
      container.appendChild(taskContainer);
    });
  }
}
