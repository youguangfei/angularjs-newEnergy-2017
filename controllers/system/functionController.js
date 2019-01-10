App.controller('functionController', [
'requestService','cacheService','$scope', 'notifications', 'lgServerDataProviderFactory', 'pagerService',
function(requestService, cacheService, $scope, notifications, lgServerDataProviderFactory, pagerService) {
        
    //创建对象，传入http服务，分页的page类
    //分页查询条件
    $scope.dataProvider = null;
    var pagerService2 = angular.copy(pagerService);
    $scope.dataProvider = lgServerDataProviderFactory.create(requestService, pagerService2);
        
    $scope.orgData = [];
    
    var menuData;
    var arrDate;
    var getTreeData = function() {
        var url = '/security/api/function/treedata';
        var param = {};
        requestService.post(url, param, true).then(
            function(data) {
                $scope.orgData = data.data;   
            },
            function(error) {
                
            }
        );
    };
    getTreeData();

    $scope.showTable = 1;   //1：显示表格，2：不显示表格
    $scope.entity = {};
    
    var initArg = function(){
        $scope.entity.funcLevelSelect = [{selectVal:-1,selectName:'权限功能'},
                                         {selectVal:1,selectName:'菜单功能'}];
        $scope.entity.treeDisplaySelect = [{selectVal:1,selectName:'显示'},
                                           {selectVal:0,selectName:'不显示'}];
        $scope.entity.isInstallSelect = [{selectVal:1,selectName:'是'},
                                           {selectVal:0,selectName:'否'}];
    }
    
    /**
     * 点击树节点
     */
    $scope.branch = null;
    $scope.pid = null;
        
    $scope.orgSelected = function(branch) {
        $scope.branch = branch;
        var param = {
            id: branch.id
        };
        // 判断节点是模块还是功能，只有当是功能的时候才设置
        if(branch.mark != null){
            $scope.pid = branch.id;
            param.mark = 'FUNCTION_MARK';
        } else {
            $scope.pid = null;
            param.mark = 'MODULE_MARK';
        }
        if (branch.children != null && branch.children.length > 0) {
            getPage(param);
        } else {
            //同步page类
            $scope.dataProvider.setViewSettings(pagerService2);
            //渲染table
            $scope.dataProvider.setModel([]);
        }
        $scope.goBack();
    }

    //获取子功能
    var getPage = function(param) {
        var url = '/security/api/function/sub';
        pagerService2.params = param;
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
    }

    /**
     * 删除操作
     */
    $scope.deletefun = function(row) {
        if($scope.branch.children != null && $scope.branch.children.length != 0){
            for(var item in $scope.branch.children){
                var var_ = $scope.branch.children[item];
                if(var_.mark != null && var_.mark.funcId == row.data.funcId){
                    if(var_.children != null && var_.children.length != 0){
                        notifications.showWarning("此功能有子节点，无法删除");
                        return;
                    }
                    break;
                }
            }
        }
        if(!confirm("确定删除功能[ " + row.data.funcName + " ]吗？")){
            return;
        }
        var url = '/security/api/function/delete';
        var param = {
            funcId: row.data.funcId,
            code: row.data.funcCode,
            codePid: ($scope.branch.mark != null) ? 'CODE:' + row.data.funcCodePid : 'CODE:FUNC'
        };
        requestService.post(url, param).then(
            function(data) {
                var gridModels = $scope.dataProvider.getGridModel();
                for (var item in gridModels) {
                    if (gridModels[item].funcId == param.funcId) {
                        gridModels.splice(item, 1);
                    }
                }
                $scope.dataProvider.setModel(gridModels);
                /**
                 * 删除操作树信息的更新
                 */
                var flag = -1;
                var reloadTree = function(e){
                    if(e.id == param.funcId){
                        flag = 0;
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
                    reloadTree($scope.orgData[item]);
                    if(flag == 1){
                        break;
                    }
                }
                notifications.showSuccess(data.message);
                $scope.goBack();
            },
            function(error) {
                $scope.goBack();
            }
        );
    }

    /**
     * 新增或修改操作
     */
    $scope.insertOrUpdatefun = function(myForm) {
        var url = '';
        if ($scope.entity.funcLevel == -1) {
            // 若为权限功能
            delete $scope.entity.url;
        } else {
            // 若为菜单功能
            delete $scope.entity.funcURl;
        }
        var param = $scope.entity;
        
        param.codePid = ($scope.branch.mark != null) ? 'CODE:' + $scope.branch.mark.funcCode : 'CODE:FUNC';
        param.codePids = ($scope.branch.mark != null) ? $scope.branch.mark.funcCodePids : 'FUNC';
        
        if ($scope.entity != null && $scope.entity.funcId != null) {
            url = '/security/api/function/update';
        } else {
            url = '/security/api/function/insert';
        }

        for ( var item in param) {
            if (param[item] == undefined)
                delete param[item];
        }
        if(myForm.$valid){
            requestService.post(url, param).then(
                function(data) {
                    var gridModels = $scope.dataProvider.getGridModel();
                    
                    if(gridModels == null){
                        $scope.dataProvider.setModel([data.data.mark]);
                    } else {
                        for(var item in gridModels){
                            if(gridModels[item].funcId == data.data.mark.funcId){
                                gridModels.splice(item,1,data.data.mark);
                            }
                        }
                        if($scope.entity.funcId == null){
                            gridModels.push(data.data.mark);
                        }
                        $scope.dataProvider.setModel(gridModels);
                    }
                    
                    /**
                     * 对于修改操作树信息的更新
                     */
                    if(url.indexOf("update") != -1){
                        var flag = -1;
                        var reloadTree = function(e){
                            if(e.id == param.funcId){
                                flag = 1;
                                return;
                            }
                            if(e.children != null && e.children.length != 0){
                                for(var item in e.children){
                                    reloadTree(e.children[item]);
                                    if (flag == 1) {
                                        // 拷贝children
                                        data.data.children = angular.copy(e.children[item].children);
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
                        for (var item in $scope.orgData) {
                            reloadTree($scope.orgData[item]);
                            if(flag == 2){
                                break;
                            }
                        }
                    } 
                    /**
                     * 对于新增操作树信息的更新
                     */
                    else {
                        var flag = -1;
                        var reloadTree = function(e){
                            // 若是某个模块下的一级子功能
                            if(data.data.mark.pid == null && e.id == data.data.mark.moduleId){
                                flag = 2;
                            }
                            if(e.id == data.data.mark.pid){
                                flag = 0;
                            }
                            if(flag == 0 || flag == 2){
                                var node = data.data;
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
                                    e.children = [node];
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
                        for (var item in $scope.orgData) {
                            reloadTree($scope.orgData[item]);
                            if(flag == 1){
                                break;
                            }
                        }
                    }
                    notifications.showSuccess(data.message);
                    $scope.goBack();
                },
                function(error) {
                    $scope.goBack();
                }
            );
            
        }else{
            myForm.funcName.$dirty = true;
            myForm.sequence.$dirty = true;   
        }
    }

    $scope.updatefun = function(row) {
        $scope.showTable = 2;
        if (row != null && row.data != null) {
            //对象拷贝
            for (var item in row.data) {
                if (row.data[item] == undefined || (typeof(row.data[item]) === "object")) {
                    continue;
                }
                $scope.entity[item] = row.data[item];
            }
            initArg();
            //日期处理,否则无法显示和更新
            if (row.data.productionDate != undefined)
                $scope.entity.productionDate = new Date(row.data.productionDate);
            if (row.data.useEndDate != undefined)
                $scope.entity.useEndDate = new Date(row.data.useEndDate);
        } else {
            //无法回显，退出
            notifications.showWarning("没有回显的数据");
            return;
        }
    }

    $scope.goBack = function() {
        $scope.showTable = 1;
        $scope.entity = {
            moduleId: $scope.branch.otherid,
            pid: $scope.pid
        };
        initArg();
        $scope.entity.funcLevel = -1;
        $scope.entity.treeDisplay = 1;
        $scope.entity.isInstall = 1;
    }

    $scope.$on('$destroy', function() {
        parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
                 this.$$childTail = null;
        $scope.dataProvider = null;
        $scope.orgData = null;

        $scope.showTable = null;
        $scope.entity = null;
        
        $scope.branch = null;
        $scope.pid = null;
        
        $scope.orgSelected = null;
        $scope.deletefun = null;
        $scope.insertOrUpdatefun = null;
        $scope.updatefun = null;
        $scope.goBack = null;
        
        console.log('function controller destroyed');
    });
    
}]);