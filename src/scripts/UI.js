import {Task} from './task.js';
import {Project} from './project.js';
import {Storage} from './storage.js';

export const DisplayController = (function(){

  const allTasksBtn = document.querySelector('#all-tasks');
  const displayTasks = document.querySelector("#display-tasks");
  const projectsContainer = document.querySelector("#projects");
  const taskDialog = document.querySelector(".add-task-dialog");
  const projectDialog = document.querySelector(".add-project-dialog");
  const taskForm = document.querySelector("#task-form");
  const projectForm = document.querySelector("#project-form");
  const addTaskBtn = document.querySelector("#add-task");
  const addProjectBtn = document.querySelector("#add-project");
  const closeTaskFormBtn = document.querySelector("#close-task-form");
  const closeProjectFormBtn = document.querySelector("#close-project-form");
  const projectSelect = document.querySelector("#project-select");
  const dueDateInput = document.querySelector("#task-due-date");
  const submitTaskBtn = document.querySelector("#submit-task-form");
  const projectNameInput = document.querySelector("#project-name");
  const submitProjectBtn = document.querySelector("#submit-project-form")
  let currentEditingTask = null;
  let currentEditingProject = null;

  addTaskBtn.addEventListener("click", openTaskForm)
  closeTaskFormBtn.addEventListener("click", closeTaskForm);
  taskForm.addEventListener("submit", submitTaskForm);
  addProjectBtn.addEventListener("click", openProjectForm);
  closeProjectFormBtn.addEventListener("click", closeProjectForm);
  projectForm.addEventListener("submit", submitProjectForm);
  allTasksBtn.addEventListener("click", displayTask )

  function init(){
    Storage.loadProjects();
    displayProjects();
    displayTask();
  }

  function setMinDate() {
    dueDateInput.min = new Date().toISOString().split("T")[0];
  }
  function openTaskForm() {
    taskDialog.showModal()
    updateProjectDropdown();
    setMinDate();
  }

  function closeTaskForm() {
    taskDialog.close();
    taskForm.reset();
  }

  function submitTaskForm(e) {
    e.preventDefault()
    const trimmedTitle = document.querySelector("#task-title").value.trim();
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-due-date").value;
    const trimmedPriority = document.querySelector("#task-priority").value;
    const trimmedProjectName = document.querySelector("#project-select").value;

    if (e.target.dataset.mode === 'edit' && currentEditingTask) {
      currentEditingTask.setTitle(trimmedTitle);
      currentEditingTask.setDescription(description);
      currentEditingTask.setDueDate(dueDate);
      currentEditingTask.setPriority(trimmedPriority);

      const newProject = Project.getOrCreateProject(trimmedProjectName);
      if (newProject !== currentEditingTask.getProject()) {
        currentEditingTask.getProject().removeTask(currentEditingTask);
        newProject.addTask(currentEditingTask);
        currentEditingTask.setProject(newProject);
      }

    } else {
      const newTask = new Task(trimmedTitle, description, dueDate, trimmedPriority, trimmedProjectName);
    }

    closeTaskForm();
    Storage.saveProjects();
    displayTask();
    displayProjects();
  }

  function openProjectForm() {
    projectDialog.showModal();
    projectForm.dataset.mode = "create";
    currentEditingProject = null;
  }

  function closeProjectForm() {
    projectDialog.close();
    projectForm.reset();
  }

  function submitProjectForm(e) {
    e.preventDefault();
    const projectName = projectNameInput.value.trim();
    if (projectName) {
      if(projectForm.dataset.mode === 'edit' && currentEditingProject) {
        editProject(currentEditingProject, projectName);
      } else{
        const newProject = Project.getOrCreateProject(projectName);
      }

      closeProjectForm();
      displayTask();
      Storage.saveProjects();
      updateProjectDropdown();
      displayProjects();
    }
  }

  function updateProjectDropdown() {
    projectSelect.innerHTML = '';

    const defaultOption = document.createElement("option");
    defaultOption.value = 'Default';
    defaultOption.textContent = 'Default';
    projectSelect.appendChild(defaultOption);

    Object.keys(Project.projects).forEach(projectName => {
      if (projectName !== "Default") {
        const option = document.createElement("option");
        option.value = projectName;
        option.textContent = projectName;
        projectSelect.appendChild(option);
      }
    });
  }

  function displayProjects() {
    const projectsHeader = projectsContainer.querySelector('h2') || document.createElement('h2');
    projectsHeader.textContent = 'Projects';

    projectsContainer.innerHTML = '';
    projectsContainer.appendChild(projectsHeader);

    Object.values(Project.projects).forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project-item');
      projectElement.addEventListener('click', () => displayProjectTasks(project));
      projectElement.addEventListener('dblclick', () => openEditProjectForm(project));

      const projectName = document.createElement("h4");
      projectName.classList.add('project-title');
      projectName.textContent = project.getName();

      const deleteProjectBtn = document.createElement("button");
      deleteProjectBtn.classList.add("delete-project");
      deleteProjectBtn.textContent = "X";
      deleteProjectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProject(project);
      })

      projectElement.appendChild(projectName);
      if (project.getName() !== "Default") {
        projectElement.appendChild(deleteProjectBtn);
      }
      projectsContainer.appendChild(projectElement);
    });
    projectsContainer.appendChild(addProjectBtn);
  }

  function displayProjectTasks(project) {
    if (!Project.projects[project.getName()]) {
      displayTask();
      return;
    }

    displayTasks.innerHTML = `
        <h2>Tasks for ${project.getName()}</h2>
        <div id="header" class="task">
            <h3 class="title">Task</h3>
            <h3 class="description">Description</h3>
            <h3 class="priority">Priority</h3>
            <h3 class="project">Project</h3>
            <h3 class="due-date">Due Date</h3>
        </div>`;

    project.getTasks().forEach(task => {
      addTaskToDisplay(task);
    });
  }

  function displayTask() {
    displayTasks.innerHTML = `
        <div id="header" class="task">
            <h3 class="title">Task</h3>
            <h3 class="description">Description</h3>
            <h3 class="priority">Priority</h3>
            <h3 class="project">Project</h3>
            <h3 class="due-date">Due Date</h3>
        </div>`;

    Object.values(Project.projects).forEach(project => {
      project.getTasks().forEach(task => {
        addTaskToDisplay(task);
      })
    })
  }

  function addTaskToDisplay(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-row");
    taskElement.addEventListener("dblclick", () => openEditTaskForm(task))

    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = task.description;

    const dueDateContainer = document.createElement("div");
    dueDateContainer.classList.add("due-date-container");

    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    dueDate.textContent = task.dueDate;

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.classList.add("delete-task");
    deleteTaskBtn.textContent = "X";
    deleteTaskBtn.addEventListener("click", () => deleteTask(task))

    const priority = document.createElement("p");
    priority.classList.add("priority");
    priority.textContent = task.priority;

    const project = document.createElement("p");
    project.classList.add("project");
    project.textContent = task.getProject().getName();

    if (task.priority === 'high') {
      taskElement.style.background = "red";
    } else if (task.priority === 'medium') {
      taskElement.style.background = 'yellow';
    } else {
      taskElement.style.background = 'green'
    }

    dueDateContainer.appendChild(dueDate);
    dueDateContainer.appendChild(deleteTaskBtn)
    taskElement.appendChild(title);
    taskElement.appendChild(description);
    taskElement.appendChild(priority);
    taskElement.appendChild(project);
    taskElement.appendChild(dueDateContainer);
    displayTasks.appendChild(taskElement);
  }

  function deleteTask(task) {
    const project = task.getProject();
    project.removeTask(task);
    Storage.saveProjects();
    displayTask();
    displayProjects()
  }

  function openEditTaskForm(task) {
    const taskTitle = document.querySelector("#task-title");
    const taskDescription = document.querySelector("#task-description");
    const taskDueDate = document.querySelector("#task-due-date");
    const taskPriority = document.querySelector("#task-priority");
    const projectSelect = document.querySelector("#project-select");

    submitTaskBtn.textContent = "Save Changes";
    taskTitle.value = task.getTitle();
    taskDescription.value = task.getDescription();
    taskDueDate.value = task.getDueDate();
    taskPriority.value = task.getPriority();
    projectSelect.value = task.getProject().getName();
    currentEditingTask = task;
    taskForm.dataset.mode = "edit";
    taskDialog.showModal();
  }

  function deleteProject(project) {
    if (project.getName() === "Default") {
      alert("Cannot delete the Default project.");
      return;
    }
    project.removeProject();
    Storage.saveProjects();
    displayTask()
    displayProjects();
    updateProjectDropdown();
  }

  function openEditProjectForm(project) {
    if (project.getName() === "Default") {
      alert("Cannot edit the default project.");
      return
    }

    projectNameInput.value = project.getName();
    submitProjectBtn.textContent = "Save Changes";
    projectForm.dataset.mode = "edit";
    currentEditingProject = project;
    projectDialog.showModal();
  }

  function editProject(project, newName) {
    if (Project.projects[newName] && Project.projects[newName] !== project) {
      alert("A project with this name already exists.");
      return;
    }

    const oldName = project.getName();
    project.setName(newName);

    project.getTasks().forEach(task => {
      task.setProject(project);
    });

    if (oldName !== newName) {
      Project.projects[newName] = project;
      delete Project.projects[oldName];
    }
  }
  return {init};
}) ();



