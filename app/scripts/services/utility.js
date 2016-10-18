'use strict';

/**
 * @ngdoc service
 * @name canteenClientApp.utility
 * @description
 * # utility
 * Service in the canteenClientApp.
 */
angular.module('canteenClientApp').service('utility', function (APP_CONFIG, $http, $filter) {
    this.getPlanByDateRage = function(dateFrom, dateTo) {
        return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
        then(function(result) {
            return result;
        });
    };

    this.getOrdersByDateRage = function(dateFrom, dateTo) {
        return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.client_orders + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
        then(function(result) {
            return result;
        });
    };

    this.getThisWeekEnd = function(date) {
        var day = date.getDay();
        //0 - Sunday
        //1- Monday
        //...6 - Saturday
        var end = new Date(date);
        if(day == 5) {
            return date;
        }
        else {
            end.setDate(end.getDate() + (5 - day));
        }
        return end;
    };

    this.getNextWeekStart = function() {
    	var today = new Date();
    	var day = today.getDay();
    	//0 - Sunday
    	//1- Monday
    	//...6 - Saturday
    	if(day == 0) {
    		today.setDate(today.getDate() + 1);
    	}
    	else {
    		today.setDate(today.getDate() + (8 - day));
    	}
    	return today;
    };
});
