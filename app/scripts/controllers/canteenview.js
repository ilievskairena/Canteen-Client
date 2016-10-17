'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:CanteenviewCtrl
 * @description
 * # CanteenviewCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('CanteenviewCtrl', function ($http,$filter) {
    var vm = this;

	vm.cardNumber= [];
    vm.guestSelection = [];
	vm.waitingList = [];
    vm.mealsForDay = [];

	vm.addCardListener = function(){
    	document.addEventListener("keyup",function(e){
            if(e.key=="Enter")
                console.log(e);
		 	if(e.keyCode != 13){
		 		vm.cardNumber.push(e.key);
		  	}
            else if(e.keyCode==13){
                vm.checkPersonCard(vm.cardNumber);
            }
    	}, false);
    };

    vm.makeNumberString = function(array){
    	var str="";
    	for(var i = 0; i < array.length; i++){
    		str+=array[i];
    	}
    	return str;
    };

    var _checkIfWaiting = function(array,obj){
        for (var i = 0; i < array.length; i++) {
            if (array[i].UserID === obj.UserID) {
                return true;
            }
        }
        return false;
    }
    vm.checkPersonCard = function(card){
    	var userCard = vm.makeNumberString(card);
    	$http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/orders/userOrdersByCard/?cardNumber="+ userCard.toString()
        }).
        success(function(data) {
            console.log(data);
            var inList = _checkIfWaiting(vm.waitingList,data);
            if(data != null && data.isRealized != true && inList != true){
		 		vm.waitingList.push(data);
		 		vm.cardNumber = [];
		 		vm.getMealsForDate();
		 	}
            else if(data == null){
                console.log("Data null");
            }
            else if(data.IsRealized == true || data.OrderID!=null){
                console.log("User realized the meal for today");
                vm.cardNumber = [];
            }
            else if(inList == true){
                console.log("User waiting in line");
                vm.cardNumber = [];
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting user");
            vm.cardNumber = [];
        });
    };

    vm.getMealsForDate = function(){
    	var today = new Date();
		$http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/meals/MealByDate?dateFrom=" + $filter("date")(today, "yyyy-MM-dd 00:00:00.000")+ "&dateTo="+$filter("date")(today, "yyyy-MM-dd HH:mm:ss.sss")
        }).
        success(function(data) {
            vm.getMealsForShift(data[0].Meals);
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting meals");
        });
	};

    vm.getMealsForShift = function(meals){
        vm.mealsForDay = [];
        for (var i = 0; i < meals.length; i++) {
            //check hours  - if < some hour set Shift 1 else set shift 2
            if(meals[i].Shift == 1)
            vm.mealsForDay.push(meals[i]);
        }
    };

    vm.Shift = function(){
        return new Date().getHours() < 16 ? 1 : 2;
    };

    vm.MealRealized = function(vm){
        var realizedMeal = {
            UserID : vm.employeeToServe.UserID,
            Name : vm.employeeToServe.Name,
            OrderID : vm.employeeToServe.OrderID != null? vm.employeeToServe.OrderID: -1,
            MealID: vm.employeeToServe.MealID,
            MealDescription : vm.employeeToServe.MealDescription,
            Guests : vm.employeeToServe.Guests,
            IsRealized : true,
            Shift : vm.Shift()
        };
        $http({
            method: 'PUT',
            crossDomain: true,
            url: "http://localhost:59700/api/orders/mealRealized",
            data: realizedMeal
        }).
        success(function(data) {
            console.log("Success realizing meal");
            var removed = vm.waitingList.splice(vm.removeIndex,1);
            vm.employeeToServe=vm.waitingList[0];
            vm.guestSelection = [];
        }).
        error(function(data, status, headers, config) {
            console.log("Error realizing meal");
        });
    };

    vm.addCardListener();
  });
