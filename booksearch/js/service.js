myApp.service("httpService",["$http",function($http){
	this.getDate = function(url,obj){
		if(obj){
			return $http.get(url,{params:obj});
		}
		else{
			return $http.get(url);
		}
	}
}])