import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {TaskService} from '../../../services/task';
import {Task} from '../../../models/task';
import {MsTimePipe} from '../../../pipes/ms-time';
import {Observable} from 'rxjs';
var moment = require('moment');

@Component({
  selector: 'timer',
  providers: [ ],
  directives: [ ],
  pipes: [ MsTimePipe ],
  //changeDetection: ChangeDetectionStrategy.OnPushObserve,
  styles: [ ],
  template: require('./timer.html')
})
export class Timer {
  currentTime: number = 0;
  currentStartTime: number;
  timerToken: number;
  actionTitle: string;
  timerActive: boolean;
  currentTask: Task;
  tasks: Task[] = [];
  public tasksX: Observable<any>;

  constructor(public _taskService: TaskService) {
    this.timerActive = false;
    this.actionTitle = 'Start';
  }

  ngOnInit() {
    this.tasksX = this._taskService.tasksX;

    this.tasksX.subscribe(
      (tasksX: Array<Task>) => {
        console.log('timer tasksX', tasksX);
    });

  }

  timerAction() {
    if (this.timerActive) {
      this.timerStop();
    } else {
      this.timerStart();
    }
  }

  timerStart(oldTask?: Task) {
    if (oldTask) {
      this.currentTask = oldTask;
      this.currentStartTime = new Date().getTime() - oldTask.time;
    } else {
      this.currentStartTime = new Date().getTime();
    }
    this.timerTick();
    this.timerActive = true;
    this.actionTitle = 'Stop';
  }

  timerStop() {
    console.log('timerStop');
    clearTimeout(this.timerToken);
    this.actionTitle = 'Start';
    this.timerActive = !this.timerActive;
    this._taskService.updateTask(this.currentStartTime, new Date().getTime(), this.currentTime, this.currentTask);
    this.currentTask = null;
    this.currentTime = 0;
  }

  timerTick() {
    this.timerToken = setInterval(() => this.currentTime = this.getCurrentTime(), 1);
  }

  getCurrentTime() {
    return new Date().getTime() - this.currentStartTime;
  }

  test() {
    console.log('test', this.currentTime);
  }
}
