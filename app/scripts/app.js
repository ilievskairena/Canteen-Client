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
    'ngProgress',
    'ngDialog',
    'LocalStorageModule',
    'toastr',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/orders', {
        templateUrl: 'views/clientview.html',
        controller: 'ClientviewCtrl',
        controllerAs: 'vm'
      })
      .when('/canteen', {
        templateUrl: 'views/canteenview.html',
        controller: 'CanteenviewCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptorService');
  });
