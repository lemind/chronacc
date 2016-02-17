import {Component, ChangeDetectionStrategy} from 'angular2/core';

import {Timer} from './components/timer';
import {TaskItem} from './components/TaskItem';
import {TasksService} from '../../services/tasks';
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
  styles: [ require('./home.less') ],
  template: require('./home.html')
})
export class Home {
  task: Task;
  public tasks: Task[] = [];
  public tasksX: Observable<any>;

  constructor(public _tasksService: TasksService) {

  }

  ngOnInit() {
    console.log('CMP - home');
    this._tasksService.getTasks().then(tasks => this.tasks = tasks);

    this.tasksX = this._tasksService.tasksX;

    this.tasksX.subscribe(
      (tasksX: Array<Task>) => {
        console.log('home tasksX', tasksX);
    });
  }
}
