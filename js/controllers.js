var aj = angular.module("myApp.controllers",[]);

//购物页控制

aj.controller("shopCtrl",["$scope","$timeout","xhr","shopService",function($scope,$timeout,xhr,shopService){
	xhr.getData("_mock/shop.json",{},function(res){
		$scope.shopInfo =  res;
		console.log($scope.shopInfo);
	});
	
	
	
	
	//按类型搜索
	$scope.searchType = "按条件搜索";
	$scope.shopType = [];
	$scope.eTypeArr = [{"" : "按条件搜索"},{"sname" : "名字"},{"price" : "价格"}];
	$scope.eTypeLen = $scope.eTypeArr.length;
	
	//将搜索类型分离
	shopService.pushType($scope.eTypeArr,function(res){
		$scope.shopType = res;
	});

	//切换选择过滤的类型
	$scope.changeType = function(){
		//切换类型中英文的映射
		shopService.changeToEnglishType($scope.eTypeArr,$scope.searchType,function(res){
			$scope.param = res;
		});
	}
	
	//定义返回过滤函数
	$scope.param = "";
	$scope.rSearch = function(param){
		var filterType = shopService.changeFilter(param,$scope.search,$scope.eShowTypeArr,$scope.groupVal);
		return filterType;
	}
	
	//设置是否显示变量
	$scope.showType = "按类型显示";
	$scope.eShowTypeArr = [{"" : "按类型显示"},{"1" : "水"},{"2" : "方便面"},{"3" : "手机"}]
	
	//将搜显示型分离
	shopService.pushType($scope.eShowTypeArr,function(res){
		$scope.showTypeArr = res;
	});
	
	//判断是否显示
	$scope.groupIndex = "";
	 	//获取显示的类型
	$scope.getType = function(getType){
		//获取对应分类的index
		shopService.getGroupIndex(getType,$scope.groupIndex,$scope.showTypeArr,function(res){
			$scope.groupIndex = res;
		});
	}
	//判断是否显示
	$scope.isShow = function(items){
		var isShow = shopService.isShow($scope.groupIndex,items);
		return isShow;
	};
	
	//商品排序功能
	$scope.sort = false;
	$scope.sortType = "按价格排序";
	$scope.eSortType = "price";
	$scope.eSortTypeArr = [{"price" : "按价格排序"},{"hot" : "按热门排序"}];
	
	//映射按钮显示文字
	shopService.pushType($scope.eSortTypeArr,function(res){
		$scope.sortTypeArr = res;
	});
	
	$scope.getSortType = function(sortTypeName){
		//切换类型中英文的映射
		shopService.changeToEnglishType($scope.eSortTypeArr,$scope.sortType,function(res){
			$scope.eSortType = res;
		});
	}
	
	//选择排序类型
	$scope.getSort = function(eSortType){
		$scope.eSortType = eSortType;
	}
	
	//选择升序降序
		//设置选中变量
	$scope.isActive = true;
	$scope.px = function(param){
		shopService.changeSort(param,$scope.isActive,function(res){
			$scope.isActive = res.isActive;
			$scope.sort = res.sort;
		});
	};
	
	//设置购买数量
	$scope.buyNum = 1;
	
	//加减运算
	$scope.addNum = function(item,event){
		var result = "add";
		shopService.changeBuyNum(item,result);
	}
	$scope.minusNum = function(item,event){
		var result = "minues";
		shopService.changeBuyNum(item,result);
	}
	
	//加入购物车
	$scope.goBuy = function(item){
		shopService.saveShop(item);
		alert("商品加入成功!");
	}
	
}]);

//cart控制
aj.controller("carCtrl",["$scope","$timeout","shopService","xhr",function($scope,$timeout,shopService,xhr){
	//读取本地存储
	shopService.readShop(function(res){
		$scope.cartObj = res;
	});
	
	//设置总消费金额
	$scope.allMoney = 0;
	
	//删除事件
	$scope.deleteShop = function(items){
		shopService.deleteShop(items,$scope.cartObj,$scope.allMoney,xhr,function(res){
			$scope.allMoney = res;
		});
	}
	  $scope.$on('to-child',function(obj,items){
    	console.log(items)
    })
	//增加减少商品
	$scope.minusNum = function(items){
		var key = "minus";
		shopService.changeCartNUm(key,items,$scope.allMoney,function(res){
			$scope.allMoney = res;
		});
	}
	//商品的增加
	$scope.addNum = function(items){
		var key = "add";
		shopService.changeCartNUm(key,items,$scope.allMoney,function(res){
			$scope.allMoney = res;
		});
	}
	
	//判断是否点击全选按钮
	$scope.isButAll = false;
	//点击全选按钮
	$scope.buyAll  = function(cartObj){
		shopService.checkAll(cartObj,$scope.isButAll,$scope.allMoney,function(res){
			$scope.allMoney = res;
		});
		$scope.isButAll = !$scope.isButAll;
	}
	
	//判断单个商品的勾选状态,计算小计
	$scope.buyThis = function(items,index,cartObj){
		shopService.isChoise(items,index,cartObj,$scope.allMoney,function(res){
			$scope.allMoney = res;
		});
	}
	//返回全选的勾选状态
	$scope.checkAll = false;//默认没有选中
	$scope.isChecked = function(index,checkAll){
		if(checkAll === true){
			return true;
		}else{
			return false;
		}
	}
	
	$scope.waring = function(){
		alert("还在用bootstrap写弹出框？既然用了angular这种与dom驱动相违背的bug，再引用JQ不嫌大吗？bootstrap连zepto都不支持，吃屎吧骚年！(其实是我偷懒嘿嘿嘿~)");
	}
}]);
