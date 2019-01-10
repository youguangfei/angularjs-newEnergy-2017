App.controller('RepairModifyController', [
	'requestService', 'cacheService', '$cookieStore', '$scope', '$timeout', '$filter', 'ngDialog', 'notifications', "$state", "$stateParams",'$interval',"$rootScope","$q",
	function(requestService, cacheService, $cookieStore, $scope, $timeout, $filter, ngDialog, notifications, $state, $stateParams,$interval,$rootScope,$q) {
		$scope.closeBlank = function() {
			window.close();
		}		
		
		var url = '/product/api/business';
		var groupid = $cookieStore.get("groupId"),
			userId = $cookieStore.get("userId"),
			userName = $cookieStore.get("name");
		$scope.selectConfigRank = {}, $scope.selectConfigType = {}, $scope.selectCfg_Modifystatus={},$scope.selectConfigSite={},$scope.selectConfigRealSite={};
		$scope.starTime,$scope.endTime,$scope.typeIn;
		$scope.typeIn=$stateParams.typeIn;
		
//		判断当前页面进入状态
		if($scope.typeIn=="look"){
			$scope.Repair_type=1;
			$scope.inpudisabled = true;
		}else{
			$scope.Repair_type=2;
			$scope.inpudisabled = false;
		}
		
		//故障等级
		var faultRankR,faultTypeR,faultSiteR;
		$scope.faultRank = faultRank;
		cacheService.getDic($scope.faultRank, "", "", function(n) {
			console.log(n);
			faultRankR=angular.copy(n);
		});
		//故障类型
		$scope.faultType = faultType //故障类型
		cacheService.getDic($scope.faultType, "", "", function(n) {
			console.log(n);
			faultTypeR=angular.copy(n);
		});
		$scope.faultSites_init=function(){
				$scope.repair_siteList={};
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
			            		var result=data.data.result;
			            		faultSiteR=angular.copy(result);
			            	}
			            },function(error){
			     })
		}
		$scope.faultSites_init();
		
		//报修单状态
//	selectCfg_Modifystatus
	var status_config=[
		{
			"value":0,
			"name":"待处理",
		},
		{
			"value":1,
			"name":"处理中",
		},
		{
			"value":2,
			"name":"已完成",
		},
	];
		
		$scope.workformCode = $stateParams.workformCode;
		if($scope.workformCode.substring(0,2)!="WX"){
			$scope.workformCode =window.pwdString.decrypt($scope.workformCode);
		}
