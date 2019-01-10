angular.module('datePickers',[]).directive('dateUi',function(){
	return{
		restrict:'EAMC',
	    templateUrl:'template/datePicker.html',
	    replace:true,
	    scope:{
	    	dt:'=',
	    	ngChanged:'&',
            dateReadonly:'=',
            dateDisabled:'=',
			    	dateRequired:'=',
			    	dateFormat:'=',
			    	initDate:'=',
			    	maxFlag:'=',
	    },
	    controller:function($scope){
			    	$scope.today = function () {
				    		if($scope.dt===null || $scope.dt===undefined || $scope.dt.length<=0){
				    			if ($scope.initDate && $scope.dateFormat != null && $scope.dateFormat == 4) {
				    				$scope.dt = new Date();
				    			}
				    		}else{
				    			if("number" === typeof date)
				    			{
				    				$scope.dt = new Date().setTime($scope.dt);
				    			}
				    		}
		        };
		        $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.open = function($event) {
				        $event.preventDefault();
				        $event.stopPropagation();
				        $scope.opened = true;
				    }
				 
				    $scope.disabled = function(date, mode) {
				        return (mode === 'day' && (date.getDay() === 0 || date
				                .getDay() === 6))
				    }
				 
				    $scope.toggleMin = function() {
				        $scope.minDate = $scope.minDate ? null : new Date();
				    }
				 
				    $scope.toggleMin();
				 
				    $scope.dateOptions = {
				            formatDay : 'dd',
				            formatMonth : 'MM',
				            formatYear : 'yyyy',
				            formatDayHeader : 'EEE',
				            formatDayTitle : 'MMMM yyyy',
				            formatMonthTitle : 'yyyy',
				            maxDate : new Date(2020, 5, 22),
				            minDate : new Date(),
				            startingDay : 1
				    }
				    // 日期格式数组
				    $scope.myDateformats = [ 'yyyy-MM-dd', 'dd-MMMM-yyyy',
				                             'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ];
				    // 将日期格式数组第0项设为默认日期格式
				    $scope.myDefaultDateFormat = $scope.myDateformats[0];
				    $scope.altInputFormats = ['M!/d!/yyyy'];
	    },
	    link:function(scope,element,attrs){
//	    	console.log(attrs.labelname);
	    	scope.labelName=attrs.labelname;
	    	scope.unToday=attrs.untoday;
	    }
	}
});