(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('sideMenuModule', []);

  module.directive('sideMenu', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template: '<ul class="sider-nav index_bot">\
						        	<li ui-sref-active=\"current\"  ng-repeat="func in functions" ng-click="funcClick(func, $event)" class="index_botli">\
							    		<a class="tab1bj" ng-class="func.icon" ui-sref="{{func.url ? func.url : (func.children && func.children.length > 0 ? func.children[0] : false)}}" ><span>{{func.name}}</span><i style="margin-top:18px;" ng-if="func.children && func.children.length > 0" class="icon icon-arrow-down pull-right"></i></a>\
							    		<ul ng-class="func.funShow" class="sider-nav-s">\
							    			<li ui-sref-active="active" ng-repeat="subFunc in func.children" class="indexli_ul_li">\
							    				<a ui-sref="{{subFunc.url}}" ng-click="subFuncClick(subFunc,$event)"><span>{{subFunc.name}}</span></a>\
							    			</li>\
							    		</ul>\
							    	</li>\
		       	   </ul>',
        replace: true,
        scope: {
        	items: '=',
        	currentState:'='
        },
		link: function(scope, element, attrs){
			$(document).on('click', '.toggle-icon', function() {
            $(this).closest("#pf-bd").toggleClass("toggle");
            $(window).resize();
      });
			scope.icon_right_class="tab1bj tabnum";
			scope.icon_down_class="tab2bj tabnum";
			
			scope.fun_show_class="indexli_ul";
			scope.fun_hide_class="indexli_ul_hide";	
			
			//init
			scope.functions = [];
			scope.init = function(){
				for(m in scope.functions){		
					if(scope.functions[m].children != null){
						var hide = true;
						for(var item in scope.functions[m].children){
							if(scope.functions[m].children[item].url == scope.currentState){
								scope.functions[m].funShow=scope.fun_show_class;
								hide = false;
								break;
							}
						}
						if(hide)scope.functions[m].funShow=scope.fun_hide_class;
					}
					else
						scope.functions[m].funShow=scope.fun_hide_class;
					scope.functions[m].icon=scope.icon_right_class;
				}
			}
			//root function click
			scope.funcClick=function(func, $event){
				if(func.funShow==scope.fun_show_class){
					func.funShow=scope.fun_hide_class;
					return;
				}
				
				scope.functions.forEach(function(item){
					item.funShow = scope.fun_hide_class;
				});
				
				func.funShow=(func.funShow==scope.fun_hide_class?scope.fun_show_class:scope.fun_hide_class);
				func.icon=(func.icon==scope.icon_right_class? scope.icon_down_class:scope.icon_right_class);
			}
			
			//function click
			scope.subFuncClick=function(subFunc,$event){
				$event.stopPropagation();
			}
			
			/*$(".sider-nav").delegate(".index_botli","click",function(event){
				var $tar=$(event.target);
	   			if(!$tar.hasClass('current')){
	   				$tar.parent().addClass('current');
	   				$tar.parent().parent().siblings().find(".tabnum").removeClass("current")
	   			} 	
			})*/
			
			scope.$watch('items',function(){
				scope.functions = scope.items;
				scope.init();
			});

			scope.init();
//			

			scope.$on('$destroy',function(){
				scope.$watch('items',function(){});
				scope.init = null;
				scope.funcClick = null;
				scope.subFuncClick = null;
				element.remove();
				console.log('side menu destroy!!');
				
			});
		}
      };
    }
  ]);

}).call(this);

