App.controller('empowerController', [
'$scope','$rootScope', 'ngDialog', '$timeout', 'requestService','notifications','lgLocalDataProviderFactory','lgServerDataProviderFactory',
function($scope,$rootScope,ngDialog, $timeout, requestService,notifications,lgLocalDataProviderFactory,lgServerDataProviderFactory) {
	
	$scope.data = {};			
	$scope.data.tree = [];
	$scope.showAuthorized=false;
	$scope.authenInfo={};
	$scope.authenInfo.title="test";
	$scope.dataProvider = null;
	$scope.authbranch={};
	$scope.data.treeAuthority=[];

	$scope.data.isOrg=0;

	// 遍历找出树中被选中的项
	var findSelected = function(selection, e,selectType){
		if(e.children != null){
			for(var item in e.children){
				findSelected(selection, e.children[item],selectType);
			}
		}
		var has=false;
		if(selection.length>0){
			for ( var i = 0; i < selection.length; i++) {
				if(e.id==selection[i].id){
					has=true;
				}
			}
		}
		if(selectType&&!has){
			if(e.selected){
				selection.push(e);
			}
		}

		if(!selectType&&!has){
			if(e.indeterminate){
				selection.push(e);
			}
		}

	}
	// 过滤样式有的节点可能是新安装的，一旦有新安装的那么所有的显示样式都要改变
	// 一个是检验新加样节点选中状态，一部分是纠正错误的选中状态
	var checkSelected = function(e){
		if(e.children != null&&e.children.length>0){
			var isSelected=false;
			var indeterminate=false;
			var isNot=false;
			for(var item in e.children){
				var c =checkSelected(e.children[item]);
				if(c==1){
					isSelected=true;
				}else if(c==0){
					indeterminate=true;
				}else if(c==2){
					isNot=true;
				}
				
			}
			//子节点非全选
			if(indeterminate||(isNot&&isSelected)){
				e.selected=false;
				e.indeterminate=true;
				return 0;
		    //子节点全不选状态
			}else if(!isSelected&&!indeterminate){
				e.selected=false;
				e.indeterminate=false;
				return 2;
			//子节点全选状态
			}else if(isSelected&&!indeterminate&&!isNot){
				e.selected=true;
				e.indeterminate=false;
				return 1;
			}
		}else{
			if(e.selected){
				return 1;
			}else if(e.indeterminate){
				return 0;
			}else{
				return 2;
			}
		}

	}
	$scope.authSelected = function(branch){
		$scope.authbranch=branch;
		if(branch.id==3){
			$scope.data.isOrg=1;
			$rootScope.isOrg=1;
		}else{
			$scope.data.isOrg=0;
			$rootScope.isOrg=0;
		}
		// 默认为角色授权参数
		var param = {
				ownerType: 1    // 1:角色, 2:用户，3:用户组
		}
		if($scope.branch!=null){
			param.pId=$scope.branch.pid;
			param.ownerId=$scope.branch.id;
		}
		
		if($scope.authorityType==0){
			//用户组授权
			if($scope.branch.otherid==1){
				param.ownerType=3;
			}else{
				//角色授权
				param.ownerType=1;
			}
		}else{
			//用户授权
			param.pId=$scope.user.groupId;
			param.ownerId=$scope.user.userId;
			param.ownerType=2;
		}
		if(branch.url!=null){
			requestService.post(branch.url, param).then(
					function(data){
						if(data.data!=null&&branch.id==1){
							for(var item in data.data){
								checkSelected(data.data[item]);
							}
			        	}
						$rootScope.allTreeData=angular.copy(data.data);
						if(data.data!=null){
			        		for ( var i = 0; i < data.data.length; i++) {
			        			if(data.data[i].children!=null&&data.data[i].children.length>0){
			        				data.data[i].hasChildren=true;
			        			}
			        			data.data[i].children=[];
			        			
							}
			        	}
						$scope.data.treeAuthority = data.data;
					},function(error){
					}
				);
		}
		
	}
	//权限去除校验
	$scope.unSelected=function(level){
		if(level==null){
			level=$rootScope.unSelectLevel
		}
		if($scope.authorityType!=0){
			$rootScope.isNextc=true;
			return;
		}
 		if(!level.selected){
 			var param={};
 			if($scope.branch.otherid==1){
				param.ownerType=3;
			}else{
				//角色授权
				param.ownerType=1;
			}
 			param.ownerId=$scope.branch.id;
 			param.funcId=level.id;
 			param.label=$scope.authbranch.label;
 			var url = '/security/api/userGroup/checkGroupRole'; 
	 		return requestService.post(url,param, 
	 				true).then(function (data) {
	 					$rootScope.isNextc=data.data;
	 					if(!data.data){
	 						level.selected = !(data.data)
							notifications.showWarning("该权限已经在使用，不能删除");
	 						
	 					}
	 		},function (data){
	 			level.selected=!level.selected;
	 		}); 
    	}
 	}
   var getTreeData = function() {
		$scope.data.tree = [{
			children:[{
				id: 3,
				isAvailable: null,
				label: "机构授权",
				mark: null,
				otherid: null,
				pid:2,
				url:"/security/api/organization/getOrgTreeByAuth",
				auth:"/security/api/authority/setAuthorAgency",
				selected: true
			}],
			id: 2,
			isAvailable: null,
			label: "数据授权",
			mark: null,
			otherid: null,
			pid: null,
			selected: false
		},{
			id: 1,
			children:null,
			isAvailable: null,
			label: "功能授权",
			otherid: null,
			pid: null,
			url:"/security/api/function/authenTree",
			auth:"/security/api/authority/setAuthor",
			selected: false,
		}
		/*,{
			id:4,
			children:null,
			isAvailable: null,
			label: "消息授权(订阅)",
			otherid: null,
			pid: null,
			url:"/security/api/topic/authenTree",
			auth:"/security/api/authority/setAuthorTopic",
			selected: false
		}*/
		
		];
		var selectiontree = new Array();
		for(var item in $scope.data.tree){
			var e = $scope.data.tree[item];
			var includeIndeterminate = true;
			findSelected(selectiontree, e, includeIndeterminate);
		}
		var branchs=selectiontree[0];
		 $scope.authbranch=branchs;
		 $scope.authSelected(branchs);
		/*var param={};
		requestService.post(selectiontree[0].url, param).then(
				function(data){
					$scope.data.treeAuthority = data.data;
				},function(error){
				}
			);*/
	};
		getTreeData();
		// 选中一个授权类型
		
		
		// 授权保存
		$scope.saveRoleAuthen = function(){
			var selection = new Array(); // 被选中项数组
			var select = new Array();
			if($scope.authbranch.id==1){
				for(var item in $scope.data.treeAuthority){
					var e = $scope.data.treeAuthority[item];
					var includeIndeterminate = true;
					findSelected(select, e, false);
				}
				for(var item in $scope.data.treeAuthority){
					var e = $scope.data.treeAuthority[item];
					var includeIndeterminate = true;
					findSelected(selection, e, true);
				}
				for(var item in $rootScope.allTreeData){
					var e = $rootScope.allTreeData[item];
					var includeIndeterminate = true;
					findSelected(select, e, false);
				}
				for(var item in $rootScope.allTreeData){
					var e = $rootScope.allTreeData[item];
					var includeIndeterminate = true;
					findSelected(selection, e, true);
				}
			}else{
				for(var item in $scope.data.treeAuthority){
					var e = $scope.data.treeAuthority[item];
					var includeIndeterminate = true;
					findSelected(selection, e, true);
				}
				for(var item in $rootScope.allTreeData){
					var e = $rootScope.allTreeData[item];
					var includeIndeterminate = true;
					findSelected(selection, e, true);
				}
			}
			
			
			var url = $scope.authbranch.auth;
			var selectedId = new Array();
			var selectionId = new Array();
			if($scope.authbranch.id!=3){
				for(var item in selection){
					if(selection[item] != undefined&&selection[item] !=''){
						selectedId.push(selection[item].id)
					}
				}
				for(var item in select){
					if(select[item] != undefined&&select[item]!=''){
						selectionId.push(select[item].id)
					}
				}
			}
			else{
				
				for(var item in selection){
					if(selection[item] != undefined&&selection[item] !=''){
						selectedId.push(selection[item].id)
					}
				}
				
			}
		
			for(var item in selectedId){
    			if(selectedId[item] == undefined) delete selectedId[item];
    		}
			for(var item in selectionId){
    			if(selectionId[item] == undefined) delete selectionId[item];
    		}
			// 默认为角色授权参数
			var param = {
					selectedId: selectedId,
					ownerType: 1    // 1:角色, 2:用户，3:用户组
			}
			if($scope.branch){
				param.ownerId = $scope.branch.id;
			}
			if($scope.authbranch.id!=3){
				param.selectionId=selectionId;
			}
			if($scope.authorityType==0){
				//用户组授权
				if($scope.branch.otherid==1){
					param.ownerType=3;
				}else{
					//角色授权
					param.ownerType=1;
				}
			}else{
				//用户授权
				param.ownerId=$scope.user.userId;
				param.ownerType=2;
			}
			
			requestService.post(url, param).then(
				function(data){
					notifications.showSuccess("授权成功！");
					$scope.closeEmpower();
					$scope.authenInfo = null;
				},function(error){
					notifications.showError("授权失败！");
				}
			);
		}
		
}
		  
]);