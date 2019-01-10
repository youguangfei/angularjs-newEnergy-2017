App.controller('employeeAuthorityController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory','$filter','pagerService','echartService','notifications','ngDialog',
	function(requestService,cacheService,$cookieStore, $scope, $timeout, lgServerDataProviderFactory,$filter,pagerService,echartService,notifications,ngDialog) {
		var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	 	var my_realName=$cookieStore.get("realName");
	 	var role_result,site_result,siteAdd_result;
	 	console.log(my_realName);
		$scope.select_employee={},$scope.Employee_config={},$scope.addEmployee_config={};
		$scope.add_realName,$scope.add_account,$scope.addEmployee_authorityDefault;
	 	
		
		var url = '/product/api/business';
	//table数据初始化
	var post_InitT,initWatch2;
	var url_pageList="/security/api/staff/pageList";
	
//	员工权限
	var roles_url="/security/api/staff/getRoles";
	var post_role={
		userId:userId,
		type:1
	}
	requestService.post(roles_url, post_role).then(
            function (data) {
            	console.log(data);
            	if(data.code==10202){
            		var result=data.data;
            		var result2=angular.copy(result);
            		result2.unshift({name:"全部",roleId:0})
            		$scope.Employee_config={
						focus:true,
						data:result2,
						placeholder:"全部"
					}  
					$scope.select_employee={"selectedType":result2[0].name,"roleId":0};
            	}
            },function(error){
     })
	var post_role={
		userId:userId,
		type:2
	}
	requestService.post(roles_url, post_role).then(
            function (data) {
            	console.log(data);
            	if(data.code==10202){
            		role_result=data.data;
            		var result2=angular.copy(role_result);
            		$scope.addEmployee_config={
						focus:true,
						data:result2
					} 
					$scope.addEmployee_authorityDefault={"selectedType":result2[0].name,"roleId":result2[0].roleId};
					$scope.addEmployee_authority=angular.copy($scope.addEmployee_authorityDefault);
					
            	}
            },function(error){
     })
//	搜索
	var post_searchData;
	$scope.employee_search=function(){
			var reGetProducts = function(){
			 	post_searchData={
				    "pageNo":$scope.myPagelist.pageNo,
					"pageSize":$scope.myPagelist.pageSize,
					"params":{
						"userId":userId,
						"account":$scope.employee_phone||"",
						"realName":$scope.employee_realName||""
					}
			     };
			     if(angular.isDefined($scope.select_employee.roleId)&&$scope.select_employee.roleId!=0){			     			
			     	post_searchData["params"].roleId=$scope.select_employee.roleId;
			    }
			     console.log(post_searchData);
				requestService.post(url_pageList, post_searchData).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.employeeList = data.data.result;
								console.log($scope.employeeList);
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
	      initWatch2=$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts);
	}
	//列表初始化
	$scope.employee_search();
	
	//选择权限后
	$scope.selectChange_Au=function(newModel){
		console.log(newModel);
		$scope.employee_search();
	}
	
//维修站点
	$scope.repair_siteList={},$scope.employeeAdd_siteConfig={};
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
            		site_result=data.data.result;
            		var result2=angular.copy(site_result);
            		result2.unshift({name:"全部",siteId:0})
            		            		
            		$scope.repair_siteList={
						focus:true,
						data:result2,
						placeholder:" "
					}
            		siteAdd_result=angular.copy(site_result);
            		$scope.employeeAdd_siteConfig={
						focus:true,
						data:siteAdd_result,
						placeholder:" ",
						defaultData:{"selectedType":"",siteId:" "}
					}
            	}
            },function(error){
     })
	
//	新建员工
	$scope.employeeAdd={},$scope.employeeModify={};
	$scope.employee_Add = function(){
		$scope.EmployeeForm_dialog=1;
		$scope.addEmployee_authority=angular.copy($scope.addEmployee_authorityDefault);
		$scope.employeeAdd_site={"selectedType":"","siteId":""};
		console.log($scope.addEmployee_authority);
		
		$scope.title1="员工信息";
		$scope.serviceAdd={};
		var option={
			url:'html/system/authority/employeeAuthority_add.html',
			className:'ngdialog-theme-default ngdialog_add1',
			width:'4.09rem'
		}
		openDialog(option);
	}
	
