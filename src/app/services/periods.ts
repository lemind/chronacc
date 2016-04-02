import {Injectable, bind} from 'angular2/core';
import {Task, Period} from '../models/task';
import {Subject, Observable} from 'rxjs';

import {TasksApi} from './api/TasksApi';

let initialTasks: Period[] = [];
interface IPeriodsOperation extends Function {
  (periods: Period[]): Period[];
}

@Injectable()
export class PeriodsService {
  periods: Observable<Period[]>;
  newPeriods: Subject<Period> = new Subject<Period>();
  updates: Subject<any> = new Subject<any>();
  create: Subject<Period> = new Subject<Period>();

  constructor(public _tasksApi: TasksApi) {
    this.periods = this.updates
      .scan((periods: Period[],
             operation: IPeriodsOperation) => {
               return operation(periods);
             },
            initialTasks)
      .publishReplay(1)
      .refCount();

    this.create
      .map( function(period: Period): IPeriodsOperation {
        return (periods: Period[]) => {
          return periods.concat(period);
        };
      })
      .subscribe(this.updates);

    this.newPeriods
      .subscribe(this.create);

    //why do it need me?
    this.periods.subscribe((pr: Period[]) => {
      //console.log('pr', pr);
    });

    this._tasksApi.tasks.subscribe((tasks: Task[]) => {
      for (let i = 0; i < tasks.length; i++) {
        for (var j = 0; j < tasks[i].periods.length; j++) {
          let period = tasks[i].periods[j];
          period.task = tasks[i];
          let newPeriod: Period = new Period(period);
          this.newPeriods.next(newPeriod);
        }
      }
    });
  }

  addPeriod(newPeriod?: Period) {
    let lastPeriods: Observable<Period[]>;
    let periodsArray: Period[] = [];
    let lastPeriodCurrentTask: Period;

    lastPeriods = this.periods.map((periods: Period[]) => {
      return periods.filter((period: Period) => {
        return period.task.id === newPeriod.task.id;
      });
    });

    lastPeriods.subscribe((periods: Array<Period>) => {
      lastPeriodCurrentTask = periods[periods.length - 1];
    });

    if (lastPeriodCurrentTask && !lastPeriodCurrentTask.e) {
      lastPeriodCurrentTask.e = newPeriod.e;
    } else {
      this.newPeriods.next(newPeriod);
    }
  }

  getLastPeriodByTaskId(taskId?: string) {
    let lastPeriods: Observable<Period[]>;
    let lastPeriodCurrentTask: Period;

    lastPeriods = this.periods.map((periods: Period[]) => {
      return periods.filter((period: Period) => {
        return period.task.id === taskId;
      });
    });

    lastPeriods.subscribe((periods: Array<Period>) => {
      lastPeriodCurrentTask = periods[periods.length - 1];
    });

    return lastPeriodCurrentTask;
  }
}

export var periodsServiceInjectables: Array<any> = [
  bind(PeriodsService).toClass(PeriodsService)
];
