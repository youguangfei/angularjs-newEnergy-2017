App.controller('packageController', [
	'requestService', '$scope','ngDialog', '$timeout','$filter','lgLocalDataProviderFactory','lgServerDataProviderFactory','notifications','$cookieStore','pagerService',
	function(requestService, $scope,ngDialog, $timeout,$filter,lgLocalDataProviderFactory,lgServerDataProviderFactory, notifications,$cookieStore,pagerService) {

		$scope.dataProvider = null;
		var pagerService2 = angular.copy(pagerService);
    	$scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService2);

		//树菜单
		var getTreeData = function() {
			var url = '/security/api/package/treedata';
			var param = {};     
			return requestService.post(url, param).then(function (data) {
				data.data[0].selected = true;
				$scope.orgData = data.data;
				$scope.orgSelected(data.data[0]);
			});
		};
		
		$scope.orgData = [];
		$scope.orgTree = tree = {};
		getTreeData();

		$scope.module = {};
		$scope.salesPackageId = null;
		$scope.salesPackageName= null;
		$scope.salesPackage=null;
		$scope.selectPackage=null;
		$scope.selectBranch=null;
		//选中树节点
		$scope.orgSelected = function(branch){
			$scope.selectBranch=branch;
			$scope.selectPackage=branch.mark;
			var param = {
				id : branch.id
			};
			$scope.salesPackageName=branch.label;
			$scope.salesPackageId = branch.id;
			
			$scope.getPage(param); 
			$scope.goBack();
		}
		
		//获取销售包下的所有模块
		$scope.getPage = function(param){
			var url = '/security/api/package/getModules';
			requestService.post(url, param).then(
				function(data){
					$scope.dataProvider.setModel(data.data);
				},function(error){
					notifications.showWarning("error");
				}
			);
			
		}
		
		//右边表格
		/*$scope.dataProvider = lgLocalDataProviderFactory.create([]);
		$scope.dataProvider.limitTo(5);*/
		
		$scope.rowSelected = function(row){
		}
		$scope.showTable = false;
		$scope.showCreatePackTable = false;
		$scope.showDataTable=false
		$scope.update = function(row) {
			$scope.showTable = true;
			
			$scope.module = row.data;
			$scope.module.statusSelect = [{
				selectVal: 1,
				selectName: '是'
			}, {
				selectVal: 0,
				selectName: '否'
			}];
		}
		var today=new Date();
		$scope.createPack=function(type){
			if(type==0){
				$scope.salesPackage=$scope.selectPackage;
				$scope.salesPackage.editor=$cookieStore.get("userId");
			}else{
				$scope.salesPackage={};
				$scope.salesPackage.creator=$cookieStore.get("userId");
			}
			var today=new Date();
			if($scope.salesPackage!=null){
				if ($scope.salesPackage.createTime != undefined){
					$scope.salesPackage.createTime=$filter("date")($scope.salesPackage.createTime,"yyyy-MM-dd");
					/*$scope.salesPackage.createTime = new Date($scope.salesPackage.createTime);*/
				}else{
					$scope.salesPackage.createTime = $filter("date")(today,"yyyy-MM-dd");
				}
				if ($scope.salesPackage.editTime != undefined){
					$scope.salesPackage.editTime = $filter("date")($scope.salesPackage.editTime,"yyyy-MM-dd");
				}else{
					$scope.salesPackage.editTime = $filter("date")(today,"yyyy-MM-dd");
				}
				$scope.showTable=false;
				$scope.showDataTable=false;
				$scope.showCreatePackTable = true;
			}
		}
		//新增销售包
		$scope.insertOrUpdatepackge = function(type){
			var url = '/security/api/package/insert';
			$scope.salesPackage.createTime = today;
			$scope.salesPackage.editTime = today;
			if(type==1){
				url = '/security/api/package/update';
				$scope.salesPackage.createTime = new Date($scope.salesPackage.createTime);
				$scope.salesPackage.editTime = new Date($scope.salesPackage.editTime);
			}
			var param = $scope.salesPackage;
			requestService.post(url, param).then(
				function(data){
					notifications.showSuccess("添加成功");
					$scope.dataProvider.updateFilters();
					if(param.salesPackageId!=null){
						$scope.selectBranch.label=param.salesPackageName;
						
					}else{
						var branch={
						id: data.data.salesPackageId,
						indeterminate: false,
						isAvailable: null,
						label: data.data.salesPackageName,
						mark: data.data,
						otherid: null,
						pid: null,
						selected: false}
						$scope.orgData.push(branch);
					}
					$scope.goBack();
				},
				function(error){
					notifications.showWarning("error");
				}
			);
		}
		
		//删除销售包
		$scope.deletePack = function(){
			if($scope.salesPackageId == null){
				notifications.showWarning("请点击左边树菜单之后再删除");
				return;
			}
			
			if(!confirm("确定删除销售包[ " + $scope.salesPackageId + " ]吗？")){
				return;
			}
			var url = '/security/api/package/deletePack';
			var param = {
				salesPackageId : $scope.salesPackageId,
			};
			requestService.post(url, param).then(
				function(data){
					notifications.showSuccess("删除成功");
					$scope.dataProvider.updateFilters();
					for(var item in $scope.orgData){
						if($scope.orgData[item].id == param.salesPackageId){
							$scope.orgData.splice(item,1);
						}
					}
				},
				function(error){
					notifications.showWarning("error");
				}
			);
		}
		
		//删除销售包与模块的关系数据
		$scope.deleteMdl = function(row){
			
			if(!confirm("确定删除销售包[ " + $scope.salesPackageId + " ]下的[ " + row.data.moduleName + " ]模块吗？")){
				return;
			}
			var url = '/security/api/package/deleteMdl';
			var param = {
					salesPackageId : $scope.salesPackageId,
					moduleId : row.data.moduleId
			};
			
			requestService.post(url, param).then(
					function(data){
						var gridModels = $scope.dataProvider.getOriginalModel();
						for(var item in gridModels){
							if(gridModels[item].moduleId == param.moduleId){
								gridModels.splice(item,1);
							}
						}
						notifications.showSuccess("删除成功");
						$scope.dataProvider.setModel(gridModels);
					},
					function(error){
						notifications.showWarning("error");
					}
			);
		}
		
		$scope.goBack = function(){
			$scope.salesPackage=null;
			$scope.showDataTable = true;
			$scope.showTable = false;
			$scope.showCreatePackTable = false;
			$scope.module = {
				moduleCode : 'MODULE2016',
				moduleName : '模块',
				url : "home.sideMenu({moduleName:'message',moduleId:31})",
				sequence: 1008610086
			};
			$scope.module.statusSelect = [{
				selectVal: 1,
				selectName: '是'
			}, {
				selectVal: 0,
				selectName: '否'
			}];
			$scope.module.status = 0;
		}
		
		
		$scope.$on('$destroy', function() {

			parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
				this.$$childTail = null;
			$scope.orgData = null;
			$scope.module = null;
			$scope.salesPackageId = null;

			console.log('function controller destroyed');

		});
		//增删模块
		$scope.showEmpower = function(){
			if($scope.salesPackageId == null){
				notifications.showWarning("请先选择一个销售包进行操作！");
				return;
			}
			$scope.ngdialog=ngDialog.open({
			    template: 'html/system/package/packagedit.html',
			    className: 'ngdialog-theme-default',	
				width:'60%',
				scope:$scope,
			    controller: 'packeditController'
			});
			 requestService.setNgDialog($scope.ngdialog);
		}
	    $scope.closeEmpower=function(){
	    	$scope.goBack();
	    	$scope.ngdialog.close(true);
	    }
	    //消息类型
	    $scope.showMesstype = function(){
			if($scope.salesPackageId == null){
				notifications.showWarning("请先选择一个销售包进行操作！");
				return;
			}
			$scope.ngdialog=ngDialog.open({
			    template: 'platform/html/platform/package/messType.html',
			    className: 'ngdialog-theme-plain',	
				width:'82%',
				height:'470px',
				scope:$scope,
			    controller: 'messTypeController'
			});
			 requestService.setNgDialog($scope.ngdialog);
		}
	    $scope.closeMesstype = function(){
	    	$scope.goBack();
	    	$scope.ngdialog.close(true);
	    }
	}
]);