import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';


// Load the implementations that should be tested
import {TasksService} from '../../../services/tasks';
import {Timer} from './timer';
import {Task} from '../../../models/task';

describe('TaskItem', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Timer,
    TasksService
  ]);

  it('should ...', inject([  ], () => {
    expect(1).toEqual(1);
  }));
});
