import {tasksServiceInjectables} from './tasks';

export * from './tasks';

export var servicesInjectables: Array<any> = [
  tasksServiceInjectables,
];
