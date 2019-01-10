App.controller('repairRecordController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',"$state","$rootScope","$interval",'$q',
	function(requestService,cacheService,$cookieStore, $scope, $timeout,$filter,ngDialog,notifications,$state,$rootScope,$interval,$q) {
	var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	 	$rootScope.Monitor_left=false;
	$scope.has_search=false,$scope.rankId,$scope.typeId,$scope.siteName="";	
//	 报修人
	 $scope.Add_realName = angular.copy($cookieStore.get("realName"))
	 console.log($scope.Add_realName);
	
//	 报修人电话
	 $scope.AdduserName = angular.copy($scope.user.name);
	 console.log($scope.AdduserName)
	var url = '/product/api/business';
	//请求地址
	var req_url="http://192.168.231.166:8080/product/api/business";

	var orgId=$cookieStore.get("groupId");
	//table tr点击选中效果
	$scope.activeIndex=-1;
	$scope.changeIndex=function(index){
		$scope.activeIndex=index;
	}
	
	//初始化变量名,故障类型，故障等级
	$scope.faultType;
	$scope.faultLevel;
	$scope.selectConfig1;
	
	//故障等级
	var faultLevel_init;
	$scope.faultLevel_Config1={};
	cacheService.getDic(faultLevel,"","",function(n){
		console.log(n);
		faultLevel_init=angular.copy(n);
		faultLevel_init.unshift({name:"全部",dicId:0});
		
		$scope.faultLevel_Config1={
			focus:true,
			data:faultLevel_init,
		}
		$scope.selectLevel={"selectedType":"全部",dicId:0}
		
		$scope.repairAdd_LevelConfig={
			focus:true,
			data:angular.copy(n),
			placeholder:"全部"
		}
	});
	
	//故障类型
	var faultType_init;
	$scope.faultType_Config1={};
	cacheService.getDic(faultType,"","",function(n){
		console.log(n);
		faultType_init=angular.copy(n);
		faultType_init.unshift({name:"全部",dicId:0});
		
		$scope.faultType_Config1={
			focus:true,
			data:faultType_init,
			placeholder:"全部"
		}
		$scope.serviceType={"selectedType":"全部",dicId:0}
		
		$scope.repairAdd_TypeConfig={
			focus:true,
			data:angular.copy(n),
//			placeholder:'';
		}
		
	});
	
	//异步测试
	var pmsFlag=false;
	function promise11(){
		return $q(function(resolve,reject){
			$timeout(function(){
				if(pmsFlag){
					resolve("success 11");
				}else{
					reject("error 22");
				}
			},1000)
		})
	}
	
	promise11().then(function(res){
//		console.log(res);
	}).catch(function(error){
//		console.log(error);
	})
	
	
	var getFaultL=function(){
		var defer1=$q.defer();
		cacheService.getDic(faultLevel,"","",function(n){
			console.log(n);
			defer1.resolve(n);
		});
		return defer1.promise;
	}
	
	var getFaultT=function(){
		var defer2=$q.defer();
		cacheService.getDic(faultType,"","",function(n){
			console.log(n);
			defer2.resolve(n);
		});
		return defer2.promise;
	}
	//异步执行
	$q.all([getFaultL(),getFaultT()]).then(function(data){
		console.log(data);
	})
	
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
	$scope.selectVin={
			"value":0,
			"name":"车牌号",
			"key":"licenseNumber",
			"selectedType":"车牌号",
	};
	$scope.vin_Config={
		focus:true,
		data:vin_config
	}
	
	//维修站点
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
	requestService.post(url, repair_siteInit).then(
            function (data) {
            	console.log(data);
            	if(data.code==200){
            		var result=data.data.result;
            		var result2=angular.copy(result);
            		result2.unshift({name:"全部",siteId:0});
            		
            		$scope.repair_siteList={
						focus:true,
						data:result2,
						placeholder:"全部"
					}
            		
            		var addResult=angular.copy(result);
            		//不选择预约维修站点时，siteId传 -1
            		$scope.repairAdd_siteConfig={
						focus:true,
						data:addResult,
						placeholder:" ",
						defaultData:{name:"",siteId:-1}
					}
            	}
            },function(error){
     })
	
	//table数据初始化
	var post_InitT;
	var initWatch;
	var initTableData=function(){
			var reGetProducts = function(){
				post_InitT={
				    "pageNo":$scope.myPagelist.pageNo,
					"pageSize":$scope.myPagelist.pageSize,
					"params":{
						"userId":userId,
						"is_single":0,
						"rankId":$scope.rankId||0,
						"typeId":$scope.typeId||0,
						"siteName":$scope.siteName||"",
						"operator":$scope.operator||"",
						"maintainer":$scope.maintainer||"",
						"starTime":$scope.startTime1||"",
						"endTime":$scope.endTime1 || ""
					}																																																	
			    };	    
			     
			    post_InitT.params[$scope.selectVin.key]=$scope.selectVin_value||"";
				var post_InitTdata={
					"code":10036,
				    "param":JSON.stringify(post_InitT)
				}
				requestService.post(url, post_InitTdata).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.recordList = data.data.result;
								$scope.myPagelist.totalCount = data.data.totalCount;
		     					$scope.myPagelist.totalPages = data.data.totalPages;
			            	}
			            },function(error){
			     })
			}
			// 配置分页基本参数
	        $scope.myPagelist = {
	            pageNo: 1,
	            pageSize: 10,
	        };
	        // 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
	      initWatch=$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts);
		}
	initTableData();
	
	//刷新当前页面
	localStorage["repair_state"]="0";
	var refresh = $interval(function(){
		if(localStorage["repair_state"]==11){
			console.log("shua xin");
			refresh_list(false);
			localStorage["repair_state"]="0";
		}
	}, 2000);
	
	//跳转报修单页面，查看模式和修改模式
	$scope.repairLook_open=function(workformCode,type){
		console.log(workformCode);
		console.log(type);
		var openUrl="#/Repair_LookOpen/"+window.pwdString.encrypt(workformCode)+"/"+type;
		console.log(openUrl);
		window.open(openUrl);
		
	}
	
	//	input框禁用状态
	$scope.inpudisabled = true;
