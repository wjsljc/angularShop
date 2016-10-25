var myApp = angular.module("my-app",[]);
var arr = "";
myApp.controller("content",['$scope','$http','httpService',function($scope,$http,httpService){
	$scope.AllPrice = 0;
	$scope.books=[];
	/*获取数据并添加进Table中*/
	httpService.getDate("books.json").then(function(callBack){
		// 点击删除按钮，:''除当前行；
		arr =callBack.data.books;
		$scope.deleteBtn = function(){
			arr.splice(this.$index,1);
			//totalPrice(arr);
			// 删除成功 请求数据并返回值
			httpService.getDate("books.json",{"Delete":true}).success(function(data){
				console.log(data.model[0].Delete);
			});
		}
		//计算总价
		//totalPrice(arr);
		// 添加内容到table中
		$scope.books = arr;
	});
	//搜索
	$scope.typeFun = function(ty){
		var obj = {};
		obj[ty] = this.inputVal;
		return obj;
	}
	$scope.changeType = function(type){
			this.ty = type;
	}

	var btn = true;
	/*书名排序*/
	$scope.Name = function(){
		if(btn){
			$scope.order = "bookName";
			btn = false;	
		}
		else{
			$scope.order = "";
			btn = true;
		}	
	}
	/*作者排序*/
	$scope.Author = function(){
		if(btn){
			$scope.order = "bookWriter";
			btn = false;	
		}
		else{
			$scope.order = "";
			btn = true;
		}	
	}
	/*价格排序*/
	$scope.Price = function(){
		if(btn){
			$scope.order = "bookPrice";
			btn = false;	
		}
		else{
			$scope.order = "";
			btn = true;
		}	
	}
	// 点击添加 按钮
	$scope.addBookBtn = function(){
		$scope.BookName = "";
		$scope.BookWriter = "";
		$scope.BookPrice = "";
		$scope.btnChange = true;
		$scope.title = "添加";
		$scope.modalBt = "添加书籍";
	}
	// 点击编辑 按钮
	var AmendIndex = 0;
	$scope.amendBtn = function(){
		AmendIndex = this.$index;
		$scope.BookName = arr[AmendIndex].bookName;
		$scope.BookWriter = arr[AmendIndex].bookWriter;
		$scope.BookPrice = arr[AmendIndex].bookPrice;
		$scope.btnChange = false;
		$scope.title = "编辑";
		$scope.modalBt = "编辑书籍";
	}
	//添加书籍按钮 与修改书籍按钮
	$scope.sureBtn = function(){
		if($scope.btnChange){
			if($scope.BookName && $scope.BookWriter && $scope.BookPrice){
				
				arr.push(bookInfo);
				$scope.books = arr;
				//totalPrice(arr);
				httpService.getDate("books.json",{"Add":true}).success(function(data){
						console.log(data.model[1].Add); 
				});
				$scope.order = "bookPrice";
				//清空信息
				$scope.BookName = "";
				$scope.BookWriter = "";
				$scope.BookPrice = "";

				// 关闭窗口
				$(function(){
					$('#myModal').modal('hide');
				});
			}
			else{
				alert("信息全为必填项");
			}
		}
		else{
			if($scope.BookName && $scope.BookWriter && $scope.BookPrice){
				
				arr[AmendIndex].bookName = $scope.BookName;
				arr[AmendIndex].bookWriter = $scope.BookWriter;
				arr[AmendIndex].bookPrice = $scope.BookPrice;
				
				$scope.boosk = arr;
				//totalPrice(arr);
				httpService.getDate("books.json",{"Amend":true}).success(function(data){
						console.log(data.model[2].Amend); 
				});
				$scope.order = "bookPrice";
				//清空信息
				$scope.BookName = "";
				$scope.BookWriter = "";
				$scope.BookPrice = "";
				//  关闭窗口
				$(function(){
					$('#myModal').modal('hide');
				});
			}
			else{
				alert("信息全为必填项");
			}
		}

	}
	// 计算总价的函数
	/*function totalPrice(arr){
		$scope.AllPrice = 0;
		angular.forEach(arr,function(val, key){
			$scope.AllPrice += parseFloat(val.bookPrice) * 100 / 100;
		});
	}*/
	var AllPrice = function(){
	   var total = 0;
        angular.forEach($scope.books,function(val, key){
			total += parseFloat(val.bookPrice) * 100 / 100;
		});
       return total;
	};

	$scope.$watch(AllPrice,function(newValue,oddValue){
        $scope.AllPrice = newValue
	})
}]);
