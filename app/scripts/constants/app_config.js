'use strict';

/**
 * @ngdoc service
 * @name canteenClientApp.APPCONFIG
 * @description
 * # APPCONFIG
 * Constant in the canteenClientApp.
 */
angular.module('canteenClientApp').constant('APP_CONFIG', {
	//BASE_URL: "http://10.203.176.30:8545",
	BASE_URL: "http://localhost:59710",
 	token: "/token",
 	config: "/api/config",
 	client_orders: "/api/client/orders",
 	client_orders_save: "/api/client/save",
 	dates:"/api/dates",
 	dates_by_year: "/api/dates/GetDates",
 	dates_range: "/api/dates/range",
 	dates_allowed: "/api/dates/allowed",
 	dates_update: "/api/dates/update",
 	dates_insert: "/api/dates/insert",
 	default_meal: "/api/config/getDefaultMeal",
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
 	orders_thidshift: "/api/orders/thirdshift",
 	orders_by_cards : "/api/orders/userOrdersByCard",
 	orders_realize: "/api/orders/mealRealized",
 	config_shift: "/api/config/getShift"
});
