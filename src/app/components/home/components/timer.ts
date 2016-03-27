import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {TasksService} from '../../../services/tasks';
import {Task} from '../../../models/task';
import {Project} from '../../../models/project';
import {Tag} from '../../../models/tag';
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
  previouslyTask: Task;
  tasks: Task[] = [];
  public tasksX: Observable<any>;

  constructor(public _tasksService: TasksService) {
    this.timerActive = false;
    this.actionTitle = 'Start';
  }

  ngOnInit() {
    this.tasksX = this._tasksService.tasksX;

    this.tasksX.subscribe(
      (tasksX: Array<Task>) => {
        //console.log('timer tasksX', tasksX);
    });

    this._tasksService.currentTask.subscribe(
      (task: Task) => {
        this.previouslyTask = task;
        this.currentTask = task;
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
    let draftName;
    let draftProject;

    if (this.previouslyTask) {
      if (this.previouslyTask.name) {
        draftName = this.previouslyTask.name;
      }
      if (this.previouslyTask.project) {
        draftProject = this.previouslyTask.project;
      }
    }

    if (this.timerActive) {
      this.timerStop();
    }
    if (oldTask) {
      this.currentTask = oldTask;
      this.currentTask.active = true;
      this.currentStartTime = new Date().getTime() - oldTask.time;
      this._tasksService.updateTask(
        this.currentStartTime,
        null,
        this.currentTask.time,
        this.currentTask);
    } else {
      this.currentStartTime = new Date().getTime();
      this._tasksService.createTasks(
          0,
          this.currentStartTime,
          draftName || '',
          draftProject || null
        );
    }
    this.timerTick();
    this.timerActive = true;
    this.actionTitle = 'Stop';
  }

  timerStop() {
    clearTimeout(this.timerToken);
    this.actionTitle = 'Start';
    this.timerActive = false;
    this.currentTask.active = false;
    this._tasksService.updateTask(
      this.currentStartTime,
      new Date().getTime(),
      this.currentTime,
      this.currentTask);
    this.currentTask = null;
    this.currentTime = 0;
    this._tasksService.currentTask.next(new Task());
  }

  timerTick() {
    this.timerToken = setInterval(() => this.currentTime = this.getCurrentTime(), 1);
  }

  getCurrentTime() {
    return new Date().getTime() - this.currentStartTime;
  }
}
