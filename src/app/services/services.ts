import {tasksServiceInjectables} from './tasks';
import {periodsServiceInjectables} from './periods';
import {projectsServiceInjectables} from './projects';

import {tasksApiInjectables} from './api/TasksApi';
import {projectsApiInjectables} from './api/ProjectsApi';

export * from './tasks';
export * from './periods';
export * from './projects';

export * from './api/TasksApi';
export * from './api/ProjectsApi';

export var servicesInjectables: Array<any> = [
  tasksServiceInjectables,
  periodsServiceInjectables,
  projectsServiceInjectables,
  tasksApiInjectables,
  projectsApiInjectables
];
