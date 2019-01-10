App.controller('faultStatisticsAddController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory', '$filter', 'pagerService', 'echartService', 'notifications', 'ngDialog', '$interval',
	function(requestService, cacheService, $cookieStore, $scope, $timeout, lgServerDataProviderFactory, $filter, pagerService, echartService, notifications, ngDialog, $interval) {
		var url = '/product/api/business';
		var orgId = $cookieStore.get("groupId");
		var userId = $cookieStore.get("userId");
		var userName = $cookieStore.get("name");
		
		//故障列表 startTime1,故障占比startTime2，故障频率 startTime3
		$scope.startTime1,$scope.endTime1,$scope.startTime7,$scope.endTime7,$scope.startTime8,$scope.endTime8;
		$scope.rankId,$scope.typeId;
		var initWatch,post_searchData;
		
//		时间初始化
		//初始化，默认查询当天的故障数据
		var today = today2= new Date();
		today2 = $filter('date')(today2, "yyyy-MM-dd");
		$scope.startTime1=today2;
		$scope.endTime1=today2;
		var todayBefore7=new Date(today.setDate(today.getDate()-7));
			todayBefore7=$filter("date")(todayBefore7,"yyyy-MM-dd");
			
		//故障占比，故障频率默认查询最近7天的数据
		function searchBefore7(type){
			if(type==2){
				$scope.startTime7=todayBefore7;
				$scope.endTime7=today2;
				return;
			}
			if(type==3){
				$scope.startTime8=todayBefore7;
				$scope.endTime8=today2;
				return;
			}
			$scope.startTime7=todayBefore7;
			$scope.endTime7=today2;
			$scope.startTime8=todayBefore7;
			$scope.endTime8=today2;
		}
		searchBefore7(0);
		
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

		//	table点击效果
		$scope.activeIndex = -1;
		$scope.changeIndex = function(index) {
			$scope.activeIndex = index;
		}
		//初始化变量名,故障类型，故障等级
		$scope.faultType;
		$scope.faultLevel;
		$scope.selectConfig1;

		//故障等级
		var faultLevel_init;
		$scope.faultLevel_Config1 = {};
		cacheService.getDic(faultLevel, "", "", function(n) {
			console.log(n);
			faultLevel_init = angular.copy(n);
			console.log(faultLevel_init);
			faultLevel_init.unshift({ name: "全部", sequence: 0 });
			$scope.faultLevel_Config1 = {
				focus: true,
				data: faultLevel_init,
				placeholder: "全部"
			}

			$scope.selectLevel = { "selectedType": faultLevel_init[0].name, "sequence": faultLevel_init[0].sequence };
			console.log(faultLevel_init)
		});
		
		//选择故障等级，刷新列表
		$scope.selectChange_level=function(newModel){
			console.log(newModel);
			$scope.selectLevel=newModel;
			$scope.faultStatis_search();
		}

		//故障类型
		var faultType_init;
		$scope.faultType_Config1 = {};
		cacheService.getDic(faultType, "", "", function(n) {
			console.log(n);
			faultType_init = angular.copy(n);
			faultType_init.unshift({ name: "全部", sequence: 0 });
			$scope.faultType_Config1 = {
				focus: true,
				data: faultType_init,
				placeholder: "全部"
			}
			$scope.serviceType = { "selectedType": faultType_init[0].name, "sequence": faultType_init[0].sequence };
			console.log(faultType_init)
		});
		
		//选择故障类型，刷新列表
		$scope.selectChange_type=function(newModel){
			console.log(newModel);
			$scope.serviceType=newModel;
			$scope.faultStatis_search();
		}
			
		//table数据初始化
		var initTableData = function(params,type) {
			console.log(params);
			var reGetProducts = function() {
				var	post_InitT = {
						"pageNo": $scope.myPagelist.pageNo,
						"pageSize": $scope.myPagelist.pageSize,
						"params": params
					}
				var paramdata = {
					"code": 10047,
					"param": JSON.stringify(post_InitT)
				}
				//请求数据
				requestService.post(url, paramdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.faultStatisticsdata1 = data.data.result;
							$scope.myPagelist.totalCount = data.data.totalCount;
							$scope.myPagelist.totalPages = data.data.totalPages;
							if(type==2&&data.data.result.length==0&&($scope.selectVin_value!=undefined)&&($scope.selectVin_value!="")){
								var json={
									type:2,
									message:'未找到该车的数据'
								}
								openConfirmFun(json);
								find_NoData();
							}
						}else{
							 find_NoData();
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
			initWatch = $scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts);
		}
		
		var initTable=function(){
			var params={
					"userId": userId,
					"alarmLevel": 0,
					"alarmType": 0,
					"starTime":today2,
					"endTime":today2,
			};
			
			initTableData(params,1);
		}
		initTable();
		//	查询功能
	
	 	function find_NoData(){
	 		$scope.faultStatisticsdata1 = [];
			$scope.myPagelist.totalCount = 0;
			$scope.myPagelist.totalPages = 0;
	 	}
	
		//查询按钮
	$scope.faultStatis_search = function() {
			$scope.startTime1 = $("#startTime1").val();
			$scope.endTime1 = $("#endTime1").val();
			
			//日期判断
			if($scope.startTime1 == "" && $scope.endTime1 == "") {
				changeDay(new Date());
			} else if($scope.endTime1 == '') {
				changeDay($scope.startTime1);
			} else if($scope.startTime1 == '') {
				changeDay($scope.endTime1);
			}
			$("#startTime1").val($scope.startTime1);
			$("#endTime1").val($scope.endTime1);
			
			
			$scope.rankId = getDefinedId($scope.selectLevel);
			$scope.typeId = getDefinedId($scope.serviceType);
			
			console.log($scope.selectLevel)
			var params = {
					"userId": userId,
					"starTime": $scope.startTime1,
					"endTime": $scope.endTime1,
					"alarmLevel": $scope.rankId,
					"alarmType": $scope.typeId
			}
			
			params[$scope.selectVin.key] = $scope.selectVin_value||"";
			if(initWatch){
				initWatch();
			}
			initTableData(params,2);
	}
	
	function getDefinedId(Textdata) {
		var Textdata = Textdata ? (Textdata.sequence ? Textdata.sequence : 0) : 0;
		return Textdata;
	}
	//	时间转化
	function changeDay(day,type) {
		day = new Date(day);
		var day1 = $filter("date")(day, 'yyyy-MM-dd');
		var day2=angular.copy(day1);
		
		$scope.startTime1 = day1;
		$scope.endTime1 = day2;
	}
	//消息确认框
	function openConfirmFun(json){
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
		//故障频率共用的图表请求
		var echartsdata_frZhe1 = function(data1, data2) {
			//故障频率全局变量
			var Xajax;
			var Yajax;
			var myChart = echarts.init(document.getElementById('powerAnalysisMain1'));
			myChart.showLoading();
			var piechartdata = {
				"status": 2,
				"userId": userId,
				"starTime": data1,
				"endTime": data2
			}
			var piechartdata1 = {
				"code": 10048,
				"param": JSON.stringify(piechartdata)
			}
			requestService.post(url, piechartdata1).then(
				function(data) {
					console.log(data);
					console.log(data.data)
					if(data.code == 200) {
						$scope.piechartdata2 = data.data;
						Xajax = $scope.piechartdata2.dateX;
						Yajax = $scope.piechartdata2.numberY;
						myChart.hideLoading(); //隐藏加载动画
						var optionObj2 = { xdata: Xajax, ydata: Yajax ,text1:"频率",bottom:"5px",Company:""};
						var option = powerEachartsdata(optionObj2);
						$timeout(function(){
							myChart.setOption(option);
						},200)

					} else {
						//返回的数据为空时显示提示信息
						alert("图表请求数据为空，可能服务器暂未录入近五天的观测数据，您可以稍后再试！");
						myChart.hideLoading();
					}
				},
				function(error) {
					//请求失败时执行该函数
					alert("图表请求数据失败，可能是服务器开小差了");
					myChart.hideLoading();
				})
		}
		//故障占比,默认显示最近七天的占比情况
		var echarts_pie1 = function(startTime, endTime) {
			//故障占比全局变量
			var myChart = echarts.init(document.getElementById('powerAnalysisMain2'));
			$scope.PowerTitle1 = '故障占比'
			myChart.showLoading(); //数据加载完之前先显示一段简单的loading动画
			
			var pieJson = {
				"status": 1,
				"userId": userId,
				"starTime":startTime,
				"endTime": endTime
			}
			pieJson = {
				"code": 10048,
				"app": 'web',
				"param": JSON.stringify(pieJson)
			}
			requestService.post(url, pieJson).then(
				function(data) {
					console.log(data);
					if(data.code == 200) {
						$scope.piedata3 = data.data;
						myChart.hideLoading(); //隐藏加载动画
						var option1 = pieOption($scope.piedata3);
						console.log(option1);
						myChart.setOption(option1);
					} else {
						//返回的数据为空时显示提示信息
						alert("图表请求数据为空，可能服务器暂未录入近五天的观测数据，您可以稍后再试！");
						myChart.hideLoading();
					}
				},
				function(error) {
					//请求失败时执行该函数
					alert("图表请求数据失败，可能是服务器开小差了");
					myChart.hideLoading();
				})
		}


		//故障占比按钮，默认显示最近7天，所有类型的故障
		$scope.faultStatistBtn_btn1 = function() {
			$scope.faultStatist = 1;
			ngDialog.open({
				template: 'html/dataStatistics/faultStatisticsAdd_Box.html',
				plain: false,
				className: 'ngdialog-theme-default faultStatic_dialog',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '9.3rem',
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						echarts_pie1($scope.startTime7, $scope.endTime7)
					}, 500)

				}]

			});

		}
		
		//故障频率按钮2
		$scope.faultStatistBtn_btn2 = function() {
			$scope.faultStatist = 2;

			ngDialog.open({
				template: 'html/dataStatistics/faultStatisticsAdd_Box.html',
				plain: false,
				className: 'ngdialog-theme-default faultStatic_dialog',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '9.3rem',
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						$scope.PowerTitle = '故障频率'
						echartsdata_frZhe1($scope.startTime8, $scope.endTime8)
					}, 1000);
				}]
			});

		}
		
		function changeTime(type,Tback){
			var startT = $("#startTime"+type).val();
			var endT = $("#endTime"+type).val();
			//只输入一个，为该时期到当前的数据
			if(startT=="" && endT==""){
				startT = todayBefore7;
				endT = today2;
			}else if(endT == '') {
				endT = today2;
			} else if(startT == '') {
				startT = angular.copy(endT);
				endT = today2;
			}else{}
			$scope["startTime"+type]=startT,$scope["endTime8"+type]=endT;
			console.log($scope.startTime7+"--"+$scope.endTime7);
			$("#startTime"+type).val(startT);
			$("#endTime"+type).val(endT);
			Tback(startT,endT);
		}
		//	故障占比，弹窗内查询
		$scope.Fault_btn1 = function() {
			changeTime(7,function(startT,endT){
				echarts_pie1(startT,endT)
			})
		}
		//	故障频率，弹窗查询
		$scope.Fault_btn2 = function() {
			changeTime(8,function(startT,endT){
				echartsdata_frZhe1(startT, endT)
			})
		}
		
		//		确认关闭弹窗按钮
		$scope.confirm = function() {
			//			alert(11)
			ngDialog.close()
		}
	}
]);