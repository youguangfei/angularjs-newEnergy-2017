App.controller('batteryDataController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory', '$filter', 'pagerService', 'echartService', 'notifications', 'ngDialog',
	function(requestService, cacheService, $cookieStore, $scope, $timeout, lgServerDataProviderFactory, $filter, pagerService, echartService, notifications, ngDialog) {
		//		接口地址
		var url = '/product/api/business';
		var orgId = $cookieStore.get("groupId");
		var userId = $cookieStore.get("userId");
		//车牌号licenseNumber,sim卡，vin
		var vin_config = [{
				"value": 0,
				"name": "车牌号",
				"key": "licenseNumber"
			},
			{
				"value": 1,
				"name": "VIN",
				"key": "vin"
			},
			{
				"value": 2,
				"name": "SIM卡ICCID号",
				"key": "iccid"
			},
		];
		$scope.vin_Config = {
			focus: true,
			data: vin_config
		}
		
		//初始化，判断是否查询过
	var local_charge=localStorage.getItem("local_batteryData");
	console.log(local_charge);
	if(local_charge!=null&&local_charge!=undefined){
		
		var local_charge1=JSON.parse(local_charge);
		var key=local_charge1[0];
		var value=local_charge1[1];	
		var name=local_charge1[2];	
		if(value==""||value==undefined){
			return;
		}
		//绑定数据
		$scope.selectVin_value=value;
		$scope.selectVin={"selectedType":name,"key":key};
			tableinital(true);
	}
		
		//	查询
		$scope.batteryData_search = function() {
			//进行空值判断
			if(angular.isUndefined($scope.selectVin_value) || $scope.selectVin_value == '') {
				openConfirmFun(2, '请输入要查询的车辆信息')
			} else {
				//存储该车信息
				var name=$scope.selectVin.name;
				var key=$scope.selectVin.key;
				var value=$scope.selectVin_value;
				//存储车的信息
				var localStorageCar = [key,value,name];
				localStorage.setItem("local_batteryData", JSON.stringify(localStorageCar)); 
				tableinital(false);
			}
		}
		
		//	table初始化
	 function tableinital(flag) {
		$scope.startTime1 = $("#startTime").val();
		$scope.endTime1 = $("#endTime").val();
		
		var isToday=isTodayFlag($scope.startTime1||$scope.endTime1);
		//日期判断
		if(($scope.startTime1 == "" && $scope.endTime1 == "") || flag) {
			changeDay(new Date(),true);
		} else if($scope.endTime1 == '') {
			changeDay($scope.startTime1,isToday);
		} else if($scope.startTime1 == '') {
			changeDay($scope.endTime1,isToday);
		}
		$("#startTime").val($scope.startTime1);
		$("#endTime").val($scope.endTime1);
		
			var reGetProducts2 = function() {
				var param = {
					"userId": userId,
					"startTime": $scope.startTime1,
					"endTime": $scope.endTime1
				}
				param[$scope.selectVin.key] = $scope.selectVin_value;
				console.log($scope.selectVin)
				var post_searchData = {
					"pageNo": $scope.myPagelist.pageNo,
					"pageSize": $scope.myPagelist.pageSize,
					"params": param
				};
				var paramsdata = {
					"code": 10054,
					"param": JSON.stringify(post_searchData)
				}
				//	请求数据
				requestService.post(url, paramsdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.batteryData2 = data.data.result;
							$scope.myPagelist.totalCount = data.data.totalCount;
							$scope.myPagelist.totalPages = data.data.totalPages;
						}else{
							$scope.batteryData2 = [];
							$scope.myPagelist.totalCount = 0;
							$scope.myPagelist.totalPages = 0;
						}
					},
					function(error) {

					})
			}
			// 配置分页基本参数
			$scope.myPagelist = {
				pageNo: 1,
				pageSize: 10,
			};
			// 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
			$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts2);
		}
	 
	 //判断是否是今天
	function isTodayFlag(Time){
		var today = new Date();
		today=$filter("date")(today,'yyyy-MM-dd');
		var startDay=$filter("date")(new Date(Time),'yyyy-MM-dd');
		var flag=startDay==today?true:false;
		return flag;
	}
	
	//时间转化
	function changeDay(day,type) {
		var day1,day2;
		if(type){
			day = new Date(new Date());
			day1 = $filter("date")(day, 'yyyy-MM-dd 00:00');
			day2 = $filter("date")(day, 'yyyy-MM-dd HH:mm');
		}else{
			day = new Date(day);
			day1 = $filter("date")(day, 'yyyy-MM-dd 00:00');
			day2=$filter("date")(day, 'yyyy-MM-dd 23:59');
		}
		$scope.startTime1 = day1;
		$scope.endTime1 = day2;
	}
	 
	 function openConfirmFun(json, messages, callType) {
			$scope.confirmlist1 = json;
			ngDialog.openCustomConfirm({
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '4.09rem',
				message: messages
			}).then(function() {
				//			callType(true);
			}, function() {
				//			callType(false);
			})
		}
	 
	 
	 
	 
	 
	 
	 
	 
	 

	}
]);