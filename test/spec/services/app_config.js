'use strict';

describe('Service: APPCONFIG', function () {

  // load the service's module
  beforeEach(module('canteenClientApp'));

  // instantiate service
  var APPCONFIG;
  beforeEach(inject(function (_APPCONFIG_) {
    APPCONFIG = _APPCONFIG_;
  }));

  it('should do something', function () {
    expect(!!APPCONFIG).toBe(true);
  });

});
