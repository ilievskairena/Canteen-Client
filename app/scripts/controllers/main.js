'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('MainCtrl', function ($location, $timeout) {
    
    var vm = this;
    var inputChangedPromise;

    vm.LogInUser = function(){
    	if(inputChangedPromise){
	        $timeout.cancel(inputChangedPromise);
	    }
	    inputChangedPromise = $timeout(vm.redirect(),1000);
    };

    vm.redirect = function() {

    	$location.path("/clientView");
    };
    vm.printit = function(){
    	document.addEventListener("keyup",function(e){console.log("BROJOT E = " + e.key)}, false);
    };
    vm.printit();
  });
