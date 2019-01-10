App.controller('monitorController', [
	'requestService','cacheService','$cookieStore','$scope', '$timeout','$interval','$window','$filter','ngDialog','notifications','$location','$state','$rootScope','$compile',
	function(requestService,cacheService,$cookieStore,$scope, $timeout,$interval,$window,$filter,ngDialog,notifications,$location,$state,$rootScope,$compile) {		
			
		$scope.monitor_select1,$scope.monitor_select2,$scope.monitor_select3,$scope.infoBox_data;
		$scope.monitor_selectConfig11={},$scope.monitor_selectConfig21={};
		$scope.status=1;$scope.unitCode1=0,$scope.useWay1=0,$scope.carStatus1=0,$scope.unitCode2=0,$scope.useWay2=0,$scope.carStatus2=0,$scope.need_sites=1;
	//报修人，报修电话
	 $scope.loginRealName = angular.copy($cookieStore.get("realName"))
	 $scope.loginPhone = angular.copy($scope.user.name);
	 console.log($scope.loginRealName);
	 console.log($scope.loginPhone);

		$rootScope.leftMap=localStorage["monitorJson"]?(localStorage["monitorJson"]=="false"?false:true):true;
		$rootScope.Monitor_left=true;
		var   siteTypeJscal=localStorage["siteTypeJson"]?JSON.parse(localStorage["siteTypeJson"]):"";
		var siteAlltype={'服务站':true,'充电桩':true,'充电站':true,'停车场':true,'加油站':true,'其它':true};
		$scope.siteTypeJson= siteTypeJscal||siteAlltype;
		console.log($scope.siteTypeJson);
		
	var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name"),
	 	realName=$cookieStore.get("realName"),
		loginphone=$cookieStore.get("name"),
		testData,siteMarkersAll=[],currentZoom = 5,
		map,infoBox,marker=null;
	var url = '/product/api/business';
	var req_url="http://192.168.231.166:8080/product/api/business";
	var gFontsize=(document.documentElement.clientWidth/1366).toFixed(2);
	
	 	var groupid_flag=angular.isDefined(groupid);
	 	var userId_flag=angular.isDefined(userId);
	 	var userName_flag=angular.isDefined(userName);
	 	
//	 	判断当前用户是否登录,没有登录返回到登录页面
	 	if(!(groupid_flag&&userId_flag&&userName_flag)){
	 		$state.go("login");
	 	}
		$scope.changeLeftArrow=function(event){
			$this=$(".qie");
			console.log($this);
			if(!$this.hasClass("active")){
				$('.leftMap').animate({left:'-3.3rem'});
			}else{
				$('.leftMap').animate({left:'0px'});
			}
			$this.toggleClass("active");
	}
	//查询下拉框初始化数据
	
		//地图初始化
		var caricons = {
			    "4":new BMap.Icon("images/img1/markerCar_myNormal.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(28,40)
			    }),
		        "5":new BMap.Icon("images/img1/markerCar_myLeave.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(28,40)
			    }),
				"1":new BMap.Icon("images/img1/markerCar_myfault1.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(28,40)
			    }),
				"2":new BMap.Icon("images/img1/markerCar_myfault2.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(28,40)
			    }),
			    "3":new BMap.Icon("images/img1/markerCar_myfault3.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(28,40)
			    }),
			    "9":new BMap.Icon("images/img1/markerCar_rentNormal.png", new BMap.Size(44,60),{
			    	imageSize:new BMap.Size(28,38.18)
			    }),
		        "10":new BMap.Icon("images/img1/markerCar_rentLeave.png", new BMap.Size(44,60),{
			    	imageSize:new BMap.Size(28,38.18)
			    }),
				"6":new BMap.Icon("images/img1/markerCar_rentfault1.png", new BMap.Size(44,60),{
			    	imageSize:new BMap.Size(28,38.18)
			    }),
				"7":new BMap.Icon("images/img1/markerCar_rentfault2.png", new BMap.Size(44,60),{
			    	imageSize:new BMap.Size(28,38.18)
			    }),
			    "8":new BMap.Icon("images/img1/markerCar_rentfault3.png", new BMap.Size(44,60),{
			    	imageSize:new BMap.Size(28,38.18)
			    }),
			};
	
	//地图初始化
	 	$scope.initMap=function(){
	 		var longitude = 107.404,latitude = 33.3915;
			map=new BMap.Map(document.getElementById("map"),{enableMapClick:false});
			var initCenterPoint=new BMap.Point(longitude,latitude);
			map.centerAndZoom(initCenterPoint,currentZoom);
			
			map.enableScrollWheelZoom();	
			map.enableInertialDragging();
			map.enableContinuousZoom();
			map.setMinZoom(5);
			map.setMapStyle(cacheService.getMapStyle());
			
			//以左下角，右上角划定区域，超出区域回弹
			var b = new BMap.Bounds(new BMap.Point(-90, -70.02387),new BMap.Point(190.779231, 80.865943));
			 BMapLib.AreaRestriction.setBounds(map, b); 
			
			// 覆盖区域图层测试
			var mapControl = new MapControl({
				map: map
			})
//			mapControl.initLocation();
			mapControl.addZoomControl(); //添加缩放组件
			mapControl.addMapTypeControl(); 
			
			mapControl.addTrafficControl({right:15*gFontsize,bottom:144*gFontsize});
	 		chinaView();
	 	}
	 	$scope.initMap();
	 
	 //中国视角
	function chinaView(){
		var chinaBounds = [{lng:122.842173,lat:53.412275},
		       			{lng:73.684596,lat:39.313958},
		       			{lng:134.690032,lat:48.393105},
		       			{lng:109.485735,lat:18.347819}];
		var pList = [];
		for(var p in chinaBounds){
			pList.push(new BMap.Point(chinaBounds[p].lng, chinaBounds[p].lat));
		}
		map.setViewport(pList);	
		var viewPoint=new BMap.Point(96.599135,36.790307);
		if(!$rootScope.leftMap){
				viewPoint=positonTopoint(viewPoint,"toLeft");
		}
		map.setCenter(viewPoint);
	}
	
