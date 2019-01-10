App.controller('chargingStaticController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory','$filter','pagerService','echartService','notifications','ngDialog',
	function(requestService,cacheService,$cookieStore, $scope, $timeout, lgServerDataProviderFactory,$filter,pagerService,echartService,notifications,ngDialog) {
//		接口地址
		var url1 = '/product/api/business';
		var orgId=$cookieStore.get("groupId");
		var userId=$cookieStore.get("userId");
		var map;
		//车牌号licenseNumber,sim卡，vin
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
				"name":"SIM卡ICCID号",
				"key":"iccid"
			},
	];
	$scope.vin_Config={
		focus:true,
		data:vin_config
	}
	
	var openConfirmFun=function(json){
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
	
	//初始化，判断是否查询过
	var local_charge=localStorage.getItem("local_charge");
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
	$scope.Chargingcale_search = function(){
		//进行空值判断
			console.log($scope.selectVin_value);
			if(angular.isUndefined($scope.selectVin_value) || $scope.selectVin_value==""){
				var json={
					type:2,
					message:'请输入要查询的车辆信息'
				}
				openConfirmFun(json)
			}else{
				//存储该车信息
				var name=$scope.selectVin.name;
				var key=$scope.selectVin.key;
				var value=$scope.selectVin_value;
				//存储车的信息
				var localStorageCar = [key,value,name];
				localStorage.setItem("local_charge", JSON.stringify(localStorageCar)); 
				//展示列表
				tableinital(false);
			}
	}
	
//	table初始化
	function tableinital(flag){
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
		
			var param = {
			 "userId":userId,
			 "startTime":$scope.startTime1,
			 "endTime":$scope.endTime1
		}
		var key=$scope.selectVin.key;
		var value=$scope.selectVin_value;
		param[key]=value;
		console.log(param);
		// 配置分页基本参数
				$scope.myPagelist = {
					pageNo: 1,
					pageSize: 1000,
				};
		var post_searchData = {
						"pageNo": $scope.myPagelist.pageNo,
						"pageSize": $scope.myPagelist.pageSize,
						"params": param
					};
		
		var paramsdata = {
			"code":10051,
			"param":JSON.stringify(post_searchData)
		}
	//	请求数据
			requestService.post(url1, paramsdata).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){	
		            		$scope.charginglist = data.data.result;
		            		//地图上标点
							addMarker($scope.charginglist);
		            	}else{
							$scope.charginglist = [];
							map.clearOverlays();
		            	}
		            	
		            },function(error){
		            	$scope.charginglist = [];
						map.clearOverlays();
		     })
	}
	//未找到该车数据
	function findNot_carData(){
		var json={
			type:2,
			message:'未找到该车的数据'
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
	
//	table点击效果
	$scope.activeIndex1=-1;
	$scope.changeIndex1=function(index){
		$scope.activeIndex1=index;
	}
	map = new BMap.Map('ChargingMap', {enableMapClick: false});
	
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 10);  // 初始化地图,设置中心点坐标和地图级别
	map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
	map.setMapStyle(cacheService.getMapStyle()); // 设置地图主题样式
	var mapControl = new MapControl({
		map: map,
	})
	mapControl.initLocation();//浏览器定位
	mapControl.addZoomControl(); //添加缩放组件	
	var siteIcons=[new BMap.Icon("images/img1/marker_serviceSite.png", new BMap.Size(43,61),{imageSize:new BMap.Size(28,39.7)})]	
	function addMarker(data){
		map.clearOverlays();
		for(var i=0;i<data.length;i++){
			var every=data[i];
			var longitude=every.lng;
			var latitude=every.lat;
			var point=new BMap.Point(longitude,latitude);
			var marker=new BMap.Marker(point);
//			marker.setIcon(siteIcons[0]);
			var  label = new BMap.Label('<div style="color:white;">'+(i+1)+'</div>', {offset: new BMap.Size(-1, -1)});
			label.setStyle(cacheService.getMaplabel_sty());
			marker.setLabel(label);
			map.addOverlay(marker);
		}
		
	}
	
	
	
	
	
	
	
	
			
}]);