App.controller('carDetailsController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', '$filter', 'ngDialog', 'notifications', "$state", "$stateParams", '$rootScope', 'cacheService','$q',
	function(requestService, cacheService, $cookieStore, $scope, $timeout, $filter, ngDialog, notifications, $state, $stateParams, $rootScope, cacheService,$q) {
		var groupid = $cookieStore.get("groupId"),
			userId = $cookieStore.get("userId"),
			userName = $cookieStore.get("name"),
			longitude, latitude,chargingMap,localtion_map;
		//全局时间
		$scope.startTime1, $scope.endTime1, $scope.startTime2, $scope.endTime2, $scope.startTime3, $scope.endTime3, $scope.startTime4, $scope.endTime4, $scope.startTime5, $scope.endTime5, $scope.startTime6, $scope.endTime6, $scope.startTime7, $scope.endTime7, $scope.startTime8, $scope.endTime8;
		//请求地址
		var url = '/product/api/business';
		var req_url = "http://192.168.231.166:8080/product/api/business";
		document.title = "桑德新能源云平台车辆详情";
		//	请求车辆详情数据
		$scope.key = $stateParams.key;
		$scope.value = $stateParams.value;
		$scope.value=window.pwdString.decrypt($scope.value);
		if($scope.key == "carId") {
			$scope.value = Number($scope.value);
		}
		
//		获取车辆基本信息请求
		var thisPageInit=function(){
			var defer=$q.defer();
			var params = {
				"userId": userId,
			}
			params[$scope.key] = $scope.value;
			var post_data = {
				"code": 10039,
				"param": JSON.stringify(params)
			}
			console.log(post_data);
			requestService.post(url, post_data).then(
				function(data) {
					console.log(data);
					if(data.code == 200) {
						defer.resolve(data);
					}
				},
				function(error) {
				})
			 return  defer.promise;
		}
		
//		获取车辆基本信息后，加载车辆数据
		$scope.firstInit=function(){
			$q.when(thisPageInit()).then(function(data){
				addPage_carData(data);
			},function(){},function(){})
		}
		$scope.firstInit();
		
		//加载该车基本信息数据
		function addPage_carData(data){
				//1.全部数据
				$scope.Careverydata = data.data;
				//2.整车数据
				$scope.vehicle = $scope.Careverydata.vehicle;
				//3.车辆位置
				if($scope.Careverydata.position){
					$scope.position1 = $scope.Careverydata.position;
					longitude = $scope.Careverydata.position.longitude;
					latitude = $scope.Careverydata.position.latitude;
				}
				//关注在页面进行逻辑处理
				//4.驱动电机数据
				$scope.driveMotor = $scope.Careverydata.driveMotor;
				if($scope.driveMotor) {
					$scope.driveMotorList = $scope.Careverydata.driveMotor.driveMotorList;
				}
				//5.燃料电池数据
				$scope.fuelCell = $scope.Careverydata.fuelCell;
				//6.发动机数据
				$scope.motor = $scope.Careverydata.motor;
				//7.极值数据
				$scope.extremum = $scope.Careverydata.extremum;
		}
		
		//车辆关注与取消关注
		$scope.mCar_care2 = function(Careverydata) {
			console.log(Careverydata);
			$scope.Careverydata = Careverydata;
			$scope.confirmlist1 = 2;
			cacheService.mCar_care(Careverydata, userId, function(flag) {
				if(flag) {
					var json = { title: "", message: "您已关注成功" };
					openConfirmFun(json, function() {})
				} else {
					var json = { title: "", message: "您已取消关注" };
					openConfirmFun(json, function() {})
				}
			});

		}
		//确认框调用
		function openConfirmFun(json, callType) {
			ngDialog.openCustomConfirm({
				title: json.title,
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '4.09rem',
				message: json.message
			}).then(function() {
				callType(true);

			}, function() {
				callType(false);

			})
		}
		//关闭按钮当前页面
		$scope.closeBlank = function() {
			window.close()
		}
		
		//初始化充电统计 地图
		var chargingMap_init=function(){
			chargingMap = new BMap.Map("ChargingMap1", { enableMapClick: false });
			chargingMap.centerAndZoom(new BMap.Point(116.404, 39.915), 10); 
			chargingMap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
			chargingMap.setMapStyle(cacheService.getMapStyle()); // 设置地图主题样式
			var mapControl = new MapControl({
				map: chargingMap,
			})
			mapControl.initLocation(); //浏览器定位
			mapControl.addZoomControl(); //添加缩放组件	
		}
		
		//初始化充电统计时间,dateType==true,到日,否则到分钟
		var init_changeDay = function(day1,day2,codeNum,dateType) {
			//充电统计，默认查询当天数据
			change_chargingDay(day1,day2,dateType,function(startT,endT){
				$scope["startTime"+codeNum] = startT;
				$scope["endTime"+codeNum] = endT;
			});
		}
		//当充电统计地图，时间初始化后，加载充电统计数据
		chargingMap_init();
		init_changeDay("","",1,false);
		inint_chargingData();
		
		//充电统计页面的数据,页面初始化
		function inint_chargingData() {
			chargingMap.clearOverlays();
			var param = {
				"userId": userId,
				"startTime": $scope.startTime1,
				"endTime": $scope.endTime1
			}
			param[$scope.key] = $scope.value;
			console.log(param);
			// 配置分页基本参数
			var post_searchData = {
				"pageNo": 1,
				"pageSize": 10000,
				"params": param
			};
			var paramsdata = {
				"code": 10051,
				"param": JSON.stringify(post_searchData)
			}
			$scope.charginglist = [];
			requestService.post(url, paramsdata).then(
				function(data) {
					console.log(data);
					if(data.code == 200) {
						$scope.charginglist = data.data.result;
						//地图上标点
						addMarker(chargingMap,$scope.charginglist);
					}
				},
				function(error) {
				})
		}
		
		
		//车辆位置及周边服务网点弹窗
		function init_locationMap(localtion_mapId,location_lng, location_lat) {
			localtion_map = new BMap.Map(localtion_mapId, { enableMapClick: false });
			
			var point = new BMap.Point(location_lng, location_lat);
			localtion_map.centerAndZoom(point, 15);
			localtion_map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
			localtion_map.setMapStyle(cacheService.getMapStyle()); // 设置地图主题样式
			var mapControl1 = new MapControl({
				map: localtion_map,
			})
			//添加当前车辆位置Marker
			var marker = new BMap.Marker(point); // 创建标注
			localtion_map.addOverlay(marker);
			//添加周边服务网点
			addNearServiceReq(localtion_map,location_lng,location_lat);
		}
		
//		地图上添加marker点
		function addMarker(map,data) {
			for(var i = 0; i < data.length; i++) {
				var every = data[i];
				var longitude = every.lng;
				var latitude = every.lat;
				var point = new BMap.Point(longitude, latitude);
				var marker = new BMap.Marker(point);
				var label = new BMap.Label('<div style="color:white;">' + (i + 1) + '</div>', { offset: new BMap.Size(-1, -1) });
				label.setStyle(cacheService.getMaplabel_sty());
				marker.setLabel(label);
				map.addOverlay(marker);
			}
		}
		
		//添加周边100公里范围内的服务网点
		function addNearServiceReq(localtion_map,location_lng,location_lat){
			var nearJson={
				"userId":userId,
				"longitude":location_lng,
				"latitude":location_lat,
				"distance":100
			};
			var postJson={
				code:10058,
				param:JSON.stringify(nearJson)
			}
			requestService.post(url,postJson).then(
				function(data) {
					console.log(data);
					if(data.code==200){
						addNearService(data.data);
					}
				},
				function(error) {})
		}
		
//		显示车辆周边服务网点
		function addNearService(data){
			infoBox_init(localtion_map);
			angular.forEach(data,function(every,index,Arr){
				//站点
					var marker= new BMap.Marker(new BMap.Point(every.lng,every.lat));
					marker.siteType=every.type;
					marker.setIcon(map_siteIcons(every.type));
					
					marker.setZIndex(10000);//设置层的Z轴值
					marker.obj=every;
					var labelName=FontCount(every.name,8);
					console.log(labelName);
				  	var  label = new BMap.Label('<div>'+labelName+'</div>', {offset: new BMap.Size(-1, -1)});  
				  	var lableStyle=cacheService.getMaplabel_sty();
				  	console.log(lableStyle);
					label.setStyle(lableStyle);
					label.obj=every;
					marker.setLabel(label);
					marker.addEventListener("click",siteClick);
					label.addEventListener("click",siteClick);
					localtion_map.addOverlay(marker);
			})
		}
		
//		地图站点弹窗
		function siteClick(e){
			console.log("site click");
			if(infoBox){
				infoBox.close();
			}
			var siteUser=e.target;
			var panPosition=e.target.getPosition();
			infoBox.open(panPosition);
		    
			var objDetail=siteUser.obj;
			console.log(objDetail);
			var html=getService_IfboxHtml(objDetail);
		    	
			infoBox.setContent(html);
			$('.mapInfoBox2').prev('img').css("margin","0.3rem 0.2rem 0 0");
		   localtion_map.panTo(panPosition);
		}
		
		var day1, day2;
		//时间处理
		//	时间转化，参数依次为，（时间，是否是今天，开始时间，结束时间，初始化标志）
		function change_chargingDay(startTime,endTime,dateType,Tback) {
			var isToday = isTodayFlag(startTime || endTime);
			var isAll=startTime&&endTime;
			var isNone=startTime||endTime;
			var fmt1;
			if(dateType){
				fmt1="yyyy-MM-dd";
			}
//			是今天,或者 都没值
			if(isToday || !isNone) {
				var day = new Date();
				day1 = $filter("date")(day, fmt1||'yyyy-MM-dd 00:00');
				day2 = $filter("date")(day, fmt1||'yyyy-MM-dd HH:mm');
				return  Tback(day1,day2);
			}
			//都有值，或者只有一个有值
			if(!startTime||!endTime){
				startTime=endTime=startTime||endTime;
			}
			day1 = $filter("date")(new Date(startTime), fmt1||'yyyy-MM-dd 00:00');
			day2 = $filter("date")(new Date(endTime), fmt1||'yyyy-MM-dd 23:59');
		
			return Tback(day1,day2);
		}
//		是否是今天判断
		function isTodayFlag(Time) {
			var today = new Date();
			today = $filter("date")(today, 'yyyy-MM-dd');
			var startDay = $filter("date")(new Date(Time), 'yyyy-MM-dd');
			var flag = startDay == today ? true : false;
			return flag;
		}
		
		
		function searchTime(codeNum,dateType){
			$scope["startTime"+codeNum] = $("#startTime"+codeNum).val();
			$scope["endTime"+codeNum] = $("#endTime"+codeNum).val();
			//日期判断
			init_changeDay($scope["startTime"+codeNum],$scope["endTime"+codeNum],codeNum,dateType);
			console.log($scope["startTime"+codeNum]);
			
			$("#startTime"+codeNum).val($scope["startTime"+codeNum]);
			$("#endTime"+codeNum).val($scope["endTime"+codeNum]);
		}
		//	查询功能
		$scope.carDt_chargingSrbtn = function() {
			searchTime(1,false);
			inint_chargingData();
		}
		
		//	点击定位图标
		$scope.carDetail_position = function() {
			var option = {
				url: 'html/serviceNetwork/serviceNetwork_setLocation.html',
				className: 'ngdialog-theme-default ngdialog_setLocation1 ServiceMap1',
				width: '16rem'
			}
			$scope.titleMapposition = "车辆位置";
			ngDialog.open({
				template: option.url,
				plain: false,
				className: option.className,
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: option.width,
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						console.log(latitude)
						init_locationMap("getLocation_map", longitude, latitude);
					}, 300);
				}]
			});
		}
		
