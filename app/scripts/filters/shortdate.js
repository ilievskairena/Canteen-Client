(function(){
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
  	.filter('shortdate', shortdate);

  	shortdate.$inject = [];

  	function shortdate() {

  		return filter;

  		// Define functions here

     	function filter(input) {
	      	var date = new Date(input);
		    var day = date.getDate();
		    var month = date.getMonth() + 1;
		    var year = date.getFullYear();
		    return day + "." + month + "." +year;
	    }
  	}
})();