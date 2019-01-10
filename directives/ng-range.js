angular.module('ngRange', [])
.directive('ngRange', function() {
	return {
		replace: true,
		restrict: 'E',
		require: 'ngModel',
		scope:{
			rangeChanged: '&',
			rangs:'=',
			acc:'='
		},
		template: '<div style="position: relative;float:left;width:265px;margin-left:3px">\
						<input type="range"></input>\
						<a ng-class="{true: \'accOn\', false: \'accOff\'}[x.type == 1]" title="acc{{x.type == 1 ? \'开启\' : \'关闭\'}}&#10; {{x.time}}" ng-repeat="x in acc" style="position: absolute;top:25px;left:{{x.left}}%"></a>\
					</div>',
		link: function(scope, elements, attrs, ngModel) {
			var ngRangeMin  = null;
			var ngRangeMax  = null;
			var ngRangeStep = null;
			var value       = null;
			var wreg = {
				min: null,
				max: null,
				step: null,
				model: null,
			};
			var element = elements.find("input[type='range']");

            element.on('$destroy', function() {
            	if (wreg.min) {
            		wreg.min();
            	}
            	if (wreg.max) {
            		wreg.max();
            	}
            	if (wreg.step) {
            		wreg.step();
            	}
            	if (wreg.model) {
            		wreg.model();
            	}
            });

            if (!angular.isDefined(attrs.ngRangeMin)) {
				ngRangeMin = 0;
			} else {
				wreg.min = scope.$watch(attrs.ngRangeMin, function(newValue, oldValue, scope) {
					if (angular.isDefined(newValue)) {
						ngRangeMin = newValue;
						setValue();
					}
				});
			}
			if (!angular.isDefined(attrs.ngRangeMax)) {
				ngRangeMax = 100;
			} else {
				wreg.max = scope.$watch("rangs", function(newValue, oldValue, scope) {
					if (angular.isDefined(newValue)) {
						ngRangeMax = newValue;
						setValue();
					}
				});
				/*wreg.max = scope.$watch("attrs.ngRangeMax", function(newValue, oldValue, scope) {
					if (angular.isDefined(newValue)) {
						ngRangeMax = newValue;
						setValue();
					}
				});*/
			}
			if (!angular.isDefined(attrs.ngRangeStep)) {
				ngRangeStep = 1;
			} else {
				wreg.step = scope.$watch(attrs.ngRangeStep, function(newValue, oldValue, scope) {
					if (angular.isDefined(newValue)) {
						ngRangeStep = newValue;
						setValue();
					}
				});
			}
			if (!angular.isDefined(ngModel)) {
				value = 50;
			} else {
				wreg.model = scope.$watch(
					function () {
						return ngModel.$modelValue;
					}, 
					function(newValue, oldValue, scope) {
						if (angular.isDefined(newValue)) {
							value = newValue;
							setValue();
						}
					}
				);
			}

			function setValue() {
				if (
					ngRangeMin != null &&
					ngRangeMax != null &&
					ngRangeStep != null &&
					value != null
				) {
					element.attr("min", ngRangeMin);
					//element.attr("max", ngRangeMax);
					element.attr("max", attrs.ngRangeMax);
					element.attr("step", ngRangeStep);
					element.val(value); 
				}
			}
			
			function read() {
				if (angular.isDefined(attrs.ngModel)) {
					value = element.val();
					ngModel.$setViewValue(element.val());
					if(scope.rangeChanged!= null){
						scope.rangeChanged();
					}
				}
			}

			element.on('change', function() {
				if (value != null) {
					scope.$apply(read);
				}
			});
		}
	};
});