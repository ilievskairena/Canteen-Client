'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('AboutCtrl', function ($scope, APP_CONFIG, $rootScope, $http, $filter, utility, AuthenticationService, localStorageService) {
    var vm = this;
    vm.loggedInUser = localStorageService.get('user');
    console.log(vm.loggedInUser);
    vm.options = [];
    vm.model = [];

    vm.flags = {
      thisWeekOrders: false,
      nextWeekOrders: false
    };

    vm.items = {
      startIndex: 0,
      endIndex: 4
  };

    vm.logout = function() {
      AuthenticationService.logOut();
    };
        
    vm.removeGuest = function(date) {
      if(date.Guests == 0) return;
      date.Guests--;
    };

    vm.addGuest = function(date) {
      if(date.OrderID != null) return;
      date.Guests++;
    };

    vm.selectShift = function(date, shift) {
      if(date.ChosenShift != null) return;
      date.shift = shift;
      date.selectedMeal = null;
    };

    vm.selectMeal = function(date, meal) {
      if(date.MealPerDateID != null) return;
      date.selectedMeal = meal.MealID
    };

    vm.formatData = function() {
      var result = [];
      for(var i in vm.options) {
        var date = vm.options[i];
        result.push({
          DateID: date.DateID,
          Date: date.Date,
          MealPerDayID: date.MealPerDateID,
          MealID : date.selectedMeal,
          Guests: date.guests,
          ChosenShift : date.ChosenShift == null ? date.shift : date.ChosenShift,
          MealChoices : []
        });
      }
      console.log(result);
      return result;
    };

    vm.getOrderPlan = function() {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0,0,0,0);
      var nextWeek = utility.getNextWeekStart();
      nextWeek.setHours(0,0,0,0);
      var dateTo = new Date(nextWeek);
      dateTo.setDate(dateTo.getDate() + 4);
      tomorrow = $filter('date')(tomorrow, "yyyy-MM-dd HH:mm:ss.sss");
      dateTo = $filter('date')(dateTo, "yyyy-MM-dd HH:mm:ss.sss");

      utility.getOrdersByDateRage(tomorrow, dateTo).then(
      function(result) {
        vm.options = result.data;
        vm.flags.thisWeekOrders = result.data.length >= 5;
      }, 
      function(error) {

      });
    };

    vm.insert = function() {
      var data = vm.formatData();
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.client_orders_save,
          data: data
      }).
      success(function(data) {
          /*console.log("Success adding cost center");*/
          vm.getOrderPlan();
      }).
      error(function(data, status, headers, config) {
          console.log("Error adding cost center");
      });
    };

    vm.getOrderPlan();
});