//		右侧车辆信息列表,展开收缩
		$scope.collpArr=['collp1','collp2','collp3','collp4','collp5','collp6','collp7'];
		// 点击取反
		$scope.collpArrInit=function(str){
			angular.forEach($scope.collpArr,function(item,index,arr){
				if(item!=str){
					$scope[item]=false;
				}else{
					$scope[item]=!$scope[item];
				}
			})
		}
		$scope.collpArrInit();
		
		
		//获取电耗分析请求参数
		$scope.getPowerParam=function(type){
				// 配置分页基本参数
				var param = {
					"userId": userId,
					"startTime": $scope.startTime2,
					"endTime": $scope.endTime2,
					'type': type
				}
				param[$scope.key] = $scope.value;
				var post_searchData = {
					"pageNo": $scope.myPagelist2.pageNo,
					"pageSize": $scope.myPagelist2.pageSize,
					"params": param
				};
				var paramdata = {
					"code": 10052,
					"param": JSON.stringify(post_searchData)
				}
				return paramdata;
		}
		
//		电耗分析请求数据
		function powerAnalyisdata() {
			var reGetProducts2 = function() {
				var paramdata=$scope.getPowerParam(1);
				//	请求数据
				requestService.post(url, paramdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.powerAnalysis = data.data.result;
							console.log($scope.powerAnalysis)
							$scope.myPagelist2.totalCount = data.data.totalCount;
							$scope.myPagelist2.totalPages = data.data.totalPages;
						}
					},
					function(error) {
					})
			}
			$scope.myPagelist2 = {
					pageNo: 1,
					pageSize: 10,
			};
			// 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
			$scope.$watch('myPagelist2.pageNo + myPagelist2.pageSize', reGetProducts2);

		}
		
		//	电耗分析点击查询按钮
		$scope.carDetails_searchbtn2 = function() {
			searchTime(2,false);
			powerAnalyisdata();
		}

		//	电耗分析中的电耗走势图弹框请求数据
		function powerData(Tback) {
			var paramdata1=$scope.getPowerParam(2);
			//请求数据
			requestService.post(url, paramdata1).then(
				function(data) {
					Tback(data);
				},
				function(error) {
					//返回的数据为空时显示提示信息
					$scope.powerData1 = [];
			})
		}
		
		$scope.powerAnalysisBtn = function() {
			powerData(function(data) {
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
							var optionObj1 = { xdata: Xdata, ydata: Ydata, text1: "电耗量:", Company: "w" };
							var option = powerEachartsdata(optionObj1);
							myChart.setOption(option);
						}, 1000);

					}]
				});
			})
		}
		
		//三,电池极差分析页面数据请求
		var app1 = echarts.init(document.getElementById('Mainearchs'));
		var app2 = echarts.init(document.getElementById('Mainearchs1'));
		function potentialRangedata1() {
			// 配置分页基本参数
			$scope.myPagelist = {
				pageNo: 1,
				pageSize: 10000,
			};
			var param = {
				"userId": userId,
				"startTime": $scope.startTime3,
				"endTime": $scope.endTime3
			}
			param[$scope.key] = $scope.value;
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
			requestService.post(url, paramdata).then(
				function(data) {
					console.log(data);
					app1.hideLoading();
					app2.hideLoading(); //隐藏加载动画
					if(data.code == 200) {
						$scope.potentialdata1 = data.data.result;
						var options=potential_option($scope.potentialdata1);
						var option1 = potentialEachartsData(options[0]);
						var option2 = potentialEachartsData(options[1]);
						app1.setOption(option1);
						app2.setOption(option2);
					} 

				},
				function(error) {
					app1.hideLoading();
					app2.hideLoading();
				})
		}
		
		//电池极差分析查询按钮
		$scope.carDetails_searchbtn3 = function() {
			searchTime(3,true);
			potentialRangedata1();
		}

		//四,电池数据统计
		function batteryDatainit() {
			var reGetProducts2 = function() {
				var param = {
					"userId": userId,
					"startTime": $scope.startTime4,
					"endTime": $scope.endTime4
				}
				param[$scope.key] = $scope.value;
				console.log($scope.selectVin)
				var post_searchData = {
					"pageNo": $scope.myPagelist4.pageNo,
					"pageSize": $scope.myPagelist4.pageSize,
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
							$scope.myPagelist4.totalCount = data.data.totalCount;
							$scope.myPagelist4.totalPages = data.data.totalPages;
						} else {
							$scope.batteryData2 = [];
							$scope.myPagelist4.totalCount = 0;
							$scope.myPagelist4.totalPages = 0;
						}
					},
					function(error) {

					})
			}
			// 配置分页基本参数
			$scope.myPagelist4 = {
				pageNo: 1,
				pageSize: 10,
			};
			// 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
			$scope.$watch('myPagelist4.pageNo + myPagelist4.pageSize', reGetProducts2);
		}
		
