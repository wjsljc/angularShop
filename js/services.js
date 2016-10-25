var aj = angular.module("myApp.services",[]);
//请求数据
//为什么用factor不对？
aj.service("xhr",["$http",function($http){
	this.getData = function(src,data,callback){
		$http.get(src).success(function(response){
			callback(response);
		});
	}
}]);

//自定义商品服务
aj.service("shopService",["$http",function($http){
	//将搜索类型分离
	this.pushType = function(arr,callback){
		var arrLen = arr.length;
		var shopType = [];
		for(var i = 0;i < arrLen;i++){
			angular.forEach(arr[i], function(val,key){
				shopType.push(val);
			});
		}
		callback(shopType);
	}
	//切换类型中英文的映射
	this.changeToEnglishType = function(arr,searchType,callback){
		var arrLen = arr.length;
		var eType = "";
		for(var i = 0;i < arrLen;i++){
			angular.forEach(arr[i], function(val,key){
				if(searchType === val){
					eType = key;
				}
			});
		}
		callback(eType);
	}
	//将过滤器设置为变量的函数处理
	this.changeFilter = function(param,search){
		if(param === ""){
			return search;
		}else{
			var obj = {};
			obj[param] = search;
			return obj;
		}
	}
	
	//获取对应分类的index
	this.getGroupIndex = function(getType,groupIndex,arr,callback){
		var arrLen = arr.length;
		for(var i = 0;i < arrLen;i++){
			if(arr[i] === getType){
				groupIndex = i;
			}
		}
		callback(groupIndex);
	};
	
	//判断是否显示
	this.isShow = function(groupIndex,items){
		if(groupIndex === ""){
			return true;
		}else if(groupIndex == 0){
			return true;
		}else if(items.group == groupIndex){
			return true;
		}else{
			return false;
		}
	}
	
	//处理升降序
	this.changeSort = function(param,isActive,callback){
		var obj = {};
		if(param === "降序"){
			obj = {"isActive" : false,"sort" : true}
			callback(obj);
		}else if(param === "升序"){
			obj = {"isActive" : true,"sort" : false}
			callback(obj);
		}
	}
	
	//处理加减按钮
	this.changeBuyNum = function(item,result){
		if(result === "add"){
			if(item.buyNum < item.allNum){
				item.buyNum++;
			}else{
				alert("没有足够的商品了!");
			}
		}else{
			if(item.buyNum > 1){
				item.buyNum--;
			}else{
				alert("商品数量不得小于1!");
			}
		}
	}
	
	//信息存储本地存储
	this.saveShop = function(item){
		var shop = localStorage.getItem("myCart");
		var objArr = [];
		var obj = {};
		//第一次加入localStorage
		if(shop === null){
			objArr.push({
				"sname" : item.sname,
				"buyNum" : item.buyNum,
				"price" : item.price,
				"sid" : item.sid,
				"allNum" : item.allNum,
				"status" : 0
			});
			//存入localStorage
			var sShop = JSON.stringify(objArr);
			localStorage.setItem("myCart",sShop);
		}else{	//不是第一次存储
			var
				isNewShop = true, // 假设是新的商品
				objArr = JSON.parse(localStorage.getItem("myCart")); 
			// for循环判断新加入的商品是否是第一次加入
			for(var j= 0; j < objArr.length; j++) {

				// 如果新添加的商品在购物车中已经存在，则只需要更新数量
				if(objArr[j].sid === item.sid) {
					console.log(item.buyNum);
					objArr[j].buyNum = parseInt(objArr[j].buyNum) + parseInt(item.buyNum);
					isNewShop = false; // 它不是一个新的商品
				}
			}
			// 如果是新商品，则追加到购物车中
			if(isNewShop) {
				objArr.push({
					"sname" : item.sname,
					"buyNum" : item.buyNum,
					"price" : item.price,
					"sid" : item.sid,
					"allNum" : item.allNum,
					"status" : 0
				});
			}
			// 加商品加入到购物车以后，将数组转换为字符串，存入到cookie中。
			var objArr = JSON.stringify(objArr);
			localStorage.setItem("myCart",objArr);
		}
	}
	
	//读取商品信息
	this.readShop = function(callback){
		var cartObj = {};
		var cartArr = [];
		var oCart = JSON.parse(localStorage.getItem("myCart"));
		if(oCart !== null){
			for(var i = 0,len = oCart.length;i < len;i++){
				cartArr.push(oCart[i]);
			}
		}
	//	cartObj.cartInfo = cartArr;
//		$scope.cartObj = cartArr;
		callback(cartArr);
	}
	
	//商品的删除
	this.deleteShop = function(items,cartObj,allMoney,xhr,callback){
		if(!confirm("确认要删除？")){
			window.event.returnValue = false;
		}else{
			//删除本地存储		
			var cartShop = JSON.parse(localStorage.getItem("myCart"));
			angular.forEach(cartShop,function(key,val){
				if(key.sid === items.sid){
					//删除本地储存
					cartShop.splice(val,1);
					//删除dom节点
					cartObj.splice(val,1);
					//重新计算总消费
					if(items.status % 2 != 0){
						allMoney -= items.price * items.buyNum;
						callback(allMoney);
					}
				}
			});
			//重新存储
			cartShop = JSON.stringify(cartShop);
			localStorage.setItem("myCart",cartShop);
		}
		//向后台请求数据
		xhr.getData("../_mock/shop.json?sid="+items.sid,{"sid":items.sid},function(res){
			
		});
	}
	
	//改变cart数量
	this.changeCartNUm = function(key,items,allMoney,callback){
		if(key === "minus"){
			if(items.buyNum > 1){
				//更改本地存储
				var cartShop = JSON.parse(localStorage.getItem("myCart"));
				angular.forEach(cartShop,function(key,val){
					if(key.sid === items.sid){
						//本地存储减少
						key.buyNum--;
						//dom减少
						items.buyNum--;
						if(items.status % 2 != 0){
							allMoney -= items.price;
							callback(allMoney);
						}
					}
				});
				//重新存储
				cartShop = JSON.stringify(cartShop);
				localStorage.setItem("myCart",cartShop);
			}else{
				if(!confirm("真的不再考虑了么？")){
					window.event.returnValue = false;
				}else{
					alert("请直接选择删除本商品，骚年！");
				}
			}
		}else{
			if(items.buyNum < items.allNum){
			//更改本地存储
			var cartShop = JSON.parse(localStorage.getItem("myCart"));
				angular.forEach(cartShop,function(key,val){
					if(key.sid === items.sid){
						//本地存储减少
						key.buyNum++;
						//dom减少
						items.buyNum++;
						//说明它是被选中的
						if(items.status % 2 != 0){
							allMoney += items.price;
							callback(allMoney);
						}
					}
				});
				//重新存储
				cartShop = JSON.stringify(cartShop);
				localStorage.setItem("myCart",cartShop);
			}else{
				alert("没有更多的该类商品了!");
			}
		}
	}
	//全选功能
	this.checkAll = function(cartObj,isButAll,allMoney,callback){
		isButAll = !isButAll;
		if(isButAll === true){
			//重置总金额
			allMoney = 0;
			angular.forEach(cartObj,function(val,key){
				allMoney += parseFloat(val.price)  * parseFloat(val.buyNum);
				val.status = 1;
			});
			callback(allMoney);
		}else{
			angular.forEach(cartObj,function(val,key){
				val.status = 0;
			});
			allMoney = 0;
			callback(allMoney);
		}
	}
	
	//判断是否勾选商品
	this.isChoise = function(items,index,cartObj,allMoney,callback){
		items.status++;
		//说明它被选中了
		if(cartObj[index].status % 2 != 0){
			allMoney += parseFloat(cartObj[index].price) * parseFloat(cartObj[index].buyNum);
			callback(allMoney);
		}else if(cartObj[index].status % 2 == 0){
			allMoney -= parseFloat(cartObj[index].price) * parseFloat(cartObj[index].buyNum);
			callback(allMoney);
		}
	};
	
	//返回全选的勾选状态
	this.isChoiseAll = function(checkAll){
//		if(checkAll === true){
//			return true;
//		}else{
//			return false;
//		}
	}
	
	
}]);
