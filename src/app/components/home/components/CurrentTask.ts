import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {TasksService} from '../../../services/tasks';
import {Task} from '../../../models/task';
import {Project} from '../../../models/project';
import {ProjectsService} from '../../../services/services';
import {Observable} from 'rxjs';

@Component({
  selector: 'current-task',
  providers: [ ],
  directives: [ NgClass ],
  pipes: [ ],
  template: require('./CurrentTask.html'),
  styles: [ require('./CurrentTask.less') ],
})
export class CurrentTask {
  currentTask: Task;
  projects: Observable<any[]>;

  constructor(public _tasksService: TasksService,
              public _projectsService: ProjectsService) {

  }

  ngOnInit() {
    console.log('CMP - current task ');
    this.projects = this._projectsService.projects;

    this.projects.subscribe(
      (project: any) => {
        console.log('project--- ', project);
      });

    this._tasksService.currentTask.subscribe(
      (task: Task) => {
        this.currentTask = task;
      });

    //ToDo Fix it later https://github.com/urish/angular2-moment/issues/14
    window.setTimeout(() => {
      this._projectsService.setProjects();
    });
  }

  changeProject(event) {
    console.log('1-1-11', event);
    var selectedProject: any = this.projects.map((projects: any) => {
      return projects.filter((project: any) => {
        return project.id === event;
      })[0];
    });

    selectedProject.subscribe(
      (project: any) => {
        this.currentTask.project = project;
      });

  }

  setProject(project?) {
    return project ? project.id : 0;
  }

}
