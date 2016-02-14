import {Injectable, bind} from 'angular2/core';
import {tasks} from './mock-task';
import {Task, Period} from '../models/task';
import {PeriodsService} from './periods';
import {Subject, Observable} from 'rxjs';
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
  }

  getTasks() {
  	return Promise.resolve(tasks);
  }

  updateTask(beginTime: number, endTime: number, time: number, oldTask?: Task) {
    let task: Task;

    if (!oldTask) {
      //let newTask: Task = {'id': taskId, 'time': time, 'periods': [{b: beginTime, e: endTime}]};
      task = this.createTasks(time, oldTask);
    } else {

      //если время след день от последнего периода, то заводим новый такс.
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
      if (moment(beginTime).day() !== moment(lastPeriodCurrentTask.e).day()) {
        task = this.createTasks(time, oldTask);
      } else {
        oldTask.time = time;
        let newPeriod: Period = {task: oldTask, b: beginTime, e: endTime};
        //oldTask.periods.push(newPeriod);
        task = oldTask;
      }
    }
    let newPeriod: Period = {task: task, b: beginTime, e: endTime};
    this._periodsService.addPeriod(newPeriod);
  }

  createTasks(time: number, oldTask?: Task) {
    let lastId;

    if (tasks.length > 0) {
      lastId = Number(tasks[tasks.length - 1].id);
    } else {
      lastId = 0;
    }

    let taskId = oldTask ? oldTask.id : String(++lastId);

    let newTask: Task = {'id': taskId, 'time': time, 'periods': []};
    tasks.push(newTask);
    this.newTasks.next(newTask);
    return newTask;
  }
}

export var tasksServiceInjectables: Array<any> = [
  bind(TasksService).toClass(TasksService)
];
