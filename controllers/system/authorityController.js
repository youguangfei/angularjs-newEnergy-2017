App.controller('authorityController', 
['$cookieStore','$scope', 'ngDialog', '$timeout', 'requestService', 'notifications', 'lgServerDataProviderFactory', 'pagerService','$filter',
function($cookieStore,$scope, ngDialog, $timeout, requestService, notifications, lgServerDataProviderFactory, pagerService,$filter) {

	//创建对象，传入http服务，分页的page类
	//分页查询条件
	$scope.dataProvider = null;
	var pagerService2 = angular.copy(pagerService);
    $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService2);
    $scope.empListFlag=true;
	$scope.showTable = 1;		// 默认显示表格
	$scope.isSelected = false;	// 默认用户不选中
	$scope.user;				// 用户项信息
	$scope.isUser=false;
	$scope.isRole=false;
	$scope.isOrg=false;
	$scope.showCreateUserTable=false;
	$scope.showCreateRoleTable=false;
	$scope.showAuthorized=false;
	$scope.showEmployeeBinding=false;
	$scope.showUserDataTable=true;
	$scope.isAuth=false;
	$scope.roleEdit=true;
	$scope.groupEdit=true;
	$scope.isRoot=false;
	$scope.isAddUser=true;
	$scope.data={groupId:0};
	var today = new Date();
	var Format=$filter('date')(today, 'yyyy-MM-dd');
	 
	/*start org */
	var getTreeData = function() {
		var url = '/security/api/userGroup/getUserGroupTree'; 
		return requestService.post(url, {}, true).then(function (data) {
			data.data[0].expanded = true;
			$scope.groupData = data.data;
			$scope.isUser=false;
			$scope.isRole=false;
			$scope.isOrg=false;
			$scope.showCreateUserTable=false;
			$scope.showCreateRoleTable=false;
			$scope.showAuthorized=false;
			$scope.showEmployeeBinding=false;
			$scope.showUserDataTable=true;
			$scope.isAuth=false;
			$scope.roleEdit=true;
			$scope.groupEdit=true;
			$scope.isRoot=false;
			$scope.isAddUser=true;
		});
	};
	$scope.groupData = [];
	$scope.groupTree = tree = {};
	getTreeData();
	
	// 包含子机构
	$scope.includeSub = false;
	$scope.orgId;
	// 选中一个机构
	this.selectedOrgId = null;
	$scope.user.orgSelect=[];
	var getOrgs = function(creteType){
		var url = '/security/api/tenant/getTenants';
		if(creteType==1){
			url = '/security/api/organization/getOrgs';
		}
		var param = {};
		if($scope.user.roleType!=1){
			requestService.post(url, param, true).then(
					function(data){
						$scope.user.orgSelect=[];
							angular.forEach(data.data, function(fun,index){
							var sel={};
							sel.selectVal=fun.tenantId;
							sel.selectName=fun.name;
							$scope.user.orgSelect[index]=sel;
						});
					},function(error){
						console.log(error);
					}
				);
		}
		
	};
	/* end org */
	
	 /* begin create role */
    $scope.branch;
    $scope.pbranch;
    $scope.isRoleSelf=true;
    $scope.isUserOption=true;
    $scope.isRoleOption=true;
    $scope.groupSelected = function (branch) {
    	$scope.redio.userId=0;
    	$scope.authorityType=0;
    	$scope.showUserDataTable=true;
    	$scope.showCreateUserTable=false;
    	$scope.showCreateRoleTable=false;
    	$scope.showCreateGroupTable=false;
    	$scope.showRoleBinding=false;
    	$scope.showAuthorized=false;
    	$scope.showEmployeeBinding=false;
    	$scope.role={};
        $scope.branch = branch;
        $scope.isAuth=true;
        $scope.isRoleOption=true;
        var targetOrgId = $cookieStore.get("targetOrgId");
		if( targetOrgId !=null){
			$cookieStore.remove("targetOrgId");
			$cookieStore.put("targetOrgId",branch.id);
		}
    	$scope.pbranch=$scope.groupTree.get_parent_branch(branch);
    	var ugroupId=$cookieStore.get("groupId");
    	var isRoot=$cookieStore.get("isRoot");
    	//选中角色
        if (branch.otherid == 2) {
        	$scope.isOrg=true;
        	$scope.isRole=true;
        	var roleType=$cookieStore.get("roleType");
            $scope.role.roleId = branch.mark.roleId;
            $scope.role.ownerCode = branch.mark.ownerCode;
            $scope.role.roleName = branch.mark.roleName;
            $scope.role.roleType = branch.mark.roleType;
            $scope.role.description = branch.mark.description;
            $scope.role.beginTime = branch.mark.beginTime;
            $scope.role.endTime = branch.mark.endTime;
            $scope.role.createTime = branch.mark.createTime;
            $scope.role.editTime = branch.mark.editTime;
            $scope.data.groupId=$scope.pbranch.mark.groupId;
            var url = '/security/api/role/getUserByRoleId';
            var param = {
                roleId: branch.mark.roleId,
                roleType:branch.mark.roleType,
                groupId:$scope.pbranch.mark.groupId
            };
            $scope.roleEdit=true;
            if($scope.role.roleType==0){
            	$scope.roleEdit=false;
            }
            if($scope.role.roleType==2){
            	var rolegeneral=new Array();
            	if(branch.mark.roleType==2&&branch.pid!=branch.mark.pId){
            		$scope.roleEdit=false;
            		$scope.isRoleOption=false;
            		$scope.isAuth=false;
            	}else{
            		$scope.isAuth=true;
            		findSelectedByRoleId(rolegeneral, $scope.pbranch,branch.mark.roleId);
                	if(rolegeneral.length>1){
                		$scope.roleEdit=false;
                	}
                	$scope.isRoleOption=true;
            	}
            	
            	
            }else{
            	$scope.isRoleOption=true;
            }
            
            pagerService2.params = param;
            //排序规则，不用时置空
    		pagerService2.orderBy = null;
    		//执行分页查询,如果不需要传递page类请赋值null
    		$scope.dataProvider.data = $scope.dataProvider.getGridModel();
    		$scope.dataProvider.updateFilters(url,pagerService2);
    		//需要开一个监听
    		$scope.$watch("dataProvider.data", function(newValue) {
    			if(newValue===undefined || newValue===null||newValue===''){
    				return;
    			}
    			//同步page类
    			//if(newValue.data.params.roleId!=null){
    				$scope.dataProvider.setViewSettings(newValue.data);
    			//}
    			
    			//渲染table
	     		if($scope.role.roleType==0&&newValue.data.result.length>0){
	     			$scope.isAddUser=false;
	     		}else{
	     			$scope.isAddUser=true;
	     		}
	     		if(newValue.data!=null&&newValue.data.result!=null){
	     			$scope.dataProvider.setModel(newValue.data.result);
	     		}
    		});

        } else {
        	$scope.isOrg=true;
        	$scope.isRole=false;
        	var groupId=$scope.data.groupId=branch.mark.groupId;
        	if(groupId==ugroupId){
        		$scope.groupEdit=false;
        		$scope.isAuth=false;
        	}else{
        		$scope.isAuth=true;
        		$scope.groupEdit=true;
        	}
        	 var url = '/security/api/role/getUserByGroupId';
             var param = {
            	groupId: branch.mark.groupId
             };
             findUserByGroup(param);
             
        	
        }
        if(isRoot!=1){
    		$scope.isUserOption=false;
    		$scope.isRoot=false;
    	}else{
    		$scope.isUserOption=true;
    		
    		$scope.isRoot=true;
    	}
       
    };
    //根据用户组查询用户
    var findUserByGroup=function (param){
    	var url = '/security/api/role/getUserByGroupId';
        pagerService2.params = param;
        //排序规则，不用时置空
 		pagerService2.orderBy = null;
 		//执行分页查询,如果不需要传递page类请赋值null
 		$scope.dataProvider.updateFilters(url,pagerService2);
 		//需要开一个监听
 		$scope.$watch("dataProvider.data", function(newValue) {
 			if(newValue===undefined || newValue===null||newValue===''){
 				return;
 			}
 			//同步page类
 			$scope.dataProvider.setViewSettings(newValue.data);
 			//渲染table
 			if(newValue.data!=null && newValue.data.result!=null){
	     		$scope.dataProvider.setModel(newValue.data.result);
	     	}
 		});
    }
    //加油记录查询对象
	$scope.data.paramUser={};
	$scope.queryUser=function(){
		var param = {};
		//对象拷贝
		for(var item in $scope.data.paramUser){
			if($scope.data.paramUser[item] == undefined ){
				continue;
			}
 			if(item=="firstDate"||item=="endDate"){
 				param[item] =$filter("date")($scope.data.paramUser[item],"yyyy-MM-dd"); 
 				continue;
 			}
			param[item] = $scope.data.paramUser[item];
		}
		if($scope.userId!=null&&$scope.userId!=undefined){
			param["userId"]=$scope.userId||"";
		}
		if($scope.name!=null&&$scope.name!=undefined){
			param["name"]=$scope.name||"";
		}
		param["groupType"]=$scope.groupType;
		if($scope.data.paramUser.groupType==0){
			param.groupId=$cookieStore.get("groupId");
		}else{
			if($scope.data.groupId>0){
				param.groupId=$scope.data.groupId;
			}else{
				param.groupId=$cookieStore.get("groupId");
			}
		}
		param.firstDate= $("#startTime").val();
		param.endDate = $("#endTime").val();
		if((param.endDate==null&&param.firstDate!=null)||(param.endDate==undefined&&param.firstDate!=undefined)||(param.endDate==""&&param.firstDate!="")){
			notifications.showWarning("开始时间不为空，结束时间不能为空");
			return false;
		}
		if((param.endDate!=null&&param.firstDate==null)||(param.endDate!=undefined&&param.firstDate==undefined)||(param.endDate!=""&&param.firstDate=="")){
			notifications.showWarning("结束时间不为空，开始时间不能为空");
			return false;
		}
		findUserByGroup(param);
		$scope.data.paramUser={};
	}
    $scope.groupType=1;
	$scope.resetQueryPanel=function(){
		$scope.showCreateUserTable=false;
    	$scope.showCreateRoleTable=false;
    	$scope.showCreateGroupTable=false;
		$scope.data.paramOil={};
		$scope.data.paramUser={};
 		$scope.data.paramUser.groupType=1;
 		$scope.queryUser();
	}
	//新建 或修改角色操作
    $scope.createRole = function(editType){
    	$scope.form_title="编辑角色";
    	var tenantId=$scope.branch.mark.tenantId;
    	if(tenantId==null||tenantId==''){
			notifications.showWarning("当前选择用户组非法");
    		return;
    	}
    	$scope.role={};
    	$scope.showCreateRoleTable=true;
    	$scope.showUserDataTable=false;
    	$scope.showCreateUserTable=false;
    	$scope.showCreateGroupTable=false;
    	$scope.showRoleBinding=false;
    	$scope.showAuthorized=false;
    	$scope.showEmployeeBinding=false;
    	if(editType == 0){
    	$scope.role = {
    			roleName: '角色-新建',
                description: '新创建角色',
                beginTime: new Date(),
                endTime: new Date(),
                createTime: new Date(),
                editTime: new Date(),
                groupId:$scope.branch.mark.groupId,
                tenantId:tenantId,
                roleType: 1
            };
            if($scope.branch.pid!=null){
            	$scope.form_title="新建角色";
            	$scope.role.ownerCode=$scope.branch.mark.orgId;
            	$scope.role.orgName=$scope.branch.mark.name;
            	$scope.role.beginTime = Format;
            	$scope.role.endTime = Format;
            	$scope.role.createTime = Format;
            	$scope.role.editTime = Format;
    		}else{
    			$scope.role.tenantId=$scope.branch.mark.orgId;
    			$scope.role.tenantName=$scope.branch.mark.name;
    		}
    	}else{
    		$scope.role=angular.copy($scope.branch.mark);
    		$scope.role.roleType=angular.copy($scope.branch.mark.roleType);
    		if($scope.pbranch.pid!=null){
            	$scope.role.ownerCode=angular.copy($scope.pbranch.mark.orgId);
            	$scope.role.orgName=angular.copy($scope.pbranch.mark.name);
    		}else{
    			$scope.role.tenantId=angular.copy($scope.pbranch.mark.orgId);
    			$scope.role.tenantName=angular.copy($scope.pbranch.mark.name);
    		}
    		if ($scope.branch.mark.beginTime != undefined){
    			$scope.role.beginTime = $filter("date")($scope.branch.mark.beginTime,"yyyy-MM-dd");
    			/*$scope.role.beginTime = new Date($scope.branch.mark.beginTime);*/
			}
			if ($scope.branch.mark.endTime != undefined){
				$scope.role.endTime = $filter("date")($scope.branch.mark.endTime,"yyyy-MM-dd");
			}
			if ($scope.branch.mark.createTime != undefined){
				$scope.role.createTime = $filter("date")($scope.branch.mark.createTime,"yyyy-MM-dd");
			}
			$scope.role.editTime = $filter("date")(today,"yyyy-MM-dd");
			
    	}
    	$scope.role.roleTypeSelect = [
	    	{
	            selectVal: 1,
	            selectName: '普通角色'
	        }, 
	        {
	            selectVal: 2,
	            selectName: '通用角色'
	        }
        ];
    	
    }
    // 新增或修改角色提交
    $scope.insertOrUpdateRole = function () {
        var url = '/security/api/role/insert';
        var param = $scope.role;
        var roleBeginTime = $("#roleBeginTime").val();
    	var roleEndTime = $("#roleEndTime").val();
    	var roleCreateTime = $("#roleCreateTime").val();
    	var	roleEditTime = $("#roleEditTime").val();
        $scope.role.beginTime = new Date(roleBeginTime);
	    $scope.role.endTime = new Date(roleEndTime);
	    $scope.role.createTime = new Date(roleCreateTime);
	    $scope.role.editTime = new Date(roleEditTime);
        var isAdd=true;
        if ($scope.role.roleId != null) {
        	isAdd=false;
            url = '/security/api/role/update';
        }
        if($scope.role.roleName==null||$scope.role.roleName==undefined||$scope.role.roleName==""){
        	notifications.showWarning("角色名字不能为空");
        	return false;
        }
        //数据长度验证
        if($scope.role.roleName.length>50){
        	notifications.showWarning("角色名字长度不能超过50个字符");
        	return false;
        }
        //数据长度验证
        if($scope.role.description.length>150){
        	notifications.showWarning("描述信息长度不能超过150个字符");
        	return false;
        }
        for (var item in param) {
            if (param[item] == undefined) {
                delete param[item];
            }
        }
        requestService.post(url, param).then(
            function (data) {
            	var branch={
            	};
            	$scope.role.roleId=data.data;
            	branch.label=$scope.role.roleName;
            	branch.otherid=2;
            	branch.mark=$scope.role;
            	if(isAdd){
            		branch.id=data.data;
            		branch.pid=$scope.branch.id;
            		$scope.groupTree.add_branch($scope.branch,branch);
            	}else{
            		branch.pid=$scope.branch.pid;
            		branch.id=$scope.branch.id;
            		$scope.groupTree.update_branch($scope.pbranch,branch);
            	}
            	getTreeData();
				notifications.showSuccess("提交成功");
                $scope.showCreateRoleTable=false;
                $scope.showUserDataTable=true;
                $scope.goBack();

            }, function (error) {
				notifications.showError("添加/修改失败");
                $scope.goBack();
            }
        );
    };
     //删除角色按钮
    $scope.removeRole = function(){
            var role = $scope.role;
            if ($scope.role.roleId != null) {
                if (!confirm("确定删除" + role.roleName + "吗？")){
                    return;
                }
                var url = '/security/api/role/remove';
                var param = {
                    roleId: role.roleId,
                    roleType:$scope.branch.mark.roleType,
                    groupId:$scope.branch.pid
                };
                requestService.post(url, param).then(
                    function (data) {
                		var selection = new Array(); // 被选中项数组
                		var e = $scope.pbranch;
                		findSelectedByRoleId(selection,e,role.roleId);
                		
                		for ( var int = 0; int < selection.length; int++) {
                			$scope.groupTree.deleteBranch(selection[int]);
						}
						getTreeData();
						notifications.showSuccess("删除完成");
                        $scope.isRole=false;
                    	$scope.showCreateRoleTable=false;
                        $scope.showUserDataTable=true;
                    	$scope.goBack();

                    }, function (error) {
						notifications.showError("删除失败");
                        $scope.goBack();
                    }
                );
            }
        }
    $scope.showCreateGroupTable=false;
 	
 	//创建用户组
    $scope.createGroup=function(type){
    	$scope.form_title="新建用户组";
    	var tenantId=angular.copy($scope.branch.mark.tenantId);
    	if(tenantId==null||tenantId==''){
			notifications.showWarning("当前选择用户组非法");
    		return;
    	}
    	$scope.select.roles=[];
    	$scope.showUserDataTable=false;
    	$scope.showCreateGroupTable=true;
    	$scope.showCreateRoleTable=false;
    	$scope.showCreateUserTable=false;
    	$scope.showRoleBinding=false;
    	$scope.showAuthorized=false;
    	$scope.showEmployeeBinding=false;
    	
    	if(type==0){//新建用户组(type=0)
    		$scope.group = {
        		pId:$scope.branch.mark.groupId,
        		pName: $scope.branch.mark.name,
        		name: 'defult',
        		description: '新创建用户组',
        		createTime: Format,
        		lastModifyTime: Format,
        		tenantId:tenantId
        	};
    		$scope.group.pRoles=new Array();
    		$scope.group.roleNames=new Array();
    	}else{
    		$scope.group=angular.copy($scope.branch.mark);
    		$scope.group.pRoles=new Array();
    		$scope.group.roleNames=new Array();
    		$scope.group.pName=angular.copy($scope.pbranch.mark.name);
    		if ($scope.branch.mark.createTime != undefined){
    			$scope.group.createTime = $filter("date")(new Date($scope.branch.mark.createTime),"yyyy-MM-dd");
    			/*$scope.group.createTime = new Date($scope.branch.mark.createTime);*/
			}
			if ($scope.branch.mark.lastModifyTime != undefined){
				$scope.group.lastModifyTime = $filter("date")(new Date($scope.branch.mark.lastModifyTime),"yyyy-MM-dd");
				/*$scope.group.lastModifyTime = new Date($scope.branch.mark.lastModifyTime);*/
			}
			for ( var i = 0; i < $scope.pbranch.children.length; i++) {
				for ( var int = 0; int < $scope.branch.children.length; int++) {
					if($scope.branch.children[int].otherid!=1&&$scope.pbranch.children[i].otherid!=1){
						if($scope.branch.children[int].mark.roleType==2&&$scope.pbranch.children[i].mark.roleType==2){
							if($scope.branch.children[int].mark.roleId==$scope.pbranch.children[i].mark.roleId){
								$scope.group.pRoles.push($scope.branch.children[int].mark.roleId);
								$scope.group.roleNames.push($scope.branch.children[int].mark.roleName);
							}
							
						}
						
					}
				}
			}
			
    	}
    	
    }
    //获取父节点角色弹框
    $scope.findParentRole = function(type){
    	 $scope.treeRoleType=1;
    	 ngDialog.open({
		        template: 'html/system/authority/bindRole.html',
		        plain: false,
		        className: 'ngdialog-theme-default',
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        scope: $scope,
		        width:'45%'
		});
		$scope.showRoleBinding=true;
		var childrens=[];
		$scope.data.treeRole=[];
		$scope.groupParentRoles=new Array();
		if(type==0){
			childrens=$scope.branch.children;
		}else{
			childrens=$scope.pbranch.children;
		}
		var index=0;
		 for ( var i = 0; i < childrens.length; i++){
			 if(childrens[i].otherid!=1){
				 if(childrens[i].mark.roleType == 2&&childrens[i].otherid!=1){
					 var branch={
								children:childrens[i].children,
								expanded:childrens[i].expanded,
								id: childrens[i].id,
								isAvailable: childrens[i].isAvailable,
								label: childrens[i].label,
								mark: childrens[i].mark,
								otherid:childrens[i].otherid,
								pid: childrens[i].pid,
								selected: childrens[i].selected
								}
					 if($scope.group.pRoles!=null){
						 for ( var int = 0; int < $scope.group.pRoles.length; int++) {
								if(childrens[i].mark.roleId==$scope.group.pRoles[int]){
									branch.selected=true;						
								}
							}
					 }
					 $scope.data.treeRole[index]=branch;
					 $scope.groupParentRoles.push(branch);
					 index++;
						
				 }
				 
			 }
		 	}
		}
    $scope.groupParentRoles={};
    $scope.select={};
    $scope.select.roles=[];
    $scope.insertOrUpdateGroup = function () {
        var url = '/security/api/userGroup/insert';
        var param = $scope.group;
        var groupCreateTime = $("#groupCreateTime").val();
    	var groupLastModifyTime = $("#groupLastModifyTime").val();
        $scope.group.createTime = new Date(groupCreateTime);
	    $scope.group.lastModifyTime = new Date(groupLastModifyTime);
        var isAdd=true;
        if ($scope.group.groupId != null) {
        	isAdd=false;
            url = '/security/api/userGroup/update';
        }
        if($scope.group.name==null||$scope.group.name==undefined||$scope.group.name==""){
        	notifications.showWarning("用户组名字不能为空");
        	return false;
        }
        if($scope.group.name.length>50){
        	notifications.showWarning("用户组名称字数不能超过50个字符");
        	return false;
        }
        if($scope.group.description.length>150){
        	notifications.showWarning("描述信息字数不能超过150个字符");
        	return false;
        }
        for (var item in param) {
            if (param[item] == undefined) {
                delete param[item];
            }
            if (item =="role") {
                delete param[item];
            }
            
        }
        param.roles=$scope.group.pRoles;
        param.allroles=new Array();
        
        for ( var i = 0; i< $scope.groupParentRoles.length; i++) {
        	param.allroles.push($scope.groupParentRoles[i].mark.roleId);
		}
        requestService.post(url, param).then(
            function (data) {
            	var branch={
            	};
            	branch.id=data.data.groupId;
            	if($scope.branch.pid!=null){
            		branch.pid=$scope.group.pId;
        		}
            	$scope.group.groupId=data.data;
            	branch.label=$scope.group.name;
            	branch.otherid=1;
            	branch.children=new Array();
            	branch.mark=data.data;
            	var childrens =$scope.branch.children;
            	for ( var int2 = 0; int2 < $scope.select.roles.length; int2++) {
            		var rolebranch=$scope.select.roles[int2];
            		rolebranch.selected=false;
            		rolebranch.pid=branch.id;
            		var save=true;
            		for ( var int3 = 0; int3 < childrens.length; int3++) {
						if(childrens[int3].otherid!=1&&$scope.select.roles[int2].mark.roleId==childrens[int3].mark.roleId){
							save=false;
						}
					}
            		if(save){
            			childrens.push(rolebranch);
            		}
            		
				}
            	var newChild=new Array();
        		var childIndex=0;
        		if(childrens.length>0){
        			for ( var int = 0; int < childrens.length; int++) {
    					if(childrens[int].otherid!=1&&childrens[int].mark.roleType==2){
    						if($scope.select.roles.length<=0&&!isAdd&&$scope.group.pRoles.length>0){
    							newChild.push(childrens[int]);
    						}
    						for ( var int2 = 0; int2 < $scope.select.roles.length; int2++) {
    							if($scope.select.roles[int2].mark.roleId==childrens[int].mark.roleId){
    								
    								var newbranch={
    				            	};
    								for ( var param in childrens[int]) {
    									if(param!="parent_uid"&&param!="uid"){
    										newbranch[param]=childrens[int][param];
    									}
    									
									}
    				            	newbranch.pid=branch.id;
    								newChild.push(newbranch);
    								break;
    							}else{
    								var isHas=true;
    								if($scope.pbranch!=null){
	    								for ( var int3 = 0; int3 < $scope.pbranch.children.length; int3++) {
	    									if($scope.pbranch.children[int3].otherid!=1&&$scope.pbranch.children[int3].mark.roleType==2&&childrens[int].mark.roleId==$scope.pbranch.children[int3].mark.roleId){
	    										isHas=false;
											}
										}
    								}else{
    									isHas=false;
    								}
    								if(isHas){
    									var newbranch={
        				            	};
    									for ( var param in childrens[int]) {
    										if(param!="parent_uid"&&param!="uid"){
        										newbranch[param]=childrens[int][param];
        									}
										}
        				            	newbranch.pid=branch.id;
        								newChild.push(newbranch);
    									break;
    								}
    							}
    						}
    					}else if(!isAdd){
    						newChild.push(childrens[int]);
    					}
    				}
        		}
            	if(isAdd){
            		if(data.data.role!=null){
            			var branchRole={
                    	};
            			branchRole.id=data.data.role.roleId;
                    	branchRole.pid=branch.id;
                    	branchRole.label=data.data.role.roleName;
                    	branchRole.otherid=2;
                    	branchRole.mark=data.data.role;
                    	newChild.push(branchRole);
            		}
            		branch.children=newChild;
            		branch.mark=data.data;
            		$scope.groupTree.add_branch($scope.branch,branch);
            	}else{
            		branch.id=$scope.branch.id;
            		branch.mark=data.data;
            		branch.children=newChild;
            		$scope.groupTree.update_branch($scope.pbranch,branch);
            	}
            	getTreeData();
				notifications.showSuccess("添加/修改成功");
                $scope.showCreateRoleTable=false;
                $scope.showUserDataTable=true;
                $scope.goBack();
            }, function (error) {
				notifications.showError("添加/修改失败");
                $scope.goBack();
            }
        );
    };
    //删除用户组
    $scope.removeGroup = function(){
            var group = $scope.branch.mark;
            if ($scope.branch.otherid== 1) {
                if (!confirm("确定删除" + group.name+ "吗？")){
                    return;
                }
                var url = '/security/api/userGroup/delete';
                var param = {
                    groupId: group.groupId
                };
                requestService.post(url, param).then(
                    function (data) {
                    	var branch={
                    	};
                    	branch.id=group.groupId;
                    	branch.pid=$scope.branch.pid;
                    	//$scope.groupTree.deleteBranch(branch);
                    	getTreeData();
						notifications.showSuccess("删除完成");
                        $scope.isRole=false;
                    	$scope.showCreateRoleTable=false;
                        $scope.showUserDataTable=true;
                    	$scope.goBack();

                    }, function (error) {
						notifications.showError("删除失败");
                        $scope.goBack();
                    }
                );
            }
        }
	
	//初始化创建用户数据
	var intArg = function(){
		$scope.user = {
			name: '',
			telephone: '',
			email: '',
			description: '新创建用户',
			beginTime:Format,
			endTime: Format,
			createTime: Format,
			editTime: Format,
			orgName:null,
			passwordTwo:'',
			password:'',
			userType:1
		};
		$scope.user.userParamTypeSelect= [{
            selectVal: 0,
            selectName: '系统外用户'
        }, {
            selectVal: 1,
            selectName: '系统内用户'
        }];
	}
	intArg();
	//创建新用户
	$scope.createUser=function(){
		$scope.form_title="新建用户";
		var tenantId=$scope.branch.mark.tenantId;
    	if(tenantId==null||tenantId==''){
			notifications.showWarning("当前选择用户组或角色非法");
    		return;
    	}
		intArg();
		$scope.showUserDataTable=false;
		$scope.showCreateUserTable=true;
		$scope.showCreateGroupTable=false;
    	$scope.showCreateRoleTable=false;
    	$scope.showRoleBinding=false;
    	$scope.user.roleNames=new Array();
    	$scope.user.userRoles=new Array();
    	$scope.user.tenantId=tenantId;
    	$scope.user.userTypeSelect= [{
            selectVal: 0,
            selectName: '系统外用户'
        }, {
            selectVal: 1,
            selectName: '系统内用户'
        }];
		
		//用户组
		 if ($scope.branch.otherid== 1) {
			$scope.user.groupId=$scope.branch.mark.groupId;
			$scope.user.groupName=$scope.branch.mark.name;
			
		}else{
			$scope.user.groupId=$scope.pbranch.mark.groupId;
			$scope.user.groupName=$scope.pbranch.mark.name;
			$scope.user.userRoles.push($scope.branch.mark.roleId);
			$scope.user.roleNames.push($scope.branch.mark.roleName);
		}
		$scope.user.userType=1;
		$scope.user.userId=null;
	}
	//修改用户信息
	$scope.updateItem = function(row) {
		$scope.form_title="修改用户信息";
		$scope.isUser=true;
		$scope.showUserDataTable=false;
		$scope.showCreateUserTable=true;
		$scope.user = row.data;
		$scope.user.roles=row.data.roles;
		$scope.user.roleNames=new Array();
		$scope.user.userRoles=new Array();
		var param={};
		for ( var int = 0; int < row.data.roles.length; int++) {
			$scope.user.roleNames.push(row.data.roles[int].roleName);
			$scope.user.userRoles.push(row.data.roles[int].roleId);
		}
		if (row != null && row.data != null) {
			// 对象拷贝
			for (var item in row.data) {
				if (row.data[item] == undefined || (typeof(row.data[item]) === "object")) {
					continue;
				}
				$scope.user[item] = row.data[item];
				if(item=="beginTime" || item=="endTime" || item=="createTime" || item=="editTime"){
					param[item] =$filter("date")($scope.user[item],"yyyy-MM-dd"); 
				}
			}
			// 日期处理,否则无法显示和更新
			if (row.data.beginTime != undefined){
				$scope.user.beginTime = $filter("date")(row.data.beginTime,"yyyy-MM-dd");
			}
			if (row.data.endTime != undefined){
				$scope.user.endTime = $filter("date")(row.data.endTime,"yyyy-MM-dd");
			}
			if (row.data.createTime != undefined){
				$scope.user.createTime = $filter("date")(row.data.createTime,"yyyy-MM-dd");
			}
			if (row.data.editTime != undefined){
				$scope.user.editTime = $filter("date")(row.data.editTime,"yyyy-MM-dd");
			}else{
				$scope.user.editTime = $filter("date")(today,"yyyy-MM-dd");
			}
			$scope.user.userType=0;
			if (row.data.userType != undefined&&row.data.userType<4){
				$scope.user.userType =row.data.userType;
			}
			if(row.data.employee!=null){
				$scope.employeeId=row.data.employee.employeeId;
				$scope.empName=row.data.employee.name;
			}
			
		} else {
			notifications.showWarning("没有回写的数据");
			$scope.goBack();
		}
	}
	
	//遍历找出树中被选中的项
	var findSelected = function(selection, e, includeIndeterminate){
		if(e.children != null){
			for(var item in e.children){
				findSelected(selection, e.children[item], includeIndeterminate);
			}
		}
		if(includeIndeterminate){
			if(e.selected || e.indeterminate ){
				selection.push(e);
			}
		} else {
			if(e.selected){
				selection.push(e);
			}
		}
	}
	//遍历找出树中角色被选中的项
	var findSelectedByRoleId = function(selection, e,condition){
		if(e.children != null){
			for(var item in e.children){
				findSelectedByRoleId(selection, e.children[item],condition);
			}
		}
		if(e.otherid!=1&&e.mark.roleId==condition){
			selection.push(e);
		}
		
	}
	$scope.authenInfo;	 // 授权信息
	$scope.data = {};    
	$scope.data.tree = [];	
	$scope.data.treeEmp = [];	
	
	$scope.saveEmp = function(){
		$scope.showCreateUserTable=true;
		$scope.showEmployeeBinding=false;
		var selection = new Array(); // 被选中项数组
		for(var item in $scope.data.treeEmp){
			var e = $scope.data.treeEmp[item];
			var includeIndeterminate = false;
			findSelected(selection, e, includeIndeterminate);
		}
		// 绑定员工ID
		$scope.employeeId = selection[0].mark.employeeId;
	}
	
	//获取员工信息
	$scope.bindEmp = function(){
		$scope.showCreateUserTable=false;
		$scope.showEmployeeBinding=true;
		
		var url = '/security/api/employee/empTreeBund';
		$scope.pbranch;
		var param = {
				orgId:$scope.pbranch.mark.orgId
		};
		requestService.post(url, param).then(
			function(data){
				$scope.data.treeEmp = data.data;
			},function(error){
			}
		);
	}
	$scope.showRoleBinding=false;
	//获取角色信息弹框
	$scope.bindRole = function(){
		 $scope.treeRoleType=2;
		 ngDialog.open({
		        template: 'html/system/authority/bindRole.html',
		        plain: false,
		        className: 'ngdialog-theme-default binfRole_ngdialog',
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        scope: $scope,
		        width:'35%'
		});
		$scope.showRoleBinding=true;
		var childrens=[];
		$scope.data.treeRole=[];
		if ($scope.branch.otherid== 1) {
			childrens=$scope.branch.children;
			
		}else{
			childrens=$scope.pbranch.children;
		}
		var index=0;
		for ( var i = 0; i < childrens.length; i++){
			 if(childrens[i].otherid!=1){
				 var branch={
					children:childrens[i].children,
					expanded:childrens[i].expanded,
					id: childrens[i].id,
					isAvailable: childrens[i].isAvailable,
					label: childrens[i].label,
					mark: childrens[i].mark,
					otherid:childrens[i].otherid,
					pid: childrens[i].pid,
					selected: childrens[i].selected
				}
				if(childrens[i].mark.roleType==0){
					  var url = '/security/api/role/getUserByRoleId';
			            var param = {
			                roleId: childrens[i].mark.roleId
			            };
			            requestService.post(url, param).then(
			                function (data) {
			                	if((data.data.result.length<=0)||($scope.user.userId==data.data.result[0].userId)){
					            	if($scope.user.roles!=null){
										 for ( var r = 0; r <  $scope.user.roles.length; r++) {
												if(branch.mark.roleId==$scope.user.roles[r].roleId){
													branch.selected=true;
												}
											}
									 }
					            	$scope.data.treeRole[index]=branch;
					            	 index++;
					            }
			                }, function (error) {
			                	hasUser=true;
			                }
			            );
			            
	    			}else{
					 if($scope.user.roles!=null){
						 for ( var r = 0; r <  $scope.user.roles.length; r++) {
								if(childrens[i].mark.roleId==$scope.user.roles[r].roleId){
									branch.selected=true;
								}
							}
					 }
					 $scope.data.treeRole[index]=branch;
	            	 index++;
			 	}
			}
		}
	}
	//$scope.showRoles=false;
	
	$scope.saveRole = function(type){
		$scope.showRoleBinding=false;
		ngDialog.close($scope.ngDialogId);
		if(type==1){
			$scope.group.roleNames=new Array();
			$scope.group.pRoles=new Array();
			$scope.showCreateGroupTable=true;
		}else{
			$scope.user.userRoles=new Array();
			$scope.user.roleNames=new Array();
			$scope.showCreateUserTable=true;
		}
		
		
		$scope.select={};
		$scope.select.roles=new Array();
		$scope.user.roles=new Array();
		var selection = new Array(); // 被选中项数组
		for(var item in $scope.data.treeRole){
			var e = $scope.data.treeRole[item];
			var includeIndeterminate = false;
			findSelected(selection, e, includeIndeterminate);
		}
		console.log($scope.user);
		for ( var int = 0; int < selection.length; int++) {
			//去除重复元素
			var tempFlag = false;
			if($scope.user && $scope.user.roleNames){
				for(var i = 0;i<$scope.user.roleNames.length;i++){
					if($scope.user.roleNames[i] == selection[int].mark.roleName){
						tempFlag = true;
					}
				}	
			}
			if(!tempFlag){
				if(type==1){
					$scope.group.pRoles.push(selection[int].mark.roleId);
					$scope.group.roleNames.push(selection[int].mark.roleName);
				}
				else{
					$scope.user.roles.push(selection[int].mark);
					$scope.user.userRoles.push(selection[int].mark.roleId);
					$scope.user.roleNames.push(selection[int].mark.roleName);
				}
				$scope.select.roles.push(selection[int]);
			}
		}
	}
	// 获取用户/角色授权信息
	var authen2userorrole = function(type){
		var url = '/security/api/function/authenTree';
		var param = {};
		if(type == 'user'){
			param.ownerId = $scope.user.userId;
			param.ownerType = 2;
			$scope.authenInfo = $scope.user;
			$scope.authenInfo.title = "用户" + $scope.user.name;
		}
		if(type == 'role'){
			param.ownerId = $scope.branch.mark.roleId;
			param.ownerType = 1;
			$scope.authenInfo = $scope.branch;
			$scope.authenInfo.title = "角色" + $scope.branch.mark.roleName;
		}
		
		requestService.post(url, param).then(
			function(data){
				$scope.data.tree = data.data;
			},function(error){
			}
		);
	}
	$scope.goBackForEmpoyee = function(type){
		if(type==2){
			$scope.showCreateUserTable=true;
		}else{
			$scope.showCreateGroupTable=true;
		}
		ngDialog.close($scope.ngDialogId);
		$scope.showEmployeeBinding=false;
		$scope.showRoleBinding=false;
	}
	$scope.isSelf=true;
	$scope.authorityType=0;
	$scope.redio={};
	$scope.redio.userId={};
	$scope.redio.top={};
	// 选中用户
	$scope.selectRow = function(row){
		$scope.authorityType=1;
		$scope.isSelected = !$scope.isSelected;
		var redioUserId=parseInt($scope.redio.userId);
		if(redioUserId==$scope.redio.top){
			$scope.redio.userId=0;
			$scope.redio.top=0;
		}else{
			$scope.redio.userId=row.data.userId;
			$scope.redio.top=row.data.userId;
		}
		if($scope.redio.userId!=0){
			$scope.isUser=true;
			$scope.authorityType=1;
		}else{
			$scope.isUser=false;
			$scope.authorityType=0;
		}
		if($scope.redio.userId!=0){
			$scope.user = row.data;
			$scope.isAuth=true;
		} else {
			$scope.goBack();
		}
		var name=$cookieStore.get("name");
		var uname=$scope.user.name;
		if(uname!=name){
			$scope.isSelf=false;
		}else{
			$scope.isSelf=true;
		}
	}
	//日期初始化
	var format=function(){
		$scope.user.beginTime = Format;
		$scope.user.endTime = Format;
		$scope.user.createTime = Format;
		$scope.user.editTime = Format;
	}
	// 新增或修改
	$scope.insertOrUpdate = function(){
		var userBeginTime = $("#userBeginTime").val();
    	var userEndTime = $("#userEndTime").val();
		var url = '/security/api/user/insert';
		$scope.user.roles=null;
		$scope.user.roleNames=null;
		if($scope.user.userId==null){
			if($scope.user.realName==null||$scope.user.realName.length<=0){
				notifications.showWarning("用户名不能为空!");
				format();
				return;
			}
			if($scope.user.realName.length>50){
				notifications.showWarning("用户名字数长度不能超过50个字符!");
				format();
				return;
			}
			if($scope.user.password==null||$scope.user.password.length<=0){
				notifications.showWarning("请设置用户密码!");
				format();
				return;
			}
			if($scope.user.password.length>50){
				notifications.showWarning("密码长度不能超过50个字符!");
				format();
				return;
			}
			if($scope.user.name.length>18){
				notifications.showWarning("请输入正确的联系电话!");
				format();
				return;
			}
			if($scope.user.email.length>50){
				notifications.showWarning("邮箱长度不能超过50个字符!");
				format();
				return;
			}
			if($scope.user.description.length>150){
				notifications.showWarning("描述信息长度不能超过150个字符!");
				format();
				return;
			}
			if($scope.user.passwordTwo==null||$scope.user.passwordTwo.length<=0||$scope.user.passwordTwo!=$scope.user.password){
				notifications.showWarning("两次输入密码不一致!");
				format();
				return;
			}
			if(($scope.user.userType==1&&$scope.employeeId==null)||($scope.user.userType==1&&$scope.employeeId=='')){
				notifications.showWarning("系统内用户必须绑定员工!");
				format();
				return;
			}
			if(($scope.user.userType==1&&$scope.empName==null)||($scope.user.userType==1&&$scope.empName=='')){
				notifications.showWarning("系统内用户必须绑定员工!");
				format();
				return;
			}
			if($scope.empName!=''&&$scope.empName!=null&&$scope.employeeId!=null&&$scope.employeeId!=''){
				$scope.user.userType=1;
			}
		}else{
			if($scope.user.name==null||$scope.user.name.length<=0){
				notifications.showWarning("用户名不能为空!");
				format();
				return;
			}
			if($scope.user.name.length>50){
				notifications.showWarning("用户名字数长度不能超过50个字符!");
				format();
				return;
			}
			if($scope.user.telephone.length>18){
				notifications.showWarning("请输入正确的联系电话!");
				format();
				return;
			}
			if($scope.user.email.length>50){
				notifications.showWarning("邮箱长度不能超过50个字符!");
				format();
				return;
			}
			if($scope.user.description.length>150){
				notifications.showWarning("描述信息长度不能超过150个字符!");
				format();
				return;
			}
			if(($scope.user.userType==1&&$scope.employeeId==null)||($scope.user.userType==1&&$scope.employeeId=='')){
				notifications.showWarning("系统内用户必须绑定员工!");
				format();
				return;
			}
			if(($scope.user.userType==1&&$scope.empName==null)||($scope.user.userType==1&&$scope.empName=='')){
				notifications.showWarning("系统内用户必须绑定员工!");
				format();
				return;
			}
			if($scope.empName!=''&&$scope.empName!=null&&$scope.employeeId!=null&&$scope.employeeId!=''){
				$scope.user.userType=1;
			}
		}
		var param = $scope.user;
		$scope.user.beginTime = new Date(userBeginTime);
		$scope.user.endTime = new Date(userEndTime);
		$scope.user.createTime = new Date($scope.user.createTime);
		$scope.user.editTime = new Date($scope.user.editTime);
		if($scope.branch!=null&&$scope.user.userId==null){
			param.roleId = $scope.branch.mark.roleId;
		}
		
		if($scope.employeeId!=null&&$scope.employeeId!=''){
			param.employeeId = $scope.employeeId;
		}
		param.userRoles=$scope.user.userRoles;
		param.creator=$cookieStore.get("userId");
		for(var item in param){
    		if(param[item] == undefined){
    			delete param[item];
    		}
    	}
		requestService.post(url, param).then(
			function(data){
					var users = $scope.dataProvider.getGridModel();
					if (param.userId == null) {
						users.push(data.data);
					} else {
						for ( var item in users) {
							if (users[item].userId == param.userId) {
								users.splice(item,1,data.data);
							}
						}
					}
					$scope.dataProvider
							.setModel(users);
					notifications.showSuccess("添加/修改成功");
					$scope.goBack();

			},function(data){
				if (data.code == 10409) {
					notifications.showError("添加失败,用户名已经存在！");
					$scope.goBack();
				}else{
					notifications.showError("添加/修改失败");
					$scope.goBack();
				}
				
			}
		);
	};
	// 密码重置
	$scope.restPassword = function(row){
		var url = '/security/api/user/restPassword';
		if(!confirm("确定重置[ " + row.data.name + " ]的密码吗？")){
			return;
		}
		var param={
				name:row.data.name,
				userId:row.data.userId
		}
		requestService.post(url, param).then(
			function(data){
					notifications.showSuccess("密码重置成功！");

			},function(data){
				notifications.showError("密码重置失败！");
			}
		);
	};
	// 删除数据
	$scope.removeRow = function removeRow(row) {
		if(!confirm("确定删除" + row.data.name + "吗？")){
			return;
		}
		var url = '/security/api/user/delete';
		var param = {
			userId: row.data.userId
		};
		
		requestService.post(url, param).then(
			function(data){
				var users = $scope.dataProvider.getGridModel();
				for(var item in users){
					if(users[item].userId == param.userId){
						users.splice(item,1);
					}
				}
				if($scope.branch.otherid == 2&&$scope.branch.mark.roleType==0&&users.length<=0){
					$scope.isAddUser=true;
				}
				notifications.showSuccess("删除成功");
				$scope.goBack();
			
			},function(error){
				
				$scope.goBack();
			}
		);
		
    }
	

	
	$scope.goBack = function(){
		$scope.showTable = 1;
		$scope.isUser=false;
		$scope.isSelected = false;
		$scope.authenInfo = null;
		$scope.employeeId = null;
		$scope.empName = null;
		$scope.showCreateUserTable=false;
		$scope.showCreateRoleTable=false;
		$scope.showAuthorized=false;
		$scope.showEmployeeBinding=false;
		$scope.showUserDataTable=true;
		$scope.showCreateGroupTable=false;
		$scope.isRoleOption=true;
		$scope.user = {};
		intArg();
	}
	
	//$scope.dicId_userType = userType;
    $scope.$on('$destroy',function(){
    	$scope.dataProvider = null;
    	$scope.data = null;
    	
    	parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
	  			this.$$childTail = null;
    	
    	$scope.roles = null;
    	$scope.branch = null;
    	
    	$scope.showTable = null;
		$scope.isSelected = null;
		$scope.user = null;
		
		$scope.roles = null;
    	
  	});
    $scope.showEmpower = function(){
    	ngDialog.open({
		    template: 'html/system/authority/empower.html',
			scope:$scope,
			controller: 'empowerController',
		    className: 'ngdialog-theme-default',
		    width:'50%'
		});
		requestService.setNgDialog($scope.ngdialog);
	}
    $scope.closeEmpower=function(){
    	ngDialog.close($scope.ngDialogId);
    }
  //人员选择框
  	$scope.empTreeShow = true;//人员选择树可用
	$scope.showEmpList = function(e){
		ngDialog.open({
		    template: 'template/empList.html',
			width:'60%',
			scope:$scope,
			controller: 'empSelectController',
		    className: 'ngdialog-theme-default emplist_ngdialog' 
		});
	}
	$scope.selectEmp = function(e){
		$scope.employeeId = null;
		$scope.empName = null;
		if (e == null) {
			notifications.showWarning("您没有选择一个人员");
			return;
		}
		if(e.userName){
			notifications.showWarning("该员工已经被绑定，请选择其他员工");
			return;
		}
		var chooseRowData = angular.copy(e);
		$scope.employeeId = chooseRowData.employeeId;
		$scope.empName = chooseRowData.name;
		ngDialog.close($scope.ngDialogId);
	}
}]);
