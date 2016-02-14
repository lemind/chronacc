import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

// Load the implementations that should be tested
import {Home} from './home';
import {TasksService} from '../../services/tasks';
import {PeriodsService} from '../../services/periods';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Home,
    TasksService,
    PeriodsService
  ]);

  it('should ...', inject([ Home ], (home) => {
    expect(1).toEqual(1);
  }));
});
