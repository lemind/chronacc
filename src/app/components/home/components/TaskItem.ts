import {Component, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {TasksService} from '../../../services/tasks';
import {ProjectsService} from '../../../services/services';
import {Task} from '../../../models/task';
import {MsTimePipe} from '../../../pipes/ms-time';
import {Observable} from 'rxjs';
import {Timer} from './timer';
import {Project} from '../../../models/project';
var moment = require('moment');

@Component({
  selector: 'task-item',
  providers: [ ],
  directives: [ Timer, NgClass ],
  pipes: [ MsTimePipe ],
  template: require('./TaskItem.html'),
  styles: [ require('./TaskItem.less') ],
})
export class TaskItem {
  @Input() task: Task;
  @Input() timer: Timer;
  isEdit: boolean = false;
  isActive: boolean = true;
  projects: Observable<any[]>;

  constructor(public _tasksService: TasksService,
              public _projectsService: ProjectsService) {}

  ngOnInit() {
    this.projects = this._projectsService.projects;
  }

  oldTaskStart() {
    this.task.active = true;
    this.timer.timerStart(this.task);
  }

  oldTaskDelete() {
    this._tasksService.deleteTask(this.task);
  }

  taskDblClick() {
    this.isEdit = !this.isEdit;
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
        this.task.project = project;
        this.task.projectId = project.id;
      });

    this._tasksService.updateTask(this.task);
  }

  nameOnBlur(event) {
    this._tasksService.updateTask(this.task);
  }

  setProject(project?) {
    return project ? project.id : 0;
  }
}
