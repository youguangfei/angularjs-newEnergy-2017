App.controller('handleController', [
	'requestService','$cookieStore', '$scope', '$timeout', 'lgServerDataProviderFactory','$filter','pagerService','ngDialog',
	function(requestService,$cookieStore, $scope, $timeout, lgServerDataProviderFactory,$filter,pagerService,ngDialog) {

		//右边表格
		$scope.dataProvider = null;
		var pagerService = angular.copy(pagerService);
	    $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService);
		
		$scope.orgData = [];
		$scope.orgTree = tree = {};
	

		$scope.module = {};
		
		//数据初始化
		$scope.initData = function(){
			var param = {
					tenantId : $cookieStore.get("tenantId")
			};
			getPage(param); 
			
		}
		
		//获取系统日志
		var getPage = function(param,settings){
			var url = '/security/api/platformLog/platformLogs';
			//排序规则，按照sequence排序
			if(settings==null || settings==''){
				pagerService.params = param;
				pagerService.orderBy = 'c.id';
				pagerService.order = 'desc';
				$scope.dataProvider.updateFilters(url, pagerService);
			}else{
				$scope.dataProvider.updateFilters(url, settings);
			}
			
			
			//执行分页查询,如果不需要传递page类请赋值null
			
			//需要开一个监听
			$scope.$watch("dataProvider.data", function(newValue) {
				if(newValue===undefined || newValue===null){
					return;
				}
				//同步page类
				$scope.dataProvider.setViewSettings(newValue.data);
				//渲染table
				$scope.dataProvider.setModel(newValue.data.result);
				$scope.totalCount = newValue.data.totalCount;
				console.log(newValue.data)
			});
		}
		$scope.initData();
		
		
		$scope.rowSelected = function(row){
			console.log(row.data);
		}
		$scope.showTable = true;
		
		$scope.update = function(row) {
			$scope.showTable = !$scope.showTable;
			$scope.module = row.data;
			$scope.module.statusSelect = [{
				selectVal: 1,
				selectName: '是'
			}, {
				selectVal: 0,
				selectName: '否'
			}];
		}
		$scope.resetQueryPanel=function(){
			ngDialog.open({
			    template: 'html/system/log/handle/handle_logOpen.html',
			        className: 'ngdialog-theme-default',
			        closeByEscape: true,
			        showClose : true,
			        closeByDocument: true,
			        width: '55%',
			        scope: $scope,
			});
		}
		$scope.qryPlatformLog = {};
		/**
		 * 重置档案查询
		 */
		$scope.resetQueryPlatformLog = function() {
			ngDialog.close($scope.ngDialogId);
		}
		/**
		 * 执行档案查询
		 */
		$scope.executeQryPlatformLog = function() {
			var param = angular.copy($scope.qryPlatformLog);
			// 剔除空的
			for(var item in param){
				if (param[item] == null) {
					delete param[item];
				}
				if(item=="startOptionTime"||item=="endOptionTime"){
	 				param[item] =$filter("date")(param[item],"yyyy-MM-dd"); 
	 				continue;
	 				
	 			}
			}
			ngDialog.close($scope.ngDialogId);
			getPage(param);
		}
		
		$scope.goBack = function(){
			$scope.showTable = true;
			
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
		$scope.enter=function(e){
			var keycode = window.event?e.keyCode:e.which;
	        if(keycode!=13){
	           return;
	        }
	        //var open=angular.element("#querybutton").find("[lg-toggle-expanded-row]");

	        angular.element("#querybutton").click();
	        $scope.executeQryPlatformLog();
	        
		}
		
		$scope.$on('$destroy', function() {

			parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
				this.$$childTail = null;
			$scope.orgData = null;
			$scope.module = null;
			$scope.salesPackageId = null;

			console.log('function controller destroyed');

		});
	}
]);

App.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});