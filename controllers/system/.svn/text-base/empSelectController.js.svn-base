App.controller('empSelectController',
		['$scope', 'ngDialog', '$timeout', 'notifications','requestService', 'lgServerDataProviderFactory', 'pagerService', 'cacheService',
		 function($scope, ngDialog, $timeout, notifications,requestService, lgServerDataProviderFactory, pagerService, cacheService) {
			//创建对象，传入http服务，分页的page类
		 	//分页查询条件
		 	$scope.dataProvider = null;
		 	var pager = angular.copy(pagerService);
		    $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pager);
		 	
		 	//左边机构树
		     $scope.orgEmpData = [];
		     $scope.orgEmpTree = empTree = {};
		     
		 	var init = function() {
		 		var url = '/security/api/organization/getOrgTree';
		 		var param = {
		 			orgType: 0	
		 		};
		 		return requestService.post(url, param).then(function (data) {
		 			data.data[0].expanded = true;
		 			$scope.orgEmpData = data.data;
		 			// 初始化选择某个机构
		 			if ($scope.selectedBranchId != null) {
		 				$timeout(function(){empTree.selectedById($scope.selectedBranchId);});
		 			}
		 			//初始化人员信息
		 		});
		 	};
		 	init();
		 	// 监听
		 	$scope.$watch("selectedBranchId", function(newValue) {
		 		if(newValue == null){
					return;
		 		}
		 		// 初始化选择某个机构
		 		if ($scope.selectedBranchId != null) {
		 			$timeout(function(){empTree.selectedById($scope.selectedBranchId);});
		 		}
		 	});
		 	
		 	//包含子机构员工设置
		 	$scope.includeSub = true;
		 	$scope.branch = {};
		 	
		 	// 清空查询条件
			$scope.resetQuery = function() {
				$scope.empQry = {};
				if($scope.qryEmp){
	 				$scope.qryEmp = {};	
	 				$scope.orgEmpData = [];
	 				$scope.selectedBranchId = null;
	 				if($scope.choseRowData){
	 					$scope.choseRowData = null;
	 				}
	 				init();
	 				//同步page类
		 			$scope.dataProvider.setViewSettings(null);
		 			//渲染table
		 			$scope.dataProvider.setModel(null);
	 			}			
			}
		 	//选中一个机构
		 	$scope.orgSelected = function(branch){
		 		//$scope.selectedBranchId = branch.id;
		 		$scope.empListFlag = false;
				$scope.showTable = 1;
				$scope.showInOrg=false;
				// 清空查询条件
				$scope.empQry = {};
				var param = {
					orgId: branch.id,
					includeSub: $scope.includeSub,
					changeType:0
				};
				$scope.querytype=0;
				$scope.isSelect=true;
				$scope.selectedBranchId=branch.id;
		 		$scope.branch = branch;
				var param = {
					orgId: branch.id,
					includeSub: $scope.includeSub,
					findKey : $scope.findKey
				};
				param.callout =$scope.callout;
				getPage(param);
		 	}
		 	$scope.readyLoding =function(){
		 		getPage();
		 	}
		 	//获取部门下的员工
		 	var getPage = function(param){
		 		if (param == null) {
					param = {};
				}
				param.orgId = $scope.branch.id;
				param.includeSub = $scope.includeSub;
		 		var url = '/security/api/employee/getEmpByOrg';
		 		if(param.orgId==null||param.orgId==undefined||param.orgId==""){
		 			notifications.showWarning("请选择组织机构");
		 			return false;
		 		}
		 		pager.params = param;
		 		//执行分页查询,如果不需要传递page类请赋值null
		 		$scope.dataProvider.updateFilters(url,pager);
		 		//需要开一个监听
		 		$scope.$watch("dataProvider.data", function(newValue) {
		 			if(newValue===undefined || newValue===null){
		 				return;
		 			}
		 			//同步page类
		 			$scope.dataProvider.setViewSettings(newValue.data);
		 			//渲染table
		 			$scope.dataProvider.setModel(newValue.data.result);
		 		});
		 	}
		 	//点击下级结构人员
		 	$scope.choose_child = function() {
				if($scope.branch == null && !$scope.includeSub){
					$scope.dataProvider.setModel([]);
					/*var  result=new Array();
					 $scope.dataProvider.setModel(result);
					 $scope.dataProvider.reset();*/
					return;
				}
				var param = {
					orgId: $scope.branch.id,
					includeSub: $scope.includeSub,
					findKey : $scope.findKey
				};
				param.callout =$scope.callout;
				getPage(param);
			}
		 	
		 	
		 	/**
		 	 * 单选框控制
		 	 */
		 	$scope.radioCtrl = {};
		 	$scope.radioCtrl.employeeId = {};
		 	var mark = 0;
		 	$scope.choseRowData = null;
		 	
		 	$scope.choseEmp = function(row){
		 		
		 		// 清空
		 		if (!row) {
		 			
		 			$scope.radioCtrl = {};
		 			$scope.radioCtrl.employeeId = {};
		 			mark = 0;
		 			$scope.choseRowData = null;
		 			if($scope.qryEmp){
		 				$scope.qryEmp = {};	
		 				$scope.orgEmpData = [];
		 				$scope.selectedBranchId = null;
		 				init();
		 				//同步page类
			 			$scope.dataProvider.setViewSettings(null);
			 			//渲染table
			 			$scope.dataProvider.setModel(null);
		 			}
		 			return;
		 		}
		 		
		 		var employeeId = parseInt($scope.radioCtrl.employeeId);
		 		
		 		if (employeeId == mark) {
		 			$scope.radioCtrl.employeeId = 0;
		 			mark = 0;
		 			$scope.choseRowData = angular.copy(row.data);
		 		} else {
		 			$scope.radioCtrl.employeeId = row.data.employeeId;
		 			mark = row.data.employeeId;
		 			$scope.choseRowData = null;
		 		}
		 		
		 		if ($scope.choseRowData == null) {
		 			$scope.choseRowData = angular.copy(row.data);
		 		} else {
		 			$scope.choseRowData = null;
		 		}
		 	}
		 	
		 	/**
		 	 * 查询
		 	 */
		 	$scope.qryEmp = {};
		 	$scope.query = function() {
		 		var param = $scope.qryEmp;
		 		param.orgId = $scope.branch.id;
		 		param.includeSub = $scope.includeSub;
		 		param.findKey = $scope.findKey;
		 		param.callout =true;
		 		// 剔除空的
		 		for(var item in param){
		 			if(param[item] == null){
		 				delete param[item];
		 			}
		 		}
		 		getPage(param);
		 	}
		 	
		 	//当组织名称较长时设置样式
		 	setTimeout(function(){
				if($(".strLengthCss").length>0){
					var html=$(".strLengthCss").html();
					if(html.length>20){
						$(".choseRowDataDiv").addClass("tooleng");
					}else{
						$(".choseRowDataDiv").removeClass("tooleng");
					}
				}
			},50)
		 	
		 	// 延时加载
		 	$timeout(function(){
		 		$scope.jobTitleFlag = true;
		 	}, 300);
		 	
		 	//$scope.dicId_jobTitle = jobTitle;
		 	//cacheService.getDic($scope.dicId_jobTitle);
		 	
		 	$scope.$on('$destroy', function() {

		 		$scope.dataProvider = null;
		 		$scope.orgEmpData = null;
		 		$scope.orgEmpTree = null;
		 		$scope.branch = null;
		 		$scope.orgSelected = null;
		 		
		 		parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
		 			this.$$childTail = null;
		 		console.log('empSelectController destroyed');
		 	});
		 	
		 }]);