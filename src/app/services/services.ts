import {tasksServiceInjectables} from './tasks';
import {periodsServiceInjectables} from './periods';

export * from './tasks';
export * from './periods';

export var servicesInjectables: Array<any> = [
  tasksServiceInjectables,
  periodsServiceInjectables
];
