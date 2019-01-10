App.controller('AppController', ['$rootScope', '$scope', '$state', '$window', '$localStorage', '$timeout', 'toggleStateService', 'loginService', 'cacheService','$cookies','$cookieStore', 'colors', 'browser', 'cfpLoadingBar', 'requestService', '$http', 'Utils', 'notifications', 'ngDialog',
	function($rootScope, $scope, $state, $window, $localStorage, $timeout, toggle, loginService, cacheService,$cookies,$cookieStore, colors, browser, cfpLoadingBar, requestService, $http, Utils, notifications, ngDialog) {
		"use strict";
		$scope.unReadMsgCount = $cookieStore.get("unReadMsgCount");
		$scope.newsmessages = 526;
		$scope.news=false,$rootScope.Monitor_left=false;
		$scope.realNameuser=$cookieStore.get("realName");
		var goEasy;
		$rootScope.confirmlist1 = 2;
		//  '$rootScope','$scope','requestService','$state', '$http', '$timeout', 'Utils',
		// Setup the layout mode
		$rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout == 'app-h');
		$rootScope.app.layout.isCollapsed = false;
		// Loading bar transition
		// ----------------------------------- 
		/*var thBar;
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		    if($('.wrapper > section').length) 
		      thBar = $timeout(function() {
		        cfpLoadingBar.start();
		      }, 0);  
		});
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		    event.targetScope.$watch("$viewContentLoaded", function () {
		      $timeout.cancel(thBar);
		      cfpLoadingBar.complete();
		    });
		});*/
		//	左边菜单栏点击效果
		$scope.activeIndex1 = -1;
		$scope.changeIndex1 = function(index) {
			$scope.activeIndex1 = index;
		}

		// Hook not found
		$rootScope.$on('$stateNotFound',
			function(event, unfoundState, fromState, fromParams) {
				console.log(unfoundState.to); // "lazy.state"
				console.log(unfoundState.toParams); // {a:1, b:2}
				console.log(unfoundState.options); // {inherit:false} + default options
			});
		// Hook error
		$rootScope.$on('$stateChangeError',
			function(event, toState, toParams, fromState, fromParams, error) {
				console.log(error);
			});
		// Hook success
		$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				// display new view from top
				$window.scrollTo(0, 0);
				// Save the route title
				$rootScope.currTitle = $state.current.title;
			});

		$rootScope.currTitle = $state.current.title;
		$rootScope.pageTitle = function() {
			var title = $rootScope.app.name + ($rootScope.currTitle || $rootScope.app.description);
			document.title = title;
			return title;
		};

		// iPad may presents ghost click issues
		// if( ! browser.ipad )
		// FastClick.attach(document.body);

		// Close submenu when sidebar change from collapsed to normal
		$rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
			if(newValue === false)
				$rootScope.$broadcast('closeSidebarMenu');
		});

		// Restore layout settings
		if(angular.isDefined($localStorage.layout))
			$scope.app.layout = $localStorage.layout;
		else
			$localStorage.layout = $scope.app.layout;

		$rootScope.$watch("app.layout", function() {
			$localStorage.layout = $scope.app.layout;
		}, true);

		// Allows to use branding color with interpolation
		// {{ colorByName('primary') }}
		$scope.colorByName = colors.byName;

		// Internationalization
		// ----------------------

		// Restore application classes state
		toggle.restoreState($(document.body));

		// cancel click event easily
		$rootScope.cancel = function($event) {
			$event.stopPropagation();
		};

		function openConfirmFun(json, callType) {
			ngDialog.openCustomConfirm({
				title: json.title,
				plain: false,
				className: 'ngdialog-theme-default',
				closeByEscape: true,
				showClose: true,
				closeByDocument: true,
				scope: $scope,
				width: '4.09rem',
				message: json.message
			}).then(function() {
				callType(true);

			}, function() {
				callType(false);

			})
		}
		$rootScope.realName = $cookieStore.get("realName");
		$scope.loginout = function(name, token) {
			$rootScope.confirmlist1 = 1;
			var json = {
				title: "",
				message: "是否退出当前登录 ?"
			}
			openConfirmFun(json, function(data) {
				if(data) {
					conOut(name, token);
				} else {
					console.log("取消退出");
				}
			})
		}

		function conOut(name, token) {
			loginService.loginout(name, token).then(
				function(token) {
					if(token == null) {
						notifications.showError("用户名错误");
					} else {
						$cookieStore.remove("push.goeasy");
						angular.forEach($cookies,function(item,index,Array){
							console.log(index);
							$cookieStore.remove(index);
						})
						
						cacheService.removeItems();
						var userName=localStorage["user.name"];
						var userPwd=localStorage["user.pwd"];
						console.log(userName+"----"+userPwd);
						localStorage.clear();
						if(userName){
							localStorage["user.name"]=userName;
						}
						if(userPwd){
							localStorage["user.pwd"]=userPwd;
						}
						
						goEasy.unsubscribe({
							channel: "my_channel"+userId,
						onSuccess: function () {
							console.log("订阅取消成功。");
						},
						onFailed: function (error) {
							console.log("取消订阅失败，错误编码：" + error.code + " 错误信息：" + error.content)
							}
						});
						
						setTimeout(function(){
							$state.go('login');
						},100)
					}
				},
				function(error) {
					$scope.user.pwd = '';
					//$location.path('home');	
				}
			);
		}
		$scope.goBack = function(id) {
			//		$scope.ngDialogId
			ngDialog.close(id);
		}
		$scope.headerFixedflag = true;
		$scope.headerFixed = function() {
			$scope.headerFixedflag = !$scope.headerFixedflag;
		}
		$scope.offsidebarTopen = function() {
			if(!$(".offsidebarT").hasClass("open")) {
				$(".offsidebarT").addClass("open");
			} else {
				$(".offsidebarT").removeClass("open");
			}
		}

		//	实时监控左侧详情开关
		$scope.changeLeftMap2 = function() {
			$rootScope.leftMap = true;
			localStorage["monitorJson"]="true";
			$rootScope.$broadcast("leftMapOpen");
		}
		
