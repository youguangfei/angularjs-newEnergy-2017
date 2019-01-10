angular.module('selectBlockModule',[]).directive('selectBlock',function(){
	return{
		restrict: 'E',
		replace: true,
		scope:{
			config:"=",
			model:"=",
			selectChange:"&",
		},
		templateUrl: 'template/selectblock.html',
		controller:function($scope){
			
		},
		link: function(scope, elem, attrs){
			scope.isShow = false;
			scope.focus=false;
			scope.start=true;
			scope.arrow=false;
			scope.$watch('model',function(newValue,oldValue, scope){
				if(newValue){					
					angular.forEach(scope.config.data,function(data,index){
						if(data==newValue){
							scope.text = data.name;
						}
						if(newValue.selectedType&&(data.name==newValue.selectedType)){
							scope.text = data.name;
							scope.model.dicId=data.dicId;
							return;
						}
					});
					if(scope.text==undefined&&newValue.selectedType&&(!newValue.isFor)){
						scope.text = newValue.selectedType;
						scope.model=newValue;
						return;
					}
					if(newValue.selectedType&&newValue.isFor){
						scope.model=scope.config.data[0];
						scope.text =scope.config.data[0].name;
					}
					
				}else{	
					//默认选第一个
					if((!scope.config.defaultData)&&scope.config.data&&scope.config.data.length>0){
						scope.model=scope.config.data[0];
						scope.text =scope.config.data[0].name;
						return;
					}
//					有默认值时,显示默认值,且当数据为空,按钮不能点击
					if(scope.config.defaultData){
						scope.model=scope.config.defaultData;
						scope.text =scope.config.defaultData.name;
						if(scope.config.data&&scope.config.data.length==0){
							scope.config.disabled=true;
						}
					}
					
				}

			});
			
			scope.select = function(index){
				
				scope.model = scope.config.data[index];
				scope.text = scope.config.data[index].name;
				scope.isShow = false;
				
				if(scope.config.focus){
					scope.focus=false;
				}else{
					scope.arrow=false;
				}
				console.log(scope.model);
				if(scope.selectChange){
					scope.selectChange({newModel:scope.model});
				}
				
			}
			scope.open=function(){
				if (scope.config.disabled) {
					return;
				}
				scope.isShow=!scope.isShow;
				if(scope.config.focus){
					scope.focus=true;
				}else{
					scope.arrow=true;
				}
			}
			scope.leave=function(){
				scope.isShow=false;
				scope.focus=false;
				scope.start=true;
				scope.arrow=false;
			}
		}
		
}
});