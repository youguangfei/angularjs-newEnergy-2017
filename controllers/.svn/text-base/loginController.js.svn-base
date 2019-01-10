App.controller('loginController', ['notifications','$compile','$cookieStore','$rootScope','loginService','$http','$scope','cacheService','$location','$timeout','ngDialog','requestService','$interval',
        function(notifications,$compile,$cookieStore,$rootScope,loginService, $http, $scope,cacheService,$location, $timeout,ngDialog,requestService,$interval) {
		$rootScope.token;
		$rootScope.user={};
		$scope.rememberUsr = false;
		$scope.rememberPwd = false;
		$scope.userId_for;
		
		var checkUsr = angular.element(document.getElementById("checkUsr"));
		var checkPwd = angular.element(document.getElementById("checkPwd"));
		
		function uuid() {
		  var s = [];
		  var hexDigits = "0123456789abcdef";
		  for (var i = 0; i < 36; i++) {
		    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		  }
		  s[14] = "4"; 
		  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		  s[8] = s[13] = s[18] = s[23] = "-";
		  var uuid = s.join("");
		  return uuid;
		}
		var thisTime=Date.parse(new Date());
		var uuidSave=uuid();
		$scope.captchaId=uuidSave;
		$scope.captchaUrl="/security/captcha";
		console.log($scope.captchaId);
		
		localStorage["thisTmFlag"]=uuidSave;
		
		$scope.user.name = localStorage.getItem("user.name")||"";
		$scope.user.pwd = localStorage.getItem("user.pwd")||"";
		
		if(localStorage.getItem("user.name")){
			$scope.rememberUsr = true;
		}
		if(localStorage.getItem("user.pwd")){
			$scope.rememberUsr = true;
			$scope.rememberPwd = true;
		}
//		记住账号
	    $scope.rememberuse = function () {
	    	if($scope.rememberUsr){
	    		$scope.rememberPwd = false;
	    	}
	    	$scope.rememberUsr = !$scope.rememberUsr;
	    };
//	 	 记住密码
	    $scope.rememberpwd = function () {
	    	if($scope.rememberpwd){
	    		$scope.rememberUsr = true;
	    	}
	    	else{
	    		$scope.rememberUsr = false;
	    	}
	    	$scope.rememberPwd = !$scope.rememberPwd;
	    };
	    
		//回车登录
		$scope.enter=function(e){
			var e = e || event;
    		var currKey=e.keyCode;
    		
    		if($scope.user.captcha && $scope.user.captcha.length != 4)
    			return;
			if (currKey == 13) {
				if ($scope.user.name == null) {
					notifications.showInfo("请输入用户名");
					return;
				}
				if ($scope.user.pwd == null) {
					notifications.showInfo("请输入密码");
					return;
				}
				if ($scope.user.captcha == null) {
					notifications.showInfo("请输入验证码");
					return;
				}
                $scope.login();
                
            } else {
            	return;
            }
		}
		
		var delayTime = null;
        $scope.login = function() {
        	if($cookieStore.get("employeeId")!=null){
        		$cookieStore.remove("employeeId");
        	}	
            if (delayTime) {
            	$timeout.cancel(delayTime);
            }
            if($scope.loginForm.$valid){
	            delayTime = $timeout(function(){
	            	if(!$("html").hasClass("bgImg")){
	            		$("html").addClass("bgImg");
	            	}
		        	loginService.login($scope.user.name, $scope.user.pwd, $scope.user.captcha,$scope.captchaId).then(
		        		function(data) {
		        			if(data.code==10202){
								$rootScope.user.name=$scope.user.name;
								$cookieStore.remove("name");
								$cookieStore.put("name",$scope.user.name);
								if(data.data.unReadMsgCount!=null){
									$cookieStore.remove("unReadMsgCount");
									$cookieStore.put("unReadMsgCount",data.data.unReadMsgCount);									
								}
								if(data.data.token!=null){
									$rootScope.user.token=data.data.token;
									$cookieStore.remove("token");
									$cookieStore.put("token",data.data.token);
								}
								if(data.data.orgId!=null){
									$cookieStore.remove("orgId");
									$cookieStore.put("orgId",data.data.orgId);
								}
								if(data.data.orgName!=null){
									$cookieStore.remove("orgName");
									$cookieStore.put("orgName",data.data.orgName);
								}
								if(data.data.tenantId!=null){
									$cookieStore.remove("tenantId");
									$cookieStore.put("tenantId",data.data.tenantId);
								}
								if(data.data.tenantName!=null){
									$cookieStore.remove("tenantName");
									$cookieStore.put("tenantName",data.data.tenantName);
								}
								if(data.data.roleType!=null){
									$cookieStore.remove("roleType");
									$cookieStore.put("roleType",data.data.roleType);
								}
								if(data.data.isRoot!=null){
									$cookieStore.remove("isRoot");
									$cookieStore.put("isRoot",data.data.isRoot);
								}
								if(data.data.groupId!=null){
									$cookieStore.remove("groupId");
									$cookieStore.put("groupId",data.data.groupId);
								}
								if(data.data.userId!=null){
									$cookieStore.remove("userId");
									$cookieStore.put("userId",data.data.userId);
								}
								if(data.data.roles!=null){
									$cookieStore.remove("roles");
									$cookieStore.put("roles",data.data.roles);
								}
								if(data.data.topics!=null){
									$cookieStore.remove("topics");
									$cookieStore.put("topics",data.data.topics);
									
								}
								if(data.data.employee!=null){
									$cookieStore.remove("employeeId");
									$cookieStore.put("employeeId",data.data.employee);
								}
								if(data.data.employeeName!=null){
									$cookieStore.remove("employeeName");
									$cookieStore.put("employeeName",data.data.employeeName);
								}
								if(data.data.realName!=null){
									$cookieStore.remove("realName");
									$cookieStore.put("realName",data.data.realName);
								}
								cacheService.removeItems();
								cacheService.removeOrgs();	
								$cookieStore.remove("targetOrgId");
								$cookieStore.remove("10405");
								$cookieStore.remove("10406");								
								$cookieStore.remove("loginUser");
								$cookieStore.put("loginUser",$rootScope.user);
								if(data.data.roleName=="维修人员"){
									$location.path('/home/repairRecord');
								}else{
									$location.path('/home/monitor');
								}
							} 
							// 登录时验证码错误，则须重新刷新验证码
							else if (data.code == 10581 || data.code == 10408) {
								$scope.monitorRefresh1 = true;
							}
		        			$cookieStore.remove("emailCount");
		        			$cookieStore.put("emailCount",0);
							if($rootScope.user==null){
								$rootScope.user={};
							}
							$rootScope.user.emailCount=0;
		                	if($scope.rememberUsr == true){
		                		localStorage.setItem("user.name",$scope.user.name);
		                		localStorage.removeItem("user.pwd");
		                	}else{
		                		localStorage.removeItem("user.name");
		                	}
	//	                	点击记住密码
		                	if($scope.rememberPwd == true){
		                		localStorage.setItem("user.name",$scope.user.name);
		                		localStorage.setItem("user.pwd",$scope.user.pwd);
		                	}else if($scope.rememberPwd != true && $scope.rememberUsr != true){
		                		localStorage.removeItem("user.name");
		                		localStorage.removeItem("user.pwd");
		                	}
		        		},
		        		function(error){
							$scope.user.pwd = '';
							$scope.monitorRefresh1 = true;
		                }
		            ); 
            	}, 500);
        	}else{
        		$scope.loginForm.user_name.$dirty = true;
      			$scope.loginForm.user_pwd.$dirty = true;
        	}		
        }
        
//      忘记密码
		$scope.forget_phone,$scope.tuCaptcha_for,$scope.new_resetPwRq=false,$scope.new_resetPwError=false,$scope.new_resetPwRq2=false,$scope.new_resetPwError2=false,$scope.pwRes_Equality=false;
		$scope.codeS,$scope.codeS2;				
		$scope.forget_pwd = function() {
			$scope.modFor_pwd=2;
			$scope.codeS=false;
			$scope.title = '忘记密码';
			var uuidForget=uuid();
			$scope.captchaId2=uuidForget;
			$scope.captchaUrl2="/security/api/captcha/graphic";
			console.log($scope.captchaId2);
			
			ngDialog.open({
				template: 'html/blocks/Modify_password.html',
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '5.15rem',
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						pwdInit();
					}, 1000)
					
				}]
			});
		}
		
		$scope.clickChange1=function(newModel){
			$scope.monitorRefresh1=newModel;
		}
		$scope.clickChange2=function(newModel){
//			$scope.monitorRefresh2=newModel;
		}
		
		//点击发送验证码
		function pwdInit() {
				$scope.sendMsgCode=function(forget_phone,tuCaptcha_for,flag){
					var reg=/(^1[3|4|5|7|8][0-9]{9}$)|(^\d{3}-\d{7,8}$)|(^\d{4}-\d{7,8}$)/;
					if(!reg.test(forget_phone)){
						return;
					}
					if(!tuCaptcha_for || tuCaptcha_for.length!=4 || $scope.codeS){
						return;
					}
					var sendMsg_data={
						"phone": forget_phone, //用户帐号
					    "tuCaptcha":tuCaptcha_for || "", //图形验证码
					    "captchaId":$scope.captchaId2,//验证码id
					}
					var url="/security/sendMsgCode";
					requestService.post(url, sendMsg_data).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){					            								
			            	notifications.showSuccess(data.message);
			            	    $scope.codeS=60;
			            		var codeMsg = $interval(function(){
			            			$scope.codeS2=$scope.codeS+" S";
			            			$scope.codeS-=1;
			            			if($scope.codeS==0){
			            				$scope.codeS2="";
			            				$interval.cancel(codeMsg);
			            			}
			            		},1000);
			            	}else{
//			            		$scope.monitorRefresh2=true;
			            	}
				         },function(error){
				         	console.log(error);
//				         	$scope.monitorRefresh2=true;
				     })
				}
				
				//忘记密码带短信，验证请求
				var submit_msgUrl="/security/submitCaptcha";
				$scope.forget_pwSend=function(forget_phone,tuCaptcha_for,inMsg,flag){
					console.log(flag);
					if(flag){
						return;
					}
					var sendMsg_data={
						"phone": forget_phone, //用户帐号
					    "tuCaptcha":tuCaptcha_for || "", 
					    "captcha" :inMsg,
					    "captchaId":$scope.captchaId2,//验证码id
					}
					console.log(sendMsg_data);
					
					requestService.post(submit_msgUrl, sendMsg_data).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
			            		$scope.userId_for=data.data;
			            		ngDialog.close();
			            		setTimeout(function(){
			            			reset_pwd();
			            		},500)
			            	}
			            	
				         },function(error){
				         	console.log(error);
				         	console.log($scope.monitorRefresh2);
//				         	$scope.monitorRefresh2=true;
				     })
				}
		}
		
		function reset_pwd(){
			$scope.modFor_pwd=3;
			$scope.title = '重置密码';
			ngDialog.open({
				template: 'html/blocks/Modify_password.html',
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '5.15rem',
				controller: ['$scope', function($scope) {
					setTimeout(function() {
						reset_pwdSave();
					}, 1000)
				
				}]
			});
			
		}
		function reset_pwdSave(){
			$scope.reset_pwSend=function(new_resetPw,new_resetPw2,flag){
					if(flag||new_resetPw&&new_resetPw2&&(new_resetPw!=new_resetPw2)){
						return;
					}
					var sendMsg_data={
						"pwd": new_resetPw, //用户帐号
					    "rePwd":new_resetPw2, 
					    "userId":$scope.userId_for,
					}
					console.log(sendMsg_data);
					
					var url="/security/restPassword";
					requestService.post(url, sendMsg_data).then(
			            function (data) {
			            	console.log(data);
			            	if(data.code==200){
								notifications.showSuccess("密码重置成功");		            								ngDialog.close();
			            	}
				         },function(error){
				     })
			}
		}
		
		
        $scope.$on('$destroy', function() {
        	console.log("login controller destroy!!");
        	
        	if(this.$$destroyed) return;
        	while (this.$$childHead) {
        	      this.$$childHead.$destroy();
        	}
        	var parent = this.$parent;
        	
        	$scope.rememberMe = null;
        	$scope.login = null;

        	$scope.user = null;
       	    this.$$destroyed = true;
        });
        
} ]);