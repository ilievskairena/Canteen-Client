'use strict';

describe('Controller: ClientviewCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenClientApp'));

  var ClientviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientviewCtrl = $controller('ClientviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientviewCtrl.awesomeThings.length).toBe(3);
  });
});
