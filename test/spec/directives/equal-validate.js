'use strict';

describe('Directive: equalValidate', function () {

  // load the directive's module
  beforeEach(module('moraApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<equal-validate></equal-validate>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the equalValidate directive');
  }));
});
