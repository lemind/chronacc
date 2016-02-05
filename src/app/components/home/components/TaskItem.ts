import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {TaskService} from '../../../services/task';
import {Task} from '../../../models/task';
import {MsTimePipe} from '../../../pipes/ms-time';
import {Observable} from 'rxjs';
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

  constructor(public _taskService: TaskService) {

  }

  ngOnInit() {
    console.log('task item ', this.task);
    console.log('--------- ', this.timer);
  }
}
