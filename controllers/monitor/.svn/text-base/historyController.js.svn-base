App.controller('historyController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',"$state","$stateParams","cacheService","$filter"
	,function(requestService,cacheService,$cookieStore, $scope, $timeout,$filter,ngDialog,notifications,$state,$stateParams,cacheService,$filter) {
		document.title = "桑德新能源云平台历史轨迹";
		var url = '/product/api/business';
		//请求地址
	var req_url="http://192.168.231.166:8080/product/api/business";
	
		var obj={"type":1};
		
		var start = {
		format: 'YYYY-MM-DD hh:mm:ss',
		minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
		initAddVal: { DD: "-7" }, //初始化日期加n月
		isinitVal: true,
		festival: false,
		ishmsVal: false,
		maxDate: $.nowDate(0), //最大日期
		choosefun: function(elem, datas) {
			console.log(datas);
			var times1=new Date(datas).getTime();
			var times2=new Date().getTime();
			var time;
			if(times1+1000*60*60*24*7<times2){
				time=times1+1000*60*60*24*7;
			}else{
				time=times2;
			}
			var day=new Date(time);
			console.log(day);
			
			day=$filter('date')(day, "yyyy-MM-dd HH:mm:ss"); 
			console.log(day);
			
			end.maxDate = day; //开始日选好后，重置结束日的最小日期
			end.minDate = $filter('date')(datas, "yyyy-MM-dd HH:mm:ss");
			endDates();
		}
	};
	var end = {
		//		skinCell:"je-bg-olive",
		format: 'YYYY-MM-DD hh:mm:ss',
		initAddVal: [0],
		maxDate: $.nowDate(0), //设定最小日期为当前日期
		isinitVal: true,
		festival: false,
		ishmsVal: false,
		choosefun: function(elem, datas) { //选中之后的回调函数
			console.log(datas);
			var times1=new Date(datas).getTime();
			var time=times1-1000*60*60*24*7;
			var day1=new Date(time);
			console.log(day1);
			
			day1=$filter('date')(day1, "yyyy-MM-dd HH:mm:ss"); 
			console.log(day1);
			start.minDate = day1; //将结束日的初始值设定为开始日的最大日期
			start.maxDate =$filter('date')(datas, "yyyy-MM-dd HH:mm:ss");
		}
	};
	//这里是日期联动的关键        
	function endDates() {
		//将结束日期的事件改成 false 即可
		end.trigger = false;
	}
	$.jeDate('#startTime', start);
	$.jeDate('#endTime', end);

	function initDate(startEnd) {
		$.jeDate('#' + startEnd, { trigger: false, festival: true, isinitVal: true, ishmsVal: false, format: 'YYYY-MM-DD hh:mm:ss' })
	}
		
		//			添加水厂
        function addFactoryMarker(factoryCarArr, map) {

            map.clearOverlays();
            var factoryCarArr = factoryCarArr;
            var factoryArr = factoryCarArr["factory"];
            var carArr = factoryCarArr["car"];
//          if (factoryArr) {
//              addMarkerF(factoryArr, map, "factory");
//          }
        }

        function addMarkerF(arrList, map, type) {
            for (var i = 0; i < arrList.length; i++) {
                var longitude = arrList[i].longitude;
                var latitude = arrList[i].latitude;

                var marker = new BMap.Marker(new BMap.Point(longitude, latitude));
                var everylist = arrList[i];
                addMarkerT(everylist, type, marker, map);
            }

        }

        function addMarkerT(everylist, type, marker, map) {
            var zoom = map.getZoom();
            marker.obj = everylist;
            if (type == "factory") {
                if (everylist.isweage) {
                    if (zoom <= 9) {
                        marker.setIcon(icons[0]);
                    } else {
                        marker.setIcon(bigIcons[0]);
                    }
                }
                marker.typeName = "factory";

            }
            map.addOverlay(marker);
        }
		var testData = {
            "car"://小车初始位置
                [{
                    address: "江苏省兴化市城东镇",
                    longitude: 119.920048,
                    latitude: 32.986093,
                    employeeId: 530,
                    type: 0,
                    carName: "巡检车",
                    carType: "长城皮卡",
                    carNumber: "苏mj1939"
                },
                    {
                        address: "江苏省兴化市沙沟镇",
                        longitude: 119.727853,
                        latitude: 33.150201,
                        employeeId: 531,
                        type: 1,
                        carName: "脱泥车",
                        carType: "厢式货车",
                        carNumber: "贵hp1732"
                    },
                    {
                        address: "江苏省兴化市茅山镇",
                        longitude: 120.009393,
                        latitude: 32.754287,
                        employeeId: 532,
                        type: 2,
                        carName: "维修车",
                        carType: "长城皮卡",
                        carNumber: "苏md2586"
                    }],
            "factory": [
                {
                    address: "江苏省兴化市城东镇",
                    "longitude": "119.922321",
                    "latitude": "32.995879",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市海南镇",
                    "longitude": "119.988958",
                    "latitude": "33.062455",
                    "time": "30000",
                    "dataTime": "1495578410000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市钓鱼镇",
                    "longitude": "119.989673",
                    "latitude": "33.092486",
                    "time": "30000",
                    "dataTime": "1495578680000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市中堡镇",
                    "longitude": "119.849226",
                    "latitude": "33.102418",
                    "time": "30000",
                    "dataTime": "1495579010000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市沙沟镇",
                    "longitude": "119.731302",
                    "latitude": "33.163983",
                    "time": "30000",
                    "dataTime": "1495580300000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市林湖乡",
                    "longitude": "120.025331",
                    "latitude": "32.995334",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市昌荣镇1",
                    "longitude": "120.099169",
                    "latitude": "32.949089",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市新垛镇1",
                    "longitude": "120.204241",
                    "latitude": "33.070374",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市合陈镇1",
                    "longitude": "120.270832",
                    "latitude": "33.018636",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市戴窑镇1",
                    "longitude": "120.241963",
                    "latitude": "32.936545",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市陶庄镇2",
                    "longitude": "120.168214",
                    "latitude": "32.8709",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市荻垛镇1",
                    "longitude": "120.100143",
                    "latitude": "32.862095",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市竹泓镇1",
                    "longitude": "119.998423",
                    "latitude": "32.918476",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市茅山镇1",
                    "longitude": "120.017716",
                    "latitude": "32.756611",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                },
                {
                    address: "江苏省兴化市周庄镇1",
                    "longitude": "119.901602",
                    "latitude": "32.734816",
                    "time": "30000",
                    "dataTime": "1495577989000",
                    "isFactory": true,
                    "isweage": true
                }
            ]
        };
        //项目公司小图标
        var icons = [
            //new BMap.Icon("images/img2/map_ldc_db.png", new BMap.Size(19,25)),
            new BMap.Icon("images/img2/map_sweage_icon.png", new BMap.Size(26, 26)),
            new BMap.Icon("images/img2/map_shuiwu_icon.png", new BMap.Size(26, 26)),
            new BMap.Icon("images/img2/map_sweage_icon.png", new BMap.Size(26, 26))
        ];

        //项目公司大图标
        var bigIcons = [
            //new BMap.Icon("images/img2/tk_zuobiao_lidianchi.png", new BMap.Size(43,43)),
            new BMap.Icon("images/img2/map_sweage_big.png", new BMap.Size(44, 44)),
            new BMap.Icon("images/img2/map_shuiwu_big.png", new BMap.Size(44, 44))

        ];
        //汽车小图标
        var caricons = [
            //new BMap.Icon("images/img2/map_ldc_db.png", new BMap.Size(19,25)),
            new BMap.Icon("images/img2/map_carType3_icon.png", new BMap.Size(26, 26)),
            new BMap.Icon("images/img2/map_carType1_icon.png", new BMap.Size(26, 26)),
            new BMap.Icon("images/img2/map_carType2_icon.png", new BMap.Size(26, 26))
        ];
		//地图----------------------开始---------------------------
  		//初始化地图	
  		var map = new BMap.Map(document.getElementById("carDialogMap"),{minZoom:6,maxZoom:17});	
  		var longitude = 119.849304;
  		var latitude = 33.097105;
  		var zoom = 11;
  		map.centerAndZoom(new BMap.Point(longitude, latitude), zoom);
//		map.setMapStyle({
//			style:'midnight'
//		});
		map.enableScrollWheelZoom();
		map.enableInertialDragging();
		map.enableContinuousZoom();
		map.setMapStyle(cacheService.getMapStyle());
		
		//添加水厂,车辆
		var testDataUin;
		//脱泥车
		
		testDataUin={"factory":testData["factory"]};
		addFactoryMarker(testDataUin,map);
  		//地图初始化----------------------结束---------------------------
  		//方向
  		var directions = ['正北','东北','正东','东南','正南','西南','正西','西北','正北'];//计算方法int((degree + 22.5)/45)
  		var replayStartTime = $("#replayStartTime").val();
  		var replayEndTime = $("#replayEndTime").val();
  		var replayVin="1233333"; 
  		var replayType = "01001G01";
  		var carMobileNumber = null;
          
        $scope.type='replay';
        $scope.pause = false;
        $scope.rangeMax = 500; //播放进度条控制
        $scope.range = 0;
        $scope.startTime = null;
        $scope.endTime = null;
        $scope.replayDate = new Date();
        $scope.isCarReplay = (replayType=='01001G01'?true:false);
        //车辆目前状态
        $scope.currentStatus = {
          		id:'0001',	
          		mobileNumber:'通讯卡号',
          		carNumber:'车牌号',
          		carName:'车辆名称',
          		carType:'车辆类型',
          		workStatus:'未知',
          		speed:'',
          		driver:'未设置', 
          		time:null,
          		direction:'',	
          		distance:'',
          		oil:'未知',
          		abnormalOil:'否',
          		overspeed:'否',
          		timeoutPark:'否',
          		org:''
        };
        //播放暂停控制
          $scope.pauseOrRestart = function(){
          	
          	if(!$scope.path || $scope.path.length == 0 || $scope.range ==$scope.path.length -1) return;
          	
          	if($scope.pause){
          		if(replay){
          			replay.start();
          		}
          	}
          	else{
          		if(replay){
          			replay.pause();
          		}
          	}
          	if(replay.stopCallback==null){
          		replay.stopCallback = function(currentStep){
          			if(currentStep == -1 || currentStep ==$scope.path.length) return;
          			var callback = function () {
          				$scope.range=currentStep;
          				/*if(currentStep ==$scope.path.length){
          					return ;
          				}*/
          				$scope.currentStatus.id = $scope.range;
          				$scope.currentStatus.distance = $scope.path[$scope.range].zMileage;
          				$scope.currentStatus.speed = $scope.path[$scope.range].speed;
          				$scope.currentStatus.time = $scope.path[$scope.range].dataTime;
          				$scope.currentStatus.direction = $scope.path[$scope.range].direction;
          				$scope.currentStatus.overspeed = $scope.path[$scope.range].isOverspeed?'是':'否';
  						$scope.currentStatus.timeoutPark = $scope.path[$scope.range].isParking?'是':'否';
          				/*if($scope.path[$scope.range].isOverspeed || $scope.path[$scope.range].isParking){
          					//第一次超速后，之后的状态设置为红色
          					if(!isOverspeed && !isParking && replay && currentStep >= firstRed){
          						isOverspeed = true;
          						replay.setDirection(redCarIcons);//改变车辆颜色用以表示有违规
          					}
          				}
          				else{
          					//第一次超速前，状态为蓝色
          					if(isOverspeed && replay && currentStep < firstRed){
          						isOverspeed = false;
          						replay.setDirection(normalCarIcons);//改变车辆颜色用以表示正常
          					}      					
          				}*/
  						if($scope.isCarReplay){
  							if(currentStep >= firstRed ){
  								replay.setDirection(redCarIcons);
  							}
  							else{
  								replay.setDirection(normalCarIcons);
  							}
  						}
  						
  						//开始全景跟踪
  						if($scope.isPanShow) {
  							startPan($scope.path[$scope.range].bd_lon,$scope.path[$scope.range].bd_lat,$scope.path[$scope.range].direction);
  						}
  						
          				$scope.currentStatus.oil = $scope.path[$scope.range].oilVolume ? $scope.path[$scope.range].oilVolume: '未知';
          				$scope.currentStatus.id = $scope.path[$scope.range].carNum;
          				$scope.currentStatus.workStatus = $scope.path[$scope.range].workStatus;
  						$scope.currentStatus.direction = directions[parseInt((parseInt($scope.path[$scope.range].direction)%360 + 22.5)/45)];
  						$scope.currentStatus.abnormalOil = $scope.path[$scope.range].abnormalOil?'是':'否';						
          			};
          			if(!$scope.$$phase) {
          				$scope.$apply(callback);
          			}
          			else{
          				callback();
          			}
          			if(currentStep == -1 || currentStep >= $scope.path.length - 1){   
          				     $scope.pause = true;
//        					$scope.$apply(function () {
//            					$scope.pause = true;
//                			});
          		}
          				
          		}
          	}
          	
          	if(replay.arrowClickCallback==null){
          		replay.arrowClickCallback = function(stepIndex){
          			if(replayType=='01001G01' && $scope.typed == '8684056427607197'){
          				openCarInfo(stepIndex);
          			}
          			else if(replayType=='01001G01' && $scope.typed == '8684056427607198'){
          				openNonCarInfo(stepIndex);
          			}else if(replayType=='01001G01' && $scope.typed == '-1'){
          				openMobileWcInfo(stepIndex);
          			}else{
          				openEmpInfo(stepIndex);
          			}
          		}
          	}
          	
          	$scope.pause = !$scope.pause;
          }
          
        //播放进度条控制
        $scope.setCurrentIndex = function(flag){
          	if(replay){
          		replay.pause();
          		if(flag == 1){
          			$scope.range += 5;
              	}
              	else if(flag == -1){
              		$scope.range -= 5;
              	}
          		if($scope.range < 0) $scope.range = 0;
          		if($scope.path && $scope.path.length > $scope.range)
          			replay.moveTo($scope.range);
          		if($scope.pause == false)
          			replay.start();
      		}
        }
          
        $scope.speedBtns = [true,false,false];
        //播放速度控制
        var mutex = 0;
        $scope.setReplaySpeed = function(speed, activeId){
          	if(mutex == 0){
          		mutex = 1;
          		for(var i in $scope.speedBtns){
          			$scope.speedBtns[i] = false;
          		}
          		$scope.speedBtns[activeId] = true;
          		if(replay){
              		if($scope.pause == false)              			
              			replay.pause();
          			replay._opts.speed = speed;
          			if($scope.pause == false)
          				replay.start();
          		}
          		mutex = 0;
          	}
        }
        
        //记录第一次超速或违规的下标,小于此下标的显示蓝色，大于小标的显示红色
        var firstRed = 10000;
        var maxSpeed = 120;
        var carMaxStayTime = 1000*60*10;//十分钟
        var empMaxStayTime = 1000*60*30;//三十分钟
        //初始化显示图标和轨迹回放对象
        //轨迹箭头
        var iconA = new BMap.Icon('images/img2/arrow_right1.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 15)});
        
        
         var playCarstr;
        playCarstr=1;
        //车辆图标
        var iconC = new BMap.Icon('images/img2/zq_che1.png', new BMap.Size(60,60),{anchor : new BMap.Size(15, 15)});
  		//起点图标
        var iconS = new BMap.Icon('images/img2/start.png',new BMap.Size(45,55),{
  			imageOffset: new BMap.Size(20,-5)//设置图片偏移
  		}); 
        //终点图标
  		var iconE = new BMap.Icon('images/img2/end.png', new BMap.Size(45,55), {imageOffset: new BMap.Size(0,45)});
  		var iconS = new BMap.Icon('images/img2/arrow_right.png', new BMap.Size(1,1));
  		//停车图标
  		var iconP = new BMap.Icon('images/img2/tingche.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 18)});
  		//超速图标
  		var iconO = new BMap.Icon('images/img2/chaosu.png', new BMap.Size(25,25),{anchor : new BMap.Size(8, 18)});
  		
  		//正常行驶的车辆图标
  		var normalCarIcons = [
  		  				new BMap.Icon('images/img2/zq_che1.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che2'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che3'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che4'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che5'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che6'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che7'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)}),
		                new BMap.Icon('images/img2/zq_che8'+playCarstr+'.png', new BMap.Size(66,60), {imageOffset: new BMap.Size(0,-5)})
  		];
  		//车辆图标方向图标
  		var iconDirects = (replayType == '01001G01'?normalCarIcons:[iconC,iconC,iconC,iconC,iconC,iconC,iconC,iconC]);
  		var replay = new Replay(map, [],{
  				arrowIcon:iconA, 
  				carIcon:iconC, 
				directions:iconDirects,
				startIcon:iconS, 
				endIcon:iconE,
				shadowIcon:iconS,
				parkingIcon:iconS,
				overspeedIcon:iconO,
				speed:1500
  		});
  		
//		初始化请求
		var now=new Date();
		var endTime=$filter('date')(now, "yyyy-MM-dd HH:mm:ss"); 
		
		var starTime=now.setDate(now.getDate()-3);
		starTime=$filter('date')(now, "yyyy-MM-dd HH:mm:ss");
		$scope.startTime=starTime;
		$scope.endTime=endTime;
		console.log(starTime+"--"+endTime);

		$scope.carId=Number($stateParams.value);
  		
        //轨迹回放初始化
        $scope.path = [];
        var isOverspeed = false;
        var initReplay = function(param,color){
			isOverspeed = false;
			var maxStayTime = null;
			replay.setDirection(normalCarIcons);
			firstRed = 10000;
			maxStayTime = carMaxStayTime;
			
			if (angular.isDefined(replay)) {
				replay.stop();
			}
			
			var playColor=["blue","#3E48CD","#890014","#FF7E26","#B97A56","#22B14C","#7F7E7E","#A348A5","#000000","#FFF300","#890014","#890014","#00A3E9","#B5E71C","#B97A56","#ED1C24"];
			
				//测试数据
				var data = {};
//				1脱泥,脱泥车环线路线
				data["1"]=[
				{address:"江苏省兴化市城东镇7","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市城东镇6","longitude":"119.917719","latitude":"33.006683","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇5","longitude":"119.896734","latitude":"32.9999","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇4","longitude":"119.859652","latitude":"33.011285","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇2","longitude":"119.808341","latitude":"32.999779","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇1","longitude":"119.744526","latitude":"33.004382","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市沙沟镇3","longitude":"119.739351","latitude":"33.072058","time":"30000","dataTime":"1495580300000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市沙沟镇2","longitude":"119.731302","latitude":"33.163983","time":"30000","dataTime":"1495580300000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市沙沟镇1","longitude":"119.739351","latitude":"33.072058","time":"30000","dataTime":"1495580300000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市中堡镇3",longitude:119.860868,latitude:33.091045,"time":"30000","dataTime":"1495579010000","isFactory":false,"dayFlag":2},
				{address:"江苏省兴化市中堡镇2",longitude:119.849226,latitude:33.102418,"time":"30000","dataTime":"1495579010000","isFactory":true,"dayFlag":2},
				{address:"江苏省兴化市中堡镇1",longitude:119.860868,latitude:33.091045,"time":"30000","dataTime":"1495579010000","isFactory":false,"dayFlag":2},
				{address:"江苏省兴化市钓鱼镇","longitude":"119.989673","latitude":"33.092486","time":"30000","dataTime":"1495578680000","isFactory":true,"dayFlag":3},
				{address:"江苏省兴化市海南镇","longitude":"119.988958","latitude":"33.062455","time":"30000","dataTime":"1495578410000","isFactory":true,"dayFlag":4},
				{address:"江苏省兴化市林湖乡3","longitude":"119.992695","latitude":"33.021052","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":5},
				{address:"江苏省兴化市城林湖乡2","longitude":"120.008577","latitude":"32.988806","time":"30000","dataTime":"1495577989000","isFactory":false,"dayFlag":5},
				{address:"江苏省兴化市林湖乡1","longitude":"120.036027","latitude":"32.999834","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":5},
				{address:"江苏省兴化市林昌荣镇2","longitude":"120.02582","latitude":"32.950654","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":6},
				{address:"江苏省兴化市昌荣镇1","longitude":"120.092329","latitude":"32.947001","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":6},
				
				{address:"江苏省兴化市新垛镇4","longitude":"120.10749","latitude":"33.077414","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":7},
				{address:"江苏省兴化市新垛镇3","longitude":"120.098292","latitude":"33.096773","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":7},
				{address:"江苏省兴化市新垛镇2","longitude":"120.185679","latitude":"33.076325","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":7},
				{address:"江苏省兴化市新垛镇1","longitude":"120.204241","latitude":"33.070374","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":7},
				
				{address:"江苏省兴化市合陈镇4","longitude":"120.185679","latitude":"33.076325","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":8},
				{address:"江苏省兴化市合陈镇3","longitude":"120.203223","latitude":"33.066976","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":8},
				{address:"江苏省兴化市合陈镇2","longitude":"120.18885","latitude":"33.015646","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":8},
				{address:"江苏省兴化市合陈镇1","longitude":"120.270832","latitude":"33.018636","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":8},
				
				{address:"江苏省兴化市戴窑镇2","longitude":"120.235833","latitude":"32.933508","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":9},
				{address:"江苏省兴化市戴窑镇1","longitude":"120.241963","latitude":"32.936545","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":9},
				
				{address:"江苏省兴化市陶庄镇3","longitude":"120.169844","latitude":"32.935044","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":10},
				{address:"江苏省兴化市陶庄镇2","longitude":"120.166395","latitude":"32.872963","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":10},
				{address:"江苏省兴化市陶庄镇2","longitude":"120.168214","latitude":"32.8709","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":10},
				
				{address:"江苏省兴化市荻垛镇2","longitude":"120.16468","latitude":"32.854257","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":11},
				{address:"江苏省兴化市荻垛镇1","longitude":"120.100143","latitude":"32.862095","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":11},
				
				{address:"江苏省兴化市竹泓镇4","longitude":"120.108161","latitude":"32.911928","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":12},
				{address:"江苏省兴化市竹泓镇3","longitude":"120.006401","latitude":"32.922597","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":12},
				{address:"江苏省兴化市竹泓镇2","longitude":"120.004676","latitude":"32.889132","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":12},
				{address:"江苏省兴化市竹泓镇1","longitude":"119.998423","latitude":"32.918476","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":12},
				
				{address:"江苏省兴化市茅山镇3","longitude":"120.004676","latitude":"32.889132","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":13},
				{address:"江苏省兴化市茅山镇2","longitude":"119.996817","latitude":"32.753346","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":13},
				{address:"江苏省兴化市茅山镇1","longitude":"120.017716","latitude":"32.756611","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":13},
				
				{address:"江苏省兴化市周庄镇4","longitude":"119.996817","latitude":"32.753346","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":14},
				{address:"江苏省兴化市周庄镇3","longitude":"119.999618","latitude":"32.737826","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":14},
				{address:"江苏省兴化市周庄镇2","longitude":"119.902745","latitude":"32.739284","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":14},
				{address:"江苏省兴化市周庄镇1","longitude":"119.901602","latitude":"32.734816","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":14},
				
				{address:"江苏省兴化市城东镇5","longitude":"119.912979","latitude":"32.716727","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":15},
				{address:"江苏省兴化市城东镇4","longitude":"119.908667","latitude":"32.762403","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":15},
				{address:"江苏省兴化市城东镇3","longitude":"119.866123","latitude":"32.8794","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":15},
				{address:"江苏省兴化市城东镇2","longitude":"119.883658","latitude":"32.953596","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":15},
				{address:"江苏省兴化市城东镇1","longitude":"119.890988","latitude":"32.97262","time":"30000","dataTime":"1495577989000","isFactory":true,"dayFlag":15},
				{address:"江苏省兴化市城东镇0","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":15},
				];
	         
//	         	脱泥车行驶路线新规则,脱泥车单点返回路线
				data["1"]=[
				{address:"江苏省兴化市城东镇1","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市城东镇2","longitude":"119.917719","latitude":"33.006683","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇3","longitude":"119.896734","latitude":"32.9999","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇4","longitude":"119.859652","latitude":"33.011285","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇5","longitude":"119.808341","latitude":"32.999779","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇6","longitude":"119.744526","latitude":"33.004382","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇7","longitude":"119.739351","latitude":"33.072058","time":"30000","dataTime":"1495580300000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市沙沟镇1","longitude":"119.731302","latitude":"33.163983","time":"30000","dataTime":"1495580300000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市城东镇7","longitude":"119.739351","latitude":"33.072058","time":"30000","dataTime":"1495580300000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇6","longitude":"119.744526","latitude":"33.004382","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇5","longitude":"119.808341","latitude":"32.999779","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇4","longitude":"119.859652","latitude":"33.011285","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇3","longitude":"119.896734","latitude":"32.9999","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇2","longitude":"119.917719","latitude":"33.006683","time":"30000","dataTime":"1495594245000","isFactory":false,"dayFlag":1},
				{address:"江苏省兴化市城东镇1","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},

//					中堡镇
				{address:"江苏省兴化市中堡镇8","longitude":"119.920773","latitude":"32.996812","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇7","longitude":"119.920665","latitude":"33.008257","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇6","longitude":"119.894866","latitude":"33.002807","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇5","longitude":"119.89501","latitude":"33.02061","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇4","longitude":"119.900759","latitude":"33.053056","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇3","longitude":"119.893285","latitude":"33.075204","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇2","longitude":"119.889871","latitude":"33.096878","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇1","longitude":"119.847436","latitude":"33.089604","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇01","longitude":"119.8451","latitude":"33.101158","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇00","longitude":"119.849052","latitude":"33.101944","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇01","longitude":"119.8451","latitude":"33.101158","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇1","longitude":"119.847436","latitude":"33.089604","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇2","longitude":"119.889871","latitude":"33.096878","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇3","longitude":"119.893285","latitude":"33.075204","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇4","longitude":"119.900759","latitude":"33.053056","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇5","longitude":"119.89501","latitude":"33.02061","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇6","longitude":"119.894866","latitude":"33.002807","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇7","longitude":"119.920665","latitude":"33.008257","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市中堡镇8","longitude":"119.920773","latitude":"32.996812","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				
		//		钓鱼镇
				{address:"江苏省兴化市钓鱼镇8","longitude":"119.920773","latitude":"32.996812","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇7","longitude":"119.920665","latitude":"33.008257","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇6","longitude":"119.947938","latitude":"33.007985","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇5","longitude":"119.992063","latitude":"33.022638","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇4","longitude":"119.989547","latitude":"33.026331","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇3","longitude":"119.990949","latitude":"33.042827","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇2","longitude":"119.990158","latitude":"33.051694","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇1","longitude":"119.990212","latitude":"33.064373","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇01","longitude":"119.988469","latitude":"33.074539","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇00","longitude":"119.989368","latitude":"33.092417","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇01","longitude":"119.988469","latitude":"33.074539","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇1","longitude":"119.990212","latitude":"33.064373","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇2","longitude":"119.990158","latitude":"33.051694","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇3","longitude":"119.990949","latitude":"33.042827","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇4","longitude":"119.989547","latitude":"33.026331","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇5","longitude":"119.992063","latitude":"33.022638","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇6","longitude":"119.947938","latitude":"33.007985","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇7","longitude":"119.920665","latitude":"33.008257","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓鱼镇8","longitude":"119.920773","latitude":"32.996812","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				{address:"江苏省兴化市钓城东镇","longitude":"119.920773","latitude":"32.996812","time":"30000","dataTime":"1495594245000","isFactory":true,"dayFlag":1},
				


				];
	         
          		var points = [];
//        		1脱泥,0巡检,2维修
          		
//        		param用于查询历史数据时使用
          		if(param){
          			data.data= param;
          			$scope.path=data.data;
          		}else{
//	          		data.data = data["1"]; 
//	          		$scope.path=data.data;
          		}
//        		data.data = data["1"];
//        		$scope.path=data.data;
//        		console.log(data.data);
          		
          		if (data.data.length > 0) {
					for (var i = 0, len = data.data.length; i < len; i++) {
						var every=data.data[i];
						var point = new BMap.Point(every.longitude, every.latitude);
						var longitude= every.longitude;
						var latitude= every.latitude;
						if( every.dayFlag){
							point.dayFlag=every.dayFlag;
							point.pathColor=playColor[every.dayFlag];
						}
						points.push(point);
					}
					if (points.length > 0 && replay) {
						if(color!=undefined&&color!=null){
							console.log("clear");
							replay.clearPath();
							replay.setPath(points,color);
						}else{
							replay.setPath(points);
						}
					}

              		$scope.rangeMax = $scope.path.length - 1;
              		$scope.pause = true;
              		$scope.currentStatus.time = null; 
              		
				} else {
					var msg = "当天没有数据";
					notifications.showWarning(msg);
				}
        		
        
        }
//      initReplay();

		initRoad($scope.startTime,$scope.endTime);
				
		function initRoad(starTime,endTime){
			var params={
					"userId":userId,"carId":$scope.carId,"starTime":starTime,"endTime":endTime
			}
			var post_data={
						"code":10044,
					    "param":JSON.stringify(params)
			}
			console.log(post_data);
			requestService.post(url,post_data).then(
				            function (data) {
				            	console.log(data);
				            	if(data.code==200){
				            		if(data.data==null){
					            		notifications.showError("当前查询不到历史数据");
				            		}else{
				            			var param=data.data;
										initReplay(param,"blue");
				            		}
				            	}
				            },function(error){
			})

			
		}
		
        /*查询时间段轨迹*/
       
       var history1=[
       			{address:"江苏省兴化市钓鱼镇","longitude":"119.989673","latitude":"33.092486","time":"30000","dataTime":"1495578680000","isFactory":true},
				{address:"江苏省兴化市海南镇","longitude":"119.988958","latitude":"33.062455","time":"30000","dataTime":"1495578410000","isFactory":true},
				{address:"江苏省兴化市林湖乡3","longitude":"119.992695","latitude":"33.021052","time":"30000","dataTime":"1495577989000","isFactory":true},
				{address:"江苏省兴化市城林湖乡2","longitude":"120.008577","latitude":"32.988806","time":"30000","dataTime":"1495577989000","isFactory":false},
				{address:"江苏省兴化市林湖乡1","longitude":"120.036027","latitude":"32.999834","time":"30000","dataTime":"1495577989000","isFactory":true}];
			
		var history0=[
				{address:"江苏省兴化市城东镇1","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇4","longitude":"119.912011","latitude":"32.852192","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇3","longitude":"119.861418","latitude":"32.836661","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇2","longitude":"119.903387","latitude":"32.740261","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇1","longitude":"119.901602","latitude":"32.734816","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇2","longitude":"119.903387","latitude":"32.740261","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇3","longitude":"119.861418","latitude":"32.836661","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市周庄镇4","longitude":"119.912011","latitude":"32.852192","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市城东镇1","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true}
       			];	
			
		var history2=[
				{address:"江苏省兴化市戴窑镇1","longitude":"120.241963","latitude":"32.936545","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市城东镇4","longitude":"120.107458","latitude":"32.940474","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市城东镇3","longitude":"119.966604","latitude":"32.959137","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市城东镇2","longitude":"119.915149","latitude":"32.923989","time":"30000","dataTime":"1495594245000","isFactory":true},
				{address:"江苏省兴化市城东镇1","longitude":"119.922321","latitude":"32.995879","time":"30000","dataTime":"1495594245000","isFactory":true}
       			];	
        $scope.searchHistory = function(){
        	var param;
        	param=history1;
			var startTime=$("#startTime").val();
			var endTime=$("#endTime").val();
        	
        	startTime=$filter('date')(startTime, "yyyy-MM-dd hh:mm:ss"); 
			endTime=$filter('date')(endTime, "yyyy-MM-dd hh:mm:ss");
			console.log(startTime);
			console.log(endTime);
			initRoad(startTime,endTime);
//  		initReplay(param,"blue");
        }
        $scope.resetQuery = function(){
        	$("#map").show();
        	$(".tool_icon ").show();
        	$scope.carReplay=false;
        	$scope.showReplay=false;
			$scope.tabControl=true;
			$scope.showPlayer=false;
			$scope.showDownUp=false;
			$scope.closeVideo=false;
			initCarList();
        }
      	
      	//划线
  	    var styleOptions= {
  	        strokeColor:"red",      //边线颜色。
  	        fillColor:"red",        //填充颜色。当参数为空时，圆形将没有填充效果。
  	        strokeWeight: 3,        //边线的宽度，以像素为单位。
  	        strokeOpacity: 0.8,     //边线透明度，取值范围0 - 1。
  	        fillOpacity: 0.3,       //填充的透明度，取值范围0 - 1。
  	        strokeStyle: 'solid'    //边线的样式，solid或dashed。
  	    };
//		关闭按钮
		$scope.closeBlank = function(){
			window.close();
		}
		
		
		
		
		
		
		
		
		
		
		
	}])