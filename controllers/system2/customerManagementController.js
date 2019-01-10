App.controller('customerManagementController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory','$filter','pagerService','echartService','notifications','ngDialog',
	function(requestService,cacheService,$cookieStore, $scope, $timeout, lgServerDataProviderFactory,$filter,pagerService,echartService,notifications,ngDialog) {
		
		var groupid=$cookieStore.get("groupId"),
	 	userId=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	 	var my_realName=$cookieStore.get("realName");
	 	var role_result,site_result;
		$scope.company_selectConfig1={};
		$scope.select_company={},$scope.addCus_unitName;
	 	$scope.searchName;
		
	//table数据初始化
	var post_InitT;
	var initWatch,initWatch2;
	var url_pageList="/security/api/customer/pageList";
//	所属公司
	// 获取车辆使用单位
	 var unit_url="/security/api/customer/getUnits"; 
	 var repair_siteInit={},post_unit;
	var getCustom_unitList=function(flag){
			var reGetProductsU = function(){
				post_unit={
					"userId":userId,
				}
				requestService.post(unit_url, post_unit).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==10202){
			            		var company_result=angular.copy(data.data);
			            		var company_select1=angular.copy(data.data);
			            		var unitAll={unitCode:0,name:"全部"}
			            		company_select1.unshift(unitAll);
			            		
			            		$scope.company_selectConfig1={
									focus:true,
									data:company_select1,
									placeholder:"全部"
								}
			            		if(flag){
			            			$scope.select_company=unitAll;
			            		}
			            		
			            		$scope.customer_AddcpyCfg={
			            			focus:true,
									data:company_result
			            		}
			            		if(company_result&&company_result[0]&&company_result[0].name){
			            			$scope.addCus_unitCode={"selectedType":company_result[0].name,"unitCode":company_result[0].unitCode};
			            		}
			            		
			            		
			            	}
			            },function(error){
			     })
				
			}
			reGetProductsU();
		}
	
	getCustom_unitList(true);
	
//	搜索
	var post_searchData;
	$scope.customer_search=function(){
			var reGetProducts = function(){
			 	post_searchData={
				    "pageNo":$scope.myPagelist.pageNo,
					"pageSize":$scope.myPagelist.pageSize,
					"params":{
						"userId":userId,
						"customerName":$scope.customerName||"",
						"customerPhone":$scope.customerPhone||""
					}
			     };

			    if(angular.isDefined($scope.select_company.unitCode)&&$scope.select_company.unitCode!=0){	     			
			     			post_searchData["params"].unitCode=$scope.select_company.unitCode;
			    }
			     console.log(post_searchData);
				requestService.post(url_pageList, post_searchData).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.customerList = data.data.result;
								console.log($scope.customerList);
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
	
	$scope.customer_search();
	
	//选择公司后
	$scope.selectChange_cpy=function(newModel){
		console.log(newModel);
		$scope.select_company=newModel;
		$scope.customer_search();
	}
		
	//	新建客户
//	customer_AddcpyCfg,addCus_unitCode
	$scope.customerModify={};
	$scope.customer_Add = function(){
		$scope.customerForm_dialog=1;
		$("#unitName").val("");
		$scope.search_unit=false;
		$scope.addCus_unitName="";
		$scope.title1="客户信息";
		$scope.searchCustomer_unit = {};
		var option={
			url:'html/system/customer/customer_addModiry.html',
			className:'ngdialog-theme-default ngdialog_add1',
			width:'4rem'
		}
		openDialog(option);
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
	
	$scope.selectNewname=function(newModel){
		console.log(newModel);
		if(angular.isDefined(newModel)){
			$scope.searchName=newModel.name||newModel;
		}
	}
		$scope.searchName1 = false;
		//新建员工信息保存
		$scope.customer_addSave=function(addCus_name,addCus_phone,flag){
			if(flag || !$scope.searchName || $scope.searchName.length>50){
				return;	
			}
			var add_customerUrl="/security/api/customer/insertOrUpdate";
			var postJson={
				 	userId:userId,
				 	name:addCus_name||"",
				 	phone:addCus_phone||"",
				 	unitName:$scope.searchName
			}
			console.log(postJson);
			requestService.post(add_customerUrl, postJson).then(
		            function (data) {
		            	console.log(data);
		            	opation_refresh(data,"新建客户");
		            	
			        },function(error){
			            opation_back("新建客户");
			})
	}
	
	function opation_refresh(data,str){
		if(data.code==10202){
    		notifications.showSuccess(str+"成功");
    		getCustom_unitList(false);
    		setTimeout(function(){
    			$scope.customer_search();
    		},10)
			$scope.goBack();
    	}else{
    		notifications.showError(str+"失败");
    		$scope.goBack();
    	}
	}
	
	//实时检索单位
	$scope.searchCustomer_unit = {};
	$scope.search_name=function(name){
		var getUnits_url="/security/api/unit/getUnits";
		var postJson={
				 	userId:userId,
				 	unitName:name
			}
		$scope.searchName=name;
		
		console.log(name)
		requestService.post(getUnits_url, postJson).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==10202){
	            		$scope.searchCustomer_unit=data.data;
	            	}
		        },function(error){
		        	console.log(error);
		})
	}
	//下拉选择
	
	function opation_back(str){
		notifications.showError(str+"失败");
		$scope.goBack();	
	}
	function addModify_dialog(){
		$scope.title1="客户信息";
		var option={
			url:'html/system/customer/customer_addModiry.html',
			className:'ngdialog-theme-default ngdialog_add1',
			width:'4.09rem'
		}
		openDialog(option);
	}
	
