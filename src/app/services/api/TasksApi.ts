import {Injectable, bind} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Task, Period} from '../../models/task';
import {Subject, Observable, Subscriber} from 'rxjs';

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

    this.newServerTask.subscribe(
      (project: Array<Task>) => {
        //console.log('+++++++++++++newServerTask', project);
    });
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
    }, error => console.log('Could not load tasks.'));

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

    formData.task = task;
    formData.periods = periodsArr;
    
    dataStr = 'data=' + JSON.stringify(formData);

    this._http.put('http://localhost:3000/api/task/' + task.id, dataStr, {headers: headers}).map(response => response.json()).subscribe(data => {
      //console.log('response updateTask - ', data);
    }, error => console.log('Could not load tasks.'));

  }

}

export var tasksApiInjectables: Array<any> = [
  bind(TasksApi).toClass(TasksApi)
];