//		权限变更,退出登录
		$rootScope.changeImtBox=false;
		$rootScope.$on("code3",function(event,msg,clearflag){
			console.log(msg);
			if($rootScope.changeImtBox ||msg==""||msg==undefined) return;
			$rootScope.changeImtMsg=msg;
			$rootScope.changeImtBox=true;
		})
		
		$rootScope.changeImt=function(clearflag){
			if(clearflag){
					localStorage.clear();
					cacheService.removeCookie();
			}
			setTimeout(function(){
				ngDialog.close();
				$state.go("login");
				$rootScope.changeImtBox=false;
			},10)
		}
		
		//	sideMenu
		var collapseList = [];
		$rootScope.app.layout.isCollapsed = false;
		// demo: when switch from collapse to hover, close all items
		$rootScope.$watch('app.layout.asideHover', function(oldVal, newVal) {
			if(newVal === false && oldVal === true) {
				closeAllBut(-1);
			}
		});
		

		// Check item and children active state
		var isActive = function(item) {
			if(!item) return;
			if(!item.url || item.url == '#') {
				var foundActive = false;
				angular.forEach(item.menu, function(value, key) {
					if(isActive(value)) foundActive = true;
				});
				return foundActive;
			} else
				return $state.is(item.url) || $state.includes(item.url);
		};

		//sidebar
		var elem = $('#sidebar'),
			ul = "",
			menuTitle,
			_this;

		elem.on('click', 'a', function(e) {
			_this = $(this);
			_this.closest("ul").find(".open").children("ul").not(_this.next()).parent('.open').removeClass("open");
			if(_this.next().is('ul') && _this.parent().toggleClass('open')) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				//_this.parent().addClass("active");
			}
		});
		/*elem.on(eventObject, 'a', function(e) {
			if(!isSidebarClosed() || isSmallDevice())
				return;
			_this = $(this);

			if(!_this.parent().hasClass('hover') && !_this.closest("ul").hasClass("sub-menu")) {
				wrapLeave();
				_this.parent().addClass('hover');
				menuTitle = _this.find(".item-inner").clone();
				if(_this.parent().hasClass('active')) {
					menuTitle.addClass("active");
				}
				var offset = $("#sidebar").position().top;
				var itemTop = isSidebarFixed() ? _this.parent().position().top + offset : (_this.parent().position().top);
				menuTitle.css({
					position: isSidebarFixed() ? 'fixed' : 'absolute',
					height: _this.outerHeight(),
					top: itemTop
				}).appendTo(wrap);
				if(_this.next().is('ul')) {
					ul = _this.next().clone(true);

					ul.appendTo(wrap).css({
						top: menuTitle.position().top + _this.outerHeight(),
						position: isSidebarFixed() ? 'fixed' : 'absolute',
					});
					if(_this.parent().position().top + _this.outerHeight() + offset + ul.height() > $win.height() && isSidebarFixed()) {
						ul.css('bottom', 0);
					} else {
						ul.css('bottom', 'auto');
					}

					wrap.children().first().scroll(function() {
						if(isSidebarFixed())
							wrapLeave();
					});

					setTimeout(function() {

						if(!wrap.is(':empty')) {
							$(document).on('click tap', wrapLeave);
						}
					}, 300);

				} else {
					ul = "";
					return;
				}

			}
		});
		wrap.on('mouseleave', function(e) {
			$(document).off('click tap', wrapLeave);
			$('.hover', wrap).removeClass('hover');
			$('> .item-inner', wrap).remove();
			$('> ul', wrap).remove();

		});*/
		// ----------------------------------- 

		$scope.getMenuItemPropClasses = function(item, $event) {
			return(item.heading ? 'nav-heading' : '') +
				(isActive(item) ? ' active open' : '');
		};
		var sideMenuArr = [];

		$scope.loadSidebarMenu = function() {
			var url = '/security/api/menu/getMenuItems';
			requestService.post(url, {}).then(function(data) {
				console.log(data);
				var items = data.data;
				angular.forEach(items, function(item, index, array) {
					item.level = 1;
					if(item.menu && item.menu.length == 1) {
						item.menu[0].level = 2;
					}
					sideMenuArr.push(item);
				})
				$scope.menuItems = sideMenuArr;
//				var firstFlag=localStorage["firstLogin"];
//				if(firstFlag!="false"&&sideMenuArr.length>0){
//						localStorage["firstLogin"]="false";
//						$state.go(sideMenuArr[0].menu[0].url);
//				}
				
			})
		}
		$scope.loadSidebarMenu();

		$scope.showThisMenu = function(item) {
			var flag = true;
			if(item.level == 2) {
				angular.forEach(sideMenuArr, function(alitem, index, array) {
					if(alitem.id == item.pId && alitem.name == item.name) {
						alitem.url = item.url;
						flag = false;
					}
				})
			}
			return flag;
		}

		$scope.showArrowIcon = function(item) {
			if(item.menu && item.menu.length > 0) {
				if(item.level == 1 && item.menu.length == 1 && (item.name = item.menu[0].name)) {
					return false;
				} else {
					return false;
				}
			} else {
				return false;
			}

		}

		// Handle sidebar collapse items
		// ----------------------------------- 

		$scope.addCollapse = function($index, item) {
			collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
		};

		$scope.isCollapse = function($index) {
			return(collapseList[$index]);
		};
		$scope.toggleCollapse = function($index, url, isParentItem, event) {

			// collapsed sidebar doesn't toggle drodopwn
			if(Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {}
			//    return true;
			// make sure the item index exists
			if(angular.isDefined(collapseList[$index])) {
				if(!$scope.lastEventFromChild) {
					collapseList[$index] = !collapseList[$index];
					closeAllBut($index);
				}
			} else if(isParentItem) {
				closeAllBut(-1);
			}

			$scope.lastEventFromChild = isChild($index);

			/*var _this;
				_this = ($(event.target).parent().parent());
				if(!_this.closest("ul").hasClass("in")){
					_this.parent().removeClass("open");
				}else{
					_this.closest("ul").find(".open").not(".active").children("ul").parent('.open').removeClass("open");
					
				}
				if(_this.closest("ul").hasClass("in")){
					_this.parent().addClass("open");
				}*/
			if(url.indexOf("home.sideMenu") != -1) {
				$state.go(url);
			}
		};

		function closeAllBut(index) {
			index += '';
			for(var i in collapseList) {
				if(index < 0 || index.indexOf(i) < 0)
					collapseList[i] = true;
			}
		}

		function isChild($index) {
			return(typeof $index === 'string') && !($index.indexOf('-') < 0);
		}
		$scope.dropM1 = false;
		$scope.change_dropM1 = function($event) {
				$event.stopPropagation();
				console.log($scope.dropM1);
				$scope.dropM1 = !$scope.dropM1;
		}
		//  点击页面其他元素隐藏修改密码
		$(document).click(function(e) {
			e.stopPropagation();
			var target = $(e.target);
			var divTop = $('#dropdown_div');   // 要隐藏的父标签
			
			if(!divTop.is(target) && divTop.has(target).length === 0) {
				if($scope.dropM1){
					$scope.dropM1=false;
					$scope.$apply();
				}
			}
		})
		$scope.Modify_pwd = function() {
			$scope.dropM1 = false;
			$scope.modFor_pwd=1;
			$scope.title = '修改密码';
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
					}, 200)

					function pwdInit() {
						var pw_url = "/security/api/user/updatePassword";
						var orgId = $cookieStore.get("groupId");
						$scope.oldPw, $scope.newPw, $scope.newPw2;
						$scope.modify_pwSend = function(flag) {
							if(flag || $scope.newPw!=$scope.newPw2) {
								return;
							}
							var name = $cookieStore.get("name");
							var postData = {
								"name": name,
								"password": $scope.oldPw,
								"newPassword": $scope.newPw,
							}
							console.log(postData);
							requestService.post(pw_url, postData).then(
								function(data) {
									console.log(data);
									if(data.code == 200) {
										console.log(data);
										notifications.showSuccess("密码修改成功");
										ngDialog.close();
										var userName=$rootScope.user.name;
										console.log(userName);
										localStorage["user.name"]=userName;
										
										if(localStorage["user.pwd"]){
											localStorage.removeItem(["user.pwd"]);
										}
										setTimeout(function() {
											$state.go("login");
										}, 200)

									}
								},
								function(error) {
									notifications.showError("密码修改失败");
								})
						}

					}

				}]
			});
		}

		$scope.closeBlank = function() {
			console.log("close");
			window.close();
		}
		
		/*推送未读消息*/
		var music = null;
		
		/*推送未读消息*/
		var firstFlag=true;
		var news = function(){
			//获取语音提示的标签
			music = document.getElementById("bgMusic");
			music.play();
			$scope.news=true;
			console.log($scope.news);
			if(firstFlag){
				$scope.news=true;
			}else{
				$scope.$apply(function(){
				 	$scope.news=true;
				 })
			}
			 firstFlag=false;
		};
