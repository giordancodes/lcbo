'use strict';

//initialize app
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
			'has_limited_time_offer': false
		},
		bonusMiles: {
			'has_bonus_reward_miles': false
		},
		promo: {
			'has_value_added_promotion': false
		},
		seasonal: {
			'is_seasonal': false
		}

	};

	//		form submit
	$scope.formSubmit = function () {
		var searchSelection = [];
		var checkBoxUrl = [];

		//		loop through each checkbox and pass checked criteria through to ajax call			
		for (var key in $scope.checkboxModel) {
			for (var item in $scope.checkboxModel[key]) {
				if ($scope.checkboxModel[key][item] === true) {
					checkBoxUrl.push(item);
				}
			}
		}

		//		turn searchSelection array into string, add &where= if boxes are checked
		checkBoxUrl = checkBoxUrl.join(',');
		console.log(checkBoxUrl);
		if (_.isEmpty(checkBoxUrl) === false) {
			searchSelection = searchSelection + '&where=' + checkBoxUrl;
		}

		console.log(searchSelection);

		//			add type of swill if $scope.swill has had user input or ignore if they choose all the booze
		if ($scope.swill !== undefined && $scope.swill !== 'allTheBooze') {
			searchSelection = searchSelection + '&q=' + $scope.swill;
		}

		//		pass along searchSelection to call
		products.getSwills(searchSelection).then(function (data) {
			searchSelection = [];
			console.log(data.data.result[0]);

			//			populate results on screen

			return data.data.result[0];
		}, function (err) {
			console.log(err);
		});
	};
}]);

app.directive('singleProduct', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/templates/results.html'
	};
});

// ajax calls
app.factory('products', ['$http', '$q', function ($http, $q) {
	var API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	var API_URL = 'http://lcboapi.com/products?access_key=';
	var isDead = '&where_not=is_discontinued';
	var perPage = '&per_page=100';
	var endpoint = API_URL + API_KEY + isDead + perPage;
	var proxy = {
		method: 'GET',
		url: 'http://proxy.hackeryou.com',
		params: {
			reqUrl: '' + endpoint
		}
	};

	return {
		getSwills: function getSwills(query) {
			var def = $q.defer(),
			    proxyQuery = '';

			//			make ajax request, add search params
			proxy.params.reqUrl = proxy.params.reqUrl + query;

			console.log(proxy.params.reqUrl);
			$http(proxy)
			//			on success send data, on error reject message, reset search params
			.then(def.resolve, def.reject);
			proxy.params.reqUrl = '' + endpoint;
			return def.promise;
		}
	};
}]);