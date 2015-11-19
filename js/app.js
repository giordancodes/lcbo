'use strict';

//init app
var app = angular.module('swillApp', ['ui.router']);

//config stateprovider
app.config(function ($stateProvider) {
	$stateProvider.state('index', {
		url: '',
		controller: 'MainController',
		templateUrl: 'js/templates/results.html'
	});
});

//main controller
app.controller('MainController', ['$scope', function ($scope) {}]);

//app.directive('singleSwill', () => {
//	return {
//		restrict: 'E',
//		templateUrl: '/js'
//	}
//});

//initial ajax call
app.factory('products', ['$http', function ($http) {
	var API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	var API_URL = 'http://lcboapi.com/products?access_key=';
	var isDead = '&where_not=is_discontinued';
	var perPage = '&per_page=200';
	var swill = '&q=';
	var endpoint = API_URL + API_KEY + isDead + perPage + swill;
	return;
	$http.get(endpoint).success(function (data) {
		return data;
	}).error(function (err) {
		return err;
	});
}]);