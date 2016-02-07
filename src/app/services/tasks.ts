import {Injectable, bind} from 'angular2/core';
import {tasks} from './mock-task';
import {Task, Period} from '../models/task';
import {Subject, Observable} from 'rxjs';

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

  constructor() {
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
    if (!oldTask) {
      let lastId = Number(tasks[tasks.length - 1].id);
      let newTask: Task = {'id': String(++lastId), 'time': time, 'periods': [{b: beginTime, e: endTime}]};
      tasks.push(newTask);
      this.newTasks.next(newTask);
    } else {
      oldTask.time = time;
      let newPeriod: Period = {b: beginTime, e: endTime};
      oldTask.periods.push(newPeriod);
    }
  }
}

export var tasksServiceInjectables: Array<any> = [
  bind(TasksService).toClass(TasksService)
];
