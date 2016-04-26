import {provide} from 'angular2/core';
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
import {ProjectsService} from './projects';
import {TasksApi} from './api/TasksApi';
import {ProjectsApi} from './api/ProjectsApi';
import {Http, Headers} from 'angular2/http';

class HttpMock{}

describe('Tasks', () => {
  beforeEachProviders(() => [
    TasksService,
    PeriodsService,
    ProjectsService,
    TasksApi,
    ProjectsApi,
    provide(Http, {useClass: HttpMock}),
  ]);

  it('should ...', inject([ TasksService ], (taskService) => {
    expect(1).toEqual(1);
  }));
});