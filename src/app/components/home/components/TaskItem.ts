import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {TasksService} from '../../../services/tasks';
import {Task} from '../../../models/task';
import {MsTimePipe} from '../../../pipes/ms-time';
import {Timer} from './timer';
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
  isActive: boolean = true;

  constructor(public _tasksService: TasksService) {

  }

  ngOnInit() {
    console.log('CMP - task item ', this.task, this.timer);
  }

  oldTaskStart() {
    this.task.active = true;
    this.timer.timerStart(this.task);
    this._tasksService.setCurrentTask(this.task);
  }
}
