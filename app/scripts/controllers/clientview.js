(function(){
  'use strict';

  /**
 * @ngdoc function
 * @name canteenClientApp.controller:ClientviewCtrl
 * @description
 * # ClientviewCtrl
 * Controller of the canteenClientApp
 */
  angular.module('canteenClientApp')
  .controller('ClientviewCtrl', ClientviewCtrl);

  ClientviewCtrl.$inject = ['$scope', '$timeout', 'toastr', '$location', '$route', 'APP_CONFIG', 'ngDialog', '$http', '$filter', 'utility', 'AuthenticationService', 'localStorageService', 'ngProgressFactory'];

  function ClientviewCtrl($scope, $timeout, toastr, $location, $route, APP_CONFIG, ngDialog, $http, $filter, utility, AuthenticationService, localStorageService, ngProgressFactory) {

    var vm = this;
    vm.loggedInUser = localStorageService.get('user');

    vm.progressBar = ngProgressFactory.createInstance();
    vm.options = [];
    vm.model = [];

    vm.flags = {
      showOtherDays: false
    };

    vm.items = {
      startIndex: 0,
      endIndex: 5,
    };

    vm.ordersMade = [];

    // Functions

    vm.addGuest = addGuest;
    vm.confirm = confirm;
    vm.formatData = formatData;
    vm.formatPreviewData = formatPreviewData;
    vm.getOrderPlan = getOrderPlan;
    vm.insert = insert;
    vm.isAlreadyOrdered = isAlreadyOrdered;
    vm.logout = logout;
    vm.nextWeek = nextWeek;
    vm.reload = reload;
    vm.removeGuest = removeGuest;
    vm.selectMeal = selectMeal;
    vm.selectShift = selectShift;
    vm.switchButtons = switchButtons;
    vm.validateButton = validateButton;

    // Init

    if(vm.loggedInUser === null || vm.loggedInUser === undefined) {
      $location.path('/');
    }
    else {
      getOrderPlan();
    }

    // Define functions here

    function addGuest(date) {
      if(date.OrderID !== null){
        return;
      } 
      date.Guests++;
    }

    function confirm() {
      var data = formatPreviewData();
      var confirmDialog = ngDialog.openConfirm({
        template: "../../views/partials/confirmOrder.html",
        scope: $scope,
        data: data
      });

      // NOTE: return the promise from openConfirm
      return confirmDialog;  
    }

      function formatData() {
        var result = [];
        for(var i in vm.options) {
          var date = vm.options[i];
        //console.log(date);
        var dateOrderExists = false;
        //if there is no meal selected for the date
        if(date.selectedMeal === null){
          continue;
        } 
        //if the date has already an order from before
        for( i = 0; i < vm.ordersMade.length; i++){
          if(date.DateID === vm.ordersMade[i].DateID){
            dateOrderExists = true;
            break;
          }
        }

        if(dateOrderExists){
          continue;
        } 

        result.push({
          DateID: date.DateID,
          Date: date.Date,
          MealPerDayID: date.MealPerDateID,
          MealID : date.selectedMeal,
          Guests: date.Guests,
          ChosenShift : date.ChosenShift === null ? date.shift : date.ChosenShift,
          MealChoices : []
        });
      }
      console.log(result);
      if(result.length === 0){
        return null;
      } 
      return result;
    }

    function formatPreviewData() {
      var result = [];
      console.log(vm.options);
      for(var i in vm.options) {
        var date = vm.options[i];
        if(date.OrderID !== null){
          continue;
        } 
        for(var j in date.MealChoices) {
          var meal = date.MealChoices[j];
          if(meal.MealID === date.selectedMeal) {
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
    }

    function getOrderPlan() {

      var today = new Date();
      //today.setDate(today.getDate() + 3);
      var nextWeek = utility.getNextWeekStart();
      nextWeek.setHours(0,0,0,0);
      var dateFrom = new Date();
      var dateTo = new Date(nextWeek);

      if(today.getDay() !== 5){
        dateFrom.setDate(today.getDate() + 1);
        dateFrom.setHours(0,0,0,0);
        dateTo.setDate(nextWeek.getDate() - 3);
      }
      else{
        dateFrom = nextWeek;
        dateTo.setDate(dateTo.getDate() + 4);
      }

      dateFrom = $filter('date')(dateFrom, "yyyy-MM-dd HH:mm:ss.sss");
      dateTo = $filter('date')(dateTo, "yyyy-MM-dd HH:mm:ss.sss");

      utility.getOrdersByDateRage(dateFrom, dateTo).then(
        function(result) {
          console.log(result);
          vm.options = result.data;
        //console.log(vm.options);
        for(var i = 0; i < vm.options.length; i++){
          if(vm.options[i].OrderID !== null){
            vm.ordersMade.push(vm.options[i]);
          }
        }
        vm.flags.showOtherDays = result.data.length >= 5;
      }, 
      function(error) {
        console.log(error);
      });
    }

    function insert() {
      var data = formatData();
      if(data === null) {
        $timeout(function() {
          AuthenticationService.logOut();
        }, 1000);//if the user entered nothing
      }
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.client_orders_save,
        data: data
      }).then(function successCallback(response) {
        console.log(response);
        vm.progressBar.complete();
        toastr.info("Нарачката е успешно извршена!");
        $timeout(function() {
          AuthenticationService.logOut();
        }, 1000);
      }, function errorCallback(response){
        toastr.error("Нарачката не е зачувана. Ве молиме обидете се повторно!");
        vm.progressBar.setColor('red');
        vm.progressBar.reset();
        console.log("Error saving order", response);
      });
    }

    function isAlreadyOrdered() {
      for(var i = 0; i < vm.options.length; i++) {
        var date = vm.options[i];
        if(date.OrderID === null){
          return false;
        } 
      }
      return true;
    }

    function logout() {
      AuthenticationService.logOut();
    }
    
    function nextWeek() {
      if(vm.flags.showOtherDays) {
        vm.items.startIndex += 5;
        vm.items.endIndex += 5;
      }
    }

    function reload() {
      $route.reload();
    }

    function removeGuest(date) {
      if(date.Guests === 0 || date.OrderID !== null){
        return;
      } 
      date.Guests--;
    }

    function selectMeal(date, meal) {
      if(date.MealPerDateID !== null){
        return;
      } 
      date.selectedMeal = meal.MealID;
    }

    function selectShift(date, shift) {
      if(date.ChosenShift !== null){
        return;
      } 
      date.shift = shift;
      date.selectedMeal = null;
    }

    function switchButtons(){
      if(vm.items.endIndex < vm.options.length){
        return true;
      } 
      else{
        return false;
      } 
    }

    function validateButton() {
      var result = true;
      for(var i = vm.items.startIndex; (i < vm.items.endIndex) && (i < vm.options.length); i++) {
        var date = vm.options[i];
        if(date.OrderID === null) {
          if(date.selectedMeal === null) {
            result = false;
            break;
          }
        }
      }
      vm.flags.showOtherDays = (vm.items.endIndex < vm.options.length);
      return result;
    }

    /*vm.formatPreviewData = function() {
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
    }*/
  }
})();