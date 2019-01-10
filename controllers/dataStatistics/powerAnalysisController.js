App.controller('powerAnalysisController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory', '$filter', 'pagerService', 'echartService', 'notifications', 'ngDialog', '$interval',
	function(requestService, cacheService, $cookieStore, $scope, $timeout, lgServerDataProviderFactory, $filter, pagerService, echartService, notifications, ngDialog, $interval) {
		//接口地址
		var url1 = '/product/api/business';
		var orgId = $cookieStore.get("groupId");
		var userId = $cookieStore.get("userId");

		//table点击效果
		$scope.activeIndex = -1;
		$scope.changeIndex = function(index) {
			$scope.activeIndex = index;
		}
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
		var openConfirmFun = function(json, callType) {
			$scope.confirmlist1 = json.type;
			ngDialog.openCustomConfirm({
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '4.09rem',
				message: json.message
			}).then(function() {
//				callType(true);
			}, function() {
//				callType(false);
			})
		}
		var localStorageCar2;
		//	查询
		$scope.powerAnalydata = function() {
			//进行空值判断
			console.log($scope.selectVin_value);	
			if(angular.isUndefined($scope.selectVin_value)||$scope.selectVin_value=="") {
				var json = {
					type: 2,
					message: '请输入要查询的车辆信息'
				}
				openConfirmFun(json);
			} else {
				//存储该车信息
				var name = $scope.selectVin.name;
				var key = $scope.selectVin.key;
				var value = $scope.selectVin_value;
				var localStorageCar2 = [key, value, name]
				localStorage.setItem("localSTCar_powerCar", JSON.stringify(localStorageCar2)); //存储
				//展示列表
				tableinital(false);
			}
		}

		//首次进入页面展示该车的当天的数据
		//初始化，判断是否查询过
		var localStorageCar3 = localStorage.getItem("localSTCar_powerCar") //读取
		console.log(localStorageCar3);
		if(localStorageCar3 != null && localStorageCar3 != undefined) {
			var local_charge4 = JSON.parse(localStorageCar3);
		
			//绑定数据
			var key = local_charge4[0];
			var value = local_charge4[1];
			var name = local_charge4[2];
			$scope.selectVin_value=value;
			$scope.selectVin={"selectedType":name,"key":key}
			tableinital(true);
			
		}

		//全局变量
		var arraydata = [];
		var arraydata1 = [];

		//table列表初始化
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
					"endTime": $scope.endTime1,
					'type': 1
				}
				
				param[$scope.selectVin.key]=$scope.selectVin_value;
				
				var post_searchData = {
					"pageNo": $scope.myPagelist.pageNo,
					"pageSize": $scope.myPagelist.pageSize,
					"params": param
				};
				var paramdata = {
					"code": 10052,
					"param": JSON.stringify(post_searchData)
				}
				//	请求数据
				requestService.post(url1, paramdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.powerAnalysis = data.data.result;
							console.log($scope.powerAnalysis)
							$scope.myPagelist.totalCount = data.data.totalCount;
							$scope.myPagelist.totalPages = data.data.totalPages;
						} else {
//							findNot_carData()
						}

					},
					function(error) {
//						findNot_carData()
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

		//未找到该车数据
		function findNot_carData() {
			var json = {
				type: 2,
				message: '暂无数据，请修改查询条件'
			}
			openConfirmFun(json);
		}
		
	function isTodayFlag(Time){
		var today = new Date();
		today=$filter("date")(today,'yyyy-MM-dd');
		var startDay=$filter("date")(new Date(Time),'yyyy-MM-dd');
		var flag=startDay==today?true:false;
		return flag;
	}
	
	//	时间转化
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
		
		var lng;
		var lat;
		var Npoint;
		//	打开查看地图
		$scope.powerAnalymap = function(locationJson) {
			//alert(11);
			ngDialog.open({
				template: 'html/dataStatistics/powerAnalysis_map.html',
				plain: false,
				className: 'ngdialog-theme-default ngdialog_setLocation ngdialog_locatClose1',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '10rem',
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						var map = new BMap.Map('getLocation_mapBox', { enableMapClick: false });
						console.log(locationJson)
						angular.forEach(locationJson, function(data) {
							lng = parseFloat(data.lng)
							lat = parseFloat(data.lat)
						});
						console.log(typeof lng)
						var point = new BMap.Point(lng, lat);
						console.log(point)
						map.centerAndZoom(point, 15);
						
						map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
						map.setMapStyle(cacheService.getMapStyle()); // 设置地图主题样式
						var mapControl = new MapControl({
							map: map,
						})
						var marker = new BMap.Marker(point);
						map.addOverlay(marker);
						mapControl.initLocation(); //浏览器定位
						mapControl.addZoomControl(); //添加缩放组件	
					}, 500);
				}]
			});
		}
		//查看地图
		$scope.LookpowerAnalymap = function(i) {
			console.log(i)
			var json1 = i;
			$scope.powerAnalymap(json1)
		}
		//电耗分析走势图按钮接口请求
		function powerData(Tback) {
			//电耗分析全局变量
			var Xdata;
			var Ydata;
			$scope.startTime1 = $("#startTime").val();
			$scope.endTime1 = $("#endTime").val();		
			// 配置分页基本参数
			$scope.myPagelist = {
				pageNo: 1,
				pageSize: 10,
			};
			var param = {
				"userId": userId,
				"startTime": $scope.startTime1,
				"endTime": $scope.endTime1,
				'type': 2
			}
			param[$scope.selectVin.key] = $scope.selectVin_value || "";
			var post_searchData = {
					"pageNo": $scope.myPagelist.pageNo,
					"pageSize": $scope.myPagelist.pageSize,
					"params": param
				};
			var paramdata1 = {
				"code": 10052,
				"param": JSON.stringify(post_searchData)
			}
			//请求数据
			requestService.post(url1, paramdata1).then(
				function(data) {
					console.log(data);
					if(data.code == 200) {
						var result=data.data.result;
						if(result.length==0){
							//返回的数据为空时显示提示信息
							$scope.powerData1 = [];
							chart_noData();
						}else{
							Tback(data);
						}
					} 
				},
				function(error) {
					//返回的数据为空时显示提示信息
					$scope.powerData1 = [];
					chart_noData();
				})
		}
		
		function chart_noData(){
			var json = {
				type: 2,
				message: '暂无数据，请修改查询条件'
			}
			openConfirmFun(json);
		}
		
		//	电耗分析走势图按钮
		$scope.powerAnalysisBtn = function() {
			powerData(function(data){
				$scope.powerData1 = data.data.result;
				console.log($scope.powerData1)
				var Xdata = $scope.powerData1[0].times;
				var Ydata = $scope.powerData1[0].consumptions;
				ngDialog.open({
					template: 'html/dataStatistics/powerAnalysis_box.html',
					plain: false,
					className: 'ngdialog-theme-default ngdialogbtn1',
					closeByEscape: true,
					showClose: true,
					closeByDocument: true,
					scope: $scope,
					width: '9.3rem',
					controller: ['$scope', function($scope) {
						setTimeout(function() {
							$scope.tilte1 = $scope.selectVin_value;
				var myChart = echarts.init(document.getElementById('powerAnalysisMain'));
							var optionObj1 = { xdata: Xdata, ydata: Ydata,text1:"电耗量:",bottom:"-40px",Company:"w"};
							var option = powerEachartsdata(optionObj1);
							myChart.setOption(option);
						}, 1000);
	
					}]
				});	
			})
		}
}]);