//		获取报修单详情
		var getSingleMsg=function(){
			
			var result;
			var defer=$q.defer();
			var repair_siteL1 = {
				"params": {
					"userId": userId,
					"is_single": 1,
					"workformCode": $scope.workformCode
				}
			}
			var repair_siteInit1 = {
				"code": 10036,
				"param": JSON.stringify(repair_siteL1)
			}
			
			requestService.post(url, repair_siteInit1).then(
				function(data) {
					console.log(data);
					if(data.code==200){
						result=data.data.result[0];
						console.log(result);
						$('#startTime1').val(result.starTime);
						$('#endTime1').val(result.endTime);
						defer.resolve(result);
						
					}
			},
			function(error) {})
			return defer.promise;
		}
		
		$scope.pageInit=function(){

			$q.when(getSingleMsg()).then(function(result){
				initResult(result);
			},function(){},function(){})
			
		}
		$scope.pageInit();
		
		function Init_selects(resultJson){
			//初始化故障类型
			$scope.faultType_init(resultJson);
			//初始化故障等级
			$scope.faultRank_init(resultJson);
			//订单状态
			$scope.faultStatus_init(resultJson);
			//预约维修站点,实际维修站点
			$scope.faultSite_init(resultJson);
		}
		
		function initResult(result){
			var resultJson=result;
				$scope.postModifydata =angular.copy(resultJson);
				Init_selects(resultJson);
				
				//报修开始时间
				$scope.creaTime=resultJson.creaTime;
				
				//初始化故障地点,故障描述，电话,预约人，维修人
	//			licenseNumber
				$scope.workformCode=resultJson.workformCode;
				$scope.licenseNumber=resultJson.licenseNumber;
				
				$scope.faultAddress=resultJson.faultAddress;
				$scope.faultDescription=resultJson.faultDescription||"";
				$scope.operator=resultJson.operator;
				$scope.maintainer=resultJson.maintainer;
				$scope.phone=resultJson.phone;
				$scope.maintainer=resultJson.maintainer||"";
				//维修方案,备注
				$scope.program=resultJson.program;
				$scope.remark=resultJson.remark;
		}
		
		
		//初始化故障类型
		$scope.faultType_init=function(resultJson){
			var fType = $interval(function(){
				if(angular.isDefined(faultTypeR)&&(faultTypeR!=null)){
					$scope.selectConfigType = {
						focus: true,
						data: faultTypeR,
						placeholder: "全部"
					}
					if(angular.isDefined(resultJson.faulType)&&(resultJson.faulType!=null)){
						$scope.selectedType={"selectedType":resultJson.faulType,"faultType":resultJson.typeId};
					}else{
						$scope.selectedType={"selectedType":faultTypeR[0].name,"faultType":faultTypeR[0].dicId};
					}
					
					 $interval.cancel(fType);
				}
				
			}, 50);
		}
		//初始化故障等级
		$scope.faultRank_init=function(resultJson){
			var fRank1 = $interval(function(){
				if(angular.isDefined(faultRankR)&&(faultRankR!=null)){
					$scope.selectConfigRank = {
						focus: true,
						data: faultRankR,
						placeholder: "全部"
					}
					if(angular.isDefined(resultJson.faultRank)&&(resultJson.faultRank!=null)){
						$scope.selectRank={"selectedType":resultJson.faultRank,"dicId":resultJson.rankId};
					}else{
						$scope.selectRank={"selectedType":faultRankR[0].name,"dicId":faultRankR[0].dicId};
					}
					 $interval.cancel(fRank1);
				}
				
			}, 50);
		}
		//报修单号初始化
		$scope.faultStatus_init=function(resultJson){
			$scope.selectCfg_Modifystatus={
				focus:true,
				data:status_config
			}
			$scope.Modifystatus={"selectedType":statusToName(resultJson.status),"value":resultJson.status};
		}
		//预约维修站点初始化
		$scope.faultSite_init=function(resultJson){
			var fSite1 = $interval(function(){
				if(angular.isDefined(faultSiteR)&&(faultSiteR!=null)){
					console.log(faultSiteR);
					$scope.selectConfigSite = {
						focus: true,
						data: faultSiteR,
						placeholder: " "
					}
					console.log(resultJson);
					if(angular.isDefined(resultJson.siteName)&&resultJson.siteName!=null){
						$scope.selectSite={"selectedType":resultJson.siteName,"siteId":resultJson.siteId};
					}else{
						var siteNull=angular.copy(faultSiteR);
	            		//不选择预约维修站点时，siteId传 -1
	            		siteNull.unshift({name:"",siteId:-1});
						$scope.selectSite={"selectedType":siteNull[0].name,"siteId":siteNull[0].siteId};
					}
					
					$scope.selectConfigRealSite = {
						focus: true,
						data: faultSiteR,
						placeholder: " "
					}
					if(angular.isDefined(resultJson.realSiteName)&&resultJson.realSiteName!=null){
						$scope.selectRealSite={"selectedType":resultJson.realSiteName,"siteId":resultJson.realSiteId};
					}else{
						var siteRealNull=angular.copy(faultSiteR);
	            		//不选择预约维修站点时，siteId传 -1
	            		siteRealNull.unshift({name:"",siteId:-1});
						$scope.selectRealSite={"selectedType":siteRealNull[0].name,"siteId":siteRealNull[0].siteId};
					}
					 $interval.cancel(fSite1);
				}
				
			}, 50);
		}
		
		//修改保修单 保存
		$scope.RepairModify_save=function(flag){
			if(flag){
				return;
			}
//			$scope.selectRank  $scope.selectedType siteId,realSiteId,Modifystatus
			$scope.creaTime=$("#creaTime").val();
			$scope.starTime=$("#startTime1").val();
			$scope.endTime=$("#endTime1").val();
			
			var params={
					"workformCode":$scope.workformCode,
					"userId":userId,
					"licenseNumber":$scope.licenseNumber,
					"operator":$scope.operator,
					"phone":$scope.phone,
					"faultDescription":$scope.faultDescription,
					"faultAddress":$scope.faultAddress,
					"faultRank":$scope.selectRank.dicId,
					"faultType":$scope.selectedType.dicId,
					"status":$scope.Modifystatus.value,
					"creaTime":$scope.creaTime,
					"starTime":$scope.starTime||"",
					"endTime":$scope.endTime||"",
					"siteId":$scope.selectSite.siteId,
					"realSiteId":$scope.selectRealSite.siteId,
					"maintainer":$scope.maintainer,
					"program":$scope.program,
					"remark":$scope.remark
		      	}
			
			var postModify = {
				"code":10037,
				"param":JSON.stringify(params)
			}
			console.log(postModify);
			requestService.post(url, postModify).then(
			            function (data) {
			            	console.log(data)
			            	if(data.code==200){
			            		console.log(data)
								notifications.showSuccess("修改报修单成功");
								localStorage["repair_state"]="11";
								if($scope.typeIn=="modify"){
									$timeout(function(){
										window.close();
									},2000)
								}
								if($scope.typeIn=="look"){
									$timeout(function(){
										$scope.Repair_modifySave();
										$scope.pageInit();
									},1500)
								}
								
			           }else{
				            	notifications.showError("修改报修单失败");
			            	}
			            	
			            },function(error){
				            notifications.showError("修改报修单失败");
			            	
			 })
		}
		
		function statusToName(status){
			if(status==0){
				return "待处理";
			}else if(status==1){
				return "处理中";
			}else if(status==2){
				return "已完成";
			}else{
				return "待处理";
			}
		}

