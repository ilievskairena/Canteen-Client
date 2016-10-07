'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:ClientviewCtrl
 * @description
 * # ClientviewCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('ClientviewCtrl', function ($scope,$http,$filter) {
   
    var vm = this;
    vm.open = 'true';
    //selected shift per day
    vm.shifts = [];
    //selected meal per day
    vm.mealsSelected = {
    	monday:"",
    	thuesday:"",
    	wednesday:"",
    	thursday:"",
    	friday:"",

    };
    vm.monGuest = 0;
    vm.thuGuest = 0;
    vm.wedGuest = 0;
    vm.thrGuest = 0;
    vm.friGuest = 0;

    vm.shifts['monday'] = vm.shifts['thuesday'] = vm.shifts['wednesday'] = vm.shifts['thursday'] = vm.shifts['friday'] =0;
    vm.clickOpen = function(day,shift){
    	vm.shifts[day] = shift;
    	console.log(vm.shifts[day] + " = " + day);
        console.log(vm.shifts);
    };

    vm.logIn = function(){
    	//send card number to log in user
    	vm.userLoggedIn="ИРЕНА ИЛИЕВСКА";
        vm.userLoggedInID=18;
    };
    vm.logOut = function(){
    	//log out user
    	console.log("LOGOUT");
    };

    vm.saveChoice = function(){
        var guestList = [vm.monGuest,vm.thuGuest,vm.wedGuest,vm.thrGuest,vm.friGuest];
        var newWeekMeals =[];
        for(var i = 0; i < 5; i++){
            var day ="";
            var dayMeal = null;
            switch(i){
                case 0: day = "monday";
                        dayMeal = vm.mealsSelected.monday;
                        break;
                case 1: day = "thuesday";
                        dayMeal = vm.mealsSelected.thuesday;
                        break;
                case 2: day = "wednesday";
                        dayMeal = vm.mealsSelected.wednesday;
                        break;
                case 3: day = "thursday";
                        dayMeal = vm.mealsSelected.thursday;
                        break;
                case 4: day = "friday";
                        dayMeal = vm.mealsSelected.friday;
                        break;
            }
            var dayMealObj = {
                UserID: vm.userLoggedInID,
                DateID: vm.weekMeals[i].DateId,
                MealPerDayID: dayMeal,
                Shift:  vm.shifts[day],
                Guests: guestList[i],
                CardNum: "15151111111",
                IsGuest: false,
                IsWorker: false,
                CreatedBy: vm.userLoggedIn
            };
            newWeekMeals.push(dayMealObj);
        }
    	$http({
            method: 'POST',
            crossDomain: true,
            url: "http://localhost:59700/api/meals/saveMealsForWeek",
            data: newWeekMeals,
            contentType:"text/json"
        }).
        success(function(data) {
            console.log('Success saving meals for user');
        }).
        error(function(data, status, headers, config) {
            console.log("Error saving meals for user");
        });
    }

    vm.Guests = function(day, opp){
    	switch(day){
    		case 'monday': if(opp == 0) vm.monGuest++;
    						else vm.monGuest--;
    						if(vm.monGuest < 0) vm.monGuest = 0;// value can not be less than 0
    						break;
    		case 'thuesday': if(opp == 0) vm.thuGuest++;
    						else vm.thuGuest--;
    						if(vm.thuGuest < 0) vm.thuGuest = 0;// value can not be less than 0
    						break;
    		case 'wednesday': if(opp == 0) vm.wedGuest++;
    						else vm.wedGuest--;
    						if(vm.wedGuest < 0) vm.wedGuest = 0;// value can not be less than 0
    						break;
    		case 'thursday': if(opp == 0) vm.thrGuest++;
    						else vm.thrGuest--;
    						if(vm.thrGuest < 0) vm.thrGuest = 0;// value can not be less than 0
    						break;
    		case 'friday': if(opp == 0) vm.friGuest++;
    						else vm.friGuest--;
    						if(vm.friGuest < 0) vm.friGuest = 0;// value can not be less than 0
    						break;	
    		default: break;			
    	}
    };

    vm.weekToShow = function(num){
    	var today = new Date();
    	today.setHours(0,0,0,0);
    	if(today.getDay()!=1)
    		return today.previous().monday().addDays(num);
	    return today.addDays(num);
    };

    vm.getMealsForWeek = function(){
		$http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/meals/MealByDate?dateFrom=" + $filter("date")(vm.weekToShow(0), "yyyy-MM-dd HH:mm:ss.sss")+ "&dateTo="+$filter("date")(vm.weekToShow(4), "yyyy-MM-dd HH:mm:ss.sss")
        }).
        success(function(data) {
            console.log(data);
            vm.weekMeals = data;
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting meals");
        });
	};

	vm.mealSelect = function(meal,day){
		switch(day){
    		case 'monday': vm.mealsSelected.monday = meal.MealID;
    						break;
    		case 'thuesday': vm.mealsSelected.thuesday = meal.MealID;
    						break;
    		case 'wednesday': vm.mealsSelected.wednesday = meal.MealID;
    						break;
    		case 'thursday': vm.mealsSelected.thursday = meal.MealID;
    						break;
    		case 'friday':  vm.mealsSelected.friday = meal.MealID;
    						break;
    		default: break;			
    	}
	};

    vm.checkUserWeekStatus = function(){
        $http({
            method: 'GET',
            crossDomain: true,
            url: "http://localhost:59700/api/meals/WeekMealsUser?dateFrom=" + $filter("date")(vm.weekToShow(0), "yyyy-MM-dd HH:mm:ss.sss")+ "&dateTo="+$filter("date")(vm.weekToShow(4), "yyyy-MM-dd HH:mm:ss.sss")
        }).
        success(function(data) {
            console.log(data);
            vm.weekMeals = data;
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting meals");
        });
    };

    vm.weekToShow();
    vm.logIn();
    vm.getMealsForWeek();
  });
