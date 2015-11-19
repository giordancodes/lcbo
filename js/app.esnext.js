let app = angular.module('swillApp', []);

let ACCESS_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';

app.controller('MainController', ['$scope', ($scope) => {
	$scope.items = [1,4,2,3];
}]);

app.factory('products', ['$http', ($http) => {
	return $http.get('http://lcboapi.com/products?access_key=' + API_KEY)
			.success((data) => {
				return data;
	})
			.error((err) => {
				return err;
	})
}]);