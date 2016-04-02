import {Injectable, bind} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Task, Period} from '../../models/task';
import {Project} from '../../models/project';
import {Subject, Observable, Subscriber} from 'rxjs';

var moment = require('moment');

@Injectable()
export class TasksApi {
  tasks: Observable<Task[]>;
  newServerTask: Observable<Task>;
  private _tasksSubscriber: Subscriber<Task[]>;
  private _newServerTaskSubscriber: Subscriber<Task>;
  private _dataStore: {
      tasks: Task[];
  };

  constructor(private _http: Http) {
    this.tasks = new Observable(subscriber =>
      this._tasksSubscriber = subscriber)
        .publishReplay(1)
        .refCount();

    this._dataStore = { tasks: [] };

    this.newServerTask = new Observable(subscriber =>
      this._newServerTaskSubscriber = subscriber)
        .publishReplay(1)
        .refCount();
  }

  loadTasks() {
    this._http.get('http://localhost:3000/api/tasks').map(response => response.json()).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let task: Task = new Task();
        task.id = data[i].id;
        task.name = data[i].desc;
        task.time = data[i].time;
        task.active = data[i].status ? true : false;
        task.projectId = data[i].project_id.toString();
        task.periods = JSON.parse(data[i].periods);
        task.data = moment(task.periods[0].b).format('DD/MM/YY');

        this._dataStore.tasks.push(task);
      }
      this._tasksSubscriber.next(this._dataStore.tasks);
    }, error => console.log('Could not load tasks.', error));
  }

  createTask(newTask: Task, periods: Period[]) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let dataStr = '';
    let formData = {task: null, periods: []};

    let periodsArr = periods.map(function(period) {
      let periodObj = {b: null, e: null};
      periodObj.b = period.b;
      return periodObj;
    });

    formData.task = newTask;
    formData.periods = periodsArr;

    dataStr = 'data=' + JSON.stringify(formData);

    this._http.post('http://localhost:3000/api/task', dataStr, {headers: headers}).map(response => response.json()).subscribe(data => {
      console.log('response', data);
      this._newServerTaskSubscriber.next(new Task(data));
    }, error => console.log('Could not create tasks.', error));
  }

  updateTask(task: Task, periods: Period[]) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let dataStr = '';
    let formData = {task: null, periods: []};

    let periodsArr = periods.map(function(period) {
      let periodObj = {b: null, e: null};
      periodObj.b = period.b;
      periodObj.e = period.e;
      return periodObj;
    });

    task.periods = [];
    formData.task = task;
    formData.periods = periodsArr;

    dataStr = 'data=' + JSON.stringify(formData);

    this._http.put('http://localhost:3000/api/task/' + task.id, dataStr, {headers: headers}).map(response => response.json()).subscribe(data => {
      this._newServerTaskSubscriber.next(new Task(data));
    }, error => console.log('Could not update tasks.', error));
  }

}

export var tasksApiInjectables: Array<any> = [
  bind(TasksApi).toClass(TasksApi)
];
