'use strict';

describe('Filter: shortdate', function () {

  // load the filter's module
  beforeEach(module('canteenClientApp'));

  // initialize a new instance of the filter before each test
  var shortdate;
  beforeEach(inject(function ($filter) {
    shortdate = $filter('shortdate');
  }));

  it('should return the input prefixed with "shortdate filter:"', function () {
    var text = 'angularjs';
    expect(shortdate(text)).toBe('shortdate filter: ' + text);
  });

});
