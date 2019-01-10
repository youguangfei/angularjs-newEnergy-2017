App.filter("dicFilter", [ 'cacheService', '$timeout',function(cacheService,$timeout) {
/**
 * dicType:字典类型id，或字典类型名称，名称需要在cacheService中配置
 */
	return function async(input, dicType) {
		var dics = cacheService.getDic(dicType,true);
		return dics && dics[input] || '';
	}
}])
.filter('appointStatusFilter', function() {
	return function(number) {
		if (isNaN(number) || number == 0) {
			return '受理中';
		}
		if (isNaN(number) || number == 1) {
			return '待维修';
		}
		if (isNaN(number) || number == 2) {
			return '维修中';
		}
		if (isNaN(number) || number == 3) {
			return '维修完成';
		}
		if (isNaN(number) || number == 4) {
			return '维修失败';
		}
	}
}).filter('faultRankFilter', function() {
	return function(number) {
		if (isNaN(number) || number == 0) {
			return '0级';
		}
		if (isNaN(number) || number == 1) {
			return '1级';
		}
		if (isNaN(number) || number == 2) {
			return '2级';
		}
		if (isNaN(number) || number == 3) {
			return '3级';
		}
		if (isNaN(number) || number == 4) {
			return '4级';
		}
	}
}).filter('textLengthSet', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
        value = value.substr(0, lastspace);
        }
        }
    return value + (tail || ' …');//'...'可以换成其它文字
    };
}); 