//	修改报修单按钮
	$scope.Repair_modifyBtn = function(){
			$scope.Repair_type=2;
			$scope.inpudisabled = false;
	}
//	修改成功后,切回 查看状态
	$scope.Repair_modifySave= function(){
//			按钮状态
			$scope.Repair_type=1;
			$scope.inpudisabled = true;
	}
	var openConfirmFun=function(json,callType){
		$scope.confirmlist1 = 1;
		ngDialog.openCustomConfirm({
			title:'删除',
			plain: false,
		    className: 'ngdialog-theme-default',
		    closeByEscape: true,
		    showClose : true,
		    closeByDocument: true,
		    scope: $scope,
		    width:'4.09rem',
			message:"确定删除该记录?"
		}).then(function(){
			callType(true);
			
		},function(){
			callType(false);
			
		})
	}
	 
	//查看模式，删除保修单
	$scope.Repair_lookDelete=function(){
		$scope.confirm_dialog1 = true;
		$scope.confirm_dialog2 = false;
		openConfirmFun("",function(data){
			if(data){
				$scope.repair_ltrueDelete($scope.workformCode);
			}else{
				console.log("取消删除");
			}
			
		})
	}
	$scope.repair_ltrueDelete=function(){
		var repair_deleteData1={
					"workformCode":$scope.workformCode,"userId":userId
				}
		var repair_deleteData2={
				 "code":10038,
				"param":JSON.stringify(repair_deleteData1)
		}
			console.log(repair_deleteData2);
		requestService.post(url, repair_deleteData2).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==200){
	            		notifications.showSuccess("删除成功");
						localStorage["repair_state"]="11";
						//关闭当前弹窗
	            		$timeout(function(){
	            			window.close();
	            		},2000)
	            	}
	            },function(error){
	            	notifications.showError("删除失败");
	     })
		
	}
		$scope.goBack=function(id){
//		$scope.ngDialogId
		ngDialog.close(id);
	}
	$scope.close_deleteDialog=function(){
		$scope.deleteType=false;
	}
		




	}
])