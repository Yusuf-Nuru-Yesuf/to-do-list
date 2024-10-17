import {Task} from './task.js';
import {Project} from './project.js';

export const Storage = {
  saveProjects: function() {
    const projectsData = Object.values(Project.projects).map(project => ({
      name: project.getName(),
      tasks: project.getTasks().map(task => ({
        title: task.getTitle(),
        description: task.getDescription(),
        dueDate: task.getDueDate(),
        priority: task.getPriority(),
        projectName: task.getProject().getName(),
      }))
    }));
    localStorage.setItem('projects', JSON.stringify(projectsData));
  },

  loadProjects: function() {
    const projectsData = JSON.parse(localStorage.getItem('projects') || '[]');
    projectsData.forEach(projectData => {
      const project = Project.getOrCreateProject(projectData.name);
      projectData.tasks.forEach((taskData) => {
        new Task(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority,
            projectData.name
        );
      });
    });
  }
};