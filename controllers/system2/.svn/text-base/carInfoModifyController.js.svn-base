App.controller('carInfoModifyController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',"$state","$stateParams",'$rootScope','cacheService',
	function(requestService,cacheService,$cookieStore,$scope, $timeout,$filter,ngDialog,notifications,$state,$stateParams,$rootScope,cacheService) {
		
		var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	 	$scope.carUse_Config1={},$scope.carType_Config1={};
	 	$scope.carUseType;
		$scope.type=$stateParams.type;
		$scope.carId=$stateParams.carId;
		$scope.carId =window.pwdString.decrypt($scope.carId);
		
		console.log($scope.type);
		console.log($scope.carId);
		
		if($scope.type=='modify'){
			$scope.modifyT=true;
			$scope.lookT=false;
		}
		if($scope.type=='look'){
			$scope.modifyT=false;
			$scope.lookT=true;
		}
		$scope.goModify=function(){
			$scope.modifyT=true;
			$scope.lookT=false;
		}
		
		var url = '/product/api/business';
		//请求地址
		document.title = "桑德新能源云平台车辆信息详情";
		
		var carType_list;
		
		//车辆类型
		var carTypeNum="5953762214233192";
	
	$scope.carInformation={id:$scope.carId},$scope.carCustomer={carId:$scope.carId}; 
	$scope.carEnergy=[{carId:$scope.carId}],$scope.carDriveMotor=[{carId:$scope.carId}];
	$scope.carBuyTime=false;
//	添加储能装置功能
	$scope.carEnergy_push=function(){
		$scope.carEnergy.push({"carId":$scope.carId,"vin":$scope.carInformation.vin,"iccid":$scope.carInformation.iccid,'licenseNumber':$scope.carInformation.licenseNumber});
		console.log($scope.carEnergy);
	}
//  删除储能装置功能
	$scope.carEnergy_delete=function($index){
		console.log($index);
		$scope.carEnergy.splice($index,1);
	}
//	添加驱动电机
	$scope.carDriveMotor_push=function(){
		$scope.carDriveMotor.push({"carId":$scope.carId,"vin":$scope.carInformation.vin,"iccid":$scope.carInformation.iccid,'licenseNumber':$scope.carInformation.licenseNumber});
		console.log($scope.carDriveMotor);
	}
//	删除驱动电机
	$scope.carDriveMotor_delete=function($index){
		$scope.carDriveMotor.splice($index,1);
	}
		
//		获取单辆车详细数据
		$scope.car_getMessage=function(){
				var repair_deleteData1={
					"userId":userId,"id":$scope.carId
				}
				var repair_deleteData2={
						 "code":10030,
						"param":JSON.stringify(repair_deleteData1)
				}
				console.log(repair_deleteData2);
				requestService.post(url, repair_deleteData2).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
		            		var data=data.data;
		            		console.log(data);
		            		$scope.carCustomer=data.CarCustomer;
		            		$scope.carInformation=data.CarInformation;
		            		$scope.carEnergy=data.CarEnergy;
							$scope.carDriveMotor=data.CarDriveMotor;
							
							//车辆类型
							var carType=$scope.carInformation.carType;
							var carTypeName=$scope.carInformation.carTypeName;
							//初始化车辆类型
							init_carType(carTypeName,carType);
							//购买时间
							var buyingTime=$scope.carCustomer.buyingTime;
							$scope.buyingTime=$filter("date")(buyingTime,"yyyy-MM-dd");
							console.log($scope.buyingTime);
							
							//初始化车辆使用方式
							$scope.useWay=$scope.carCustomer.useWay;
							init_useWay($scope.useWay);
							
		            	}
		            },function(error){
		            	notifications.showError("查询不到数据");
		     })
	}
		
	$scope.car_getMessage();	
		
	//初始化车辆类型	
		function init_carType(carTypeName,carType){
			cacheService.getDic(carTypeNum,"","",function(n){
				console.log(n);
				carType_list=angular.copy(n);
				$scope.carType_Config1={
					focus:true,
					data:carType_list,
				}
				console.log($scope.carType_Config1);
				$scope.carType={selectedType:carTypeName,dicId:carType};
			});
			
		}
	
	//初始化车辆使用方式
	function init_useWay(useWay){
			var useWayName;
			if(useWay==1){
				 useWayName="自购车";
			}else{
				 useWayName="租赁车";
				 useWay=2;
			}
			$scope.useWayName=useWayName;
			//车牌号licenseNumber,sim卡，vin
			var carUse_config3=[
				{
					"value":1,
					"name":"自购车",
				},
				{
					"value":2,
					"name":"租赁车",
				}
			];
			$scope.carUse_Config1={
				focus:true,
				data:carUse_config3,
			}
			$scope.carUseType={"selectedType":useWayName,"value":useWay};
			console.log($scope.carUseType);
	}
	//车辆类型
	$scope.selectCarType=function(newModel){
		$scope.carType=newModel;
	}
	//车辆使用方式
	$scope.selectCarUse=function(newModel){
		$scope.carUseType=newModel;
	}
	
	//保存
	$scope.RepairModify_save=function(flag){
		if(flag){
			$scope.alreadyBt = true;
			return;
		}
		console.log($scope.carType);
		//vin,iccid,licenseNumber 数据绑定
		$scope.carCustomer.vin=$scope.carEnergy[0].vin=$scope.carDriveMotor[0].vin=$scope.carInformation.vin;
		$scope.carCustomer.iccid=$scope.carEnergy[0].iccid=$scope.carDriveMotor[0].iccid=$scope.carInformation.iccid;
		$scope.carCustomer.licenseNumber=$scope.carEnergy[0].licenseNumber=$scope.carDriveMotor[0].licenseNumber=$scope.carInformation.licenseNumber;
//		车辆信息
		$scope.carInformation.carType=$scope.carType.dicId;
		
		//车主信息
		console.log($scope.carUseType);
		$scope.carCustomer.useWay=$scope.carUseType.value;
		var buyTime=$("#buyingTime2").val();
		if(buyTime==""){
			$scope.carBuyTime=true;
			return;
		}else{
			$scope.carBuyTime=false;
			$scope.carCustomer.buyingTime=buyTime;
		}
		console.log($scope.carCustomer);
		console.log($scope.carEnergy);
		console.log($scope.carDriveMotor);
		
		var param={
			    	"userId":userId,
			    	"carInformation":$scope.carInformation,			    					"carCustomer":$scope.carCustomer,			    	
			    	"carEnergy":$scope.carEnergy,
			    	"carCustomer":$scope.carCustomer,
			    	"carDriveMotor":$scope.carDriveMotor
			 }
		
			var post_InitTdata={
				"code":10013,
			    "param":JSON.stringify(param)
			}
			console.log(post_InitTdata);
			requestService.post(url, post_InitTdata).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
				            notifications.showSuccess("修改车辆信息成功");
				            window.opener.funInA_carRefresh('modify');
				            $timeout(function(){
				            	window.close();
				            },2000)
		            	}else{
		            		notifications.showError("修改车辆信息失败");
		            	}
		            },function(error){
		            		notifications.showError("修改车辆信息失败");
		     })
		
	}
	
	//取消，关闭当前页面
	$scope.closeBlank=function(){
		window.close();		
	}
	//	取消按钮
	$scope.closeD = function(){
		window.close();
	}
		
	}])

