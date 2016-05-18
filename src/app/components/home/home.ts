import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs';

import {Timer} from './components/timer';
import {TaskItem} from './components/TaskItem';
import {CurrentTask} from './components/CurrentTask';

import {TasksService} from '../../services/tasks';
import {ProjectsService} from '../../services/services';

import {Task} from '../../models/task';
import {Project} from '../../models/project';

import {MsTimePipe} from '../../pipes/ms-time';

@Component({
  inputs: ['task'],
  selector: 'home',
  providers: [ ],
  directives: [ Timer, TaskItem, CurrentTask ],
  //changeDetection: ChangeDetectionStrategy.OnPushObserve,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [ MsTimePipe ],
  styles: [ require('./home.less') ],
  template: require('./home.html')
})
export class Home {
  task: Task;
  public tasks: Task[] = [];
  public tasksX: Observable<any>;
  currentTask: any;

  constructor(public _tasksService: TasksService,
              public _projectsService: ProjectsService) {

  }

  ngOnInit() {
    this._tasksService.getTasks().then(tasks => this.tasks = tasks);

    this.tasksX = this._tasksService.tasksX;
    this._tasksService.loadTasks();
  }

  loadMoreTasks() {
    this._tasksService.loadTasks();
  }
}