//	 左侧栏关闭
	 $scope.changeLeftMap=function(){
	 	$rootScope.leftMap=false;
	 	localStorage["monitorJson"]="false";
	 	leftMap_panTo("toLeft");
	 }
	
	$rootScope.$on("leftMapOpen",function(){
		$scope.changeLeftMap3();
	});
	
//	左侧栏打开,
	$scope.changeLeftMap3=function(){
	 	leftMap_panTo("toRight");
	 } 
	 //左侧栏相关，地图平移
	 function leftMap_panTo(panType){
	 	var panPosition=map.getCenter();
	 	var point1=positonTopoint(panPosition,panType);
	 	map.panTo(point1);
	 }
	 
//	搜索
var vin_config=[
		{
			"value":0,
			"name":"车牌号",
			"key":"licenseNumber"
		},
		{
			"value":1,
			"name":"VIN",
			"key":"vin"
		},
		{
			"value":2,
			"name":"ICCID",
			"key":"iccid"
		},
	];
	
	$scope.vin_Config={
		focus:true,
		data:vin_config
	}

//三个条件
// 获取车辆使用单位,type==1,获取全部车辆单位，type=2,获取关注车辆单位
	function getAll_units(type){
		var getUnit_Param={
			 userId:userId,
		}
		var code=10057;
		if(type==1){
			getUnit_Param.unitName="";
			code=10056;
		}
		var Unit_Json={
			"code":code,
			"param":JSON.stringify(getUnit_Param)
		}
		console.log(Unit_Json);
		requestService.post(url, Unit_Json).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==200){
	            		var monitor_selectConfig=angular.copy(data.data);							
	            		var unitAll={unitCode:0, unitName:"全部",name:"全部"}
	            		monitor_selectConfig.unshift(unitAll);
	            		
	            		bindCarlist(monitor_selectConfig,type);
	            	}
	            },function(error){
	     })
	}
	
	function bindCarlist(selectConfig,type){
		var monitor_select={selectedType:"全部",unitCode:0};
		var monitor_selectConfig={
					focus:true,
					data:selectConfig,
					placeholder:"全部"
		    };
		if(type==1){
				$scope.monitor_select11=angular.copy(monitor_select);
        		$scope.monitor_selectConfig11=angular.copy(monitor_selectConfig);
		}
		if(type==2){
			$scope.monitor_select21=angular.copy(monitor_select);
    		$scope.monitor_selectConfig21=angular.copy(monitor_selectConfig);
		}
	}
//	获取全部车辆单位
	getAll_units(1);
//	获取关注车辆单位	
	getAll_units(2);

//车辆使用方式
var monitor_selectConfig2=[
		{
			"value":0,
			"name":"全部",
			"key":"licenseNumber"
		},
		{
			"value":1,
			"name":"自购车",
			"key":"vin"
		},
		{
			"value":2,
			"name":"租赁车",
			"key":"iccid"
		},
	];
	
	$scope.monitor_selectConfig12={
		focus:true,
		data:monitor_selectConfig2
	}
	
	$scope.monitor_selectConfig22={
		focus:true,
		data:monitor_selectConfig2
	}
	
//车辆使用状况
var monitor_selectConfig3=[
		{
			"value":0,
			"name":"全部",
		},
		{
			"value":5,
			"name":"正常",
		},
		{
			"value":6,
			"name":"离线",
		},
		{
			"value":4,
			"name":"全部故障",
		},
		{
			"value":1,
			"name":"一级故障",
		},
		{
			"value":2,
			"name":"二级故障",
		},
		{
			"value":3,
			"name":"三级故障",
		}
	];
	
	$scope.monitor_selectConfig13={
		focus:true,
		data:monitor_selectConfig3
	}
	$scope.monitor_selectConfig23={
		focus:true,
		data:monitor_selectConfig3
	}
	
//左侧车辆列表class集合
	$scope.mCarlist={"4":"mCarlist_myNormal","5":"mCarlist_myLeave","1":"mCarlist_myFault1","2":"mCarlist_myFault2","3":"mCarlist_myFault3","9":"mCarlist_rentNormal","10":"mCarlist_rentLeave","6":"mCarlist_rentFault1","7":"mCarlist_rentFault2","8":"mCarlist_rentFault3"};
	
