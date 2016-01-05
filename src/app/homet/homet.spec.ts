import {
  it,
  inject,
  injectAsync,
  describe,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

// Load the implementations that should be tested
import {Homet} from './homet';
import {Title} from './providers/title';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    Title,
    Homet,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);

  it('should have a title', inject([ Homet ], (homet) => {
    expect(homet.title.value).toEqual('Angular 2');
  }));

  it('should have a http', inject([ Homet ], (homet) => {
    expect(!!homet.http).toEqual(true);
  }));

  it('should log ngOnInit', inject([ Homet ], (homet) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    homet.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
