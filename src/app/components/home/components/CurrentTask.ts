import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {TasksService} from '../../../services/tasks';
import {Task} from '../../../models/task';
import {Project} from '../../../models/project';
import {ProjectsService} from '../../../services/services';
import {Observable} from 'rxjs';
import {Timer} from './timer';

@Component({
  selector: 'current-task',
  providers: [ ],
  directives: [ Timer, NgClass ],
  pipes: [ ],
  template: require('./CurrentTask.html'),
  styles: [ require('./CurrentTask.less') ],
})
export class CurrentTask {
  @Input() timer: Timer;
  currentTask: Task;
  projects: Observable<any[]>;

  constructor(public _tasksService: TasksService,
              public _projectsService: ProjectsService) {

  }

  ngOnInit() {
    this.projects = this._projectsService.projects;

    this._tasksService.currentTask.subscribe(
      (task: Task) => {
        this.currentTask = task;
      });

    //ToDo Fix it later https://github.com/urish/angular2-moment/issues/14
    window.setTimeout(() => {
      this._projectsService.setProjects();
    });
  }

  //ToDo: why invoke twice?
  changeProject(event) {
    var selectedProject: any = this.projects.map((projects: any) => {
      return projects.filter((project: any) => {
        return project.id === event;
      })[0];
    });

    selectedProject.subscribe(
      (project: any) => {
        this.currentTask.project = project;
        this.currentTask.projectId = project.id;
      });

    this._tasksService.updateTask(this.currentTask);
  }

  nameOnBlur(event) {
    this._tasksService.updateTask(this.currentTask);
  }

  setProject(project?) {
    return project ? project.id : 0;
  }

}
