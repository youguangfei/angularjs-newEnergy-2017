App.controller('potentialRangeController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory', '$filter', 'pagerService', 'echartService', 'notifications', 'ngDialog',
	function(requestService, cacheService, $cookieStore, $scope, $timeout, lgServerDataProviderFactory, $filter, pagerService, echartService, notifications, ngDialog) {
		var url1 = '/product/api/business';
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
		var openConfirmFun=function(json,callType){
		$scope.confirmlist1 = json.type;
		ngDialog.openCustomConfirm({
			plain: false,
		    className: 'ngdialog-theme-default',
		    closeByEscape: true,
		    showClose : true,
		    closeByDocument: true,
		    scope: $scope,
		    width:'4.09rem',
			message:json.message
		}).then(function(){
//			callType(true);
		},function(){
//			callType(false);
			
		})
	}
	
		//	查询按钮
		$scope.potential_search = function() {
			//进行空值判断
			console.log($scope.selectVin_value);
			if(!$scope.selectVin_value) {
				var json={
					type:2,
					message:'请输入要查询的车辆信息'
				}
				openConfirmFun(json)
				return;
			} 
				var name=$scope.selectVin.name;
				var key=$scope.selectVin.key;
				var value=$scope.selectVin_value;
				storageCar(key,value,name);
//				展示列表
				tableinital(key,value,false);
			
		}
//		首次进入页面展示该车的当天的数据
//		初始化，判断是否查询过
		var localStorageCar4 = JSON.parse(localStorage.getItem("local_carPoten"))//读取
		console.log(localStorageCar4)
		if(localStorageCar4!=null&&localStorageCar4!=undefined){
			console.log(localStorageCar4)
			var key = localStorageCar4[0];
			var value = localStorageCar4[1];
			if(value=="" || value==undefined){
				return;
			}
			var name = localStorageCar4[2];
			tableinital(key,value,true);
			//绑定数据
			$scope.selectVin_value=value;
			$scope.selectVin={"selectedType":name,"key":key}
			
		}
		//	  记录查询的车辆信息
		//	  记录查询的车辆信息
		function storageCar(key, value, name) {
			//存储车的信息
			var localStorageCar3 = [key, value, name]
			localStorage.setItem("local_carPoten", JSON.stringify(localStorageCar3)); //存储
		}
	var app1 = echarts.init(document.getElementById('Mainearchs2'));
	var app2 = echarts.init(document.getElementById('Mainearchs3'));	
	//	时间转化
	function changeDay(day,type) {
		day = new Date(day);
		var day1 = $filter("date")(day, 'yyyy-MM-dd');
		var day2=angular.copy(day1);
		
		$scope.startTime1 = day1;
		$scope.endTime1 = day2;
	}
		//		table初始化
		function tableinital(key, value,flag) {
			$scope.startTime1 = $("#startTime").val();
			$scope.endTime1 = $("#endTime").val();
			
			//日期判断
			if(($scope.startTime1 == "" && $scope.endTime1 == "") || flag) {
				changeDay(new Date());
			} else if($scope.endTime1 == '') {
				changeDay($scope.startTime1);
			} else if($scope.startTime1 == '') {
				changeDay($scope.endTime1);
			}
			$("#startTime").val($scope.startTime1);
			$("#endTime").val($scope.endTime1);
			
			// 配置分页基本参数
			$scope.myPagelist = {
				pageNo: 1,
				pageSize: 10000,
			};
			var param = {
				"userId": userId,
				"startTime": $scope.startTime1,
				"endTime": $scope.endTime1
			}
			param[key] =value || "";
			var post_searchData = {
					"pageNo": $scope.myPagelist.pageNo,
					"pageSize": $scope.myPagelist.pageSize,
					"params": param
				};
			var paramdata = {
				"code": 10053,
				"param": JSON.stringify(post_searchData)
			}
			//	请求数据
			requestService.post(url1, paramdata).then(
				function(data) {
					console.log(data);
					app1.hideLoading(); 
					app2.hideLoading(); //隐藏加载动画
					if(data.code == 200) {
						$scope.potentialdata1 = data.data.result;
						console.log($scope.potentialdata1)
						
						var options=potential_option($scope.potentialdata1);
						var option1 = potentialEachartsData(options[0]);
						var option2 = potentialEachartsData(options[1]);
						app1.setOption(option1);
						app2.setOption(option2);
					} else {}
					
				},
				function(error) {
					app1.hideLoading();
					app2.hideLoading();
				})
		}
		//未找到该车数据
		function findNot_carData() {
			var json = {
				type: 2,
				message: '未找到该车的数据'
			}
			openConfirmFun(json);
		}

	
}]);