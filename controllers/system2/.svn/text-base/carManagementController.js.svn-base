App.controller('carManagementController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory','$filter','pagerService','echartService','notifications','ngDialog',
	function(requestService,cacheService,$cookieStore, $scope, $timeout, lgServerDataProviderFactory,$filter,pagerService,echartService,notifications,ngDialog) {
		var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	 	var my_realName=$cookieStore.get("realName");
	 	var role_result,site_result;
	 	console.log(my_realName);
		$scope.Employee_config={},$scope.addEmployee_config={};
		$scope.add_realName,$scope.add_account;
		$scope.already_search=false;
		var url="/product/api/business";
		
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
		
		
	var url = '/product/api/business';
//table数据初始化
		var post_InitT,post_seachData;
		var initWatch,initWatch2;
		
	//table数据初始化
	var post_InitT;
	var reGetProducts1,reGetProducts2;
	var initTableData=function(){
			reGetProducts1= function(){
				post_InitT={
				    "pageNo":$scope.myPagelist.pageNo,
					"pageSize":$scope.myPagelist.pageSize,
					"params":{
						"userId":userId,
					}
			     };
				console.log(JSON.stringify(post_InitT));
				var post_InitTdata={
					"code":10041,
				    "param":JSON.stringify(post_InitT)
				}
				requestService.post(url, post_InitTdata).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.cartableList = data.data.result;
								console.log($scope.cartableList);
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
	      initWatch=$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts1);
		}
	initTableData();
		
	//实时检索单位，模糊查询
	$scope.searchPlaceholder="请输入单位名称";
	$scope.searchCustomer_unit = {};
	$scope.search_name=function(name){
		var getUnits_url="/product/api/business";
		var postParam={
			 	userId:userId,
			 	unitName:name || ""
			}
		var postJson={
			"code":10056,
			"param":JSON.stringify(postParam)
		}
		$scope.searchName=name;
		console.log(postJson);
		requestService.post(getUnits_url, postJson).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==200){
	            		$scope.searchCustomer_unit=data.data; 
	            	}
		        },function(error){
		        	console.log(error);
		})
	}
	
	//用户点击下拉单位列表后
	$scope.selectNewname=function(newModel){
		if(angular.isDefined(newModel)){
			$scope.searchName=newModel.name;
		}
		console.log($scope.searchName);
	}
	
//	搜索
	$scope.carList_search=function(){
			$scope.already_search=true;
			if(initWatch){
				initWatch();
			}
			console.log($scope.searchName);
			reGetProducts2 = function(){
				post_seachData={
				    "pageNo":$scope.myPagelist.pageNo,
					"pageSize":$scope.myPagelist.pageSize,
					"params":{
						"userId":userId,
						"unitName":$scope.searchName||""
					}
			     };
			     console.log($scope.selectVin_value);
			     if(angular.isDefined($scope.selectVin_value)){
					post_seachData.params[$scope.selectVin.key]=$scope.selectVin_value;
				}
				var post_InitTdata={
					"code":10041,
				    "param":JSON.stringify(post_seachData)
				}
				console.log(post_InitTdata);
				requestService.post(url, post_InitTdata).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.cartableList = data.data.result;
								console.log($scope.cartableList);
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
	      initWatch2=$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts2);
		
	}
	
	
