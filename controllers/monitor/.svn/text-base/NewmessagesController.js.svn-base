App.controller('NewmessagesController', [
	'requestService','cacheService','$cookieStore', '$scope', '$timeout','$filter','ngDialog','notifications',"$state","$stateParams",'$rootScope',
	function(requestService,cacheService,$cookieStore,$scope, $timeout,$filter,ngDialog,notifications,$state,$stateParams,$rootScope) {
		$scope.newsmessage = $stateParams.newsmessages;
		
	var newsInit_Url="/security/api/message/getMessages";
	var url = '/product/api/business';
	var req_url="http://192.168.231.166:8080/product/api/business";
	//table tr点击选中效果
	$scope.activeIndex=-1;
	$scope.changeIndex=function(index){
		$scope.activeIndex=index;
	}
	
//	进入消息管理页面时,关闭推送的弹窗
	window.opener.closeNews();
	
	var post_InitT;
	var initWatch;
	var initTableData=function(){
			var reGetProducts = function(){
				var param={
					"pageNo":$scope.myPagelist.pageNo,"pageSize":$scope.myPagelist.pageSize
				}
				requestService.post(newsInit_Url,param).then(
						function (data) {
			            	console.log(data);
			            	if(data.code==200){
								$scope.Newslist = data.data.result;
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
	      initWatch=$scope.$watch('myPagelist.pageNo + myPagelist.pageSize', reGetProducts);
		}
	initTableData();
	$scope.setAlreadyRead=function(x){
		console.log(x);
		var messageId=x.messageId;
		var post_data={
			 "messageId":messageId
		}
		console.log(post_data);
		var read_url="/security/api/message/setRead";
		requestService.post(read_url,post_data).then(
				function (data) {
	            	console.log(data);
	            	if(data.code==200){
		            	notifications.showSuccess("设置成功");
		            	window.opener.funInA_msgNumRefresh();
		            	if(x.status==0){
		            		x.status=1;
		            	}
	            	}else{
		            	notifications.showError("设置失败");
	            	}
	            	
				},function(error){
		            notifications.showError("设置失败");
					
		})
		
	}
	
	$scope.lookDetails=function(x){
		console.log(x);
		 var href=window.location.href;
		 var indexNum=href.indexOf("#");
		 var hrefUrl=href.substring(0,indexNum);
		 console.log(hrefUrl);
		checkIsDelete(x,function(data){
			if(!data){
				return;
			}
			if(x.status==0){
				x.status=1;
				$scope.setAlreadyRead(x);
				setTimeout(function(){
					window.opener.funInA_msgNumRefresh();
				},100)
			}
			//报修单,点击后，对应消息变为已读
			var workformCode=x.workformCode;
			var goUrl;
			if(workformCode !="" && workformCode!=undefined){
				goUrl=hrefUrl+"#/Repair_LookOpen/"+window.pwdString.encrypt(workformCode)+"/"+"look";
				console.log(goUrl);
				newWin(goUrl);
			}else{
	//			车辆详情
				var carId=x.carId;
				goUrl=hrefUrl+"#/carDetails/"+"carId"+"/"+window.pwdString.encrypt(carId);
				console.log(goUrl);
				newWin(goUrl);
			}
		})
		
	}
	
	function newWin(url) {  
	      var a = document.createElement("a");  
	      a.setAttribute('href', url);  
	      a.setAttribute('target', '_blank');
	      a.setAttribute('id', "goInblank_noErId");
	      if(!document.getElementById("goInblank_noErId")) {                       
               document.body.appendChild(a);  
           } 
	      a.click(); 
	      setTimeout(function(){	      
	      	document.body.removeChild(document.getElementById("goInblank_noErId"));
	      },1000)
  	}
	
//	验证相关信息是否已经删除
	function checkIsDelete(x,Tback){
		var postDt={
			userId:userId,
		}
		if(x.workformCode){
			postDt.workformCode=x.workformCode;
		}else{
			postDt.carId=x.carId;
		}
		var postData={
			"code":10059,
		    "param":JSON.stringify(postDt)
		}
		requestService.post(url,postData).then(
				function (data) {
					if(!data.data){
						if(x.workformCode){
							notifications.showError("报修单已被删除!");
						}else{
							notifications.showError("该车辆已被删除!");
						}
					}
	            	Tback(data.data);
				},function(error){
					Tback(true);
		})
	}	
	
//	关闭弹窗
	$scope.closeBlank = function(){
		window.close();
	}
	
	
	
	
	
		
		
}])