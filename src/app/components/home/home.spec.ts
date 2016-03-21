import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder,
  ComponentFixture
} from 'angular2/testing';

// Load the implementations that should be tested
import {Home} from './home';
import {CurrentTask} from './components/CurrentTask';
import {Timer} from './components/timer';
import {TasksService} from '../../services/tasks';
import {PeriodsService} from '../../services/periods';
import {ProjectsService} from '../../services/services';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    //Home,
    TasksService,
    PeriodsService,
    ProjectsService,
    CurrentTask
  ]);

  it('should ...', inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
  //it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    expect(1).toEqual(1);
    // return tcb.createAsync(Home)
    //    .then((fixture: any) => {
    //      console.log('11');
    //      console.log(fixture);
    //      expect(1).toEqual(1);
    //    });
  }));
});