//修改保修单,删除保修单,保存保修单的初始状态
	$scope.Repair_modifybtn1 = true;
	$scope.Repair_deletebtn1 = true;
	$scope.Repair_save1 = false;
//内容切换状态
	$scope.Repair_modifycontnet1 = true;
	$scope.Repair_modifycontnet2 = false;

//	下拉select选择及改变
//	改变故障等级
	$scope.selectChange1 = function(newModel){
		$scope.selectLevel = newModel;
		console.log(newModel);
		$scope.rankId=newModel.dicId;
		selectChangeRet();
	}
	
//  改变故障类型
	$scope.selectChangeType = function(newModel){
		$scope.serviceType = newModel;
		$scope.typeId=newModel.dicId;
		console.log(newModel);
		selectChangeRet();
	}
	//预约维修站点实时检索
	$scope.selectNewname=function(newModel){
		console.log(newModel);
		$scope.searchName=newModel;
		$scope.siteName=newModel?newModel.likeName ||"":"";
		console.log($scope.siteName);
	}
	//下拉改变后，刷新列表
	function selectChangeRet(){
		changeDay("select");
		refresh_list(true);
	}
	
//	刷新列表
	function refresh_list(flag){
		if(flag){
			$scope.myPagelist.pageNo=1;
		}
		initTableData();
	}
//	查询功能
	var post_searchData;
	$scope.operator,$scope.maintainer;
	$scope.startTime1,$scope.endTime1;
	var getDefinedId=function(Textdata){
		var Textdata=Textdata?(Textdata.dicId ? Textdata.dicId : 0):0;
		return Textdata;
	}
	var getDefinedSiteId=function(Textdata){
		var Textdata=Textdata?(Textdata.siteId ? Textdata.siteId : 0):0;
		return Textdata;
	}
	$scope.searchSite_list = {};
