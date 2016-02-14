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
import {Timer} from './timer';
import {Task} from '../../../models/task';

describe('Timer', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Timer,
    TasksService,
    PeriodsService,
    Task
  ]);

  it('should invoke timer action func depends on timer status', inject([ Timer ], (timer) => {
    timer.timerActive = true;
    spyOn(timer, 'timerStop');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerAction();
    expect(timer.timerStop).toHaveBeenCalled();
  }));

  it('should invoke timerStop if timer is active', inject([ Timer ], (timer) => {
    timer.timerActive = true;
    spyOn(timer, 'timerStop');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerStart();
    expect(timer.timerStop).toHaveBeenCalled();
  }));

  it('should not invoke timerStop if timer ist active', inject([ Timer ], (timer) => {
    timer.timerActive = false;
    spyOn(timer, 'timerStop');
    expect(timer.timerStop).not.toHaveBeenCalled();
    timer.timerStart();
    expect(timer.timerStop).not.toHaveBeenCalled();
  }));

  it('should set true to timerActive', inject([ Timer ], (timer) => {
    timer.timerActive = false;
    timer.timerStart();
    expect(timer.timerActive).toEqual(true);
  }));

  // it('should set currentTask if there is oldTask in params', inject([ Timer ], (timer) => {
  //   let task: Task = {'id': '1', 'time': 1000, 'periods': [{b: 0, e: 1000}]};
  //   timer.timerStart(task);
  //   expect(timer.currentTask).toEqual(task);
  // }));

  // it('should set correct currentStartTime if there is oldTask in params', inject([ Timer ], (timer) => {
  //   let task: Task = {'id': '1', 'time': 1000, 'periods': [{b: 0, e: 1000}]};
  //   timer.timerStart(task);
  //   expect(new Date().getTime() - timer.currentStartTime).not.toBeLessThan(900);
  // }));

  it('should set correct currentStartTime if there is not oldTask in params', inject([ Timer ], (timer) => {
    timer.timerStart();
    expect(new Date().getTime() - timer.currentStartTime).toBeLessThan(900);
  }));

  it('should reset variables amd invoke updateTask', inject([ Timer, TasksService ], (timer, taskService) => {
    spyOn(taskService, 'updateTask');
    timer.timerStop();
    expect(timer.actionTitle).toEqual('Start');
    expect(timer.timerActive).toEqual(false);
    expect(timer.currentTask).toEqual(null);
    expect(timer.currentTime).toEqual(0);
    expect(taskService.updateTask).toHaveBeenCalled();
  }));

  it('should get correct currentTime', inject([ Timer ], (timer) => {
    timer.currentTime = 1000;
    expect(timer.getCurrentTime()).toEqual(new Date().getTime() - this.currentStartTime);
  }));
});
