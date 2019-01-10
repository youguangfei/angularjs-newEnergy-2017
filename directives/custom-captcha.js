﻿(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('customCaptchaModule', []);

  module.directive('customCaptcha', ['$compile',function($compile) {
      return {
        restrict: 'E',
        template: '<img id="captchaImg" src="http://192.168.52.225:25510{{captchaUrl}}?t={{timestamp}}&captchaId={{captchaId}}" ng-click="refreshCaptcha()" title="刷新"/>',
        replace: true,
        scope: {
        	monitorVar: '=',
        	captchaId:"=",
        	captchaUrl:"=",
        	numFlag:"=",
        	clickChange:"&"
        },
		link: function(scope, element, attrs){
			
			console.log(scope.captchaUrl);
			scope.timestamp = new Date().getTime();
			scope.idFlag = localStorage["thisTmFlag_fgt"]||localStorage["thisTmFlag"] ;
			
			scope.refreshCaptcha = function() {
				element.attr('src','');
				setTimeout(function(){element.attr('src','http://192.168.52.225:25510'+scope.captchaUrl+'?t=' + new Date().getTime()+"&captchaId="+scope.captchaId);},50);
			}
			
			scope.$watch("monitorVar", function(newValue,oldValue) {
				console.log(newValue);
				if (scope.monitorVar) {
					scope.refreshCaptcha();
				}
				if (newValue) {
					scope.monitorVar = false;
					if(scope.clickChange){
						scope.clickChange({newModel:scope.monitorVar });
					}
				}
			});
			
			scope.$on('$destroy',function(){
				
			});
			
		}
      };
    }
  ]);

}).call(this);