//	实时检索功能
	$scope.search_name=function(name){
		var param={
			userId:userId,
			name:name,
			types:[6769630307925945]
	     };
		var post_searchTdata={
			"code":10050,
		    "param":JSON.stringify(param)
		}
		console.log(post_searchTdata);
		requestService.post(url, post_searchTdata).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==200){
	            		$scope.searchSite_list=data.data;
	            	}else{
	            		$scope.searchSite_list={};
	            	}
		        },function(error){
		        	console.log(error);
		})
	}
//	查询按钮
	$scope.repair_search=function(){
		$scope.has_search=true;
		if(initWatch){
			initWatch();
		}
		$scope.siteName=$("#unitName").val();	
		changeDay("search");
		
		$scope.rankId=getDefinedId($scope.selectLevel);
		$scope.typeId=getDefinedId($scope.serviceType);
		$scope.siteId=getDefinedSiteId($scope.searchName);
		
		initTableData();
	}
	
	function changeDay(type){
		$scope.startTime1=$("#startTime").val();
		$scope.endTime1=$("#endTime").val();
		//	日期判断
		var nowDay=$filter("date")(new Date(),'yyyy-MM-dd');
		var timeS2=$scope.startTime1&&$scope.endTime1;
		if(!timeS2){
			//至少有一个为空
			var timeNoKong=$scope.startTime1||$scope.endTime1;
			if(type=="search" || (type=="select"&&$scope.has_search)){
				timeNoKong=timeNoKong||nowDay;
			}
			$scope.startTime1=angular.copy(timeNoKong);
			$scope.endTime1=angular.copy(timeNoKong);
			$("#startTime").val($scope.startTime1);
			$("#endTime").val($scope.endTime1);
		}
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
	
	
//修改按钮
	$scope.closeBlank=function(){
		window.close();
	}
	//新建保修单
	$scope.Repair_AddOrder = function(){
		console.log("新建");
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
		         
		         //新建报修单，保存
			    $scope.serviceSave1=function(e,flag){
			    	if(flag){
			    		return;	
			    	}
			    console.log($scope.repairAdd_Type);
			  	$scope.repairAdd_Type=getDefinedId($scope.repairAdd_Type);
				$scope.repairAdd_Level=getDefinedId($scope.repairAdd_Level);			         	
				$scope.repairAdd_site=getDefinedSiteId($scope.repairAdd_site);
			         		console.log($scope.repairAdd_Type);
				         	
			         		var repairAdd_data1={
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
									initTableData();
									$scope.goBack();
				            	}else{
				            		notifications.showError("新建保修单失败");
				            		$scope.goBack();
				            	}
				            },function(error){
				            	notifications.showError("新建报修单失败");
				            	$scope.goBack();
				     	})
		         		
		         	}
			         	
		         }]
		});
		
	}
	
	//删除按钮
	$scope.managementDelete = function(i){
		console.log(i);
		$scope.workformCode=i.workformCode;
		console.log($scope.workformCode);
//		$scope.deleteType=true;
		$scope.confirm_dialog1 = true;
		$scope.confirm_dialog2 = false;
		openConfirmFun("",function(data){
			if(data){
				$scope.repair_trueDelete($scope.workformCode);
			}else{
				console.log("取消");
			}
			
		})
		
	}
	
	$scope.repair_trueDelete=function(workformCode){
		
				var repair_deleteData1={
					"workformCode":workformCode,"userId":userId
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
		            		initTableData();
		            	}
		            },function(error){
		            	notifications.showError("删除失败");
		     })
	}
	
	$scope.goBack=function(id){
//		$scope.ngDialogId
		ngDialog.close(id);
	}
	$scope.$on('$destroy', function() {
		$interval.cancel(refresh);
		
//		$scope.dic = "";
//		parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
//			this.$$childTail = "";
			

	});
	
	
	
	
	
}])    

