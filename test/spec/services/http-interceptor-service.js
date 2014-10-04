'use strict';

describe('Service: httpInterceptorService', function () {

  // load the service's module
  beforeEach(module('moraApp'));

  // instantiate service
  var httpInterceptorService;
  beforeEach(inject(function (_httpInterceptorService_) {
    httpInterceptorService = _httpInterceptorService_;
  }));

  it('should do something', function () {
    expect(!!httpInterceptorService).toBe(true);
  });

});
