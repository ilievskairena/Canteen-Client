(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name canteenClientApp.utility
     * @description
     * # utility
     * Service in the canteenClientApp.
     */
     
     /* jshint latedef:nofunc */

    angular.module('canteenClientApp')
    .service('utility', utility);

    utility.$inject = ['APP_CONFIG', '$http'];

    function utility(APP_CONFIG, $http) {
        /* jshint validthis: true */
        this.getPlanByDateRage = getPlanByDateRage;
        this.getOrdersByDateRage = getOrdersByDateRage;
        this.getThisWeekEnd = getThisWeekEnd;
        this.getNextWeekStart = getNextWeekStart;
        this.getHolidaysForThisWeek = getHolidaysForThisWeek;

        function getPlanByDateRage(dateFrom, dateTo) {
            return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
            then(function(result) {
                return result;
            });
        }

        function getOrdersByDateRage(dateFrom, dateTo) {
            return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.client_orders + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
            then(function(result) {
                return result;
            });
        }

        function getThisWeekEnd(date) {
            var day = date.getDay();
            //0 - Sunday
            //1- Monday
            //...6 - Saturday
            var end = new Date(date);
            if(day === 5) {
                return date;
            }
            else {
                end.setDate(end.getDate() + (5 - day));
            }
            return end;
        }

        function getNextWeekStart() {
            var today = new Date();
            var day = today.getDay();
            //0 - Sunday
            //1- Monday
            //...6 - Saturday
            if(day === 0) {
                today.setDate(today.getDate() + 1);
            }
            else {
                today.setDate(today.getDate() + (8 - day));
            }
            return today;
        }

        function getHolidaysForThisWeek() {
            return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.dates_holidays).
            then(function (result){
                return result;
            });
        }
    }
})();