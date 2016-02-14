import {Injectable, bind} from 'angular2/core';
import {Task, Period} from '../models/task';
import {Subject, Observable} from 'rxjs';

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

  constructor() {
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

    this.periods.subscribe(
      (periods: Array<Period>) => {
        console.log('service periods', periods);
    });

  }

  addPeriod(newPeriod?: Period) {
    this.newPeriods.next(newPeriod);
  }

}

export var periodsServiceInjectables: Array<any> = [
  bind(PeriodsService).toClass(PeriodsService)
];
