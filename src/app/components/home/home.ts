import {Component, ChangeDetectionStrategy} from 'angular2/core';

import {Timer} from './components/timer';
import {TaskItem} from './components/TaskItem';
import {TaskService} from '../../services/task';
import {Task} from '../../models/task';
import {MsTimePipe} from '../../pipes/ms-time';
import {Observable} from 'rxjs';

@Component({
  inputs: ['task'],
  selector: 'home',
  providers: [ ],
  directives: [ Timer, TaskItem ],
  //changeDetection: ChangeDetectionStrategy.OnPushObserve,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [ MsTimePipe ],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
  task: Task;
  public tasks: Task[] = [];
  public tasksX: Observable<any>;

  constructor(public _taskService: TaskService) {

  }

  ngOnInit() {
    this._taskService.getTasks().then(tasks => this.tasks = tasks);

    this.tasksX = this._taskService.tasksX;

    this.tasksX.subscribe(
      (tasksX: Array<Task>) => {
        console.log('home tasksX', tasksX);
    });
  }

}
