//initialize app
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
			'has_limited_time_offer': false
		},
		bonusMiles :{
			'has_bonus_reward_miles': false
		},
		promo :{
			'has_value_added_promotion': false
		},
		seasonal :{
			'is_seasonal': false
		}
	
	};
	
//		form submit
	$scope.formSubmit = () => {
		let searchSelection = [];
		let checkBoxUrl = [];
		
//		loop through each checkbox and pass checked criteria through to ajax call			
		for (let key in $scope.checkboxModel){
				for (let item in $scope.checkboxModel[key]){
					if($scope.checkboxModel[key][item] === true){
						checkBoxUrl.push(item);
					}
				}
		}
		
//		turn searchSelection array into string, add &where= if boxes are checked
		checkBoxUrl = checkBoxUrl.join(',');
		console.log(checkBoxUrl);
		if (_.isEmpty(checkBoxUrl) === false){
			searchSelection = searchSelection + '&where=' + checkBoxUrl;}
				
//			add type of swill if $scope.swill has had user input or ignore if they choose all the booze
		if($scope.swill !== undefined && $scope.swill !== 'allTheBooze'){
			searchSelection = '&q=' + $scope.swill + searchSelection;
		}
		
//		pass along searchSelection to ajax call
		console.log(searchSelection);
		products.getSwills(searchSelection).then((data) => {
			searchSelection = [];
			console.log(data.data.result[0]);
			console.log(data.data.result);
			
//			populate results on screen
			
			return data.data.result[0];
		},(err) => {
			console.log(err);
		});
	}
}]);

app.directive('singleProduct', () => {
	return{
		restrict: 'E',
		templateUrl: 'js/templates/results.html'
	}
});

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
			let def = $q.defer();

//			make ajax request, add search params
			proxy.params.reqUrl = proxy.params.reqUrl + query;
			console.log(proxy.params.reqUrl);
			
//			send search params to $http
			$http(proxy)
			
//			on success send data, on error reject message, reset search params
				.then(def.resolve, def.reject);
			proxy.params.reqUrl = `${endpoint}`;
			console.log(def.promise);
			return def.promise;
		}
		
	}

}]);