//	实时监控数据获取
//	1,获取全部车辆数据
	$scope.Monitor_initResult,$scope.carNumber,$scope.sitesResults;
	$scope.repair_siteList={};
	var siteMarkersArr=[],carsMarkerArr=[],markerClus_cars=null,markerClus_sites=null;
	//1,代表加载车和站点，2 只加载车          3,代表只加载站点 
	$scope.carListInit=function(flag){
			$scope.need_sites=flag;
			if(flag==3){
				$scope.need_sites=1;
			}
			var repair_siteL2={};
			var repair_siteL={
				"userId":userId,
				"need_sites":$scope.need_sites, //是否需要站点
				"status":$scope.status, //全部还是关注
			}
			if($scope.status==1){
				repair_siteL2={
				"unitCode":$scope.unitCode1, //车辆使用单位
				"useWay":$scope.useWay1,  //车辆使用方式
				"carStatus":$scope.carStatus1 //车辆使用状态
				}
			}
			if($scope.status==2){
				repair_siteL2={
					"unitCode":$scope.unitCode2, //车辆使用单位
					"useWay":$scope.useWay2,  //车辆使用方式
					"carStatus":$scope.carStatus2 //车辆使用状态
				}
			}
			repair_siteL=$.extend({}, repair_siteL, repair_siteL2);
			var repair_siteInit={
					 "code":10043,
					"param":JSON.stringify(repair_siteL)
			}
			console.log(repair_siteInit);
			requestService.post(url, repair_siteInit).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
		            		$scope.Monitor_initResult=data.data;
		            		
	            		   //加载站点
	            			$scope.sitesResults=data.data.sites;
	            			if((flag==1||flag==3)&&$scope.sitesResults&&$scope.sitesResults.length>0){
	            				siteMarkersArr=[],siteMarkersAll=[];
	            				initMapData($scope.sitesResults,2);
	            			}
		            		//加载车
		            		$scope.carInit_List1=data.data.cars;
		            		if((flag==1||flag==2)&&$scope.carInit_List1&&$scope.carInit_List1.length>0){
		            			carsMarkerArr=[];
		            			initMapData($scope.carInit_List1,1);
							}
		            		if($scope.status==1){
		            			$scope.carInit_List=data.data.cars;
		            			$scope.carNumber=data.data.carNumber || 0;     		
		            		}else{
		            			$scope.carCareInit_List=data.data.cars;
		            			$scope.carCareNumber=data.data.carNumber || 0; 
		            		}
		            	}
		            },function(error){
		     })
	}
//	初始化
	$scope.carListInit(1);
	
	//1,刷新车和站点，2，代表车，3代表站点
	function clearCars(flag){
		var mOverlays=map.getOverlays();
		angular.forEach(mOverlays,function(item,index,array){
			if(item.typeName=="car"&&(flag==1||flag==2)){
				map.removeOverlay(item);
			}
			if(item.typeName=="site"&&(flag==1||flag==3)){
				map.removeOverlay(item);
			}
		})
		$scope.carListInit(flag);
	}
	
//手动刷新	
	$scope.refresh_monitor=function(){
		clearCars(1);
	}
	
	//每三分钟刷新一次
	var refreshTimer=$interval(function(){
		clearCars(1);
	},1000*60*3)
	
//全部车辆，关注车辆切换
	 $scope.mCar_allCare=function(togNumber){
	 	$scope.toggle=togNumber;
	 	$scope.status=togNumber;//当前全部还是关注标志
	 	clearCars(2);
	 }
	 
//	 选择车辆使用单位
	 $scope.selectChange_userUnit1=function(newModel){
	 	$scope.monitor_select11=newModel;		
		console.log(newModel);
		if(angular.isDefined(newModel.unitCode)){
			$scope.unitCode1=newModel.unitCode;
			clearCars(2);
		}
	 }
	 $scope.selectChange_userUnit2=function(newModel){
	 	$scope.monitor_select21=newModel;		
		console.log(newModel);
		if(angular.isDefined(newModel.unitCode)){
			$scope.unitCode2=newModel.unitCode;
			clearCars(2);
		}
	 }
//  选择车辆使用方式
	$scope.selectChange_12=function(newModel){
	 	$scope.monitor_select12=newModel;
	 	if(angular.isDefined(newModel.value)){
	 		$scope.useWay1=newModel.value;
			clearCars(2);
	 	}
	 }
	$scope.selectChange_22=function(newModel){
	 	$scope.monitor_select22=newModel;
	 	if(angular.isDefined(newModel.value)){
	 		$scope.useWay2=newModel.value;
			clearCars(2);
	 	}
	 }
//  选择车辆使用状态
	$scope.selectChange_13=function(newModel){
		$scope.monitor_select13=newModel;
		$scope.carStatus1=newModel.value;		
		clearCars(2);
	}
	$scope.selectChange_23=function(newModel){
		$scope.monitor_select23=newModel;
		$scope.carStatus2=newModel.value;		
		clearCars(2);
	}
	
		$scope.addMarker = function(every,type){
				var longitude,latitude,labelName;
				var marker=null;
				if(type==1){
					//车辆
					if(!angular.isDefined(every.location)){
						return;
					}
					labelName= every.licenseNumber || every.vin || every.iccid;
					 longitude= every.location.longitude;
					 latitude= every.location.latitude;
					 //添加覆盖物
					marker= new BMap.Marker(new BMap.Point(longitude,latitude));
					marker.typeName="car";
					marker.setIcon(caricons[parseInt(every.mark)]);
				}else{
					//站点
					labelName=every.name;
					if(labelName . length > 8){
						labelName = labelName.substring(0,8) + '...';
					}
					marker= new BMap.Marker(new BMap.Point(every.lng,every.lat));
					marker.typeName="site";
					marker.siteType=every.type;
					marker.setIcon(map_siteIcons(every.type));
				}
			
				marker.setZIndex(10000);//设置层的Z轴值
				marker.obj=every;
				
			  	var  label = new BMap.Label('<div>'+labelName+'</div>', {offset: new BMap.Size(-1, -1)});   
				label.setStyle(cacheService.getMaplabel_sty());
				label.obj=every;
				marker.setLabel(label);
				
//				map.addOverlay(marker);
				//车辆与站点
				if(type==1){
					marker.addEventListener("click",carClick);
					label.addEventListener("click",carClick); 
					carsMarkerArr.push(marker);
				}else{
					marker.addEventListener("click",siteClick);
					label.addEventListener("click",siteClick);
					siteMarkersAll.push(marker);
					if($scope.siteTypeJson[every.type]){
						siteMarkersArr.push(marker);
					}
				}
		}
		//当地图缩小时，关闭弹窗
		map.addEventListener("zoomend",function(){
			var zoom=map.getZoom();
			if(currentZoom>zoom && infoBox){
				infoBox.close();
			}
			currentZoom=zoom;
		})
		//车辆,站点聚合图标
        var myCluStyles_car = [{
            url: 'images/img1/map_CluseCar.png',
            size: new BMap.Size(48, 48),
//          opt_anchor: [16, 0],
            textColor: '#ffffff',
            opt_textSize: 18
        }];
        var myCluStyles_site = [{
            url: 'images/img1/map_CluseSite.png',
            size: new BMap.Size(48, 48),
//          opt_anchor: [16, 0],
            textColor: '#ffffff',
            opt_textSize: 18
        }];
        
