App.controller('versionController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',
	function(requestService,cacheService,$cookieStore, $scope, $timeout,$filter,ngDialog,notifications) {
	
	
	var groupid=$cookieStore.get("groupId"),
	 	userid=$cookieStore.get("userId"),
	 	userName=$cookieStore.get("name");
	
	var url = '/product/api/business';
	
	// 下拉单字典 
	//故障性质
	$scope.dicId_faultCharacter = faultCharacter;
	//故障类型
	$scope.dicId_faultType = faultType;
	//故障等级
	$scope.dicId_faultRank = faultRank;
	cacheService.getDic($scope.dicId_faultCharacter);
	cacheService.getDic($scope.dicId_faultType);
	cacheService.getDic($scope.dicId_faultRank);
	
	//右边表格
	$scope.myPage = null;
	var Param;
	$scope.appoint={};
	
	//数据初始化
	$scope.initData = function(){
		Param = {
			licenseNumber:$scope.appoint.licenseNumber,
			vin:$scope.appoint.vin,
			iccid:$scope.appoint.iccid,
			userId : userid
		};
		$timeout(function(){
			$scope.getPage(Param);
		},10)
	}	
	//获取一个月内的工单数据
	$scope.getPage = function(param){
		// 在变更分布的时候，重新获取数据条目
        var reGetProducts = function(){
        	// 发送给后台的请求数据
        	var postData = {
                pageNo: $scope.myPage.pageNo,
                pageSize: $scope.myPage.pageSize,
                params:{}
            };
            postData.params=Param;
			var param = {
					"code":10007, 
					"param":JSON.stringify(postData)
			}
	         requestService.post(url, param).then(
	            function (data) {
                	$scope.recordList=data.data.result;
	     			$scope.myPage.totalCount = data.data.totalCount;
	     			$scope.myPage.totalPages = data.data.totalPages;
	            },function(error){
	        	}
	        )
        };

        // 配置分页基本参数
        $scope.myPage = {
            pageNo: 1,
            pageSize: 15,
        };

        // 通过$watch pageNo和pageSize 当他们一变化的时候，重新获取数据条目
        $scope.$watch('myPage.pageNo + myPage.pageSize', reGetProducts);
	}
	$scope.initData();
	
	
	//查询车牌号是否存在
	$scope.searchLicenseNumber=function(){
		var param={
			"code":10010,
			"param":JSON.stringify({
				"userId":userid,
				"licenseNumber":$scope.appoint.licenseNumber
			})
		}
		requestService.post(url, param).then(
            function (data) {
            	$scope.appoint.vin=data.data.vin;
            	$scope.appoint.iccid=data.data.iccid;
            	if($scope.appoint ==null || $scope.appoint == ""){
            		notifications.showError("车牌号不存在，请重新输入");
            	} 
            },function(error){
        	}
        )
	}
	
	//table tr点击选中效果
	$scope.activeIndex=-1;
	$scope.changeIndex=function(index){
		$scope.activeIndex=index;
	}
	$scope.cancelVersion=function(){
		
		$scope.upgradePage=1;
		
	}
            
            $scope.showTable = true;
            $scope.data = {};
            var getPage = function () {
                var url = $scope.baseUrl + 'findAll';
                //执行分页查询,如果不需要传递page类请赋值null
                
            };
            $scope.open=function(){
                $scope.showTable=!$scope.showTable;
            }
            getPage();
            //上传配置
            $scope.insertUser=false;
            $scope.fileType = true;
            $scope.frequency = true;
            $scope.imgSrc = [];
            $scope.files = [];
            $scope.url="";
          	
          	$scope.userid=$cookieStore.get("userId");
          	$scope.codeid=10013;
          	
            $scope.clickToOpen = function () {
                $scope.files = [];
                
                ngDialog.open({ template: 'html/system/upgrade/templateDialog.html',//模式对话框内容为template.html
                    className: 'ngdialog-theme-default ngdialog-version',
                    scope:$scope ,//将scope传给template.html
                    width:"100%",
        			height:"100%",
                    preCloseCallback:function(){
                        //$scope.partner.picArray=$scope.imgSrc.slice(0);\
                        if($scope.files){
                            if($scope.files.length>=2){
                                alert("一次只能上传一个apk");
                            }else if($scope.files.length==1){
                                var file=$scope.files[0].path;
                                var suff=file.substr(file.lastIndexOf(".")+1);
                                if("apk"!=suff){
                                    alert("只能上传apk");
                                }else{
                                    $scope.url=file;
                                }
                            }
                        }
                        $scope.$apply();
                    }
                });
            };
              $scope.clickToOpen();
            /**
             * 保存或修改时间段
             */
            $scope.save = function () {
                var url = "save";
                var params = {
                    versionNo: $scope.data.versionNo,
                    version: $scope.data.version,
                    source: $scope.data.source,
                    url:$scope.url
                }
                if (!params.versionNo) {
                    alert("比较版本号不能为空");
                    return;
                }
                if (!params.version) {
                    alert("显示版本号不能为空");
                    return;
                }
                if (!params.source) {
                    alert("来源不能为空");
                    return;
                }
                larRequestService.post($scope.baseUrl + url, params).then(
                    function (data) {
                        if (data.data.code == 200) {
                            $scope.showTable = true;
                            //修改
                            getPage();
                        } else {
                            alert(data.data.message);
                        }
                    },
                    function (error) {
                        console.log("error:" + error.message);
                    }
                );
                $scope.upgradePage=1;
            };
        
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}])    

