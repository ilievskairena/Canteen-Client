'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:CanteenviewCtrl
 * @description
 * # CanteenviewCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('CanteenviewCtrl', function ($http) {
    var vm = this;

	vm.cardNumber= [];
	vm.waitingList = [];
	vm.addCardListener = function(){
    	document.addEventListener("keyup",function(e){
		 	if(e.keyCode != 13){
		 		vm.cardNumber.push(e.key);
			 	if(vm.cardNumber.length == 11){
			 		var person = vm.checkPersonCard(vm.cardNumber);
				 	if(person != null){
				 		vm.waitingList.push(person);
				 		vm.cardNumber = [];
				 	}
				}
		  	}
		  	console.log(e);
    	}, false);
    };

    vm.checkPersonCard = function(card){
    	$http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/users/getUserForCard"
            params: { CardNum : card.join("")};
        }).
        success(function(data) {
            console.log(data);
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting user");
        });
    };
    vm.addCardListener();
  });