//	消息推送
	var userId=$cookieStore.get("userId");
	console.log(userId);
	
	 goEasy = new GoEasy({
        appkey: 'BS-b8d3dd2ed44743f98085e84e27604ec4'
	  });
		goEasy.subscribe({
		    channel: 'channel'+userId,
		    onMessage: function(msg){
		    	console.log(msg);
		    	var content=msg.content;
		    	if(content.indexOf("{")!=-1){
		    		$scope.content=JSON.parse(msg.content);
		    		var message=$scope.content.body;
		    		var indexNumber=message.indexOf("：");
					$scope.getT_msgtitle=message.substring(0,indexNumber);
					$scope.getT_msgBody=message.substring(indexNumber+1);
		    	}else{
		    		$scope.getT_msgtitle="权限通知";
					$scope.getT_msgBody=content;
		    	}
				$scope.unReadMsgCount+=1;
		        news();
		    }
		});

	$scope.setAlreadyRead=function(x,Tback){
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
	            		Tback(true);
	            	}else{
	            		Tback(false);
	            	}
	            	
				},function(error){
					Tback(false);
		})
	}
	
	$scope.lookNewsDetail=function(){
		console.log($scope.content);
		//消息设为已读
		$scope.setAlreadyRead($scope.content,function(data){
			if(data){
				$scope.getUnRead_num();
			}
		});
		var workformCode=$scope.content.workformCode;
		if(workformCode !="" && workformCode!=undefined){
			window.open("#/Repair_LookOpen/"+workformCode+"/"+"look");
		}else{
//			车辆详情
			var carId=$scope.content.carId;
			window.open("#/carDetails/"+"carId"+"/"+carId); 
		}
		$scope.news = false;
	}
		  
	/*关闭信息框*/
	$scope.closeNews = function() {
		//消息设为已读
		$scope.setAlreadyRead($scope.content,function(data){
			if(data){
				$scope.getUnRead_num();
			}
		});
		$scope.news = false;
		if(music != null) {
			music.pause();
		}
		
	}  
		//跳转消息页面
		$scope.goMessage=function(){
			window.open("#/newsmessage");
		}
		
		//刷新未读消息数量
		window.funInA_msgNumRefresh = function() {
			 $scope.getUnRead_num();
		}
		//关闭推送窗口
		window.closeNews = function() {
			 if($scope.news){
			 	$scope.news=false;
			 }
		}
		
		//  获取未读消息数量
		$scope.getUnRead_num = function() {
			var postJson = {};
			var getUnRead_url = "/security/api/message/getUnreadNumber";
			requestService.post(getUnRead_url, postJson).then(
				function(data) {
					console.log(data);
					if(data.code == 200) {
						$scope.unReadMsgCount=data.data;
//						notifications.showSuccess("获取未读消息" + data.data);
					}
				},
				function(error) {
				})
		}
		  $scope.getUnRead_num();
		
		
		
		




	}
]);