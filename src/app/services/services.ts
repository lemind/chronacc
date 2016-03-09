import {tasksServiceInjectables} from './tasks';
import {periodsServiceInjectables} from './periods';
import {projectsServiceInjectables} from './projects';

export * from './tasks';
export * from './periods';
export * from './projects';

export var servicesInjectables: Array<any> = [
  tasksServiceInjectables,
  periodsServiceInjectables,
  projectsServiceInjectables
];