//	修改
	$scope.customer_Modify=function(x){
		console.log(x);
		$scope.customerForm_dialog=2;
		
		addModify_dialog();
		$scope.cus_modiry=angular.copy(x);
		$scope.textInit=angular.copy(x);
		console.log($scope.textInit);
	}
	
//修改员工信息保存
		$scope.customer_modifySave=function(flag){
			console.log($scope.alreadyBt1);
			if(flag || !$scope.searchName || $scope.searchName.length>50){
				return;
			}
			var add_customerUrl="/security/api/customer/insertOrUpdate";
			var postJson={
				 	userId:userId,
					id:$scope.cus_modiry.id,
				 	name:$scope.cus_modiry.name||"",
				 	phone:$scope.cus_modiry.phone||"",
				 	unitName:$scope.searchName
			}
			console.log(postJson);
			requestService.post(add_customerUrl, postJson).then(
		            function (data) {
		            	console.log(data);
		            	opation_refresh(data,"修改客户");
		            	
			        },function(error){
			            opation_back("修改客户");
			})
	}
		

//删除客户信息
		var delete_url="/security/api/customer/delete";
		$scope.customer_Delete=function(x){
			
			$scope.confirm_dialog1 = true;
			$scope.confirm_dialog2 = false;
			var jsonDialog={
				title:"删除",
				message:"确定删除该记录？"
			}
			$scope.confirmlist1 = 1;
			openConfirmFun(jsonDialog,function(data){
				if(data){
					console.log("确定删除了");
					var postJson={
						"userId":userId,
						"id":x.id
					}
					console.log(postJson);
					requestService.post(delete_url, postJson).then(
				            function (data) {
				            	console.log(data);
				            	opation_refresh(data,"删除客户");
				            },function(error){
				            	opation_back("删除客户");
				     })
	
				}else{
					console.log("取消");
				}
				
			})			
		}

		function openConfirmFun(json,callType){
			ngDialog.openCustomConfirm({
				title:json.title,
				plain: false,
			    className: 'ngdialog-theme-default ngdialog-deleteCus',
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
		$scope.confirmlist1 = 1;
		openConfirmFun(jsonDialog,function(data){
			if(data){
				var postJson={
					 userId:userId,
					 excelCode:"excel003",
					 type:0,
					 app:"web",
					 token:$cookieStore.get("token")
				}
				var name = $scope.uploadTemplateName == null ? "客户管理模板" : $scope.uploadTemplateName;
//			url="http://192.168.232.148:8080/security/api/staff/downExcel";
				var template_uploadUrl="/security/api/customer/downExcel";
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
//			if (!confirm("确定导入[ " + file.name + " ]吗？")) {		
//				excelFile.value = null;
//				return;
//			}
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
		$scope.uploadURL="/security/api/customer/uploadExcel";
		var upload = function(file) {
			var fd = new FormData();
			fd.append('excelCode',"excel003");
			fd.append('file', file);
			fd.append('userId',userId);
			fd.append("token",$cookieStore.get("token"));
			fd.append('app',"web");
			
			// 清空文件
			excelFile.value = null;
				
			requestService.upload($scope.uploadURL, fd, true).then(function(data) {
				console.log(data);
				if(data.code==200){
					$scope.customer_search();
					getCustom_unitList(false);
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
		
	function cancelConFirm(){
		var $target=$("#delete_Cancel2");
		var id=$target.parents(".ngdialog").attr("id");
		console.log(id);
		ngDialog.close(id);
	}
	
	$scope.goBack2=function(){
		cancelConFirm();
	}	
		
		
		
		
		
		
	
	
}]);