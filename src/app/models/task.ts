import {Project} from './project';
import {Tag} from './tag';

export class Task {
  id: string;
  time: number;
  periods: Period[];
  active: boolean;
  name: string;
  project: Project;

  constructor(obj?: any) {
    this.id              = obj && obj.id              || '0';
    this.time            = obj && obj.time            || 0;
    this.periods         = obj && obj.periods         || [];
    this.active          = obj && obj.active          || false;
    this.name            = obj && obj.name            || null;
    this.project         = obj && obj.project         || null;
  }
}

export class Period {
  task: Task;
  b: number;
  e: number;

  constructor(obj?: any) {
    this.task         = obj && obj.task         || null;
    this.b            = obj && obj.b            || null;
    this.e            = obj && obj.e            || null;
  }
}
