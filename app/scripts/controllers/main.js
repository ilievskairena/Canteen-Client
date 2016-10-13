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

    vm.addCardListener = function(){
        document.addEventListener("keyup",function(e){
            if(e.keyCode != 13){
                vm.cardNumber.push(e.key);
                if(vm.cardNumber.length == 11){
                    vm.checkPersonCard(vm.cardNumber);
                }
            }
        }, false);
    };

    vm.checkPersonCard = function(card){
        var userCard = vm.makeNumberString(card);
        $http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/orders/userOrdersByCard/?cardNumber="+ userCard.toString()
        }).
        success(function(data) {
            //console.log(data);
            if(data != null ){
                vm.waitingList.push(data);
                console.log(data);
                vm.cardNumber = [];
                vm.getMealsForDate();
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting user");
        });
    };

  });
