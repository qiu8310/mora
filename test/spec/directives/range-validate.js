'use strict';

describe('Directive: rangeValidate', function () {

  // load the directive's module
  beforeEach(module('moraApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<range-validate></range-validate>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rangeValidate directive');
  }));
});
