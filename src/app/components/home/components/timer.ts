import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {TasksService} from '../../../services/tasks';
import {PeriodsService} from '../../../services/periods';
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

  constructor(public _tasksService: TasksService,
              public _periodsService: PeriodsService) {
    this.timerActive = false;
    this.actionTitle = 'Start';

  }

  ngOnInit() {
    this.tasksX = this._tasksService.tasksX;

    this._tasksService.currentTask.subscribe(
      (task: Task) => {
        this.previouslyTask = task;
        this.currentTask = task;
      });

    this._tasksService.currentTask.subscribe((task: Task) => {
      if (task.active && !task.periods[task.periods.length - 1].e) {
        this.currentStartTime =  task.periods[task.periods.length - 1].b - task.time;
        clearTimeout(this.timerToken);
        this.timerTick();
        this.actionTitle = 'Stop';
        this.timerActive = true;
      }
    });

  }

  timerAction() {
    if (this.timerActive) {
      this.timerStop(true);
    } else {
      this.timerStart();
    }
  }

  timerStart(oldTask?: Task) {
    let draftName;
    let draftProject;
    let newTaskFl;

    if (this.previouslyTask) {
      if (this.previouslyTask.name) {
        draftName = this.previouslyTask.name;
      }
      if (this.previouslyTask.project) {
        draftProject = this.previouslyTask.project;
      }
    }

    if (this.timerActive) {
      this.timerStop(false);
    }
    if (oldTask) {
      this.currentTask = oldTask;

      if (this._periodsService.getLastPeriodByTaskId(oldTask.id).e) {
        this.currentStartTime = new Date().getTime() - oldTask.time;
        newTaskFl = this._tasksService.prepareUpdateTask(
          this.currentStartTime + oldTask.time,
          null,
          this.currentTask.time,
          this.currentTask);
      } else {
        this.currentStartTime = oldTask.periods[oldTask.periods.length - 1].b - oldTask.time;
      }
    } else {
      this.currentStartTime = new Date().getTime();
      this._tasksService.createTasks(
          0,
          this.currentStartTime,
          draftName || '',
          draftProject || null
        );
      newTaskFl = true;
    }

    if (!newTaskFl) {
      this.timerTick();
      this.actionTitle = 'Stop';
      this.timerActive = true;
      this.currentTask.active = true;
    }
  }

  timerStop(needBlankTask?: boolean) {
    clearTimeout(this.timerToken);
    this.actionTitle = 'Start';
    this.timerActive = false;
    this.currentTask.active = false;

    this._tasksService.prepareUpdateTask(
      this.currentStartTime,
      new Date().getTime(),
      this.currentTime,
      this.currentTask);

    this.currentTask = null;
    this.currentTime = 0;
    needBlankTask && this._tasksService.setCurrentTask(new Task());
  }

  timerTick() {
    this.timerToken = setInterval(() => this.currentTime = this.getCurrentTime(), 1);
  }

  getCurrentTime() {
    return new Date().getTime() - this.currentStartTime;
  }
}
