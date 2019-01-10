App.service('requestService', ['$http', '$rootScope', '$state', '$cookieStore', '$window', '$q', 'notifications', function($http, $rootScope, $state, $cookieStore, $window, $q, notifications) {
	$rootScope.ngDialog = {};
	urls = {
		'/security': 'http://192.168.52.225:25510',
		'/product': 'http://192.168.52.225:25510'
	};
	//清楚cookie
	var clearCache = function() {
			$cookieStore.remove("tenantId");
			$cookieStore.remove("tenantName");
			$cookieStore.remove("isRoot");
			$cookieStore.remove("groupId");
			$cookieStore.remove("userId");
			$cookieStore.remove("employeeId");
			$cookieStore.remove("employeeName");
			$cookieStore.remove("token");
			$cookieStore.remove("name");
			$cookieStore.remove("orgId");
			$cookieStore.remove("orgName");
			$cookieStore.remove("roleType");
			$cookieStore.remove("roles");
	}
	var downloadRequest = function(path, data, fileName) {
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == undefined || data.token == null) {
				data.token = $cookieStore.get("token");
			}
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
			data.app = "web";
			var deferred = $q.defer();
			$http({
				url: url,
				method: 'POST',
				responseType: 'arraybuffer',
				data: data,
				xhrFields: {
					withCredentials: false,
					useDefaultXhrHeader: false
				},
				headers: {
			    	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			    },
				transformRequest: function(obj) {
					return $.param(obj);
				}
			}).success(function(data1) {
				var blob = new Blob([data1], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				});
				saveAs(blob, fileName+ '.xls');
			}).error(function() {
				console.log("downloadRequest error...")
			}).then(function(response) {
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {

					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
//							alert("用户异地登入,你已被强制下线！");
							var msg="该账号已在其它终端进行登录";
							$rootScope.$broadcast('code3',msg,false);
							$cookieStore.put("10406", true);
						}
						return;
					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
				} else if (response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 凡是后台返回ResultDTO.getFailure
					// 前端页面提示，后台传过来的错误消息message
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function(response) {
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);
			});
			return deferred.promise;
	}
	saveAs = function(blob, fileName) {
		if (window.navigator.msSaveOrOpenBlob) {
			navigator.msSaveBlob(blob, fileName);
		} else {
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(link.href);
		}
	}
	//isLoading - set loading image when waiting for a response, default is false, 
	var postRequest = function(path, data, isLoading) {
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			data.app = "web";
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: url,
				data: data,
				async: true,
				xhrFields: {
					withCredentials: false,
					useDefaultXhrHeader: false
				},
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: function(obj) {
					return $.param(obj);
				}
			}).then(function(response) {

				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}

					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
//							alert("用户异地登入,你已被强制下线！");
							var msg="该账号已在其它终端进行登录";
							$cookieStore.put("10406", true);
							$rootScope.$broadcast('code3',msg,false);
						}
						return;
					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 3) {
					console.log("权限变更-------");
					$rootScope.$broadcast('code3',"操作权限变更，请重新登录 ",true);
					
				}else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code == 10505) {
					if(response.data.message.length<300){
						notifications.showError(response.data.message);
					}else{
						notifications.showError("获取不到数据");
					}
					deferred.resolve(response.data);					
				} else if (response.data.code != null && response.data.code != 200) {
					if(response.data.code == 10404){
						console.log(response.data.message)
					}else{
						// 前端页面提示，后台传过来的错误消息message
						// 凡是后台返回ResultDTO.getFailure
						notifications.showError(response.data.message);
						deferred.reject(response.data);
					}
					
				} else {
					deferred.resolve(response.data);
				}

			}, function(response) {
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);
			});
			return deferred.promise;
	}


	var setNgDialog = function(ngDialog) {
		$rootScope.ngDialog = ngDialog;
	}
	//get 后台接口请求
	var getRequest = function(path, data) {
			return $http({
				method: 'GET',
				url: host + path,
				data: data,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj)
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				}
			}).then(function(response) {
				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}
					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
//							alert("用户异地登入,你已被强制下线！");
							var msg="该账号已在其它终端进行登录";
							$cookieStore.put("10406", true);
							$rootScope.$broadcast('code3',msg,false);
						}
						return;
					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 凡是后台返回ResultDTO.getFailure
					// 前端页面提示，后台传过来的错误消息message
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}
				return response.data;

			}, function(response) {
				return response;

			});
		}

	var uploadRequest = function(path, data, isLoading) {
		/*if(isLoading != undefined && isLoading == true)
			ngLoadingService.setNgLoading(true);*/
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
			url = url + "?token=" + data.token + "&app=web";
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: url,
				data: data,
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function(response) {

				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}
					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}

					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code == 10602) {
					deferred.reject(response.data);
				} else if (response.data.code != null && response.data.code == 10504) {
						deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 前端页面提示，后台传过来的错误消息message
					// 凡是后台返回ResultDTO.getFailure
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function(response) {
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);

			});
			return deferred.promise;
	}


		//isLoading - set loading image when waiting for a response, default is false, 
	var postJsonRequest = function(path, data, isLoading,code) {
		/*if(isLoading != undefined && isLoading == true)
			ngLoadingService.setNgLoading(true);*/
			if ($rootScope.user != null) {
				data.token = $rootScope.user.token;
			}
			if (data.token == null) {
				data.token = $cookieStore.get("token");
			}
			data.app = "web";
			url = urls[path.substr(0, path.substr(1).indexOf('/') + 1)] + path;
			//url = path;
			url = url + "?token=" + data.token + "&app=web";
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: data,
				async: true,
				xhrFields: {
					withCredentials: false,
					useDefaultXhrHeader: false
				},
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=UTF-8'
				},
			}).then(function(response) {

				if (response.data.code != null && (response.data.code == 10401 || response.data.code == 10405 || response.data.code == 10406)) {
					if (response.data.code == 10405) {
						var boolean = $cookieStore.get("10405");
						if (boolean == null || !boolean) {
							alert("长时间没有操作,登入已经过期！");
							$cookieStore.put("10405", true);
						}
					}
					if (response.data.code == 10406) {
						var boolean = $cookieStore.get("10406");
						if (boolean == null || !boolean) {
							alert("用户异地登入,你已被强制下线！");
							$cookieStore.put("10406", true);
						}
					}
					if ($rootScope.ngDialog != null && $rootScope.ngDialog.close != null) {
						$rootScope.ngDialog.close(true)
					}
					clearCache();
					$state.go('login');
				} else if (response.data.code != null && response.data.code == 10403) {
					notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
				} else if (response.data.code != null && response.data.code == 10202) {
					deferred.resolve(response.data);
				} else if (response.data.code != null && response.data.code != 200) {
					// 前端页面提示，后台传过来的错误消息message
					// 凡是后台返回ResultDTO.getFailure
					notifications.showError(response.data.message);
					deferred.reject(response.data);
				} else {
					deferred.resolve(response.data);
				}

			}, function(response) {
				// 前端页面提示
				notifications.showError("操作失败");
				deferred.reject(response);

			});
			return deferred.promise;
	}

	return {
		post: postRequest,
		get: getRequest,
		setNgDialog: setNgDialog,
		download: downloadRequest,
		upload: uploadRequest,
		postJson: postJsonRequest
	};



}]);