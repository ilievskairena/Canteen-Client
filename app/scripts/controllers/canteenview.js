'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:CanteenviewCtrl
 * @description
 * # CanteenviewCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('CanteenviewCtrl', function ($http, $filter, $location, APP_CONFIG, AuthenticationService, localStorageService, ngProgressFactory, toastr) {
    var vm = this;

    vm.loggedInUser = localStorageService.get('user');
	vm.cardNumber= [];
    vm.guestSelection = [];
	vm.waitingList = [];
    vm.mealsForDay = [];
    vm.defaultMeal = '';
    vm.progressBar = ngProgressFactory.createInstance();

    vm.employeeChange = function(employee, index){
        vm.employeeToServe=employee;
        vm.removeIndex=index;
        vm.employeeToServe.MealID=null;
        vm.MealSelectedForUser = null;
        vm.guestSelection = [];

    };
	vm.addCardListener = function(){
    	document.addEventListener("keyup",function(e){
            console.log(e.key);
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
    };
    var _checkIfWorkerWaiting = function(array,obj){
        for (var i = 0; i < array.length; i++) {
            if (array[i].OrderID === obj.OrderID) {
                return true;
            }
        }
        return false;
    };

    vm.getDefaultMeal = function(){
        $http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.default_meal
        }).success(function(data){
            console.log(data);
            vm.defaultMeal = data;
        }).error(function(data, status, headers, config) {
            console.log("Error getting default meal");
        });
    };

    vm.checkPersonCard = function(card){
        if(card == null) return;
    	var userCard = vm.makeNumberString(card);
    	$http({
            method: 'GET',
            crossDomain: true,
<<<<<<< HEAD
            url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_by_cards  + "?cardNumber="+ userCard.toString()
=======
            url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_by_cards + "?cardNumber="+ userCard.toString()
>>>>>>> refs/remotes/origin/master
        }).
        success(function(data) {
            //console.log("GET DATA");
            //console.log(data);
            vm.getShift();
            var inList = _checkIfWaiting(vm.waitingList,data);

            if(data.Shift != vm.Shift && data.Shift!=0){
                console.log("User has order in another shift");
                vm.cardNumber = [];
            }
            else if(data.Name == "Worker"){
                console.log(data);
                    vm.waitingList.push(data);
                    vm.cardNumber = [];
                    vm.getMealsForDate();
            }
            else if(data.isRealized == true){
                console.log("User realized the meal for today");
                vm.cardNumber = [];
            }
            else if(inList == true){
                console.log("User waiting in line");
                vm.cardNumber = [];
            }
            else if(data != null && data.isRealized != true && inList != true){
                console.log("OK");
                    vm.waitingList.push(data);
                    vm.cardNumber = [];
                    vm.getMealsForDate();
		 	}
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting user");
            vm.cardNumber = [];
        });
    };

    vm.getMealsForDate = function(){
    	var today = new Date();
        var date = $filter("date")(today, "yyyy-MM-dd 00:00:00.000");
		$http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" + date + "&dateTo="+ date
        }).
        success(function(data) {
            console.log(data);
            vm.getMealsForShift(data[0].Meals);
        }).
        error(function(data, status, headers, config) {
            toastr.error("Грешка при вчитување на оброк!");
        });
	};

    vm.getMealsForShift = function(meals){
        vm.mealsForDay = [];
        for (var i = 0; i < meals.length; i++) {
            if(meals[i].Shift == vm.Shift)
                vm.mealsForDay.push(meals[i]);
        }
    };

    vm.getShift = function(){
        $http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.config_shift
        }).success(function(data){
            vm.Shift = data;
            console.log(data);
        }).error(function(data,status,headers,config){
            toastr.error("Грешка при вчитување на тековна смена");
        });
    };

    vm.MealRealized = function(vm){
        vm.progressBar.setColor('#8dc63f');
        vm.progressBar.start();
        var realizedMeal = {
            UserID : vm.employeeToServe.UserID,
            Name : vm.employeeToServe.Name,
            OrderID : vm.employeeToServe.OrderID != null? vm.employeeToServe.OrderID: -1,
            MealID: vm.employeeToServe.OrderID != null? vm.employeeToServe.MealID : vm.defaultMeal.MealPerDateID,
            MealDescription : vm.employeeToServe.MealDescription,
            Guests : vm.employeeToServe.Guests,
            IsRealized : true,
            Shift : vm.Shift
        };
        $http({
            method: 'PUT',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_realize,
            data: realizedMeal
        }).
        success(function(data) {
            vm.progressBar.complete();
            toastr.info("Нарачката е успешно реализирана!");
            var removed = vm.waitingList.splice(vm.removeIndex,1);
            vm.employeeToServe=vm.waitingList[0];
            vm.guestSelection = [];
        }).
        error(function(data, status, headers, config) {
          toastr.error("Реализацијата не е зачувана. Ве молиме обидете се повторно!");
          vm.progressBar.setColor('red');
          vm.progressBar.reset();
        });
    };

    if(vm.loggedInUser == null || vm.loggedInUser == undefined) {
        $location.path('/');
    }
    else 
        {
            vm.addCardListener();
            vm.getShift();
            vm.getDefaultMeal();
        }

  });
