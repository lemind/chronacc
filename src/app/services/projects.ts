import {Injectable, bind} from '@angular/core';
import {Project} from '../models/project';
import {ProjectsApi} from './api/ProjectsApi';
import {Subject, Observable} from 'rxjs';

let initialProjects: Project[] = [];
interface IProjectsOperation extends Function {
  (projects: Project[]): Project[];
}

@Injectable()
export class ProjectsService {
  projects: Observable<Project[]>;
  newProjects: Subject<Project>  = new Subject<Project>();
  updates: Subject<any> = new Subject<any>();
  create: Subject<Project> = new Subject<Project>();

  constructor(private _projectsApi: ProjectsApi) {
    this.projects = this._projectsApi.projects;
  }

  setProjects() {
    this._projectsApi.loadProjects();
  }
}

export var projectsServiceInjectables: Array<any> = [
  bind(ProjectsService).toClass(ProjectsService)
];
