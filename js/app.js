'use strict';

//initialize app
var app = angular.module('swillApp', ['ui.router']);

//config stateprovider
app.config(function ($stateProvider) {
	$stateProvider.state('index', {
		url: '',
		controller: 'MainController',
		templateUrl: 'js/templates/MainController.html'
	}).state('single', {
		url: '/single/:id',
		controller: 'SingleController',
		templateUrl: 'js/templates/SingleController.html'
	});
});

//main controller
app.controller('MainController', ['$scope', 'products', function ($scope, products) {

	$scope.swill = 'choose';

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
		},
		kosher: {
			'is_kosher': false
		}

	};

	//	back to top function
	$scope.backToTop = function () {
		$location.hash('top');
		$anchorScroll();
	};

	//		form submit
	$scope.formSubmit = function () {
		var searchSelection = {};
		var checkBoxUrl = [];

		searchSelection = {
			where: '',
			q: ''
		};

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
		if (_.isEmpty(checkBoxUrl) === false) {
			searchSelection['where'] = searchSelection['where'] + checkBoxUrl;
		}

		//			add type of swill if $scope.swill has had user input or ignore if they choose all the booze. if nothing chosen display all the booze
		if ($scope.swill !== undefined && $scope.swill !== 'allTheBooze' && $scope.swill !== 'choose') {
			searchSelection['q'] = $scope.swill;
		}

		//		pass along searchSelection to ajax call
		products.getSwills(searchSelection).then(function (data) {
			console.log(data.data.result[0]);
			$scope.products = data.data.result;
			//			if error...
		}, function (err) {
			console.log(err);
		});
	};
}]);

//controller for single item
app.controller('SingleController', function ($scope, products, $stateParams) {});

//directive for displaying results in MainController
app.directive('singleProduct', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/templates/results.html'
	};
});

// ajax calls
app.factory('products', ['$http', '$q', function ($http, $q) {
	var API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	var API_URL = 'http://lcboapi.com/products';
	var isDead = '&where_not=is_discontinued';
	var perPage = '&per_page=100';
	var endpoint = API_URL;
	var proxy = {
		method: 'GET',
		url: 'http://proxy.hackeryou.com',
		params: {
			reqUrl: '' + API_URL,
			access_key: API_KEY,
			per_page: 100,
			isDead: false
		}
	};

	return {
		getSwills: function getSwills(query) {
			var def = $q.defer();

			//			make ajax request, add search params
			var proxyCopy = proxy;
			Object.assign(proxyCopy.params, query);
			console.log(query);
			//			send search params to $http
			$http(proxyCopy)

			//			on success send data, on error reject message, reset search params
			.then(def.resolve, def.reject);
			return def.promise;
		}
	};
}]);