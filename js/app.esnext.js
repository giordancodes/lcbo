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
		clearance :{
			'&=has_clearance_sale=': false
		},
		promo :{
			'&=has_value_added_promotion=': false
		},
		seasonal :{
			'&=is_seasonal=': false
		},
		kosher :{
			'&=is_kosher=': false
		}
	};
	
//		form submit
	$scope.formSubmit = () => {
		let searchSelection = [];
		console.log(searchSelection);
//		loop through each checkbox and pass checked criteria through to ajax call
					
		for (let key in $scope.checkboxModel){
				for (let item in $scope.checkboxModel[key]){
					searchSelection.push(item, $scope.checkboxModel[key][item])
				}
			};
		searchSelection = searchSelection.join();
		searchSelection = searchSelection.replace(/,/g, '');
		if($scope.swill !== undefined){
			searchSelection = searchSelection + '&q=' + $scope.swill;
		};

		products.getSwills(searchSelection).then((data) => {
			searchSelection = [];
			return data.data.result;
		}
		
	)}
}]);

// ajax calls
app.factory('products', ['$http', '$q', ($http, $q) => {
	const API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	const API_URL = 'http://lcboapi.com/products?access_key=';
	let isDead = '&where_not=is_discontinued';
	let perPage = '&per_page=100';
	let endpoint = API_URL + API_KEY + isDead + perPage;
	let proxy = {
			method: 'GET',
			url: 'http://proxy.hackeryou.com',
			params:{
				reqUrl: `${endpoint}`
			}
		};
	
	return {
		getSwills(query) {
			let def = $q.defer(),
					proxyQuery = '';
			console.log(query);

//			make ajax request, add search params
			proxy.params.reqUrl = proxy.params.reqUrl + query;
			$http(proxy)
//			on success send data, on error reject message
				.then(def.resolve,def.reject);
			proxy.params.reqUrl = `${endpoint}`;
			console.log(proxy.params.reqUrl);
			return def.promise;
		}
		
	}

}]);