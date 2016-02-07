import {Component, Input} from 'angular2/core';
import {TasksService} from '../../../services/tasks';
import {Task} from '../../../models/task';
import {MsTimePipe} from '../../../pipes/ms-time';
import {Timer} from './timer';
var moment = require('moment');

@Component({
  selector: 'task-item',
  providers: [ ],
  directives: [ Timer ],
  pipes: [ MsTimePipe ],
  styles: [ ],
  template: require('./TaskItem.html')
})
export class TaskItem {
  @Input() task: Task;
  @Input() timer: Timer;

  constructor(public _tasksService: TasksService) {

  }

  ngOnInit() {
    console.log('CMP - task item ', this.task, this.timer);
  }
}