//	新建时,判断是否是维修人员
	$scope.add_showSite=false;
	$scope.selectAdd_Change=function(newModel,type){
		console.log(newModel);
		if(type=="add"){
			$scope.addEmployee_authority=newModel;
		}
		if(type=="modify"){
			$scope.modifyEmployee_authority=newModel;
		}
		if(newModel.name=="维修人员"){
			$scope.add_showSite=true;
			$scope.modify_showSite=true;
		}else{
			$scope.add_showSite=false;
			$scope.modify_showSite=false;
		}
	}
	$scope.selectep_site=function(newModel){
		$scope.employeeAdd_site=newModel;
	}
	//新建员工信息保存
		$scope.employee_addSave=function(add_realName,add_account, add_deptName,add_email,flag){
			if(flag){
				return;
			}
			var add_employeeUrl="/security/api/staff/insertOrUpdate";
			var postJson={
				 	userId:userId,
				 	account:add_account||"",
				 	realName:add_realName||"",
				 	deptName:add_deptName||"",
				 	roleId:$scope.addEmployee_authority.roleId,
				 	email:add_email||"",
			}
			if($scope.add_showSite){
					postJson.siteId=$scope.employeeAdd_site.siteId ||""
			}
			console.log(postJson);
			requestService.post(add_employeeUrl, postJson).then(
		            function (data) {
		            	console.log(data);
		            	opation_refresh(data,"新建员工");
		            	
			        },function(error){
			            opation_back("新建员工");
			})
	}
	
	function opation_refresh(data,str){
		if(data.code==10202){
    		notifications.showSuccess(str+"成功");
    		$scope.employee_search();
			$scope.goBack();
    	}else{
    		notifications.showError(str+"失败");
    		$scope.goBack();
    	}
	}
	function opation_back(str){
		notifications.showError(str+"失败");
		$scope.goBack();	
	}
	
	//修改员工
	$scope.modify_showSite=false;
	$scope.employee_Modify = function(i){
		$scope.EmployeeForm_dialog=2;
		
		console.log(i);
		if(i.roleName=="维修人员"){
			$scope.modify_showSite=true;
		}else{
			$scope.modify_showSite=false;
		}
		$scope.employeeModify=angular.copy(i);
		$scope.modify_id=i.id||"";
		//权限初始化
		$scope.modifyEmployee_config={
			focus:true,
			data:angular.copy(role_result)
		} 
		$scope.modifyEmployee_authority={"selectedType":i.roleName,"roleId":i.roleId};
		//维修站点初始化
		$scope.employeeModify_siteConfig={
			focus:true,
			data:angular.copy(siteAdd_result),
			placeholder:" "
		} 		
		$scope.employeeModify_site={"selectedType":i.siteName,"siteId":i.siteId};
		
		$scope.title1="员工信息";
		var option={
			url:'html/system/authority/employeeAuthority_add.html',
			className:'ngdialog-theme-default ngdialog_add1',
			width:'4.09rem'
		}
		openDialog(option);
	}
//	修改
	$scope.modify_employeeSave=function(employeeModify_site,flag){
			if(flag){
				return;
			}
			$scope.employeeModify_site=employeeModify_site;
			var add_employeeUrl="/security/api/staff/insertOrUpdate";
			console.log($scope.employeeModify);
			var postJson={
				 	userId:userId,
				 	id:$scope.modify_id||"",
				 	account:$scope.employeeModify.account||"",
				 	realName:$scope.employeeModify.realName||"",
				 	deptName:$scope.employeeModify.deptName||"",
				 	roleId:$scope.modifyEmployee_authority.roleId,
				 	email:$scope.employeeModify.email||"",
			}
			if($scope.modify_showSite){
					postJson.siteId=employeeModify_site.siteId ||""
			}
			console.log(postJson);
			requestService.post(add_employeeUrl, postJson).then(
			            function (data) {
			            	console.log(data);
			            	opation_refresh(data,"修改员工信息");
			            	
				        },function(error){
				            opation_back("修改员工信息");
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
	
	//删除按钮
	var delete_url="/security/api/staff/delete";
	$scope.managementDelete = function(i){
		console.log(i);
		var employeeId=i.id; 
		
//		$scope.deleteType=true;
		$scope.confirm_dialog1 = true;
		$scope.confirm_dialog2 = false;
		var jsonDialog={
			title:"删除",
			message:"确定删除该记录？"
		}
		openConfirmFun(jsonDialog,function(data){
			if(data){
				console.log("确定删除了");
				var postJson={
					"userId":userId,
					"id":employeeId
				}
				requestService.post(delete_url, postJson).then(
			            function (data) {
			            	console.log(data);
			            	opation_refresh(data,"删除员工");
			            },function(error){
			            	opation_back("新建员工");
			     })

			}else{
				console.log("取消");
			}
			
		})
		
	}
	
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
					 excelCode:"excel004",
					 type:0,
					 app:"web",
					 token:$cookieStore.get("token")
				}
				var name = $scope.uploadTemplateName == null ? "员工权限管理模板" : $scope.uploadTemplateName;
			
//			url="http://192.168.232.148:8080/security/api/staff/downExcel";
				var template_uploadUrl="/security/api/staff/downExcel";
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
			className:'ngdialog-theme-default  ngdialog_add3',
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
	$scope.uploadURL="/security/api/staff/uploadExcel";
	var upload = function(file) {
		var fd = new FormData();
		fd.append('excelCode',"excel004");
		fd.append('file', file);
		fd.append('userId',userId);
		fd.append("token",$cookieStore.get("token"));
		fd.append('app',"web");
		
		// 清空文件
		excelFile.value = null;
		
		requestService.upload($scope.uploadURL, fd, true).then(function(data) {
			console.log(data);
			if(data.code==200){
				$scope.employee_search();
	    		$scope.goBack();
				notifications.showSuccess("导入成功");
			}else{
				var message=data.message;
					message="文件导入失败！"+message;
					notifications.showError(message);
					$scope.fileName="请选择文件";
			}

		}, function(error) {
			console.log(error);
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