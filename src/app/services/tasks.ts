import {Injectable, bind} from 'angular2/core';
import {tasks} from './mock-task';
import {Task, Period} from '../models/task';
import {Project} from '../models/project';
import {Tag} from '../models/tag';
import {PeriodsService} from './periods';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
var moment = require('moment');

let initialTasks: Task[] = [];
interface ITasksOperation extends Function {
  (tasks: Task[]): Task[];
}

@Injectable()
export class TasksService {
  tasksX: Observable<Task[]>;
  newTasks: Subject<Task> = new Subject<Task>();
  updates: Subject<any> = new Subject<any>();
  create: Subject<Task> = new Subject<Task>();

  currentTask: Subject<Task> =
    new BehaviorSubject<Task>(new Task());

  constructor(public _periodsService: PeriodsService) {
     this.tasksX = this.updates
      .scan((tasks: Task[],
             operation: ITasksOperation) => {
               return operation(tasks);
             },
            initialTasks)
      .publishReplay(1)
      .refCount();

    this.create
      .map( function(task: Task): ITasksOperation {
        return (tasks: Task[]) => {
          return tasks.concat(task);
        };
      })
      .subscribe(this.updates);

    this.newTasks
      .subscribe(this.create);

    this.tasksX.subscribe(
      (tasksX: Array<Task>) => {
        console.log('service tasksX', tasksX);
    });

    this.setCurrentTask(new Task());
  }

  getTasks() {
  	return Promise.resolve(tasks);
  }

  updateTask(beginTime: number, endTime: number, time: number, oldTask: Task) {
    let task: Task;
    let lastPeriods: Observable<Period[]>;
    let lastPeriodCurrentTask: Period;
    lastPeriods = this._periodsService.periods.map((periods: Period[]) => {
      return periods.filter((period: Period) => {
        return period.task.id === oldTask.id;
      });
    });
    lastPeriods.subscribe((periods: Array<Period>) => {
      lastPeriodCurrentTask = periods[periods.length - 1];
    });

    //if now next day create new task
    if (lastPeriodCurrentTask && moment(beginTime).day() !== moment(lastPeriodCurrentTask.e).day()) {
      task = this.createTasks(time, oldTask.name);
    } else {
      oldTask.time = time;
      oldTask.active = false;
      let newPeriod: Period = {task: oldTask, b: beginTime, e: endTime};
      //oldTask.periods.push(newPeriod);
      task = oldTask;
    }

    let newPeriod: Period = {task: task, b: beginTime, e: endTime};
    this._periodsService.addPeriod(newPeriod);
  }

  createTasks(time: number, name?: string, project?: any) {
    let lastId;

    if (tasks.length > 0) {
      lastId = Number(tasks[tasks.length - 1].id);
    } else {
      lastId = 0;
    }

    let taskId = String(++lastId);

    let newTask: Task = new Task();
    newTask.id = taskId;
    newTask.time = time;
    newTask.name = name;
    newTask.project = project;
    newTask.active = true;

    tasks.push(newTask);
    this.newTasks.next(newTask);
    this.currentTask.next(newTask);
    return newTask;
  }

  setCurrentTask(currentTask: Task) {
    this.currentTask.next(currentTask);
  }
}

export var tasksServiceInjectables: Array<any> = [
  bind(TasksService).toClass(TasksService)
];
