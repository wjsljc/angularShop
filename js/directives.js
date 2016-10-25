var aj = angular.module("myApp.directives",[]);

aj.directive("shoplist",function(){
	return {
		restrict : "AE",
		scope : {cartObj : "=cartObj",deleteShop : "&",ev : "=myEvent",allMoney : "=cartPrice",checkAll : "=checkAll",buyAll : "&",waring : "&"},
		template : '<table class="table table-bordered table-hover">' + 
				'<thead>' + 
					'<tr class="info">' + 
						'<td><input type="checkbox" ng-model="checkAll" ng-click="buyAll(cartObj)" />全选</td>' + 
						'<td>商品名称</td><td>商品单价</td>' + 
						'<td>购买数量</td>' + 
						'<td>小计</td>' +
						'<td>操作</td>' +
					'</tr>' + 
				'</thead>' + 
				'<tbody>' + 
					'<tr ng-repeat="items in cartObj" class="getinfo-tr">' + 
						'<td><input type="checkbox" ng-checked="$parent.$parent.isChecked($index,checkAll)" ng-click="$parent.$parent.buyThis(items,$index,cartObj)" /></td>' + 
						'<td ng-bind="items.sname"></td>' + 
						'<td ng-bind="items.price"></td>' + 
						'<td>' + 
							'<i class="fa fa-minus" ng-click="minusNum(items)"></i>' + 
							'<span ng-bind="items.buyNum" class="buyNum"></span>' + 
							'<i class="fa fa-plus " ng-click="$parent.$parent.addNum(items)"></i>' +
						'</td>' +
						'<td ng-bind="items.price*items.buyNum"></td>' + 
						'<td><a href="javascript:;" data-sid={{items.sid}} ng-click="$parent.$parent.deleteShop(items)">删除</a></td>' + 
					'</tr>' + 
				'</tbody>' + 
				'<tfoot>' + 
					'<tr class=" myshop">' + 
						'<td><a href="../html/cart.html" target="_blank">我的购物车</a></td>' + 
						'<td colspan="4">总消费：<span ng-bind="allMoney"></span></td>' + 
						'<td><button class="btn btn-danger" ng-click="waring()">去结算</button></td>' +
					'</tr>' + 
				'</tfoot>' + 
			'</table>',
		replace:true,
	 	transclude:true, //处理指令里面的dom显示在哪里的
	 	link:function(scope, element, attrs){
	 		//解决从里面传递到外面避免耦合的问题
	 		scope.minusNum=function(items){
	 			scope.$emit('to-child', items); 
	 		}
		}
	}
});




