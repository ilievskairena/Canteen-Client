'use strict';

/**
 * @ngdoc function
 * @name canteenClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenClientApp
 */
angular.module('canteenClientApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, localStorageService, $location, $timeout, APP_CONFIG, AuthenticationService, toastr, ngProgressFactory) {
    var vm = this;
    //Incharge for the card field to be focused
    vm.inputFocus = true;
    vm.cardNumber = "";
    vm.progressBar = ngProgressFactory.createInstance();
    
    AuthenticationService.logOut();

    vm.focus = function() {
        $timeout(function() {
            vm.inputFocus = false;
            vm.inputFocus = true;
        }, 10);
    };

    vm.entryScanner = function(e) {
        if(e.keyCode == 13){
            vm.login();
        }
    };

    vm.login = function(){
    	vm.progressBar.setColor('#8dc63f');
        vm.progressBar.start();
        vm.user = {
            username: vm.cardNumber,
            password: "9899c72b436acac0b0670403dde686e8"
        }
        AuthenticationService.login(vm.user).then(
        function(response)
        {
            vm.profileProperties();
        },
        function(error) {
            vm.progressBar.setColor('red');
            vm.progressBar.reset();
            vm.cardNumber = "";
            toastr.error("Грешка!","Вашата картичка не е регистрирана во системот");
        });
    };

    vm.profileProperties = function() {
        $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.user_properties
        }).
        success(function(data) {
            console.log(data);
            localStorageService.set('user', data);
            vm.progressBar.complete();
            $rootScope.isLogin = false;
            $rootScope.userName = data.Name;
            $rootScope.roleName = data.RoleName;
            $rootScope.roleId = data.RoleID;
            if($rootScope.roleId == 4)
                $location.path('/canteenView');
            else $location.path('/orders')
        }).
        error(function(data, status, headers, config) {
            vm.progressBar.setColor('red');
            vm.progressBar.reset();
            AuthenticationService.logOut();
            toastr.error("Грешка при најава, ве молиме обидете се повторно!");
        });
    }; 

    vm.redirect = function() {
    	$location.path("/orders");
    };


    vm.checkPersonCard = function(card){
        var userCard = vm.makeNumberString(card);
        $http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + "/api/orders/userOrdersByCard/?cardNumber="+ userCard.toString()
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
