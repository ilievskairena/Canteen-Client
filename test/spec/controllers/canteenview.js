'use strict';

describe('Controller: CanteenviewCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenClientApp'));

  var CanteenviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CanteenviewCtrl = $controller('CanteenviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CanteenviewCtrl.awesomeThings.length).toBe(3);
  });
});
