angular.module('inputSearchModule',[]).directive('inputSearch',function(){
	return{
		restrict: 'E',
		replace: true,
		scope:{
			searchlist:"=",
			model:"=",
			search:"&",
			selectChange:"&",
			configName:"=",
			placeHolder:"="
		},
		templateUrl: 'template/inputsearch.html',
		controller:function($scope){
			
		},
		link: function(scope, elem, attrs){
//			初始化
			scope.searchulShow = false;
			
			var watch1=scope.$watch('searchlist',function(newValue,oldValue, scope){
				if(newValue.length>0){
					scope.searchulShow = true;
				}else{
					scope.searchulShow = false;
				}
				if(newValue.length==1&&(scope.text==newValue[0].likeName)){
					console.log(newValue);
					if(scope.selectChange){
						scope.selectChange({newModel:newValue[0]});
					}
				}
				if(newValue.length>1){
					if(scope.selectChange){
						scope.selectChange({newModel:scope.text});
					}
				}
				
			})
			var watch2=scope.$watch('configName',function(newValue,oldValue, scope){
				if(newValue){
					console.log(newValue);
					scope.text=newValue.likeName;
					scope.model = newValue;
					scope.searchulShow = false;
					if(scope.selectChange){
						scope.selectChange({newModel:scope.text});
					}
				}

			})
			//选择
			scope.select = function(x){
				scope.model = x;
				scope.text = x.likeName;
				scope.searchulShow = false;
				
				if(scope.selectChange){
					scope.selectChange({newModel:scope.model});
				}
			}
			
			//离开
			scope.leave=function(){
				scope.searchulShow = false;
			}
			
			scope.$on('$destroy', function() {
				if(watch1){
					watch1();
				}
				if(watch2){
					watch2();
				}

			});
			
		}
		
		
		
}
});