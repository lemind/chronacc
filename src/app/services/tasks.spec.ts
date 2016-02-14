import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

// Load the implementations that should be tested
import {TasksService} from './tasks';
import {PeriodsService} from './periods';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    TasksService,
    PeriodsService
  ]);

  it('should ...', inject([ TasksService ], (taskService) => {
    expect(1).toEqual(1);
  }));
});