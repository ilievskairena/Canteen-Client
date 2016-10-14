'use strict';

/**
 * @ngdoc filter
 * @name canteenClientApp.filter:shortdate
 * @function
 * @description
 * # shortdate
 * Filter in the canteenClientApp.
 */
angular.module('canteenClientApp')
  .filter('shortdate', function () {
    return function (input) {
      	var date = new Date(input);
	    var day = date.getDate();
	    var month = date.getMonth() + 1;
	    var year = date.getFullYear();
	    return day + "." + month + "." +year;
    };
  });
