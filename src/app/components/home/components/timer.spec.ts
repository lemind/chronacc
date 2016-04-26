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
import {TasksService} from '../../../services/tasks';
import {PeriodsService} from '../../../services/periods';
import {ProjectsService} from '../../../services/projects';
import {TasksApi} from '../../../services/api/TasksApi';
import {ProjectsApi} from '../../../services/api/ProjectsApi';
import {Timer} from './timer';
import {Http} from 'angular2/http';
import {Observable, Subscriber} from 'rxjs';

//ToDo: check it
class HttpMock{
  post() {
    let response: Observable<any[]>;
    let mockSubscriber: Subscriber<any[]>;

    response = new Observable(subscriber =>
      mockSubscriber = subscriber)
        .publishReplay(1)
        .refCount();

    mockSubscriber.next([{id: '1'}, {id: '2'}]);
    return response;
  }
}

describe('Timer', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Timer,
    TasksService,
    PeriodsService,
    ProjectsService,
    TasksApi,
    ProjectsApi,
    provide(Http, {useClass: HttpMock}),
  ]);

  it('should invoke timer action func depends on timer status', inject([ Timer ], (timer) => {
    timer.timerActive = true;
    spyOn(timer, 'timerStop');
    spyOn(timer, 'timerStart');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerAction();
    expect(timer.timerStop).toHaveBeenCalled();
  }));

  it('should invoke timerStop if timer is active', inject([ Timer, TasksService ], (timer, tasksService) => {
    spyOn(tasksService, "createTasks");
    spyOn(tasksService, "prepareUpdateTask");
    timer.timerActive = true;
    spyOn(timer, 'timerStop');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerStart();
    expect(timer.timerStop).toHaveBeenCalled();
  }));

  it('should not invoke timerStop if timer ist active', inject([ Timer, TasksService ], (timer, tasksService) => {
    spyOn(tasksService, "createTasks");
    spyOn(tasksService, "prepareUpdateTask");
    timer.timerActive = false;
    spyOn(timer, 'timerStop');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerStart();
    expect(timer.timerStop).not.toHaveBeenCalled();
  }));

  it('should set correct currentStartTime if there is not oldTask in params', inject([ Timer, TasksService ], (timer, tasksService) => {
    spyOn(tasksService, "createTasks");
    spyOn(tasksService, "prepareUpdateTask");
    timer.timerStart();
    expect(new Date().getTime() - timer.currentStartTime).toBeLessThan(900);
  }));

  it('should get correct currentTime', inject([ Timer ], (timer) => {
    timer.currentTime = 1000;
    expect(timer.getCurrentTime()).toEqual(new Date().getTime() - this.currentStartTime);
  }));
});