//		type=1 代表车辆,type=2 代表站点,加载marker,并进行聚合
		var initMapData = function(testData,type){
			angular.forEach(testData,function(every,index){
				$scope.addMarker(every,type);
			})
			if(type==1){
				if(markerClus_cars != null) {
					markerClus_cars.clearMarkers();
				}
				markerClus_cars = new BMapLib.MarkerClusterer(map, {markers:carsMarkerArr, maxZoom:17, minClusterSize:2});
				markerClus_cars.setGridSize(100);
				markerClus_cars.setStyles(myCluStyles_car);
			}
			
			if(type==2){
				Ret_siteClus();
			}
		}
		
//		重新设置网点聚合
		function Ret_siteClus(){
			if(markerClus_sites != null) {
					markerClus_sites.clearMarkers();
			}
			markerClus_sites = new BMapLib.MarkerClusterer(map, {markers:siteMarkersArr, maxZoom:17, minClusterSize:2});
			markerClus_sites.setGridSize(50); 
			markerClus_sites.setStyles(myCluStyles_site);
		}
		
		//初始化地图弹框
		var infoBox_init = function(){
			//初始化弹框
			infoBox = new BMapLib.InfoBox(map,"",{
				boxClass:'infoBoxContent infoBoxContent_m1'
				,offset: {width:40,height:32}
				,closeIconMargin: "0.45rem 0.3rem 0 0"
				,enableAutoPan: false
				,closeIconUrl:"images/img1/infoBox_close1_2.png"
				,align: INFOBOX_AT_TOP
			});	
			infoBox.addEventListener("close", function(e) {
//		        clearSelected();
				return;
			});	
		}
		infoBox_init();
		
		//点击车辆
		function carClick(e){
			if(infoBox){
				infoBox.close();
			}
			console.log("car click");
			var carUser=e.target;
			var panPosition;
			if(carUser){
				panPosition=e.target.getPosition();
			}else{
				carUser=viewMarker;
				panPosition=viewMarker.point;
			}
			var objDetail=carUser.obj;
			console.log(objDetail);
			//请求单车详细信息，加载车辆信息
			addCarInfoBox(objDetail,panPosition,11);
		}
		
		function addCarInfoBox(objDetail,panPosition,clickType,noArrow){
			getSingle_car(objDetail,function(data){
				if(!data){
				  data=	{"position":{"locationStatus":0,"longitude":"119.558218","latitude":"35.41455","address":""},"is_follow":false,"licenseNumber":"",alarmName:"",carType:"",vin:"","vehicle":{"totalMileage":"",vehicleStatus:"",speed:""},"mileage":""}
				}
				addInfo_content(data,panPosition,clickType,noArrow);				
			})
		}
		//点击站点
		function siteClick(e){
			console.log("site click");
			if(infoBox){
				infoBox.close();
			}
			var siteUser=e.target;
			infoBox.open(e.target.getPosition());
		    var panPosition=e.target.getPosition();
			var objDetail=siteUser.obj;
			console.log(objDetail);
			var html=getService_IfboxHtml(objDetail);
			infoBox.setContent(html);
			$('.mapInfoBox2').prev('img').css("margin","0.3rem 0.2rem 0 0");
		   infoBox_panTo(panPosition,"site",html,2);
			
		}
		//渲染车辆信息
		function addInfo_content(infoBox_data,panPosition,clickType,noArrow){
			$scope.infoBox_data=infoBox_data;
			var address=infoBox_data.position?infoBox_data.position.address||"":"";
			var carType=infoBox_data.carType?infoBox_data.carType||"":"";
			var totalMileage=infoBox_data.vehicle?infoBox_data.vehicle.totalMileage||"":"";
			var speed=infoBox_data.vehicle?infoBox_data.vehicle.speed||"":"";
			var mileage=infoBox_data.mileage||"";
			var carStatus=infoBox_data.carStatus||"";
			var isFollow_text=infoBox_data.is_follow?"已关注":"+关注";
			var mapInfoBox_Class=noArrow?'mapInfoBox_noArrow':'mapInfoBox1';
			var html = '<div class="'+mapInfoBox_Class
				+'" id="mapInfoBox1">'
					+'<h4 class="modal-title text-center">车辆信息</h4>'
					+'<div class="panel-body">'
					 +'<div class="map_in_box mt-xl clearfix">'
						+'<div class="mCar_inf_ulist1 clearfix mt">'
							+'<ul><li class="commonColor1">车牌号</li><li class="typeMonitor"><span>'+FontCount(infoBox_data.licenseNumber,8)+'</span>'+'<button class="info_careBtn" id="info_careBtn" ng-click="mCar_care(infoBox_data)">'+isFollow_text+'</button>'+'</li></ul>'
							
							+'<ul class="text-center"><li class="commonColor1">车辆状态</li><li class="mCar_in_onLine">'+carStatus
+'</li></ul>'
							+'<ul><li class="commonColor1">车辆类型</li><li>'+carType+'</li></ul>'
							+'<ul><li class="commonColor1 AlarmName">报警名称</li><li class="typeMonitor">'+FontCount(infoBox_data.alarmName,11)+'</li></ul>'
						+'</div>'
						+'<div class="mCar_inf_ulist1 clearfix">'	
							+'<ul><li class="commonColor1">总里程</li><li>'+totalMileage+'</li></ul>'
							+'<ul class="text-center"><li class="commonColor1">车速</li><li>'+speed+'</li></ul>'
							+'<ul><li class="commonColor1">当日里程</li><li>'+mileage+'</li></ul>'
							+'<ul><li class="commonColor1 typeMonitor">故障类型</li><li class="typeMonitor">'+FontCount(infoBox_data.alarmType,11)+'</li></ul>'
						+'</div>'
						+'<div class="Vinnumber">'	
							+'<ul class="m0"><li class="commonColor1">VIN码</li><li>'+FontCount(infoBox_data.vin,38)+'</li></ul>'
						+'</div>'
						+'<div class="mCar_inf_pstionbox ml-lg mt">'
							+'<p class="commonColor1">地理位置</p>'
							+'<p>'+FontCount(address,38)+'</p>'
						+'</div>'
						+'<div class="mCar_inf_btnlist1 commonColor1 mt">'
						+'<div class="Transectionline"></div>'
							+'<ul class="wt100 ht100 m0 font-large">'
								+'<li><div class="mCar_detailsli mCar_monitorIcon" ng-click="mGo_carDetails1(infoBox_data)"></div><span class="mCar_monitorTiltle" ng-click="mGo_carDetails1(infoBox_data)">车辆详情</span></li>'
								+'<li><div class="mCar_realtimeli mCar_monitorIcon" ng-click="realtimeLook()"></div><span class="mCar_monitorTiltle" ng-click="realtimeLook()">实时看板</span></li>'
								+'<li id="mCar_battery"><div class="mCar_batteryli mCar_monitorIcon" ng-click="mCar_batteryLook()"></div><span class="mCar_monitorTiltle" ng-click="mCar_batteryLook()">电池监控</span></li>'
								+'<li id="mCar_longControl"><div class="mCar_longControlli mCar_monitorIcon" ng-click="mCar_longControl()"></div><span class="mCar_monitorTiltle" ng-click="mCar_longControl()">远程控制</span></li>'
								+'<li id="mPre_repairBtn"><div class="mCar_pRepairli mCar_monitorIcon" ng-click="mPre_repair()"></div><span class="mCar_monitorTiltle" ng-click="mPre_repair()">维修预约</span></li>'
								+'<li><div class="mCar_historyli mCar_monitorIcon" ng-click="mCar_history(infoBox_data)"></div><span class="mCar_monitorTiltle" ng-click="mCar_history(infoBox_data)">历史轨迹</span></li>'
							+'</ul>'
						+'</div>'
							
					+'</div>'	
			    +'</div>'
		    +'</div>';
			infoBox_panTo(panPosition,"car",html,clickType);
		}
		
		//平移计算，使弹窗能够完全显示 
