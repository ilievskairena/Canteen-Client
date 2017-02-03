(function(){
    'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:CanteenviewCtrl
 * @description
 * # CanteenviewCtrl
 * Controller of the canteenClientApp
 */

 /* jshint latedef:nofunc */

    angular.module('canteenClientApp')
    .controller('CanteenviewCtrl', CanteenviewCtrl);

    CanteenviewCtrl.$inject = ['$http', '$filter', '$location', 'APP_CONFIG', 'localStorageService', 'ngProgressFactory', 'toastr'];

    function CanteenviewCtrl($http, $filter, $location, APP_CONFIG, localStorageService, ngProgressFactory, toastr) {
        /* jshint validthis: true */
        var vm = this;

        vm.loggedInUser = localStorageService.get('user');
        vm.cardNumber= [];
        vm.guestSelection = [];
        vm.waitingList = [];
        vm.mealsForDay = [];
        vm.defaultMeal = '';
        vm.progressBar = ngProgressFactory.createInstance();

        // Functions

        vm.addCardListener = addCardListener;
        vm.checkPersonCard = checkPersonCard;
        vm.employeeChange = employeeChange;
        vm.getDefaultMeal = getDefaultMeal;
        vm.getMealsForDate = getMealsForDate;
        vm.getMealsForShift = getMealsForShift;
        vm.getShift = getShift;
        vm.makeNumberString = makeNumberString;
        vm.MealRealized = MealRealized;

        // Init

        if(vm.loggedInUser === null || vm.loggedInUser === undefined) {
            $location.path('/');
        }
        else 
        {
            addCardListener();
            getShift();
            getDefaultMeal();
        }

        // Define Functions here

        function addCardListener(){
            document.addEventListener("keyup",function(e){
                if(e.keyCode !== 13){
                    vm.cardNumber.push(e.key);
                }
                else if(e.keyCode === 13){
                    checkPersonCard(vm.cardNumber);
                }
            }, false);
        }

        function checkPersonCard(card){

            if(card === null){
              return;  
            } 

            var userCard = makeNumberString(card);
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_by_cards + "?cardNumber="+ userCard.toString()
            }).then(function successCallback(response){
                var data = response.data;
                getShift();
                var inList = _checkIfWaiting(vm.waitingList,data);

                if(data.Shift !== vm.Shift && data.Shift !== 0){
                    toastr.info("Корисникот има нарачка во друга смена!");
                    vm.cardNumber = [];
                }
                else if(data.Name === "Worker"){
                    vm.waitingList.push(data);
                    vm.cardNumber = [];
                    getMealsForDate();
                }
                else if(data.isRealized === true){
                    toastr.info("Корисникот веќе ја реализирал нарачката!");
                    console.log("User realized the meal for today");
                    vm.cardNumber = [];
                }
                else if(inList === true){
                    toastr.info("Корисникот е веќе во редот!");
                    console.log("User waiting in line");
                    vm.cardNumber = [];
                }
                else if(data !== null && data.isRealized !== true && inList !== true){
                    console.log("OK");
                    vm.waitingList.push(data);
                    vm.cardNumber = [];
                    getMealsForDate();
                }

            }, function errorCallback(response){
                toastr.error("Грешка во системот! Ве молиме обидете се повторно. Доколку проблемот продолжи, известете го администраторот!");
                console.log("Error getting user", response);
                vm.cardNumber = [];
            });
        }

        function employeeChange(employee, index){
            vm.employeeToServe = employee;
            vm.removeIndex = index;
            vm.employeeToServe.MealID = null;
            vm.MealSelectedForUser = null;
            vm.guestSelection = [];
        }

        function getDefaultMeal(){
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.default_meal
            }).then(function successCallback(response){

                console.log(response.data);
                vm.defaultMeal = response.data;

            }, function errorCallback(response){

                toastr.error("Грешка при превземањето на default оброк. Ве молиме освежете го прозорецот и обидете се повторно!");
                console.log("Error getting default meal", response);

            });
            
        }

        function getMealsForDate(){
            var today = new Date();
            var date = $filter("date")(today, "yyyy-MM-dd 00:00:00.000");
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" + date + "&dateTo="+ date
            }).then(function successCallback(response){

                console.log(response.data);
                getMealsForShift(response.data[0].Meals);

            }, function errorCallback(response){
                toastr.error("Грешка при вчитување на оброк!");
                console.log('Error getting meal', response);
            });
        }

        function getMealsForShift(meals){
            vm.mealsForDay = [];
            for (var i = 0; i < meals.length; i++) {
                if(meals[i].Shift === vm.Shift){

                    vm.mealsForDay.push(meals[i]);
                }
            }
        }

        function getShift(){
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.config_shift
            }).then(function successCallback(response){

                vm.Shift = response.data;
                console.log(response.data);

            }, function errorCallback(response){
                toastr.error("Грешка при вчитување на тековна смена");
                console.log("Error getting shift", response);
            });
        }
        
        function makeNumberString(array){
            var str="";
            for(var i = 0; i < array.length; i++){
                str+=array[i];
            }
            return str;
        }

        function MealRealized(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            var realizedMeal = {
                UserID : vm.employeeToServe.UserID,
                Name : vm.employeeToServe.Name,
                OrderID : vm.employeeToServe.OrderID !== null? vm.employeeToServe.OrderID: -1,
                MealID: vm.employeeToServe.OrderID !== null? vm.employeeToServe.MealID : vm.defaultMeal.MealPerDateID,
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
            }).then(function successCallback(response){
                console.log(response);
                vm.progressBar.complete();
                toastr.info("Нарачката е успешно реализирана!");
                vm.waitingList.splice(vm.removeIndex,1);
                vm.employeeToServe=vm.waitingList[0];
                vm.guestSelection = [];

            }, function errorCallback(response){
                toastr.error("Реализацијата не е зачувана. Ве молиме обидете се повторно!");
                vm.progressBar.setColor('red');
                vm.progressBar.reset();
                console.log("Error saving", response);
            });
        }

        // Define local functions here

        function _checkIfWaiting(array,obj){
            for (var i = 0; i < array.length; i++) {
                if (array[i].UserID === obj.UserID) {
                    return true;
                }
            }
            return false;
        }

        // function _checkIfWorkerWaiting(array,obj){
        //     for (var i = 0; i < array.length; i++) {
        //         if (array[i].OrderID === obj.OrderID) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
    }
})();