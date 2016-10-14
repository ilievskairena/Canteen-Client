'use strict';

/**
 * @ngdoc service
 * @name canteenClientApp.APPCONFIG
 * @description
 * # APPCONFIG
 * Constant in the canteenClientApp.
 */
angular.module('canteenClientApp').constant('APP_CONFIG', {
	BASE_URL: "http://localhost:59700",
 	token: "/token",
 	config: "/api/config",
 	dates:"/api/dates",
 	dates_by_year: "/api/dates/GetDates",
 	dates_range: "/api/dates/range",
 	dates_allowed: "/api/dates/allowed",
 	dates_update: "/api/dates/update",
 	dates_insert: "/api/dates/insert",
 	login: "/api/account/login",
 	user_properties: "/api/account/properties",
 	meals: "/api/meals",
 	meals_insert: "/api/meals/insert",
 	meals_by_date: "/api/meals/MealByDate",
 	meals_per_type: "/api/meals/MealsPerType",
 	mealtype: "/api/mealtype",
 	mealtype_insert: "/api/mealtype/insert",
 	menu: "/api/meals/menu",
 	orders: "/api/orders",
 	orders_delete: "/api/orders/delete/",
 	orders_thidshift: "/api/orders/thirdshift"
});