//		clickType 11地图车,12左侧车辆列表,2,地图站点
		function infoBox_panTo(panPosition,type,html,clickType){
			
			infoBox.disableAutoPan();
			if(clickType==11){
				infoBox.open(panPosition);
				infoBox.setContent(html);
			}
				console.log(panPosition);
			var point1=	positonTopoint(panPosition,clickType,type);
				console.log(point1);
				
				var marker1= new BMap.Marker(point1);
				if(clickType==12){
					infoBox.open(point1);
					infoBox.setContent(html);
				}
			$timeout(function(){
				$compile($('#mapInfoBox1'))($scope);
				if(clickType!=12){
					map.panTo(point1);
				}
			},10)
		}
		
//		地图偏移位置转换
		function positonTopoint(panPosition,clickType,type){
			var heightPro=(document.documentElement.clientHeight/637).toFixed(2);
			var pixelM=map.pointToPixel(panPosition);
			var translatePo={x:-80,y:-200};
			if(type=="site") translatePo={x:-80,y:-100};
			if(clickType==12) translatePo={x:+80,y:+200};
			if(clickType=="toLeft") translatePo={x:+80,y:0};
			if(clickType=="toRight") translatePo={x:-80,y:0};
			var p=new BMap.Pixel(pixelM.x+(translatePo.x*heightPro),pixelM.y+(translatePo.y*heightPro)); 
			var point1=map.pixelToPoint(p);
			console.log(point1);
			return point1;
		}		
		
		//获取查询搜索框有效数据
		function getValid_vinId(obj){
			var arr=[];
			if(angular.isDefined(obj.licenseNumber)){
				arr[0]="licenseNumber";
				arr[1]=obj.licenseNumber;
			}else if(angular.isDefined(obj.vin)){
				arr[0]="vin";
				arr[1]=obj.vin;
			}else{
				arr[0]="iccid";
				arr[1]=obj.iccid;
			}
			return arr;
		}
		
		//请求单车数据
		function getSingle_car(obj,Tback){
			var params={
				"userId":userId,
			}
			console.log(obj);
			params.carId=obj.carId;
			var post_data={
						"code":10039,
					    "param":JSON.stringify(params)
			}
			console.log(post_data);
		requestService.post(url,post_data).then(
				            function (data) {
				            	console.log(data);
				            	if(data.code==200){
									Tback(data.data);
				            	}else{
				            		Tback(false);
				            	}
				            },function(data){
				            	console.log(data);
				            	Tback(false);
				            	
			})
			 
		}
	
	//站点工具栏,显示隐藏对应的站点
	$scope.clickSiteTp=false;
	
	$scope.showHide_site=function(type){
		if($scope.siteTypeJson[type]){
			delete $scope.siteTypeJson[type];
		}else{
			$scope.siteTypeJson[type]=true;
		}
		console.log(siteMarkersAll);
		siteMarkersArr=[];
		angular.forEach(siteMarkersAll,function(item,index,Array){
			if($scope.siteTypeJson[item.siteType]){
				siteMarkersArr.push(item);
			}
		})
		Ret_siteClus();
	}
	
