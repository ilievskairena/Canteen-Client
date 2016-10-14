'use strict';

/**
 * @ngdoc overview
 * @name canteenClientApp
 * @description
 * # canteenClientApp
 *
 * Main module of the application.
 */
angular
  .module('canteenClientApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'vm'
      })
      .when('/clientView', {
        templateUrl: 'views/clientview.html',
        controller: 'ClientviewCtrl',
        controllerAs: 'vm'
      })
      .when('/canteenView', {
        templateUrl: 'views/canteenview.html',
        controller: 'CanteenviewCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
