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
app.controller('MainController', ['$scope', 'products', function ($scope, products) {
	console.log(products);
	products.getSwills().then(function (data) {
		console.log('obj');
	});
}]);

//initial ajax call
app.factory('products', ['$http', '$q', function ($http, $q) {
	var API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	var API_URL = 'http://lcboapi.com/products?access_key=';
	var isDead = '&where_not=is_discontinued';
	var perPage = '&per_page=100';
	var swill = '&q=';
	var endpoint = API_URL + API_KEY + isDead + perPage + swill;
	return {
		getSwills: function getSwills() {
			var def = $q.defer();

			//			make ajax request
			$http.get(endpoint)
			//			on success send data
			.then(def.resolve, def.reject);
			//			on error reject message

			return def.promise;
		}
	};
	//	
	//			$http.get( endpoint )
	//			.then((data) => {
	//				return data;
	//	})
	//			.error((err) => {
	//				return err;
	//	})
}]);