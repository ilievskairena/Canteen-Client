(function(){
    'use strict';

    /**
    * @ngdoc function
    * @name canteenClientApp.controller:MainCtrl
    * @description
    * # MainCtrl
    * Controller of the canteenClientApp
    */

     /* jshint latedef:nofunc */
     
    angular.module('canteenClientApp')
    .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$http', '$rootScope', 'localStorageService', '$location', '$timeout', 'APP_CONFIG', 'AuthenticationService', 'toastr', 'ngProgressFactory'];

    function MainCtrl($http, $rootScope, localStorageService, $location, $timeout, APP_CONFIG, AuthenticationService, toastr, ngProgressFactory) {
        /* jshint validthis: true */
        var vm = this;
        //Incharge for the card field to be focused
        vm.inputFocus = true;
        vm.cardNumber = "";
        vm.progressBar = ngProgressFactory.createInstance();
        
        AuthenticationService.logOut();

        // Functions

        vm.entryScanner = entryScanner;
        vm.focus = focus;
        vm.login = login;
        vm.profileProperties = profileProperties;
        vm.redirect = redirect;

        // Init


        // Define functions here

        function entryScanner(e) {
            if(e.keyCode === 13){
                login();
            }
        }

        function focus() {
            $timeout(function() {
                vm.inputFocus = false;
                vm.inputFocus = true;
            }, 10);
        }

        function login(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            vm.user = {
                username: vm.cardNumber,
                password: "9899c72b436acac0b0670403dde686e8"
            };
            AuthenticationService.login(vm.user).then(
                function(response)
                {
                    console.log(response);
                    profileProperties();
                },
                function(error) {
                    vm.progressBar.setColor('red');
                    vm.progressBar.reset();
                    vm.cardNumber = "";
                    toastr.error("Грешка!","Вашата картичка не е регистрирана во системот");
                    console.log("Error with card", error);
                });
        }

        function profileProperties() {
            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + APP_CONFIG.user_properties
            }).then(function successCallback(response) {
                var data = response.data;
                localStorageService.set('user', data);
                vm.progressBar.complete();
                $rootScope.isLogin = false;
                $rootScope.userName = data.Name;
                $rootScope.roleName = data.RoleName;
                $rootScope.roleId = data.RoleID;
                if($rootScope.roleId === 4){
                    $location.path('/canteen');
                }
                else{
                  $location.path('/orders');  
                } 
            }, function errorCallback(response){
                vm.progressBar.setColor('red');
                vm.progressBar.reset();
                AuthenticationService.logOut();
                toastr.error("Грешка при најава, ве молиме обидете се повторно!");
                console.log("Error with authenticating", response);
            });
        }

        function redirect() {
            $location.path("/orders");
        }
    /*

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
        };*/
    }
})();