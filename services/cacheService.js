App.service('cacheService',['requestService','$rootScope','notifications','$q','$timeout','$state','$cookies','$cookieStore',
function(requestService,$rootScope,notifications,$q,$timeout,$state,$cookies,$cookieStore) {

	var orgsList = null;// [{value:1,name:部门1},{value:2, name:部门2}]
	var orgsTree = null;// [{id:1,label:部门1,
						// children:[{id:1,label:部门2}]}]

	var filterDicSet = {};
	var directiveDicSet = {};
	
	var treeData = [];
	var items = {};
	var orgData={};
	/*
	 地图样式设置
	 * 
	 * */
//	实时监控地图配色方案
	var mapStyle ={
		 styleJson: [
		          {
		                    "featureType": "background",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#062026ff"
		                    }
		          },
		          {
		                    "featureType": "highway",
		                    "elementType": "geometry.fill",
		                    "stylers": {
		                              "color": "#04676eff"
		                    }
		          },
		          {
		                    "featureType": "highway",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#04676eff"
		                    }
		          },
		          {
		                    "featureType": "arterial",
		                    "elementType": "geometry.fill",
		                    "stylers": {
		                              "color": "#032932ff"
		                    }
		          },
		          {
		                    "featureType": "arterial",
		                    "elementType": "geometry.stroke",
		                    "stylers": {
		                              "color": "#032932ff"
		                    }
		          },
		          {
		                    "featureType": "local",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#033a3eff"
		                    }
		          },
		          {
		                    "featureType": "land",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#062026ff"
		                    }
		          },
		          {
		                    "featureType": "railway",
		                    "elementType": "geometry.fill",
		                    "stylers": {
		                              "color": "#1e1c1c",
		                              "visibility": "off"
		                    }
		          },
		          {
		                    "featureType": "railway",
		                    "elementType": "geometry.stroke",
		                    "stylers": {
		                              "color": "#1e1c1c",
		                              "visibility": "off"
		                    }
		          },
		          {
		                    "featureType": "subway",
		                    "elementType": "geometry",
		                    "stylers": {
		                              "visibility": "off"
		                    }
		          },
		          {
		                    "featureType": "building",
		                    "elementType": "geometry.fill",
		                    "stylers": {
		                              "color": "#096176ff"
		                    }
		          },
		          {
		                    "featureType": "all",
		                    "elementType": "labels.text.fill",
		                    "stylers": {
		                              "color": "#31f6c9ff"
		                    }
		          },
		          {
		                    "featureType": "all",
		                    "elementType": "labels.text.stroke",
		                    "stylers": {
		                              "color": "#013126ff"
		                    }
		          },
		          {
		                    "featureType": "building",
		                    "elementType": "geometry",
		                    "stylers": {
		                              "color": "#073841ff"
		                    }
		          },
		          {
		                    "featureType": "green",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#023330ff"
		                    }
		          },
		          {
		                    "featureType": "boundary",
		                    "elementType": "all",
		                    "stylers": {
		                              "color": "#035e4fff"
		                    }
		          },
		          {
		                    "featureType": "poilabel",
		                    "elementType": "all",
		                    "stylers": {
		                              "visibility": "on"
		                    }
		          },
		          {
		                    "featureType": "highway",
		                    "elementType": "labels.icon",
		                    "stylers": {
		                              "color": "#eeeeeeff",
		                              "visibility": "on"
		                    }
		          },
		          {
		                    "featureType": "all",
		                    "elementType": "labels",
		                    "stylers": {
		                              "visibility": "on"
		                    }
		          },
		          {
		                    "featureType": "arterial",
		                    "elementType": "labels",
		                    "stylers": {}
		          }
		]
	};