//	搜索
	$scope.selectChange_vin=function(newModel){
		$scope.selectVin=newModel;
	}
	
	function openConfirmFun(json,callType){
		ngDialog.openCustomConfirm({
			title:json.title,
			plain: false,
		    className: 'ngdialog-theme-default',
		    closeByEscape: true,
		    showClose : true,
		    closeByDocument: true,
		    scope: $scope,
		    width:'4.09rem',
			message:json.message
		}).then(function(){
			callType(true);
			
		},function(){
			callType(false);
			
		})
	}
	
//	车辆搜索后,先做合法性判断
	$scope.mSearch_car=function(){
		//判断空值
		if(angular.isUndefined($scope.mSearchVin)||$scope.mSearchVin==''){
			return;
		}
		var key=$scope.selectVin.key;
		var params={
				"userId":userId,
			}
		params[key]=$scope.mSearchVin || "";
		var post_data={
					"code":10049,
				    "param":JSON.stringify(params)
		}
		console.log(post_data);

		requestService.post(url,post_data).then(
				            function (data) {
				            	console.log(data);
				            	if(data.data){
									var key=$scope.selectVin.key;
									var value=$scope.mSearchVin;
	 								window.open("#/carDetails/"+key+"/"+window.pwdString.encrypt(value)); 
				            	}else{
				            		var json={title:"",message:"未找到任何车辆数据"};
				            		$scope.confirmlist1 = 2;
				            		openConfirmFun(json,function(){
				            			
				            		})
				            	}
				            	
				            },function(error){
				            	
		})
		
	}
		
//故障等级
	var faultLevel_init,faultType_init,repair_siteInit_res;
	cacheService.getDic(faultLevel,"","",function(n){
		faultLevel_init=angular.copy(n);
	});
	//故障类型
	cacheService.getDic(faultType,"","",function(n){
		faultType_init=angular.copy(n);
	});
	//维修站点
	var repair_siteL={
			"params":{
				"types":["6769630307925945"],"userId":userId,"status":1
			}
	}
	var repair_siteInit={
			 "code":10033,
			"param":JSON.stringify(repair_siteL)
	}
	console.log(repair_siteInit);
	requestService.post(url, repair_siteInit).then(
            function (data) {
            	console.log(data);
            	if(data.code==200){
            		repair_siteInit_res=data.data.result;
            	}
            },function(error){
     })

// 点击车辆列表，设置该车视角
	var viewMarker;
	$scope.mGo_carView=function(carObj){
		console.log(carObj);
		if(!carObj.location||(carObj.location&&!carObj.location.longitude)){
//			window.open("#/carDetails/carId"+"/"+carObj.carId);
			
			var mapCenter=map.getCenter();
			console.log(mapCenter);
			addCarInfoBox(carObj,mapCenter,12,true);
			return;
		}
		viewMarker=null;
		angular.forEach(carsMarkerArr,function(item,index,array){
			if(item.typeName=="car"&&item.obj.carId==carObj.carId){
				console.log(item);
				viewMarker=item;
				map.setViewport([viewMarker.getPosition()]);
				setTimeout(function(){
					var event = document.createEvent('HTMLEvents');
					// 3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为  
    				event.initEvent("click", false, true);
    				viewMarker.dispatchEvent(event);
				},100)
			}
		})
	}
	//跳转车辆详情页
	$scope.mGo_carDetails1=function(obj){
		console.log(obj);
		var openUrl="#/carDetails/carId"+"/"+window.pwdString.encrypt(obj.carId);
	 	window.open(openUrl); 
	}
// 跳转历史轨迹
	$scope.mCar_history=function(obj){
		console.log(obj);
	 	window.open("#/history/"+"carId"+"/"+obj.carId); 
	}	
	
