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

	//	model for checkbox inputs
	$scope.checkboxModel = {
		onSale: {
			'&=has_limited_time_offer=': false
		},
		bonusMiles: {
			'&=has_bonus_reward_miles=': false
		},
		clearance: {
			'&=has_clearance_sale=': false
		},
		promo: {
			'&=has_value_added_promotion=': false
		},
		seasonal: {
			'&=is_seasonal=': false
		},
		kosher: {
			'&=is_kosher=': false
		}
	};

	//		form submit
	$scope.formSubmit = function () {
		var searchSelection = [];

		//		loop through each checkbox and pass checked criteria through to ajax call

		for (var key in $scope.checkboxModel) {
			for (var item in $scope.checkboxModel[key]) {
				searchSelection.push(item, $scope.checkboxModel[key][item]);
			}
		};
		searchSelection = searchSelection.join();
		searchSelection = searchSelection.replace(/,/g, '');
		console.log(searchSelection);
	}, products.getSwillsAjax().then(function (data) {
		console.log(data);
	});
}]);

// ajax calls
app.factory('products', ['$http', '$q', function ($http, $q) {
	var API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	var API_URL = 'http://lcboapi.com/products?access_key=';
	var isDead = '&where_not=is_discontinued';
	var perPage = '&per_page=100';
	var type = '&q=';
	var endpoint = API_URL + API_KEY + isDead + perPage + type;
	var proxy = {
		method: 'GET',
		url: 'http://proxy.hackeryou.com',
		data: {
			reqUrl: '' + endpoint
		}
	};

	return {
		getSwills: function getSwills() {
			var def = $q.defer();

			//			make ajax request
			$http.get(proxy)
			//			on success send data, on error reject message
			.then(def.resolve, def.reject);

			return def.promise;
		},
		searchSwills: function searchSwills(query) {
			var def = $q.defer();

			$http.get(proxy);
		},
		getSwillsAjax: function getSwillsAjax() {
			$.ajax({
				url: 'http://proxy.hackeryou.com',
				method: 'GET',
				data: {
					reqUrl: endpoint
				}
			}).then(function (res) {
				console.log(res);
			});
		}
	};
}]);