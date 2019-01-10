(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('topMenuModule', []);

  module.directive('topMenu', [
	function() {
      return {
        restrict: 'E',
        template: "<ul class=\"pf-nav\"><li ui-sref-active=\"current\" class=\"pf-nav-item project\" ng-repeat=\"menu in menuData track by $index\">"
       +"<a ui-sref=\"{{menu.url}}\">{{menu.name}}</a></li></ul>",
        replace: true,
        scope: {
          menuData: '='
        },
		link: function(scope, element, attrs){
				menuData = [];
				scope.$watch("menuData",function(value,old){
					if(value && value.length > 0){
						angular.forEach(value,function(item){
							var pos = item.icon.lastIndexOf('.');
							item.cls = item.icon.substring(item.icon.lastIndexOf('/')+1,pos);
									item.icon_a = item.icon.substring(0,pos)+'_a'+item.icon.substring(pos);
									item.icon_b = item.icon.substring(0,pos)+'_b'+item.icon.substring(pos);
								});
							}				
						});
						
						scope.$on("$destroy",function (){
							menuData = null;
							element.remove();
						});
						
						
					}
      };
    }]
  );

}).call(this);