//消息确认框	
	function openConfirmFun(json,callType){
		$scope.confirmlist1 = 1;
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
//模板下载
	$scope.template_upLoad=function(){
		var jsonDialog={
			title:"模板下载",
			message:"是否进行模板下载"
		}
		openConfirmFun(jsonDialog,function(data){
			if(data){
				var postJson={
					 userId:userId,
					 excelCode:"excel001",
					 type:0,
					 app:"web",
					 token:$cookieStore.get("token")
				}
				var name = $scope.uploadTemplateName == null ? "车辆信息管理模板" : $scope.uploadTemplateName;
//			url="http://192.168.232.148:8080/security/api/staff/downExcel";
				var template_uploadUrl="/product/api/downExcel2";
				requestService.download(template_uploadUrl,postJson, name).then(function(data) {
					console.log("downloadTemplet success...")
				},function(error) {
					console.log("downloadTemplet error...")
				});
				
			}else{
				console.log("取消");
			}
		})
	}
	function openDialog(option){
		ngDialog.open({
		        template: option.url,
		        plain: false,
		        className: option.className,
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        scope: $scope,
		        width:option.width,
		});
	}
	
	//批量导入
	// 提交，导入文件
	var excelFile = document.getElementById("excelFile");
	$scope.importFile = function() {
		$scope.CarOrfile_dialog=2;
		$scope.title2="批量导入";
		$scope.fileName="请选择文件";
		$scope.serviceAdd={};
		var option={
			url:'html/monitor/mCar_longControll.html',
			className:'ngdialog-theme-default ngdialog_add1 ngdialog_add3',
//			width:'5.15rem'
		}
		openDialog(option);
	};
	
	//改变文件名
	$scope.changeFileName=function(event){
   		var fileName=$(event)[0].files[0].name;
   		if(fileName.length>12){
   			var index=fileName.lastIndexOf(".");
   			var type=fileName.substring(index);
   			fileName=fileName.substring(0,6)+"..."+type;
   		}
   		$scope.$apply(function(){
   			$scope.fileName=fileName;
   		})
	}
	
	// 提交，导入文件
	var excelFile;
		$scope.importFileSave = function() {
			excelFile = document.getElementById("excelFile");
			var files = excelFile.files;
			var file = files[0];
			if (!file) {
				notifications.showWarning("请选择导入文件");
				return;
			}
			var fileName = file.name;
			var index = file.name.lastIndexOf(".");
			var fileType = fileName.substring(index);
			if(fileType != ".xlsx" && fileType != ".xls"){
				notifications.showWarning("文件类型非法，请选择Excel文件");
				return;
			}
			// 清空文件
			No_dragMove();
			$scope.confirmlist1 = 3;
			var Bj_json={
					title:"",
					message:"确定导入["+$scope.fileName+" ]吗？"
				};
			openConfirmFun(Bj_json,function(flag){
					if(flag){
						upload(file);
					}else{
						excelFile.value = null;
					}
			})
			
		};
		$scope.uploadURL="/product/api/uploadExcel2";
		var upload = function(file) {
			var fd = new FormData();
			fd.append('excelCode',"excel001");
			fd.append('file', file);
			fd.append('userId',userId);
			fd.append("token",$cookieStore.get("token"));
			fd.append('app',"web");
			
			// 清空文件
			excelFile.value = null;
				
			requestService.upload($scope.uploadURL, fd, true).then(function(data) {
				console.log(data);
				if(data.code==200){
					refresh();
		    		$scope.goBack();
					notifications.showSuccess("导入成功");
				}else{
						var message=data.message;
							message="文件导入失败！"+message;
							notifications.showError(message);
							$scope.fileName="请选择文件";
				}
				
			}, function(error) {
				$scope.fileName="请选择文件";
			});
		};
			
			// 清空文件
		$scope.clearFile = function() {
			excelFile.value = null;
		}	
		
	$scope.goBack=function(id){
//		$scope.ngDialogId
		ngDialog.close(id);
	}				
		
//	新建车辆
	$scope.employeeAdd={},$scope.employeeModify={};
	$scope.carInformation_Add = function(){
	 	window.open("#/carInformation_add"); 
	}	
	//查看模式
	function refresh(){
		if($scope.already_search){
			reGetProducts2();
		}else{
			reGetProducts1();
		}
	}
	var new_modifyPage;
	window.funInA_carRefresh = function(type) {
		console.log(type);
		if(type=="add"&&(!$scope.already_search)){
			$scope.myPagelist.pageNo=1;
		}
		refresh();
	}
	$scope.carInfo_look=function(x){
		console.log(x);
		var carId=x.carId;
		window.open("#/carInformation_modify/"+"look/"+window.pwdString.encrypt(carId)); 
	}
		
	//修改模式
	$scope.carInfo_modify=function(x){
		console.log(x);
		var carId=x.carId;
		new_modifyPage=window.open("#/carInformation_modify/"+"modify/"+window.pwdString.encrypt(carId)); 
	}
	
	
	//删除车辆
	$scope.carInfo_delete=function(x){
		console.log(x);
		var jsonDialog={
			title:"删除",
			message:"确定删除该记录?"
		}
		openConfirmFun(jsonDialog,function(data){
			if(data){
				$scope.car_trueDelete(x.carId);
			}else{
				console.log("取消");
			}
		})
		
		
	}
	
//	确认删除车辆信息
	$scope.car_trueDelete=function(carId){
				var repair_deleteData1={
					"userId":userId,"id":carId
				}
				var repair_deleteData2={
						 "code":10042,
						"param":JSON.stringify(repair_deleteData1)
				}
				console.log(repair_deleteData2);
				requestService.post(url, repair_deleteData2).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
		            		notifications.showSuccess("删除成功");
		            		refresh();
		            	}
		            },function(error){
		            	notifications.showError("删除失败");
		     })
	}	
		
	//禁止确认框移动
	function No_dragMove(){
		setTimeout(function(){
		    	$(".ngdialog-content").myDrag({
		    		isFlag:false,
		    		randomPosition: false,
					direction: 'all',
					handler: false,
					parent: 'body',
		    	});
		},400);
	}
		
		
		
		
		
		
}]);