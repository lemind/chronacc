import {Injectable, bind} from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

import {tasks} from './mock-task';
import {Task, Period} from '../models/task';
import {Project} from '../models/project';
import {Tag} from '../models/tag';

import {TasksApi} from './api/TasksApi';
import {PeriodsService} from './periods';
import {ProjectsService} from './projects';

var moment = require('moment');

let initialTasks: Task[] = [];
interface ITasksOperation extends Function {
  (tasks: Task[]): Task[];
}

@Injectable()
export class TasksService {
  tasksX: Observable<Task[]>;
  newServerTask: Observable<Task>;
  newTasks: Subject<Task> = new Subject<Task>();
  updates: Subject<any> = new Subject<any>();
  create: Subject<Task> = new Subject<Task>();
  firstTask: Task;

  currentTask: Subject<Task> =
    new BehaviorSubject<Task>(new Task());

  constructor(public _periodsService: PeriodsService,
              public _tasksApi: TasksApi,
              public _projectsService: ProjectsService) {
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
          let oldTask = false;
          tasks.map((_task: Task) => {
            if (_task.id === task.id) {
              _task.name = task.name;
              _task.active = task.active;
              _task.time = task.time;
              _task.project = task.project;
              _task.projectId = task.projectId;
              oldTask = true;
            }
          });
          let sortedTasks = oldTask ? tasks : tasks.concat(task);
          if (task.delete) {
            sortedTasks = sortedTasks.filter((_task: Task) => {
              return task.id !== _task.id
            });
          }
          sortedTasks.sort((a, b) => {
            return parseInt(b.id) - parseInt(a.id);
          });
          return sortedTasks;
        };
      })
      .subscribe(this.updates);

    this.newTasks
      .subscribe(this.create);

    this.setCurrentTask(new Task());

    this._tasksApi.newServerTask.subscribe((newTask: Task) => {
      tasks.push(newTask);
      this.newTasks.next(newTask);
      newTask.active && this.currentTask.next(newTask);
    });

    this._tasksApi.tasks.subscribe((tasks: Task[]) => {
      for (let i = 0; i < tasks.length; i++) {
        let newTask: Task = new Task(tasks[i]);
        this.newTasks.next(newTask);
        newTask.active && this.currentTask.next(newTask);
      }
      this.firstTask = tasks[0];
    });

    //ToDo: move to another func
    this._projectsService.projects.subscribe((projects: Project[]) => {
      this.tasksX.subscribe((tasks: Task[]) => {
        return tasks.map((task: Task) => {
          let currentProject = projects.filter((project: Project) => {
            return project.id === task.projectId;
          });
          return task.project = currentProject[0];
        });
      });
    });
  }

  getTasks() {
  	return Promise.resolve(tasks);
  }

  loadTasks() {
    if (this.firstTask) {
      let endDate = moment(this.firstTask.data, 'DD/MM/YY').format('YYYY-MM-DD');
      let beginDate = moment(endDate, 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD');
      this._tasksApi.loadTasks(beginDate, endDate);
    } else {
      this._tasksApi.loadTasks();
    }
  }

  prepareUpdateTask(beginTime: number, endTime: number, time: number, oldTask: Task) {
    let task: Task;
    let periodsArray: Period[] = [];
    let lastPeriodCurrentTask: Period;
    let newTaskFl = false;

    periodsArray = this._periodsService.getPeriodsByTaskId(oldTask.id);
    lastPeriodCurrentTask = periodsArray[periodsArray.length - 1];

    //if now is next day create new task
    if (lastPeriodCurrentTask && lastPeriodCurrentTask.e && moment(beginTime).day() !== moment(lastPeriodCurrentTask.e).day()) {
      oldTask.active = false;
      task = this.createTasks(0, beginTime, oldTask.name, oldTask.project);
      newTaskFl = true;
    } else {
      oldTask.time = time;
      task = oldTask;
    }

    let newPeriod: Period = {task: task, b: beginTime, e: endTime || null};
    this._periodsService.addPeriod(newPeriod);

    !newTaskFl && this.updateTask(task);
    return newTaskFl;
  }

  updateTask(task: Task) {
    let periodsArray: Period[] = [];

    periodsArray = this._periodsService.getPeriodsByTaskId(task.id);

    this._tasksApi.updateTask(task, periodsArray);
  }

  createTasks(time: number, beginTime: number, name?: string, project?: any) {
    let newTask: Task = new Task();
    let newTaskServer: Task;

    newTask.time = time;
    newTask.name = name;
    newTask.project = project;
    if (project) {
      newTask.projectId = project.id || '1';
    }
    newTask.active = true;

    let periodsArray: Period[] = [];
    let newPeriod: Period = new Period({b: beginTime});
    periodsArray.push(newPeriod);

    this._tasksApi.createTask(newTask, periodsArray);

    return newTask;
  }

  setCurrentTask(currentTask: Task) {
    this.currentTask.next(currentTask);
  }

  deleteTask(task: Task) {
    task.delete = true;
    this.newTasks.next(task)
  }

}

export var tasksServiceInjectables: Array<any> = [
  bind(TasksService).toClass(TasksService)
];
