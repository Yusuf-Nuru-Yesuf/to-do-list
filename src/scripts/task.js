import {Project} from './project.js';

export class Task {
  static validPriorities = ['high', 'medium', 'low'];
  static validatePriorities(priority) {
    return Task.validPriorities.includes(priority);
  }

  constructor(title, description, dueDate, priority, projectName = "default") {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.setPriority(priority);
    this.setProject(Project.getOrCreateProject(projectName));
  }

  setTitle(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }

  setDescription(description) {
    this.description = description;
  }

  getDescription() {
    return this.description;
  }

  setDueDate(dueDate) {
    this.dueDate = dueDate;
  }

  getDueDate() {
    return this.dueDate;
  }

  setPriority(priority) {
    if (Task.validatePriorities(priority)) {
      this.priority = priority;
    } else {
      throw new Error('Invalid priority');
    }
  }

  getPriority() {
    return this.priority;
  }

  setProject(project) {
    if (project instanceof Project) {
      this.project = project;
      project.addTask(this)
    } else {
      throw new Error('Invalid Project')
    }
  }

  getProject() {
    return this.project;
  }
}
