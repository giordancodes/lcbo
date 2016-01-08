//initialize app
let app = angular.module('swillApp', ['ui.router', 'ngGeolocation']);

//config stateprovider
app.config(($stateProvider) => {
	$stateProvider
		.state('index', {
			url: '',
			controller: 'MainController',
			templateUrl: 'js/templates/MainController.html'
	})
		.state('single', {
			url: '/single/:id',
			controller: 'SingleController',
			templateUrl: 'js/templates/SingleController.html'
	});
});

//main controller
app.controller('MainController', ['$scope', 'products', '$location', '$anchorScroll', ($scope, products, $location, $anchorScroll) => {
		
//	set default for dropdown menu
	$scope.swill = 'allTheBooze';
	
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
		},
		kosher :{
			'is_kosher': false
		}
	};
	
//	back to top function
	$scope.backToTop = () => {
		$anchorScroll.yOffset = 30;
		$location.hash('header');
		$anchorScroll();
	};
	
//	sort function
	$scope.predicate = 'price_per_liter_of_alcohol_in_cents';
	$scope.reverse = true;
	$scope.order = (predicate) => {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};
	
	
//		form submit
	$scope.formSubmit = () => {
		let searchSelection = {};
		let checkBoxUrl = [];
		
		searchSelection = {
			where: '',
			q: ''
		};
		
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
		if (_.isEmpty(checkBoxUrl) === false){
			searchSelection['where'] = searchSelection['where'] + checkBoxUrl;}
				
//			add type of swill if $scope.swill has had user input or ignore if they choose all the booze. if nothing chosen display all the booze
		if($scope.swill !== undefined && $scope.swill !== 'allTheBooze' && $scope.swill !== 'choose'){
			searchSelection['q'] =  $scope.swill;
		}
		
//		pass along searchSelection to ajax call
		products.getSwills(searchSelection).then((data) => {
			$scope.products = data.data.result;
			
//			scroll to results
			$anchorScroll.yOffset = -30;
			$location.hash('results');
			$anchorScroll();
			
//			throw error if search returns nothing
			if($scope.products[0] === undefined){
				alert('Sorry, nothing meets your criteria! Please broaden your search.');
			}
			
			//			if general error...
		},(err) => {
			console.log(err);
			alert("Sorry, something's amiss! Please try again.")
		});
	}
}]);

//controller for single item
app.controller('SingleController', ($scope, $anchorScroll, $location, products, $stateParams, $geolocation) => {

	$scope.backToTop = () => {
		$anchorScroll.yOffset = -20;
		$location.hash('header');
		$anchorScroll();
	};
	
	let location = {
		lat: '',
		lon: ''
	}
	
//	pass product id to $http
	products.getSingle($stateParams.id).then((data) => {
		$scope.products = data.data;
		$scope.stores = data.data.result;
		
		
//			scroll to results
		$anchorScroll.yOffset = 0;
		$location.hash('resultItem');
		$anchorScroll();
	})
	
});

//directive for displaying singular result in SingleController
app.directive('singleProduct', () => {
	return{
		restrict: 'E',
		templateUrl: 'js/templates/results.html'
	}
});

// ajax calls
app.factory('products', ['$http', '$q', '$geolocation', ($http, $q, $geolocation) => {
	const API_KEY = 'MDo3NTJjYzBmMC04ZWU2LTExZTUtYjkxYy04M2IwMzZlMmUwYTc6V1hLeXQ3cWRlYVFoRzFzZFF2NVdrM3JqTk9EN3l0aXRMc3d5';
	const API_URL_PRODUCTS = 'http://lcboapi.com/products';
	const API_URL_STORES = 'http://lcboapi.com/stores';
	let isDead = '&where_not=is_discontinued';
	const proxy_products = {
			method: 'GET',
			url: 'http://proxy.hackeryou.com',
			params:{
				reqUrl: `${API_URL_PRODUCTS}`,
				access_key: API_KEY,
				per_page: 64,
				page: '1',
				isDead: false
			}
		};
	const proxy_stores = {
			method: 'GET',
			url: 'http://proxy.hackeryou.com',
			params:{
				reqUrl: `${API_URL_STORES}`,
				access_key: API_KEY,
				per_page: 42,
				isDead: false,
				lat: '',
				lon: '',
				product_id: ''
			}
		};
	
	return {
		getSwills(query) {
			let def = $q.defer();

//			make ajax request, add search params
			let proxyCopy = proxy_products;
			Object.assign(proxyCopy.params, query);
			
			let proxyStoreCopy = proxy_stores;
			
//			get geolocation
			$geolocation.getCurrentPosition({
					timeout: 60000
			 }).then(function(position) {
						proxyStoreCopy.params.lat = position.coords.latitude;
						proxyStoreCopy.params.lon = position.coords.longitude;
			 })
			
//			send search params to $http
			$http(proxyCopy)
			
//			on success send data, on error reject message, reset search params
				.then(def.resolve, def.reject);
			return def.promise;
		},
	
//		results for single item showing stores with stock
		getSingle(query){
			
			let def = $q.defer();

			let proxyStoreCopy = proxy_stores;
			
			proxyStoreCopy.params.product_id = query;
			
//			send product id to $http
			$http(proxyStoreCopy)
			
//			on success send data, on error reject message, reset search params
				.then(def.resolve, def.reject);
			return def.promise;
		}
		
	};

}]);