//维修预约,新建车辆保修单
	$scope.mPre_repair=function(){
		preRepairInit();
		
		$scope.title = '车辆报修单';
		ngDialog.open({
		        template: 'html/afterService/repairRecord_addNew.html',
		        plain: false,
		        className: 'ngdialog-theme-default ngdialog_addRepai',
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        scope: $scope,
		        width:'4.09rem',
		        controller: ['$scope',function($scope) {
		         	$scope.serviceSave1=function(e,flag){
				         		if(flag){
				         			return;
				         		}
				     			$scope.repairAdd_Type=$scope.repairAdd_Type.dicId;
								$scope.repairAdd_Level=$scope.repairAdd_Level.dicId;			         				
								$scope.repairAdd_site=$scope.repairAdd_site.siteId;
				         		var repairAdd_data1={
				         		"carId":$scope.infoBox_data.carId||"",
							"userId":userId,
							"licenseNumber":$scope.repairAdd_licenseNumber||"",
							"operator":$scope.Add_realName||"",
							"phone":$scope.AdduserName||"",
							"faultDescription":$scope.repairAdd_faultDescription,
							"faultAddress":$scope.repairAdd_address||"",
							"siteId":$scope.repairAdd_site,
							"faultRank":$scope.repairAdd_Level,
							"faultType":$scope.repairAdd_Type
						}
						var repairAdd_data2={
								 "code":10037,
								"param":JSON.stringify(repairAdd_data1)
						}
						console.log(repairAdd_data2);
			         	requestService.post(url, repairAdd_data2).then(
				            function (data) {
				            	console.log(data);
				            	if(data.code==200){
									notifications.showSuccess("新建报修单成功");
									$scope.goBack_m2();
				            	}else{
				            		notifications.showError("新建报修单失败");
				            		$scope.goBack_m2();
				            	}
				            },function(error){
				            	notifications.showError("新建报修单失败");
				            	$scope.goBack_m2();
				     	})
			     		
			     	}
			         	
		         }]
		});
		
	}
	
	//初始化新建保修单基本信息
	function preRepairInit(){
		$scope.repairAdd_licenseNumber=$scope.infoBox_data.licenseNumber||"";
		
//		设置默认故障等级
		$scope.repairAdd_Level={selectedType:$scope.infoBox_data.carStatus,name:$scope.infoBox_data.carStatus,isFor:true};
		$scope.repairAdd_LevelConfig={
			focus:true,
			data:faultLevel_init,
		}		
//		设置默认故障类型
		$scope.repairAdd_Type={selectedType:$scope.infoBox_data.alarmType||"可充电"
,name:$scope.infoBox_data.alarmType,isFor:true};
		$scope.repairAdd_TypeConfig={
			focus:true,
			data:faultType_init,
		}		

//  	设置预约维修站点
		var repairSites=angular.copy(repair_siteInit_res);
		$scope.repairAdd_siteConfig={
			focus:true,
			data:repairSites,
			placeholder:" ",
			defaultData:{name:"",siteId:-1}
		}
		$scope.repairAdd_site={name:"",siteId:-1};
		$scope.Add_realName=angular.copy($scope.loginRealName);
		$scope.AdduserName=angular.copy($scope.loginPhone);
		
	}
	
	$scope.selectChange1 = function(newModel){
		console.log(newModel)
		if(newModel.value==0){
			$scope.titleMseeages = '说明：车辆将在停车后启动失效';
		}else{
			$scope.titleMseeages = '说明：车辆将可以进行启动操作';
		}
	}
//远程控制
	$scope.mCar_longControl=function(){
 		$scope.title=$scope.infoBox_data.licenseNumber||$scope.infoBox_data.vin||$scope.infoBox_data.iccid;
		$scope.CarOrfile_dialog = 1;
		$scope.titleMseeages = '说明：车辆将在停车后启动失效';
	var long_config=[
		{
			"value":0,
			"name":"启动失效",
			"key":"licenseNumber"
		},
		{
			"value":1,
			"name":"启动生效",
			"key":"vin"
		},
	];
	$scope.long_Config={
		focus:true,
		data:long_config
	}
 	ngDialog.open({
		        template: 'html/monitor/mCar_longControll.html',
		        plain: false,
		        className: 'ngdialog-theme-default',
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        scope: $scope,
		        width:'4.09rem',
		        controller: ['$scope',function($scope) {
		        	
		        }]
		});
 	
 }
		
//车辆添加关注与取消关注
	$scope.mCar_care=function(obj){
		$scope.confirmlist1 = 2;		
		cacheService.mCar_care(obj,userId,function(flag){
			if(flag){
						var json={title:"",message:"您已关注成功"};
	            		openConfirmFun(json,function(){})
					}else{
						var json={title:"",message:"您已取消关注"};
	            		openConfirmFun(json,function(){})
					}
		});
	}

//电池监控
	$scope.mCar_batteryLook=function(){	 	
		$scope.battery_title=$scope.infoBox_data.licenseNumber||$scope.infoBox_data.vin||$scope.infoBox_data.iccid;
	 	$scope.monitor_batteryRealLook=1;
	 	
	 	ngDialog.open({
			        template: 'html/monitor/monitor_batteryLook.html',
			        plain: false,
			        className: 'ngdialog-theme-default ngdialog_mBattery',
			        closeByEscape: true,
			        showClose : true,
			        closeByDocument: true,
			        scope: $scope,
			        width:'4.6rem',
			        controller: ['$scope',function($scope) {
			        	
			        }]
			});
		
	}
	
	//实时看板图表
	function batteryReal_echart(obj){
			//第一个图表
			var option = {
			  	backgroundColor: 'rgba(12, 63,71)',
			    title: {
			        text: '',
			        subtext: ''
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:['最新成交价']
			    },
			    grid: {
			    	x:30,
					y: 40,
					y2: 40,
					x2: 40,
				},
			    dataZoom: {
			        show: false,
			        start: 0,
			        end: 1000
			    },
			    xAxis: [
			        {
			            type: 'category',
			            boundaryGap: true,
			            //网格线
				        splitLine:{  
			                    show:false  
			            },
			            axisLabel:{
			            	textStyle:{
			            		color:"#fff",
			            	},
			            	formatter:function(params){
			            		var num1=params.indexOf(" ");
			            		var s1=params.substring(0,num1)+"\n"+params.substring(num1+1);
			            		return s1;
				            }
			            },
			             axisLine:{  
                                lineStyle:{  
                                    color:'#046a70',  
                                    width:1,//这里是为了突出显示加上的  
                                }  
                        },
			            data: obj.xData
			        }
			       
			    ],
			    yAxis: [
			        {
			            type: 'value',
			            scale: true,
			            name: '',
			            axisLine:{  
                                lineStyle:{  
                                    color:'#046a70',  
                                    width:1,//这里是为了突出显示加上的  
                                }  
                        },
                        //网格线
				        splitLine:{  
			                    show:false  
			            },
			        },
			        
			    ],
			    series: [
			        {
			            name:'',
			            type:'line',
			            data:obj.yData
			        }
			    ]
			};	
			
			return option;
		
	}