//	服务网点地图配色方案
	var mapStyle2={
		styleJson:[
          {
                    "featureType": "background",
                    "elementType": "all",
                    "stylers": {
                              "color": "#0d3e48ff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#08767eff"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#08767eff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#052f38ff"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#052f38ff"
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "all",
                    "stylers": {
                              "color": "#052f38ff"
                    }
          },
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#082830ff"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#1e1c1cff",
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#1e1c1c",
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                              "visibility": "off"
                    }
          },
          {
                    "featureType": "building",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#0f7993ff"
                    }
          },
          {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#31f6c9ff"
                    }
          },
          {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#013126ff"
                    }
          },
          {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                              "color": "#0a4651ff"
                    }
          },
          {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                              "color": "#043c39ff"
                    }
          },
          {
                    "featureType": "boundary",
                    "elementType": "all",
                    "stylers": {
                              "color": "#056f5eff"
                    }
          },
          {
                    "featureType": "poilabel",
                    "elementType": "all",
                    "stylers": {
                              "visibility": "on"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "labels.icon",
                    "stylers": {
                              "color": "#eeeeeeff",
                              "visibility": "on"
                    }
          },
          {
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": {
                              "visibility": "on"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "labels",
                    "stylers": {}
          }
		]
	}
	
	var map_labelStyle = {
					"position": "absolute",
				    "display": "inline",
				    "cursor": "pointer",
				    "background": "rgb(25, 53, 75)",
				    "border": "1px solid rgba(19, 178, 218, 0.52)",
				    "padding": "0px 8px 0px 30px",
				    "white-space": "nowrap",
				    "font-style": "normal",
				    "font-variant": "normal",
				    "font-weight": "normal",
				    "font-stretch": "normal",
				    "font-size": "15px",
				    "line-height": "26px",
				    "z-index": "-1",
				    "box-shadow": "rgb(19, 178, 218) 0px 0px 5px",
				    "border-radius": "16px",
				    "height": "27px",
				    "color": "white",
				    "user-select": "none",
				    "max-width":"none",
				    "left": "0px",
				    "top": "-1px",
				    "font-family":"宋体"
			};
	
	
	
	/*
	 echart统计图 格式
	 * */
	var option={
		tooltip:{
			formatter: '{b} {a}:{c}'
		},
		 
	}
	/*
	 * 
	 
	 * 添加带有定位的导航控件
	 * */
	var navigationControl = new BMap.NavigationControl({
		// 靠左上角位置
			anchor: BMAP_ANCHOR_TOP_LEFT,
			// LARGE类型
			type: BMAP_NAVIGATION_CONTROL_LARGE,
			 // 启用显示定位
			enableGeolocation: true
	});
	var projLabelStyle = {
		border: "0px solid rgb(255, 0, 0)",
		'border-radius': "5px",
		background:"#005cab",
		color:"white",
		whiteSpace: "nowrap",
		padding: "2px 1px 1px",
		cursor: "pointer",
		font: "15px arial,sans-serif"
	};
	var onlineLabelStyle = { 
		border: "0px solid rgb(255, 0, 0)",
		'border-radius': "5px",
		background:"green",
		color:"white",
		whiteSpace: "nowrap",
		padding: "2px 1px 1px",
		cursor: "pointer",
		font: "15px arial,sans-serif"
	};
	var offlineLabelStyle = { 
		border: "0px solid rgb(255, 0, 0)",
		'border-radius': "5px",
		background:"gray",
		color:"white",
		whiteSpace: "nowrap",
		padding: "2px 1px 1px",
		cursor: "pointer",
		font: "15px arial,sans-serif"
	};
	
	var getOrgsTreeFun = function() {
		return orgsTree;
	}
	var removeItemsFun=function() {
		items={};
	}
	var removeOrgsFun =function(){
		orgData={};
	}
	
	var removeCookie=function(){
		angular.forEach($cookies,function(item,index,Array){
			console.log(index);
			$cookieStore.remove(index);
		})
	}
	
	var getOrgListFun = function() {
		return orgsList;
	}

	var setOrgsTreeFun = function(orgsT) {
		orgsTree = orgsT;
	}

	var setOrgsListFun = function(orgsL) {
		orgsList = orgsL;
	}
	var dicNameMap = {
		/*'发票类型' : '1405592801686249',
		'广告载体' : '4663600092367423',
		'广告形式' : '4002971430598973',
		'所属设备类型' : '372685869724616',
		'合同类型' : '6577781076375885',
		'用水类型' :'5331515972273250'*/
	};
	var urlGetDicFun = '/security/api/dic/getDicList';
	var getDicFun = function(dicId, isFilter,hasChild,callType) {
//		var dicId=dicNameMap[dicType];
		//兼容传入id或名称
		if(dicId==null || dicId=="" || dicId==undefined){
			return;
		}
//		!directiveDicSet[dicId]
		if(hasChild){
			param.includeChild = 1;
		}
		requestService.post(urlGetDicFun, {
			pid : dicId
		}, true).then(function(data) {
			console.log(data);
				var map = {};
			if(data.data!=null&&data.data.length>0){
				data.data.forEach(function(item){
					if(hasChild) {
						if(!directiveDicSet[item.pid]) {
							directiveDicSet[item.pid] = [];
							filterDicSet[item.pid] = {};
						}
						directiveDicSet[item.pid].push(item);
						filterDicSet[item.pid][item.dicId] = item.name;
					}else{
						map[item.dicId] = item.name;
					}
				})
				if(!hasChild) {
					directiveDicSet[dicId] = data.data;
					filterDicSet[dicId] = map;
				}
				var nData=isFilter?filterDicSet[dicId]:directiveDicSet[dicId];
				if(callType){						
					callType(nData);
				}
			}else{
				callType([{}]);
			}

		});
		
		if(!callType){	
			return isFilter?filterDicSet[dicId]:directiveDicSet[dicId];
		}
		
	} 
	var getTreeData = function() {
		var deferred = $q.defer();
		if(treeData.length == 0){
			var url = '/security/api/function/treedata';
			var param = {};
			requestService.post(url, param, true).then(
				function(data) {
					treeData = data.data;
					deferred.resolve(treeData);
				},
				function(error) {
					deferred.reject(error);
				}
			);
		}else{
			deferred.resolve(treeData);
		}
		return deferred.promise;
	};
	
	var getOrgsTree=function (param){
		var deferred = $q.defer();
		var url = '/security/api/organization/getOrgTree';
		if (!param) {
			param = {};
			if(!orgData.orgs){
				requestService.post(url,param, true).then(
				        function (data) {
				        	orgData.orgs=data.data;
				        	deferred.resolve(orgData.orgs);
						}, function(error) {
							deferred.reject(error);
						}
				  );
					}else{
						deferred.resolve(orgData.orgs);
					}
		}else{
			if(!orgData.depart){
				requestService.post(url,param, true).then(
				        function (data) {
				        	orgData.depart=data.data;
				        	deferred.resolve(orgData.depart);
						}, function(error) {
							deferred.reject(error);
						}
				        );
					}else{
						deferred.resolve(orgData.depart);
					}
		}
		return deferred.promise;
	}
	
	/*var getSideMenu = function(url, param, isLoading) {
		var deferred = $q.defer();
		if(!items[param.id]){
			requestService.post(url, param, isLoading).then(
				function(data) {
					items[param.id] = data.data;
					$timeout(function(){
						for(var item in data.data){
							if(data.data[item.url] != null){
								$state.go(data.data[item.url]);
								break;
							}	
						}
					}, 1000);
					deferred.resolve(items);
				},
				function(error) {
					deferred.reject(error);
				}
			);
		}else{
			deferred.resolve(items);
		}
		return deferred.promise;
	};*/
	
	var updateDicCache = function(dicId){
		delete directiveDicSet[dicId];
	}
	
	var mCar_care=function(obj,userId,Tback){
			var url = '/product/api/business';
			var mCar_careData={
				"carId":obj.carId,"userId":userId
			}
			if(obj.is_follow){
				mCar_careData.type=2;
			}else{
				mCar_careData.type=1;
			}
			var mCar_carePost={
					 "code":10040,
					"param":JSON.stringify(mCar_careData)
			}
			console.log(mCar_carePost);
			requestService.post(url, mCar_carePost).then(
						function (data) {
							if(data.code==200){
								console.log($("#info_careBtn"));
								if(!obj.is_follow){
									obj.is_follow=true;
									$("#info_careBtn").html("已关注");
								}else{
									obj.is_follow=false;
									$("#info_careBtn").html("+关注");
								}
								Tback(obj.is_follow);
							}
							
			},function(error){
				            	
			})
		
	}
	
	return {
		getOrgs : getOrgsTreeFun,
		getOrgList : getOrgListFun,
		setOrgsTree : setOrgsTreeFun,
		setOrgsList : setOrgsListFun,
		getDic : getDicFun,
		getTreeData: getTreeData,
		/*getSideMenu: getSideMenu,*/
		getOrgsTree : getOrgsTree,
		removeItems: removeItemsFun,
		removeOrgs : removeOrgsFun,
		removeCookie: removeCookie,
		getMapStyle: function(){return mapStyle;},
		getMapStyle2: function(){return mapStyle2;},
		getMaplabel_sty: function(){return map_labelStyle;},
		getNavigation: function(){return navigationControl;},
		/*getLocation:function(){
			return location;
		}*/
		getProjLabelStyle:function(){return projLabelStyle;},
		getMonitorLabelStyle:function(status){if(status) return onlineLabelStyle; else return offlineLabelStyle;},
		updateDicCache:updateDicCache,
		mCar_care:mCar_care
	};

}]);