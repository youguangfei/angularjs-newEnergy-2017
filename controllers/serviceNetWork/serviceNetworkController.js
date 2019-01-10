App.controller('serviceNetworkController', [
	'requestService','cacheService','$cookieStore','FileUploader','$scope', '$timeout','$filter','ngDialog','notifications',
	function(requestService,cacheService,$cookieStore,FileUploader,$scope, $timeout,$filter,ngDialog,notifications) {
		
//	var req_url="http://192.168.231.166:8080"; 8448731421296324
	var url="/product/api/business";
	var orgId=$cookieStore.get("groupId");
	var userId=$cookieStore.get("userId");
	console.log(orgId);
	$scope.selectValue,$scope.selectSpinner,$scope.has_search=false;;
	$scope.searchName="",$scope.type=[0],$scope.dicId;
	
	var map,Npoint,directiveDicSet={},mkrTool=null,localSearch=null;
	var urlGetDicFun = '/security/api/dic/getDicList';

	//字典获取服务网点类型
	$scope.serviceTypePid=SERVICE_TYPE;
	var serviceType;
//	服务网点初始化页面为selectConfig,新增修改页面为selectConfig2
	$scope.selectConfig={},$scope.selectConfig2={},$scope.selectAll;
	cacheService.getDic($scope.serviceTypePid,"","",function(n){
		console.log(n);
		$scope.selectConfig2={
			focus:true,
			data:angular.copy(n),
			placeholder:"全部"
		}
		serviceType=n;
		console.log($scope.selectConfig2);
		
		serviceType.unshift({name:"全部",dicId:0});
		$scope.selectConfig={
			focus:true,
			data:serviceType,
			placeholder:"全部"
		}
		$scope.selectValue={"selectedType":"全部",dicId:0};
		$scope.selectAll=angular.copy($scope.selectConfig);
		console.log($scope.selectConfig.data);
	});
	//table tr点击选中效果
	$scope.activeIndex=-1;
	$scope.changeIndex=function(index){
		$scope.activeIndex=index;
	}	
	//新建服务网点
	$scope.serviceAdd={},$scope.serviceModify={};
	$scope.service_add = function(){
		$scope.MapAdd_setTitle="设置";
		$scope.addServiceForm=true;
		$scope.modifyServiceForm=false;
		$scope.title1="新建";
		$scope.serviceAdd={};
		$scope.serviceAdd.userId=userId;
		var option={
			url:'html/serviceNetwork/serviceNetwork_add_modify.html',
			className:'ngdialog-theme-default ngdialog_add1',
			width:'4.09rem'
		}
		openDialog(option);
	}
	//修改服务网点
	$scope.service_Modify = function(i){
		$scope.addServiceForm=false;
		$scope.modifyServiceForm=true;
		$scope.serviceModify=angular.copy(i);
		$scope.title1="修改";
		console.log(i);
		$scope.serviceModify.typeObj={};
		$scope.serviceModify.typeObj.selectedType=i.type;
		console.log($scope.serviceModify);		
				
		var option={
			url:'html/serviceNetwork/serviceNetwork_add_modify.html',
			className:'ngdialog-theme-default ngdialog_add2',
			width:'4.09rem'
		}
		openDialog(option);
	}
	function openDialog(option){
		$scope.addModifyDg=ngDialog.open({
		        template: option.url,
		        plain: false,
		        className: option.className,
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        closeByNavigation:true,		       
		        scope: $scope,
		        width:option.width,
		});
	}
	$scope.address_string="";
	
	var Bj_json={
				title:"",
				message:"是否将服务网点的位置标注在这里？"
		};
//	地图初始化,flag是否显示搜索框标志
	function init_locationMap(id,type,locationJson,flag){
			map = new BMap.Map(id, {enableMapClick: false});// 创建Map实例 		
			var initZoom=18;
			if(type=="add") initZoom=12;
			map.centerAndZoom(new BMap.Point(116.404, 39.915), initZoom);
			map.setMinZoom(4);
			// 初始化地图,设置中心点坐标和地图级别
			map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
			map.enableDragging();//开启鼠标拖拽
			map.setMapStyle(cacheService.getMapStyle2()); // 设置地图主题样式
			var mapControl = new MapControl({
				map: map,
			})
			mapControl.addZoomControl(); //添加缩放组件
			//是否显示搜索输入框
			if(flag){
				$scope.$apply(function(){
					$scope.setLocationInput=true;
					if(type=="look"){
						$scope.setLocationInput=false;
					}
				})
			}
			
			if(type=="look" || type=="modify"){
				var lng=locationJson.lng;
				var lat=locationJson.lat;
				if(angular.isDefined(lng)&&angular.isDefined(lat)){
					Npoint=new BMap.Point(lng,lat);
					Add_point(Npoint);
					map.addEventListener('zoomend', function(){
							Add_point(Npoint);
					});
				}
			}else{
				mapControl.initLocation();
			}
			
			if(type=="look"){
				return;
			}
			mkrTool = new BMapLib.MarkerTool(map, {autoClose: true,followText:" "});
			mkrTool.addEventListener("markend", markeEnd.bind(this,type,locationJson));
			
		//地图智能搜索
		var ac = new BMap.Autocomplete({
			"input" : "suggestId",//搜索框定义
        	"location" : map//定义map位置
    	});
    	var myValue = '';
		ac.addEventListener("onconfirm",onFirm.bind(this,type));
	}
//	地图搜索下拉选中事件
	function onFirm(type,e){
		    //鼠标点击下拉列表后的事件
		   		if(mkrTool){
			        mkrTool.close();
			     };
		    	No_dragMove();
		    	$scope.confirmlist1=3;
				confirmDialog(Bj_json,function(flag){
					if(flag){
						var _value = e.item.value;
				        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				        var index=myValue.indexOf("市");
				        if(myValue.substring(0,index+1)==myValue.substring(index+1).substring(0,index+1)){
							myValue=myValue.substring(index+1);
						}
				        $scope.MapAdd_setTitle = "修改";
				        setPlace(myValue,type);
					}
			})
	}
	
	//显示修改模式，地图上添加marker点
	function Add_point(point){
		map.clearOverlays();
		var marker= new BMap.Marker(point);
		map.addOverlay(marker);
		map.panTo(point);
	}
	
	//点击标注按钮，设置标注图标
	$scope.selectBTool=function(){
				if(localSearch){
			        	localSearch.clearResults();
			    }
				mkrTool.open();  
			    icon=new BMap.Icon("images/img1/map_BiaoJiIcon.png", new BMap.Size(42,60),{
			    	imageSize:new BMap.Size(30,30)
			    })
			    mkrTool.setIcon(icon);  
	}
	
//	地图标注完成后触发
	function markeEnd(type,locationJson,evt){
		    var mkr = evt.marker;
		    var point=mkr.point;
		    $scope.confirmlist1 = 3;
		    No_dragMove();
			confirmDialog(Bj_json,function(flag){
				if(flag){
					$scope.add_lng_lat(type,point);
					if(type=='add'){
						lngLat_Address(type,point);
						$scope.MapAdd_setTitle = "修改";
					}
					console.log($scope.serviceModify.address);
					if(type=='modify'&&($scope.serviceModify.address==undefined||$scope.serviceModify.address=="")){
						lngLat_Address(type,point);
					}
					ngDialog.close($scope.seviceLDig.id);
					
				}else{
					map.removeOverlay(mkr);
					init_locationMap("getLocation_map",type,locationJson||"",false);
										
				}
			})
		}
	//地图智能搜索结果处理	
	function setPlace(myValue,type){
	        map.clearOverlays();    //清除地图上所有覆盖物
	        localSearch = new BMap.LocalSearch(map, { //智能搜索
	          onSearchComplete: myFun//智能搜索这个范围
	        });
	        function myFun(){
	        	console.log(localSearch.getResults());
	            Npoint = localSearch.getResults().getPoi(0).point;  
	            console.log(Npoint);
	            $scope.add_lng_lat(type,Npoint);
	            $scope.add_address(type,myValue);
	            
	            map.centerAndZoom(Npoint, 18);
	            map.addOverlay(new BMap.Marker(Npoint)); 
	            ngDialog.close($scope.seviceLDig.id);
	        }
	        localSearch.search(myValue);
	   }
		
//	地图经纬度,转地址
	function lngLat_Address(type,point){
			 var gc = new BMap.Geocoder();
			  gc.getLocation(point, function(rs){
			   	   console.log(rs);
			       var addComp = rs.addressComponents;
			       var address_string="";
			       if(addComp.province == addComp.city){
			       		address_string=addComp.province  + addComp.district + addComp.street  + addComp.streetNumber;
			       }else{
			       		address_string=addComp.province  + addComp.city + addComp.district + addComp.street  + addComp.streetNumber;
			       }
			       console.log(address_string);
			       $scope.$apply(function(){
				       	if(type=='add'){
							$scope.serviceAdd.address=address_string;
						}
						if(type=='modify'){
							$scope.serviceModify.address=address_string;
						}
			       })
			});
				
	}
	
	$scope.add_lng_lat=function(type,point){
		if(type=='add'){
				$scope.serviceAdd.lng=point.lng;
				$scope.serviceAdd.lat=point.lat;
		}
		if(type=='modify'){
				$scope.serviceModify.lng=point.lng;
				$scope.serviceModify.lat=point.lat;
		}
	}
	$scope.add_address=function(type,address){
		if(type=='add'){
			$scope.$apply(function(){
				$scope.serviceAdd.address=address;
			})
		}
		if(type=='modify'){
			$scope.$apply(function(){
				$scope.serviceModify.address=address;
			})
		}
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
	
	
	//打开地图弹窗,新建，修改，查看三种模式，新建只传递type,修改和查看传递当前obj
	$scope.addTwo=function(type,locationJson){
		
		$scope.titleMapposition = "服务网点位置设定";
		var option={
			url:'html/serviceNetwork/serviceNetwork_setLocation.html',
			className:'ngdialog-theme-default ngdialog_setLocation1 ServiceMap1',
			width:'16rem',
			height:"8rem"
		}
		
		$scope.seviceLDig=ngDialog.open({
		        template: option.url,
		        plain: false,
		        className: option.className,
		        closeByEscape: true,
		        showClose : true,
		        closeByDocument: true,
		        closeByNavigation:true,
		        preCloseCallback: function(value) {
			        if(mkrTool){
			        	mkrTool.close();
			        }
			        if(localSearch){
			        	localSearch.clearResults();
			        }
			        return true;
			    },
		        scope: $scope,
		        width:option.width,
		        controller: ['$scope',function($scope) {
		        	$scope.address_string="";
		        	setTimeout(function(){
						init_locationMap("getLocation_map",type,locationJson,true);
						
					},300);
					
		        }]
		});
		
	}
	
	//tabel表格数据初始化
	var post_InitT;
	// 配置分页基本参数
	var initTableData=function(){
		var reGetProducts = function(){
			console.log("页码--"+$scope.myPagelist.pageNo);
			post_InitT={
				"pageNo":$scope.myPagelist.pageNo,"pageSize":$scope.myPagelist.pageSize,
			    "params":{"types":$scope.type,"userId":userId,"name":$scope.searchName||"","status":2}
		     };
			console.log(JSON.stringify(post_InitT));
			var post_InitTdata={
				"code":10033,
			    "param":JSON.stringify(post_InitT)
			}
			requestService.post(url, post_InitTdata).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
							$scope.selectSpinner = data.data.result;
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
        $scope.$watch('myPagelist.pageNo + myPagelist.pageSize+myPagelist.totalCount', reGetProducts);
	}
	
	//初始化
	var init=function(){
		$scope.type=[0];
		initTableData();
	}
	init();
	//搜索下拉按钮
	var postType;
	$scope.searchSelect=function(){
		$scope.has_search=true;
		postType=[];
		console.log($scope.selectValue);
		
		if(angular.isDefined($scope.selectValue)){
			$scope.dicId=$scope.selectValue.dicId;
			postType.push($scope.dicId);
			console.log(postType);
			$scope.type=postType;
		}else{
			$scope.type=[0];
		}
		
		initTableData();
	}
	//下拉select选择即改变	
	$scope.selectChange=function(newModel){
		$scope.selectValue=newModel;		
		$scope.searchSelect();
	}
	//禁用mouseDown事件
	function funcNoBlue(e){
		e.preventDefault();
	}
	
	function saveSend(event,postDt,type){
		var postData={
			"code":10034,
		    "param":JSON.stringify(postDt)
		}
		console.log(postData);		
		requestService.post(url, postData).then(
	            function (data) {
	            	console.log(data);
	            	if(data.code==200){
	            		console.log(data);
	            		if(type=="add"){
	            			initTableData();
	            			notifications.showSuccess("新建服务网点成功");
	            		}
	            		if(type=="modify"){
	            			$scope.myPagelist.totalCount-=1;
	            			notifications.showSuccess("修改服务网点成功");
	            		}
	            		ngDialog.close($scope.addModifyDg.id);
	            	}
	            	
	            },function(error){
	            	
	     })
	}
	//新建服务网点存按钮
	$scope.serviceSave1 = function(event,flag){
		console.log($scope.serviceAdd.lng);
		if(flag || !$scope.serviceAdd.lng){
			return;
		}
		$scope.serviceAdd.type=$scope.serviceAdd.typeObj.dicId;
		var postData=angular.copy($scope.serviceAdd);
		delete(postData.typeObj);		
		
		saveSend(event,postData,"add");
	}
	//修改服务网点存按钮
	$scope.serviceSave2 = function(event,flag){
		if(flag || !$scope.serviceModify.lng){
			return;
		}
		$scope.serviceModify.type=$scope.serviceModify.typeObj.dicId;
		$scope.serviceModify.userId=userId;
		console.log($scope.serviceModify);
		
		var postDATA={"siteId":$scope.serviceModify.siteId,"name":$scope.serviceModify.name,"address":$scope.serviceModify.address||"","phone":$scope.serviceModify.phone||"","contacts":$scope.serviceModify.contacts||"","type":$scope.serviceModify.type,
"lng":$scope.serviceModify.lng,"lat":$scope.serviceModify.lat,"userId":userId}
		console.log(postDATA);
		saveSend(event,postDATA,"modify");
	}
	
	function confirmDialog(json,Tback){
		
		ngDialog.openCustomConfirm({
			title:json.title,
			plain: false,
		    className: 'ngdialog-theme-default',
		    closeByEscape: true,
		    showClose : true,
		    closeByDocument: true,
		    scope: $scope,
		    width:'4.09rem',
			message:json.message
		}).then(function(){
			Tback(true);
		},function(){
			Tback(false);
		})
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
	//删除按钮
	$scope.delete1 = function(i){
		var json={
			title:"",
			message:"确定删除该记录?"
		};
		$scope.confirmlist1 = 1;
		confirmDialog(json,function(flag){
			if(flag){
				var postDATA={"siteId":i.siteId,"userId":userId};
				console.log(postDATA);
				var postData={
					"code":10035,
				    "param":JSON.stringify(postDATA)
				}
				requestService.post(url,postData).then(
		            function (data) {
		            	console.log(data);
		            	if(data.code==200){
		            		notifications.showSuccess("删除服务网点成功");
		            		$scope.myPagelist.totalCount-=1;
		            	}
		            },function(error){
		     	})
				
			}
		})
		
	}
	
	$scope.goBack=function(id){
		ngDialog.close(id);
		console.log(id)
	}
	$scope.close_deleteDialog=function(){
		$scope.deleteType=false;
	}
	
//查看地图
	$scope.service_look_map=function(i){
		console.log(i);
		$scope.addTwo("look",i);
	}
	
	
	//导入相关信息
	var uploadTemplateURL = '/product/api/downExcel';
	var uploadURL = '/product/api/uploadExcel';
	
	// 下载导入模板
	$scope.downloadTemplet = function() {
		var param = {
			excelCode:$scope.excel,
			userId:userid,
			type:0,
			param:""
		};
		var fileName;
		if($scope.excel=='excel001'){
			fileName ="车辆基本信息模板.xls";
		}else if($scope.excel=='excel002'){
			fileName="车主信息模板.xls";
		}
		requestService.download(uploadTemplateURL,param,fileName).then(function(data) {
			console.log("downloadTemplet success...")
		},function(error) {
			console.log("downloadTemplet error...")
		});
	}
	
	//导出数据
	$scope.conformTemplet = function(){
		var param = {
			excelCode:$scope.excel,
			userId:userid,
			type:1,
			param:""
		};
		var fileName;
		if($scope.excel=='excel001'){
			fileName ="车辆基本信息.xls";
		}else if($scope.excel=='excel002'){
			fileName="车主信息.xls";
		}
		requestService.download(uploadTemplateURL,param,fileName).then(function(data) {
			console.log("downloadTemplet success...")
		},function(error) {
			console.log("downloadTemplet error...")
		});
	}
	
	//打开导出页面
	$scope.exportExcel=function(){
		$scope.deleteType=true;
		var downloadName="车辆信息";
		ngDialog.openCustomConfirm({
			title:'导出数据',
			plain: false,
		    className: 'ngdialog-theme-default',
		    closeByEscape: true,
		    showClose : true,
		    closeByDocument: true,
		    scope: $scope,
		    width:'32%',
			message:"确定导出"+downloadName+"的信息吗？"
		}).then(function(value){
		},function(){
			
		})
	}
//	$scope.exportExcel();
	
	// 提交，导入文件
	var excelFile = document.getElementById("excelFile");
	$scope.importFile = function() {
		if($scope.importProgressBar) {
			$scope.showButton = true;//当使用了进度条的情况下，点击导入后 导入和清空按钮 暂时禁用
		}
		var files = excelFile.files;
		var file = files[0];
		if (!file) {
			notifications.showWarning("请选择导入文件");
			$scope.showButton = false;//导入按钮可用
			return;
		}
		//导入数据
		upload(file);
	};
	
	$scope.showButton = true;
	//导入
	var upload = function(file) {
		var excelCode = $scope.excel;
		if(excelCode==undefined||excelCode==null){
			notifications.showError("请选择导入文件所属模板!");
			return ;
		}
		var fd = new FormData();
		fd.append('file', file);
		fd.append('excelCode', excelCode);
		fd.append('userId', userid);
		// 清空文件
		if(! $scope.importProgressBar) {
			excelFile.value = null;//不使用了进度条的情况下，点击导入后 清空文件
		}
		$scope.loading = false;
		requestService.upload(uploadURL, fd, true).then(function(data) {
			notifications.showSuccess("导入成功");
		}, function(error) {
			$scope.loading = true;//不显示进度条
			$scope.showButton = false;//不禁用导入按钮(导入按钮可用)
		});
		/**
		 * 如果使用了进度条，0.5秒读一次缓存
		 */
		if($scope.importProgressBar){
			$scope.showProgress = loading;//显示进度条
		}
	};

	
	$scope.$on('$destroy', function() {
		$scope.car = null;
		$scope.carEnergyList = null;
		$scope.carDriveMotorList = null;

		parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
			this.$$childTail = null;
			console.log("remove---");
	});
	//document.addEventListener("mousedown",funcNoBlue);
	//document.removeEventListener("mousedown",funcNoBlue);
	
}]);

