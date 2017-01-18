(function(){
  'use strict';

  /**
  * @ngdoc directive
  * @name canteenClientApp.directive:focusMe
  * @description
  * # focusMe
  */
  angular.module('canteenClientApp')
  .directive('focusMe', focusMe);

  focusMe.$inject = [];

  function focusMe(){
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
            element[0].focus();
            scope.trigger = false;
        }
      });
    }
  };
}
})();