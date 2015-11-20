//init app
let app = angular.module('swillApp', ['ui.router']);

//config stateprovider
app.config(($stateProvider) => {
	$stateProvider
		.state('index', {
			url: '',
			controller: 'MainController',
			templateUrl: 'js/templates/results.html'
	})
});

//main controller
app.controller('MainController', ['$scope', 'products', ($scope, products) => {
	
	console.log(products);
	
//	model for checkbox inputs
	$scope.checkboxModel = {
		onSale: false,
		limOffer: false,
		bonusMiles: false,
		promo: false,
		seasonal: false,
		kosher: false,
		clearance: false
	},
	products.getSwills().then((data) => {
		console.log(data);
	})
}]);

//initial ajax call
app.factory('products', ['$http', '$q', ($http, $q) => {
	const API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	const API_URL = 'http://lcboapi.com/products?access_key=';
	let isDead = '&where_not=is_discontinued';
	let perPage = '&per_page=100';
	let swill = '&q=';
	let endpoint = API_URL + API_KEY + isDead + perPage + swill;
	return {
		getSwills() {
			let def = $q.defer();
			
//			make ajax request
			$http.get(endpoint)
//			on success send data, on error reject message
				.then(def.resolve,def.reject);			
			
			return def.promise;
		}
	}

}]);