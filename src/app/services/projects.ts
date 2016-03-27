import {Injectable, bind} from 'angular2/core';
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
    // this.projects = this.updates
    //   .scan((projects: Project[],
    //          operation: IProjectsOperation) => {
    //            return operation(projects);
    //          },
    //         initialProjects)
    //   .publishReplay(1)
    //   .refCount();

    // this.create
    //   .map( function(project: Project): IProjectsOperation {
    //     return (projects: Project[]) => {
    //       return projects.concat(project);
    //     };
    //   })
    //   .subscribe(this.updates);

    // this.newProjects
    //   .subscribe(this.create);
    this.projects = this._projectsApi.projects;
    this.projects.subscribe(
      (tasksX: Array<Project>) => {
        //console.log('service tasksX', tasksX);
    });

  }

  setProjects() {
    //this.projects = this._projectsApi.projects; 
    // this.projects = this._projectsApi.projects; 
    //this.projects.subscribe(this._projectsApi.projects);

    // this.newProjects.next(new Project({id: '1', name: 'Personal'}));
    // this.newProjects.next(new Project({id: '2', name: 'Work'}));
    // this.newProjects.next(new Project({id: '3', name: 'Family'}));
    this._projectsApi.loadProjects();
    //this.projects = this._projectsApi.projects;
  }

}

export var projectsServiceInjectables: Array<any> = [
  bind(ProjectsService).toClass(ProjectsService)
];
