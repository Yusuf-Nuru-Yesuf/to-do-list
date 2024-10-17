
export class Project {
  static projects = {};
  static defaultProject;

  static initialize() {
    Project.defaultProject = new Project("Default");
    Project.projects["Default"] = Project.defaultProject;
  }

  static getDefaultProject() {
    return Project.defaultProject;
  }

  static getOrCreateProject(name) {
    if (!Project.projects[name]) {
      Project.projects[name] = new Project(name);
    }
    return Project.projects[name];
  }

  constructor(name) {
    this.name = name;
    this.tasks = []
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  addTask(task) {
    if (!this.tasks.includes(task)) {
      this.tasks.push(task);
    }
  }

  getTasks() {
    return this.tasks;
  }

  removeTask(task) {
    this.tasks = this.tasks.filter((t) => t !== task);
  }

  removeProject() {
    this.tasks = []; // Clear all tasks from the project
    delete Project.projects[this.name]; // Remove the project from the map
  }
}

Project.initialize();
