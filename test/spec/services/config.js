'use strict';

describe('Service: config', function () {

  // load the service's module
  beforeEach(module('moraApp'));

  // instantiate service
  var Config;
  beforeEach(inject(function (_Config_) {
    Config = _Config_;
  }));

  it('should do something', function () {
    expect(!!Config).toBe(true);
  });

});
