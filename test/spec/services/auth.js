'use strict';

describe('Service: auth', function () {

  // load the service's module
  beforeEach(module('moraApp'));

  // instantiate service
  var Auth;
  beforeEach(inject(function (_Auth_) {
    Auth = _Auth_;
  }));

  it('should do something', function () {
    expect(!!Auth).toBe(true);
  });

});
