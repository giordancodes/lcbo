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
		
//	model for checkbox inputs
	$scope.checkboxModel = {
		onSale :{
			'&=has_limited_time_offer=': false
		},
		bonusMiles :{
			'&=has_bonus_reward_miles=': false
		},
		promo :{
			'&=has_value_added_promotion=': false
		},
		seasonal :{
			'&=is_seasonal=': false
		},
		kosher :{
			'&=is_kosher=': false
		},
		clearance :{
			'&=has_clearance_sale=': false
		}
	};
	
//		form submit
	$scope.formSubmit = () => {
		let searchSelection = [];
		
//		loop through each checkbox and only pass checked criteria through to ajax call
					
		for (let key in $scope.checkboxModel){
				for (let item in $scope.checkboxModel[key]){
					console.log(item, $scope.checkboxModel[key][item]);
					searchSelection.push(item, $scope.checkboxModel[key][item])
				}
			};
		
		console.log(searchSelection);
		console.log($scope.swill);
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
	let type = '&q=';
	let endpoint = API_URL + API_KEY + isDead + perPage + type;
	let proxy = {
		
	};
	
	return {
		getSwills() {
			let def = $q.defer();
			
//			make ajax request
			$http.get(`${endpoint}`)
//			on success send data, on error reject message
				.then(def.resolve,def.reject);			
			
			return def.promise;
		},
		
		searchSwills(query){
			let def = $q.defer();
			
			$http.get(`${endpoint}`)
		}
	}

}]);