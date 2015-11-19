//init app
let app = angular.module('swillApp', ['ui.router']);

//config stateprovider
app.config( ($stateProvider) => {
	$stateProvider
		.state('index', {
			url: '',
			controller: 'MainController',
			templateUrl: 'js/templates/results.html'
	})
});

//main controller
app.controller('MainController', ['$scope', ($scope) => {
		
}]);

//app.directive('singleSwill', () => {
//	return {
//		restrict: 'E',
//		templateUrl: '/js'
//	}
//});

//initial ajax call
app.factory('products', ['$http', ($http) => {
	let API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	let API_URL = 'http://lcboapi.com/products?access_key=';
	let isDead = '&where_not=is_discontinued';
	let perPage = '&per_page=200';
	let swill = '&q=';
	let endpoint = API_URL + API_KEY + isDead + perPage + swill;
	return 
			$http.get( endpoint )
			.success((data) => {
				return data;
	})
			.error((err) => {
				return err;
	})
}]);