//		电池数据统计
		$scope.carDetails_searchbtn4 = function() {
			searchTime(4,false);
			batteryDatainit();
		}

		//五，电机初始化
		function motorDatainit() {
			var reGetProducts2 = function() {
				var param = {
					"userId": userId,
					"startTime": $scope.startTime5,
					"endTime": $scope.endTime5
				}
				param[$scope.key] = $scope.value;
				var post_searchData = {
					"pageNo": $scope.myPagelist5.pageNo,
					"pageSize": $scope.myPagelist5.pageSize,
					"params": param
				};
				var paramsdata = {
					"code": 10055,
					"param": JSON.stringify(post_searchData)
				}

				//	请求数据
				requestService.post(url, paramsdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.motorData1 = data.data.result;
							$scope.myPagelist5.totalCount = data.data.totalCount;
							$scope.myPagelist5.totalPages = data.data.totalPages;
						} else {
							$scope.motorData1 = [];
							$scope.myPagelist5.totalCount = 0;
							$scope.myPagelist5.totalPages = 0;
						}
					},
					function(error) {

					})
			}
			// 配置分页基本参数
			$scope.myPagelist5 = {
				pageNo: 1,
				pageSize: 10,
			};
			// 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
			$scope.$watch('myPagelist5.pageNo + myPagelist5.pageSize', reGetProducts2);
		}
		
