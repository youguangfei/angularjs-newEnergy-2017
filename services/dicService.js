/**
 * 机构、字典、用户mapService
 */
App.service('dicService', [ 'requestService', function(waterRequestService) {
	var getOrgMap = function() {
		var orgMap = {};
		var url = '/security/api/organization/getOrgTree';
		rquestService.post(url, {}).then(function(data) {
			orgMap[data.data[0].id] = data.data[0].label;
			var child1 = data.data[0].children;
			orgMap[child1[0].id] = child1[0].label;
			var child2 = child1[0].children;
			for (var i = 0; i < child2.length; i++) {
				orgMap[child2[i].id] = child2[i].label;
				var child3 = child2[i].children;
				for (var j = 0; j < child3.length; j++) {
					orgMap[child3[j].id] = child3[j].label;
					var child4 = child3[j].children;
					for (var k = 0; i < child4.length; k++) {
						orgMap[child4[k].id] = child4[k].label;
					}
				}
			}
		});
		return orgMap;
	}
	/**
	 * type：字典中文名称
	 */
	var getDicMap = function(type) {
		var typeMap = {
			/*'发票类型' : '1405592801686249',
			'广告载体' : '4663600092367423',
			'广告形式' : '4002971430598973',
			'所属设备类型' : '372685869724616',
			'合同类型' : '6577781076375885',
			'用水类型' :'5331515972273250'*/
		};
		var dicMap = {};
		if (typeMap[type] != null) {
			var url = '/security/api/dic/getDicList';
			waterRequestService.post(url, {
				pid : typeMap[type]
			}).then(function(data) {
				for (var i = 0; i < data.data.length; i++) {
					 dicMap[data.data[i].dicId]=data.data[i].name;
				}
			}, function(error) {
				console.log('static/dic Service.getDicList error ');
			});
		}
		return dicMap;
	}
	/**
	 * 获取用户map
	 */
	var getUserMap = function() {
		var userMap = {};

		return userMap;
	}
	return {
		getOrgMap : getOrgMap,// 返回机构map
		getDicMap : getDicMap,// 返回字典map
		getUserMap : getUserMap
	// 返回用户map

	};

} ]);