'use strict';

describe('Service: authInterceptorService', function () {

  // load the service's module
  beforeEach(module('canteenClientApp'));

  // instantiate service
  var authInterceptorService;
  beforeEach(inject(function (_authInterceptorService_) {
    authInterceptorService = _authInterceptorService_;
  }));

  it('should do something', function () {
    expect(!!authInterceptorService).toBe(true);
  });

});