//		电机数据统计
		$scope.carDetails_searchbtn5 = function() {
			searchTime(5,false);
			motorDatainit();
		}
		
//		六,故障统计
		$scope.faultType,$scope.faultLevel;
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
		//选择故障等级，刷新列表
		$scope.selectChange_level = function(newModel) {
			$scope.selectLevel = newModel;
		}
		//选择故障类型，刷新列表
		$scope.selectChange_type = function(newModel) {
			$scope.serviceType = newModel;
		}
		//故障统计页面
		//数据统计初始化页面显示前一个月的数据,故障占比，故障频率默认查询最近7天的数据
		var today2,todayBefore7,MounthBefore1;
		function init_FaultTime(){
			today2 = $filter('date')(new Date(), "yyyy-MM-dd");
			todayBefore7 = new Date(new Date().setDate(new Date().getDate()-7));
			todayBefore7 = $filter("date")(todayBefore7, "yyyy-MM-dd");
			console.log(todayBefore7);
			
			MounthBefore1 = new Date(new Date().setMonth(new Date().getMonth()-1));
			MounthBefore1 = $filter("date")(MounthBefore1, "yyyy-MM-dd");
			console.log(MounthBefore1);
			
			init_faultTime6();
			init_faultTime7();
			init_faultTime8();
		}
		
		function init_faultTime6() {
			$scope.startTime6=MounthBefore1;
			$scope.endTime6=today2;
		}
		
		function init_faultTime7() {
			$scope.startTime7 = todayBefore7;
			$scope.endTime7 = today2;
		}

		function init_faultTime8() {
			$scope.startTime8 = todayBefore7;
			$scope.endTime8 = today2;
		}
		
		//table初始化
		function faultStaticdatainit(params) {
			var reGetProducts = function() {
				var post_InitT = {
					"pageNo": $scope.myPagelist6.pageNo,
					"pageSize": $scope.myPagelist6.pageSize,
					"params": params
				}
				console.log(params);
				var paramdata = {
					"code": 10047,
					"param": JSON.stringify(post_InitT)
				}
				console.log(paramdata);
				//请求数据
				requestService.post(url, paramdata).then(
					function(data) {
						console.log(data);
						if(data.code == 200) {
							$scope.faultStatisticsdata1 = data.data.result;
							$scope.myPagelist6.totalCount = data.data.totalCount;
							$scope.myPagelist6.totalPages = data.data.totalPages;

						} 

					},
					function(error) {})
			}
			// 配置分页基本参数
			$scope.myPagelist6 = {
				pageNo: 1,
				pageSize: 10,
			};
			// 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
			var init_faultWatch = $scope.$watch('myPagelist6.pageNo + myPagelist6.pageSize', reGetProducts);
		}
		
		function search_faultTable(){
			$scope.rankId = getDefinedId($scope.selectLevel);
			$scope.typeId = getDefinedId($scope.serviceType);
			var params = {
				"userId": userId,
				"alarmLevel": $scope.rankId,
				"alarmType": $scope.typeId,
				"starTime": $scope.startTime6,
				"endTime": $scope.endTime6,
			};
			console.log(params);
			params[$scope.key] = $scope.value;
			faultStaticdatainit(params);
		}
		