//	soc
	var soc_config = [
			{
				"value": 1,
				"name": "SOC（电容量）",
			},
			{
				"value": 2,
				"name": "总电流",
			},
			{
				"value": 3,
				"name": "总电压",
			},
		];
		$scope.Soc_Config = {
			focus: true,
			data: soc_config
		}
		
		$scope.socdata = $scope.Soc_Config.data[0];
		
		
		
//		电机数据
		var mointor_config = [{
				"value": 1,
				"name": "驱动电机控制器温度",
			},
			{
				"value": 2,
				"name": "驱动电机温度",
			},
			{
				"value": 3,
				"name": "电机控制器输入电压",
			},
			{
				"value": 4,
				"name": "电机控制器直流母线电流",
			},
			{
				"value": 5,
				"name": "驱动电机转矩",
			},
		];
		$scope.Mointor_Config = {
			focus: true,
			data: mointor_config
		}
		$scope.mointordata = $scope.Mointor_Config.data[0];
		$scope.selectChange_vin2 = function(newModel){
			console.log(newModel);
			$scope.socdata = newModel;
			realtimeLookdata(1);
		}
		$scope.selectChange_vin3 = function(newModel){
			console.log(newModel);
			$scope.mointordata = newModel;
			realtimeLookdata(2);
		}
//	实时看板数据请求
	var app1,app2;
	function realtimeLookdata(type){
		if(type==3){
			app1 = echarts.init(document.getElementById('mReal_echart1'));
			app2 = echarts.init(document.getElementById('mReal_echart2'));
		}
		
	 	var xData1 =yData1= xData2=yData2=[];
	 	
			var params={
				"userId":userId,"carId":$scope.infoBox_data.carId,"batteryStatus":$scope.socdata.value,"motorStatus":$scope.mointordata.value
			}
			console.log(params);
			var post_data={
						"code":10045,
					    "param":JSON.stringify(params)
			}
			console.log(post_data);
			requestService.post(url,post_data).then(
				            function (data) {
				            	console.log(data);
				            	app1.hideLoading(); 
								app2.hideLoading(); //隐藏加载动画
				            	if(data.code==200){
				            		console.log(data);
				            		var real_EchartData=data.data;
				            		
////				            		soc图表
				            		var xData1=real_EchartData.batteryX;
				            		var yData1=real_EchartData.batteryY[0];
////				            		电机数据图表
									var xData2=real_EchartData.motorX;
									var yData2=real_EchartData.motorY[0];
									console.log(real_EchartData.batteryX)
									var optionObj1 = {xData:xData1,yData:yData1}
									var optionObj2 = {xData:xData2,yData:yData2}
									
									if(type==1||type==3){
										
										app1.setOption(batteryReal_echart(optionObj1));
									}
									if(type==2||type==3){
										app2.setOption(batteryReal_echart(optionObj2));
									}
									
				            	}else{
				            		notifications.showError("实时看板查询失败");
				            	}
				            	
				            },function(error){
				            	app1.hideLoading();
								app2.hideLoading();
				            	
			})
	}
	
//实时看板
	$scope.realtimeLook=function(){	
//		console.log($scope.infoBox_data);
	 	$scope.title=$scope.infoBox_data.licenseNumber||$scope.infoBox_data.vin||$scope.infoBox_data.iccid;
	 	$scope.monitor_batteryRealLook=2;
	 	console.log($scope.socdata)
	 	
	 	ngDialog.open({
			        template: 'html/monitor/monitor_batteryLook.html',
			        plain: false,
			        className: 'ngdialog-theme-default ngdialog_mReal',
			        closeByEscape: true,
			        showClose : true,
			        closeByDocument: true,
			        scope: $scope,
			        width:'11.82rem',
		       	    controller: ['$scope',function($scope) {
						$timeout(function(){
							realtimeLookdata(3);
							
						},1000)

			        }]
			});
		
		
	}
//关闭当前弹窗
$scope.goBack_m2=function(id){
		ngDialog.close(id);
}  
$scope.goBack=function(){
			var $target=$("#delete_Cancel");
			console.log($target);
			var id=$target.parents(".ngdialog").attr("id");
			console.log(id);
			ngDialog.close(id);
}
//	点击操作按钮		
	$scope.Moniter_option = function(){
		$scope.confirmlist1 = 1;
		var json={title:"",message:" 您确定要执行远程监控？"};
	    openConfirmFun(json,function(flag){
	    	if(flag){
	    		notifications.showSuccess("操作成功");
	    		ngDialog.close();
	    	}else{
	    			
	    	}
	    })
	}
	
//	离开当前页面
	$scope.$on('$destroy', function() {
			$interval.cancel(refreshTimer);
			$rootScope.Monitor_left=false;
			console.log($scope.siteTypeJson);
			if($cookieStore.get("userId")&&$cookieStore.get("groupId")){
				localStorage["siteTypeJson"]=JSON.stringify($scope.siteTypeJson);
			}
			
	});
	
				
}])