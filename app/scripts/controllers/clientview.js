'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:ClientviewCtrl
 * @description
 * # ClientviewCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('ClientviewCtrl', function ($scope, $timeout, $location, $route, APP_CONFIG, $rootScope, ngDialog, $http, $filter, utility, AuthenticationService, localStorageService) {
    var vm = this;
    vm.loggedInUser = localStorageService.get('user');

    vm.options = [];
    vm.model = [];

    vm.flags = {
      showOtherDays: false
    };

    vm.items = {
      startIndex: 0,
      endIndex: 5
    };

    vm.logout = function() {
      AuthenticationService.logOut();
    };
        
    vm.nextWeek = function() {
        if(vm.flags.showOtherDays) {
            vm.items.startIndex += 5;
            vm.items.endIndex +=5;
        }
    };

    vm.validateButton = function() {
        var result = true;
        for(var i = vm.items.startIndex; (i < vm.items.endIndex) && (i < vm.options.length); i++) {
            var date = vm.options[i];
            if(date.OrderID == null) {
                if(date.selectedMeal == null) {
                    result = false;
                    break;
                }
            }
        }
        vm.flags.showOtherDays = (vm.items.endIndex < vm.options.length);
        return result;
    };

    vm.isAlreadyOrdered = function() {
        for(var i = 0; i < vm.options.length; i++) {
            var date = vm.options[i];
            if(date.OrderID == null) return false;
        }
        return true;
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

    vm.formatPreviewData = function() {
        var result = [];
        for(var i in vm.options) {
            var date = vm.options[i];
            for(var j in date.MealChoices) {
                var meal = date.MealChoices[j];
                if(meal.MealID == date.selectedMeal) {
                    result.push({
                        date : date.Date,
                        meal : meal.MealDescription,
                        type : meal.Type,
                        shift : meal.shift
                    });
                    break;
                }
            }
        }
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
        vm.flags.showOtherDays = result.data.length >= 5;
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
        toastr.success("Нарачата е успешно извршена!");
        $timeout(function() {
            AuthenticationService.logOut();
        }, 1000);
      }).
      error(function(data, status, headers, config) {
          console.log("Error adding cost center");
      });
    };

    vm.confirm = function() {
        var data = vm.formatPreviewData();
        var confirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/confirmOrder.html",
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return confirmDialog;  
    };

    vm.reload = function() {
         $route.reload();
    };

    if(vm.loggedInUser == null || vm.loggedInUser == undefined) {
        $location.path('/');
    }
    else vm.getOrderPlan();
});