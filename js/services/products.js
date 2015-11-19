var ACCESS_KEY = 'MDoyNmNiMWU2Ni04ZTRiLTExZTUtYTM1Ny01MzgyMzIyOWU5ZmQ6ck5MWkI2TWt2d21RQnhRRm1lZ293ZUh1cmF4QTNCWlk2QlNi';
app.factory('products', ['$http', function($http){
	return $http.get('http://lcboapi.com/products?access_key=' + API_KEY)
			.success(function(data){
				return data;
	})
			.error(function(err){
				return err;
	})
}]);