//		故障统计查询功能
		function getDefinedId(Textdata) {
			var Textdata = Textdata ? (Textdata.sequence ? Textdata.sequence : 0) : 0;
			return Textdata;
		}
		//故障统计查询功能
		$scope.carDetails_searchbtn6 = function() {
			searchTime(6,true);
			search_faultTable();
		}

		//故障占比请求数据
		var echarts_pie1 = function() {
			//故障占比全局变量
			var myChart = echarts.init(document.getElementById('powerAnalysisMain2'));
			$scope.PowerTitle1 = '故障占比'
			myChart.showLoading(); //数据加载完之前先显示一段简单的loading动画
			
			var pieJson = {
				"status": 1,
				"userId": userId,
				"starTime": $scope.startTime7,
				"endTime": $scope.endTime7
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
						
//						alert("图表请求数据为空，可能服务器暂未录入近五天的观测数据，您可以稍后再试！");
						myChart.hideLoading();
					}
				},
				function(error) {
//					alert("图表请求数据失败，可能是服务器开小差了");
					myChart.hideLoading();
				})
		}
		//	故障频率请求数据
		var echartsdata_frZhe1 = function() {
			var myChart = echarts.init(document.getElementById('powerAnalysisMain1'));
			myChart.showLoading();
			
			var piechartdata = {
				"status": 2,
				"userId": userId,
				"starTime": $scope.startTime8,
				"endTime": $scope.endTime8
			}
			var piechartdata1 = {
				"code": 10048,
				"param": JSON.stringify(piechartdata)
			}
			requestService.post(url, piechartdata1).then(
				function(data) {
					console.log(data);
					myChart.hideLoading();
					if(data.code == 200) {
						$scope.piechartdata2 = data.data;
						var Xajax = $scope.piechartdata2.dateX;
						var Yajax = $scope.piechartdata2.numberY;
						var optionObj2 = { xdata: Xajax, ydata: Yajax, text1: "频率", bottom: "5px", Company: "" };
						var option = powerEachartsdata(optionObj2);
						$timeout(function() {
							myChart.setOption(option);
						}, 200)

					} else {
//						alert("图表请求数据为空，可能服务器暂未录入近五天的观测数据，您可以稍后再试！");
					}
				},
				function(error) {
//					alert("图表请求数据失败，可能是服务器开小差了");
					myChart.hideLoading();
				})
		}
		//	故障占比按钮	
		$scope.faultStatistBtn_btn1 = function() {
			$scope.faultStatist = 1;
			open_faultDialog();
			setTimeout(function() {
				echarts_pie1();
			}, 500)
		}
		//	故障频率按钮
		$scope.faultStatistBtn_btn2 = function() {
			$scope.faultStatist = 2;
			open_faultDialog();
			setTimeout(function() {
					$scope.PowerTitle = '故障频率'
					echartsdata_frZhe1();
			}, 1000);

		}
		//	故障占比,故障频率弹框内时间查询共用
		function changeTime(type) {
			var startT = $("#startTime" + type).val();
			var endT = $("#endTime" + type).val();
			//只输入一个，为该时期到当前的数据
			if(startT == "" && endT == "") {
				$scope['startTime'+type]= todayBefore7;
				$scope['endTime'+type]= today2;
			}else{
				searchTime(type,true);
			}
			$("#startTime" + type).val($scope['startTime'+type]);
			$("#endTime" + type).val($scope['endTime'+type]);
		}
		//	故障占比，弹窗内查询
		$scope.Fault_btn1 = function() {
			changeTime(7);
			echarts_pie1();
		}
		//	故障频率，弹窗查询
		$scope.Fault_btn2 = function() {
			changeTime(8);
			echartsdata_frZhe1();
		}
		
		//故障占比，故障频率弹窗
		function open_faultDialog(){
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
					
				}]
			});
		}
		
//		点击切换按钮
		$scope.carDatalist = [
			{ "title": "充电统计" },
			{ "title": "电耗分析" },
			{ "title": "电池极差分析" },
			{ "title": "电池数据统计" },
			{ "title": "电机数据统计" },
			{ "title": "故障统计" }
		];
		$scope.activeTab = 0;
		
//		数据模块，点击时函数只初始化一次
		var dataStatic_funcList=[
			{flag:true},
			{flag:false,func:function(){
				init_changeDay("","",2,false);
				powerAnalyisdata();
			}},
			{flag:false,func:function(){
				init_changeDay("","",3,true);
				potentialRangedata1();
			}},
			{flag:false,func:function(){
				init_changeDay("","",4,false);
				batteryDatainit();
			}},
			{flag:false,func:function(){
				init_changeDay("","",5,false);
				motorDatainit();	
			}},
			{flag:false,func:function(){
				init_FaultTime();
				search_faultTable();
			}},
		];
		$scope.changeIndex = function(index) {
			$scope.activeTab = index;
			if(dataStatic_funcList[index].flag){
        		return;
        	}
			dataStatic_funcList[index].flag=true;
        	var func=dataStatic_funcList[index].func;
        	func();
		}
	
}])