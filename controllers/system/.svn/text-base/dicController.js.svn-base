App.controller('dicController', [
'requestService', '$scope', 'notifications', 'lgServerDataProviderFactory', 'pagerService','cacheService',
function(requestService, $scope, notifications, lgServerDataProviderFactory, pagerService,cacheService) {

	// 创建对象，传入http服务，分页的page类
	// 分页查询条件
	$scope.dataProvider = null;
	var pagerService2 = angular.copy(pagerService);
    $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService2);
	
	// 控制页面显示
	$scope.showTable = 1;			// 1：显示表格，2：不显示表格，显示form表单
	$scope.showCtrl = 1;			// 1：不控制，2：修改名称/序号，3：控制其他按钮为disabled
	$scope.showContent = 1;			// 1：显示空白，2：不显示空白
	$scope.loadingTree=false;
	$scope.orgData = [];
	$scope.form_title = '';
	
	$scope.branch = {};
	$scope.dic = {};

	var initArg = function(){
		$scope.dic.levelSelect = [{selectVal:0,selectName:'分组/字典无须指定级别'},
		                          {selectVal:1,selectName:'级别一'},
		                          {selectVal:2,selectName:'级别二'},
		                          {selectVal:3,selectName:'级别三'},
		                          {selectVal:4,selectName:'级别四'},
		                          {selectVal:5,selectName:'级别五'},
		                          {selectVal:6,selectName:'级别六'},
		                          {selectVal:7,selectName:'级别七'}];
		
		$scope.dic.typeSelect = [{selectVal:0,selectName:'分组'},
		                         {selectVal:1,selectName:'字典'},
		                         {selectVal:2,selectName:'属性'}];
	}
	var getTreeData = function() {
		var url = '/security/api/dic/treedata';
		var param = {};
		requestService.post(url, param, true).then(
			function(data) {
				var newData=[];
				$.each(data.data,function(i,item){
						if(item["label"].indexOf("人事分组")!=-1 || item["label"].indexOf("新能源汽车分组")!=-1){
							newData.push(item);
						}
				})
				$scope.orgData = newData;
			},
			function(error) {
				$scope.orgData = [];
			}
		);
	};
	getTreeData();
	$scope.loadingTree=true;
	

	// 点击树节点
	$scope.nodeSelected = function(branch) {
		$scope.branch = branch;
		var param = {
			pid: branch.id
		};
		
		if (branch.children == null || branch.children.length == 0) {	// 若为叶子节点表格不显示
			$scope.showContent = 1;
			// 防止监听器监听到该值改变而又二次发送请求
			$scope.dataProvider.data = $scope.dataProvider.getGridModel();
			// 同步page类
			$scope.dataProvider.setViewSettings(pagerService2);
			// 渲染table
			$scope.dataProvider.setModel([]);
			
			$scope.goBack();
			return;
		}
		
		if(branch.mark.type == 0){	// 若为分组表格不显示
			$scope.showContent = 1;
			// 防止监听器监听到该值改变而又二次发送请求
			$scope.dataProvider.data = $scope.dataProvider.getGridModel();
			// 同步page类
			$scope.dataProvider.setViewSettings(pagerService2);
			// 渲染table
			$scope.dataProvider.setModel([]);
			
		} else {	// 若为字典/属性表格显示
			$scope.showContent = 2;
			getPage(param);
		}
		$scope.goBack();
	}
	
	// 获取表格内容
	var getPage = function(param) {
		var url = '/security/api/dic/sub';
		pagerService2.params = param;
		// 排序规则，按照sequence排序
		pagerService2.orderBy = 'sequence';
		pagerService2.order = 'ASC';
		// 执行分页查询,如果不需要传递page类请赋值null
		$scope.dataProvider.updateFilters(url,pagerService2);
		// 需要开一个监听
		$scope.$watch("dataProvider.data", function(newValue) {
			if(newValue===undefined || newValue===null){
				return;
			}
			// 同步page类
			$scope.dataProvider.setViewSettings(newValue.data);
			// 渲染table
			$scope.dataProvider.setModel(newValue.data.result);
		});
	}
	
	// 新增分组
	$scope.createDicGroup = function(){
		$scope.showTable = 2;
		$scope.showCtrl = 3;
		$scope.form_title = '新增分组';
		
		$scope.dic_pid_2_show = null;
		
		$scope.dic = {
			code: "DICS2016",
			level: 0,
			type: 0
		};
		initArg();
	}
	
	// 修改
	$scope.updateDicGroup = function() {
		$scope.showTable = 2;
		$scope.showCtrl = 2;
		$scope.form_title = '修改';
		
		$scope.dic_pid_2_show = null;
		
		var name = angular.copy($scope.branch.label);
		name = name.lastIndexOf("*") == -1 ? name : $scope.branch.label.substr(0, name.length - 1);
		$scope.dic = {
			name: name,
			dicId: $scope.branch.id,
			sequence: $scope.branch.mark.sequence,
			type: $scope.branch.mark.type,
			level: $scope.branch.mark.level
		};
		initArg();
	}
			
	// 新增字典/属性
	$scope.createDic = function(){
		$scope.showTable = 2;
		$scope.showCtrl = 3;
		$scope.form_title = '新增字典/属性';
		
		$scope.dic_pid_2_show = $scope.branch.label;
		
		if($scope.branch.mark.level != 0){
			$scope.dic.level = $scope.branch.mark.level + 1;
			$scope.dic.type = 2;
		} else {
			if($scope.branch.mark.type == 0){	// 树节点若为分组
				$scope.dic.level = 0;
				$scope.dic.type = 1;
			} else if($scope.branch.mark.type == 1) {	// 树节点若为字典
				$scope.dic.level = 1;
				$scope.dic.type = 2;
			}
		}
		
	}
	
	// 表格中的修改
	$scope.updateItem = function(row) {
		$scope.showTable = 2;
		$scope.showCtrl = 3;
		$scope.form_title = '修改';
		
		$scope.dic_pid_2_show = $scope.branch.label;
		
		if (row != null && row.data != null) {
			// 对象拷贝
			for (var item in row.data) {
				if (row.data[item] == undefined || (typeof(row.data[item]) === "object")) {
					continue;
				}
				$scope.dic[item] = row.data[item];
			}
			initArg();
		} else {
			notifications.showWarning("没有回显数据");
			$scope.goBack();
		}
	}

	// 执行新增或修改
	$scope.insertOrUpdate = function(myForm) {
		if(myForm.$valid){
			var url = '';
			var param = $scope.dic;
			
			if (param.name.indexOf("*") != -1) {
				notifications.showWarning("名称不能包含 ' * ' 字符");
				return;
			}
			if ($scope.dic != null && $scope.dic.dicId != null) {
				url = '/security/api/dic/update';
			} else {
				url = '/security/api/dic/insert';
			}
			for ( var item in param) {
				if (param[item] == undefined)
					delete param[item];
			}
			requestService.post(url, param, true).then(
				function(data) {
					var gridModels = $scope.dataProvider.getGridModel();
					if(gridModels == null || gridModels.length == 0){	
						if(data.data.mark.type == 2){
							// 原表格没有内容
							$scope.showContent = 2;
							$scope.dataProvider.setModel([data.data.mark]);
						}
					} else {
						if($scope.dic.dicId == null){
							gridModels.push(data.data.mark);
						} else {
							for(var item in gridModels){
								if(gridModels[item].dicId == data.data.mark.dicId){
									gridModels.splice(item,1,data.data.mark);
								}
							}
						}
						$scope.dataProvider.setModel(gridModels);
					}
					/**
					 * 对于修改操作树信息的更新
					 */
					if(url.indexOf("update") != -1){
						/**
						 * 修改分组
						 */
						if(data.data.mark.pid == null){
							var nodes = $scope.orgData;
							var childNodes;
							// 拷贝children，并将原有node删除
							for (var item in nodes) {
								if (nodes[item].id == data.data.id) {
									childNodes = angular.copy(nodes[item].children);
									// 若原来节点展开，则也展开
									if (nodes[item].expanded) {
										data.data.expanded = true;
									}
									nodes.splice(item, 1);
									break;
								}
							}
							// 重新插入新的node
							for (var item in nodes) {
								if (childNodes) {
									data.data.children = childNodes;
									// 判断修改后的序号小于某个依次变大的序号
									if(data.data.mark.sequence < nodes[item].mark.sequence){
										nodes.splice(parseInt(item),0, data.data);
										break;
									}
									// 若上述条件没有执行，则往数组的末尾添加
									if((parseInt(item) + 1) == nodes.length){
										nodes.push(data.data);
									}
								}
							}
							
						} 
						/**
						 * 修改字典、属性
						 */
						else {
							var flag = -1;
							var reloadTree = function(e){
								if(e.id == param.dicId){
									flag = 1;
									return;
								}
								if(e.children != null && e.children.length != 0){
									for(var item in e.children){
										reloadTree(e.children[item]);
										if (flag == 1) {
											// 拷贝children，并将原有node删除
											data.data.children = angular.copy(e.children[item].children);
											// 若原来节点展开，则也展开
											if (e.children[item].expanded) {
												data.data.expanded = true;
											}
											e.children.splice(item,1);
											if (e.children == null || e.children.length == 0) {
												e.children.push(data.data);
											} else {
												for(var item2 in e.children){
													// 判断修改后的序号小于某个依次变大的序号
													if(data.data.mark.sequence < e.children[item2].mark.sequence){
														e.children.splice(parseInt(item2),0, data.data);
														break;
													}
													// 若上述条件没有执行，则往数组的末尾添加
													if((parseInt(item2) + 1) == e.children.length){
														e.children.push(data.data);
													}
												}
											}
											flag = 2;
											break;
										}
									}
								}
							}
							/**
							 * 遍历$scope.orgData
							 */
							for (var item in $scope.orgData) {
								reloadTree($scope.orgData[item]);
								if(flag == 2){
									break;
								}
							}
						}
					} 
					/**
					 * 对于新增操作树信息的更新
					 */
					else {
						/**
						 * 新增分组
						 */
						if(data.data.mark.pid == null){
							var nodes = $scope.orgData;
							for (var item in nodes) {
								// 判断修改后的序号小于某个依次变大的序号
								if(data.data.mark.sequence < nodes[item].mark.sequence){
									nodes.splice(parseInt(item),0, data.data);
									break;
								}
								// 若上述条件没有执行，则往数组的末尾添加
								if((parseInt(item) + 1) == nodes.length){
									nodes.push(data.data);
								}
							}
						} 
						/**
						 * 新增字典、属性
						 */
						else {
							var flag = -1;
							var reloadTree = function(e){
								if(e.id == data.data.mark.pid){
									flag = 0;
								}
								if(flag == 0){
									if(e.children != null && e.children.length != 0){
										for(var item2 in e.children){
											// 判断修改后的序号小于某个依次变大的序号
											if(data.data.mark.sequence < e.children[item2].mark.sequence){
												e.children.splice(parseInt(item2),0, data.data);
												break;
											}
											// 若上述条件没有执行，则往数组的末尾添加
											if((parseInt(item2) + 1) == e.children.length){
												e.children.push(data.data);
											}
										}
									} else {
										e.children = [data.data];
									}
									flag = 1;
									return;
								}
								if(e.children != null && e.children.length != 0){
									for(var item in e.children){
										reloadTree(e.children[item]);
									}
								}
							}
							/**
							 * 遍历$scope.orgData
							 */
							for (var item in $scope.orgData) {
								reloadTree($scope.orgData[item]);
								if(flag == 1){
									break;
								}
							}
						}
					}
					//更新cacheService中的字典缓存 by liy 2016.12.03
					cacheService.updateDicCache($scope.dic.pid)
					
					notifications.showSuccess(data.message);
					$scope.goBack();
				},
				function(error) {
					$scope.goBack();
				}
			);
		}else{
			myForm.name.$dirty = true;
            myForm.sequence.$dirty = true;
		}
	}
	
	// 删除分组/字典/属性
	$scope.deleteItem = function(row) {
		var title = '';
		var param = {};
		if(row == null){
			title = $scope.branch.label;
			param.dicId = $scope.branch.id;
			
			if($scope.branch.children != null && $scope.branch.children.length > 0){
				notifications.showWarning("[" + title + "]有子节点，无法删除");
				return;
			}
		} else {
			
			for(var item in $scope.branch.children){
				var node = $scope.branch.children[item];
				if(node.label == row.data.name){
					if(node.children != null && node.children.length > 0){
						notifications.showWarning("[" + row.data.name + "]有子节点，无法删除");
						return;
					}
				}
			}
			
			title = row.data.name;
			param.dicId = row.data.dicId;
		}
		
		if(!confirm("删除此字典，如果被使用将会影响系统的使用，确定删除[ " + title + " ]吗？")){
			return;
		}
		var url = '/security/api/dic/delete';
		requestService.post(url, param, true).then(
			function(data) {
				if(row != null){
					var gridModels = $scope.dataProvider.getGridModel();
//					var gridModels = $scope.dataProvider.getOriginalModel();
					for (var item in gridModels) {
						if (gridModels[item].dicId == param.dicId) {
							gridModels.splice(item, 1);
						}
					}
					$scope.dataProvider.setModel(gridModels);
				}
				
				// 修改树信息
				var flag = -1;
				var reloadTree = function(e){
					if(e.id == param.dicId){
						flag = 0;
						return;
					}
					if(e.children != null && e.children.length != 0){
						for(var item in e.children){
							reloadTree(e.children[item]);
							if(flag == 0){
								e.children.splice(item, 1);
								flag = 1;
								return;
							}
						}
					}
				}
				
				for (var item in $scope.orgData) {
					// 删除分组
					if($scope.orgData[item].id == param.dicId){
						$scope.orgData.splice(item, 1);
						break;
					}
					// 删除字典/属性
					reloadTree($scope.orgData[item]);
					if(flag == 1){
						break;
					}
				}
				// 当点击右上角按钮时，将节点信息清空，点击"图标删除"时不清空
				if (row == null) {
					$scope.branch = {};
				}
				
				//更新cacheService中的字典缓存 by liy 2016.12.03
				cacheService.updateDicCache(row.pid);
				
				notifications.showSuccess(data.message);
				$scope.goBack();
			},
			function(error) {
				$scope.goBack();
			}
		);
	}
	
	$scope.goBack = function() {
		$scope.showTable = 1;
		$scope.showCtrl = 1;
		$scope.form_title = '';
		
		$scope.dic = {
			code: "DIC2016",
			level: 1,
			type: 1,
			pid: $scope.branch.id
		};
		initArg();
	}
	
	//获取字典设备类型下所有节点并加入localStorage
	var getDeviceDicNode = function(){
			var url = '/watersupply/api/ws/device/findPlatformTenantDicByPid';
			requestService.post(url,{}).then(
				function(data) {
					localStorage["dicChildList"]=JSON.stringify(data.data);
				},
				function(erro) {
					console.log("get getDeviceDicNode error:" +error);
					}
				);
		}
	 

	$scope.$on('$destroy', function() {
		$scope.getPage = null;
		$scope.showTable = null;
		$scope.showCtrl = null;
		$scope.showContent = null;
		
		$scope.orgData = null;
		$scope.form_title = null;
		//getDeviceDicNode();
		$scope.branch = null;
		$scope.dic = null;
		
		parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
			this.$$childTail = null;
		console.log('dicController destroyed');
	});
	
}]);