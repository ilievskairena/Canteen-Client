'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('AboutCtrl', function ($scope, $http, $filter, utility) {
    var vm = this;
    vm.options = [];
    vm.model = [];

    vm.initModel = function() {

    };

    vm.getWeek = function() {
      var dateFrom = utility.getNextWeekStart();
      dateFrom.setHours(0,0,0,0);
      var dateTo = new Date(dateFrom);
      dateTo.setDate(dateTo.getDate() + 4);
      dateFrom = $filter('date')(dateFrom, "yyyy-MM-dd HH:mm:ss.sss");
      dateTo = $filter('date')(dateTo, "yyyy-MM-dd HH:mm:ss.sss");
      console.log(dateFrom);
      console.log(dateTo);
      utility.getPlanByDateRage(dateFrom, dateTo).then(function(result) {
          vm.options = result.data;
          vm.model = angular.copy(vm.options);
      });
    };

    vm.getWeek();
});
