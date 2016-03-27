import {Injectable, bind} from 'angular2/core';
import {Http} from 'angular2/http';
import {Project} from '../../models/project';
import {Subject, Observable, Subscriber} from 'rxjs';

@Injectable()
export class ProjectsApi {
  projects: Observable<Project[]>;
  private _projectsSubscriber: Subscriber<Project[]>;
  private _dataStore: {
      projects: Project[];
  };

  constructor(private _http: Http) {
    this.projects = new Observable(subscriber => 
      this._projectsSubscriber = subscriber)
        .publishReplay(1)
        .refCount();
  
    this._dataStore = { projects: [] };

    this.projects.subscribe(
      (project: Array<Project>) => {
        //console.log('service tasksX999', project);
    });
  }

  loadProjects() {
    this._http.get('http://localhost:3000/api/projects').map(response => response.json()).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this._dataStore.projects.push(new Project(data[i]));
      }
      this._projectsSubscriber.next(this._dataStore.projects);
    }, error => console.log('Could not load projects.'));
  }

}

export var projectsApiInjectables: Array<any> = [
  bind(ProjectsApi).toClass(ProjectsApi)
];
