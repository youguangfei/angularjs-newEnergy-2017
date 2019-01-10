App.controller('moduleController', [
	'requestService', '$scope', '$location', 'notifications', 'lgServerDataProviderFactory','pagerService',
	function(requestService, $scope, $location, notifications, lgServerDataProviderFactory, pagerService) {

		//创建对象，传入http服务，分页的page类
		$scope.dataProvider = null;
		var pagerService2 = angular.copy(pagerService);
		//分页查询条件
		pagerService2.params = {
				moduleName: ''
		} ;
        $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService2);
		$scope.showTable = 1;
		$scope.module = {};

		var getPage = function(curPage, pageSize, sort) {
			var url = '/security/api/module/getAllModules';
			//排序规则，按照sequence排序
			pagerService2.orderBy = 'sequence';
			pagerService2.order = 'ASC';
			//执行分页查询,如果不需要传递page类请赋值null
			$scope.dataProvider.updateFilters(url, pagerService2);
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
		};
		getPage();
		
		
		var initArg = function(){
			$scope.module.statusSelect = [{
				selectVal: 1,
				selectName: '是'
			},{
				selectVal: 0,
				selectName: '否'
			}];
		}
		
		$scope.updateMdl = function(row) {
			$scope.showTable = 2;
			$scope.form_title="修改信息";
			$scope.module = row.data;
			if($scope.module.createTime != null){
				$scope.module.createTime = new Date($scope.module.createTime);
			}
			if($scope.module.editTime != null){
				$scope.module.editTime = new Date($scope.module.editTime);
			}
			
			initArg();
		}
		
		$scope.insertOrUpdateModule = function(myForm) {
			if(myForm.$valid){
				var url = '';
				var param = $scope.module;
				if ($scope.module != null && $scope.module.moduleId != null) {
					url = '/security/api/module/update';
				} else {
					url = '/security/api/module/insert';
					param.codePid = 'CODE:MDL';
				}
				
				for(var item in param){
					if(param[item] == undefined) {
						delete param[item];
					}
				}
				requestService.post(url, param).then(
					function(data) {
						/*var gridModels = $scope.dataProvider.getGridModel();
						if(param.moduleId == null){
							gridModels.push(data.data);
						} else {
							for(var item in gridModels){
								if(gridModels[item].moduleId == param.moduleId){
									gridModels.splice(item,1,data.data);
								}
							}
						}*/
						$scope.dataProvider.updateFilters();
						notifications.showSuccess(data.message);
						$scope.goBack();
					},
					function(erro) {
						$scope.goBack();
					}
				);
				
			}else{
				myForm.moduleName.$dirty = true;
				myForm.sequence.$dirty = true;
			}
		};
		
		//删除数据
		$scope.removeRow = function removeRow(row) {
			$scope.showTable = 1;
			if(!confirm("确定删除模块[ " + row.data.moduleName + " ]吗？")){
				return;
			}
			var url = '/security/api/module/delete';
			var param = {
					moduleId: row.data.moduleId,
					code: row.data.moduleCode,
					codePid: 'CODE:MDL'
			};
			requestService.post(url, param).then(
				function(data){
					/*var gridModels = $scope.dataProvider.getGridModel();
					for(var item in gridModels){
						if(gridModels[item].moduleId == param.moduleId){
							gridModels.splice(item,1);
						}
					}*/
					$scope.dataProvider.updateFilters();
					notifications.showSuccess(data.message);
					$scope.goBack();
				
				},function(error){
					$scope.goBack();
				}
			);
			
	    }
		
		//新增模块显示信息
		$scope.createMdl = function(){
			$scope.showTable = 2;
			$scope.form_title="新增信息";
			$scope.module = {
//					url: "home.sideMenu({moduleName:'customer',moduleId:44})",
					status: 1
			};
			initArg();
		}
		
		$scope.goBack = function(){
			$scope.showTable = 1;
			$scope.module = {};
		}
		
		$scope.$on('$destroy', function() {
			$scope.showTable = null;
			$scope.module = null;
			
			parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
				this.$$childTail = null;
			$scope.gridOptions = null;
			$scope.gridApi = null;
			$scope.upMdl = null;
			console.log('function controller destroyed');

		});
	}
]);