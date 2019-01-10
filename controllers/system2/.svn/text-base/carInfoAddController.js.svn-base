App.controller('carInfoAddController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',"$state","$stateParams",'$rootScope','cacheService',
	function(requestService,cacheService,$cookieStore,$scope, $timeout,$filter,ngDialog,notifications,$state,$stateParams,$rootScope,cacheService) {
		
		var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
		console.log(userId);
		var url = '/product/api/business';
		//请求地址
		document.title = "桑德新能源云平台车辆信息详情";
		$scope.carType_Config1={};
		
		//车辆类型
	var carTypeNum="5953762214233192";
	cacheService.getDic(carTypeNum,"","",function(n){
		console.log(n);
		var carType_list=angular.copy(n);
		
		$scope.carType_Config1={
			focus:true,
			data:carType_list,
		}
		$scope.carType={selectedType:carType_list[0].name,dicId:carType_list[0].dicId,name:carType_list[0].name};
	});
	
	//车牌号licenseNumber,sim卡，vin
	var carUse_config=[
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
		data:carUse_config
	}
	$scope.carInformation={},$scope.carCustomer={}; 
	$scope.carEnergy=[{}],$scope.carDriveMotor=[{}];
	$scope.carBuyTime=false;
//	添加储能装置功能
	$scope.carEnergy_push=function(){
		$scope.carEnergy.push({"vin":$scope.carInformation.vin,"iccid":$scope.carInformation.iccid,'licenseNumber':$scope.carInformation.licenseNumber});
	}
//  删除储能装置功能
	$scope.carEnergy_delete=function($index){
		console.log($index);
		$scope.carEnergy.splice($index,1);
	}
	
//	添加驱动电机
	$scope.carDriveMotor_push=function(){
		$scope.carDriveMotor.push({"vin":$scope.carInformation.vin,"iccid":$scope.carInformation.iccid,'licenseNumber':$scope.carInformation.licenseNumber});
	}
//	删除驱动电机
	$scope.carDriveMotor_delete=function($index){
		$scope.carDriveMotor.splice($index,1);
	}
	//车辆类型
	$scope.selectCarType=function(newModel){
		$scope.carType=newModel;
	}
	//车辆使用方式
	$scope.selectCarUse=function(newModel){
		$scope.carUse=newModel;
	}
	//新建车辆信息
	$scope.carInfo_addSave=function(flag){
		console.log($scope.carType);
		console.log($scope.carUse);
		//vin,iccid,licenseNumber 数据绑定
		$scope.carCustomer.vin=$scope.carEnergy[0].vin=$scope.carDriveMotor[0].vin=$scope.carInformation.vin;
		$scope.carCustomer.iccid=$scope.carEnergy[0].iccid=$scope.carDriveMotor[0].iccid=$scope.carInformation.iccid;
		$scope.carCustomer.licenseNumber=$scope.carEnergy[0].licenseNumber=$scope.carDriveMotor[0].licenseNumber=$scope.carInformation.licenseNumber;
//		车辆信息
		$scope.carInformation.carType=$scope.carType.dicId;
		
		//车主信息
		$scope.carCustomer.useWay=$scope.carUse.value;
		var val=$("#startTime").val();
		if(val==""){
			$scope.carBuyTime=true;
			return;
		}else{
			$scope.carBuyTime=false;
			$scope.carCustomer.buyingTime=$("#startTime").val();
		}
		
		console.log($scope.carEnergy);
		console.log($scope.carDriveMotor);
		
		var param={
			    	"userId":userId,
			    	"carInformation":$scope.carInformation,			    					"carCustomer":$scope.carCustomer,
			    	"carEnergy":$scope.carEnergy,
			    	"carDriveMotor":$scope.carDriveMotor
			 }
			var post_InitTdata={
				"code":10013,
			    "param":JSON.stringify(param)
			}
			console.log(post_InitTdata);
			if(flag){
				return;
			}
			requestService.post(url, post_InitTdata).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
				            notifications.showSuccess("新建车辆信息成功");
							window.opener.funInA_carRefresh('add');
				            $timeout(function(){
				            	window.close();
				            },2000)
		            	}else{
		            		notifications.showError("新建车辆信息失败");
		            	}
		            },function(error){
		            		notifications.showError("新建车辆信息失败");
		     })
				
	}
//	点击关闭弹窗按钮
	$scope.closeBlank = function(){
		window.close();
	}

		
}])

