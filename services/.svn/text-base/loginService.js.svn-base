App.service('loginService', ['requestService',function(requestService) {
	return {
        login : function(name, pwd, captcha,flagId) {
			return requestService.post('/security/login', {name: name, password: pwd, captcha: captcha,captchaId : flagId})
			.then(function(response) {
				return response;
                
            },function(error) {
            	console.log(error);
            	return error;
            });
		},
		loginout : function(name, token) {
			return requestService.post('/security/loginout', {name: name,token:token,app:"web"})
			.then(function(response) {
				 return response;
                
            },function(error) {
            	console.log(error);
            	return error;
            });
		},
		remember : function (name, values) {
	    	   function fetchValue(name) {
		           var gCookieVal = document.cookie.split("; ");
		           for (var i = 0; i < gCookieVal.length; i++) {
		               // a name/value pair (a crumb) is separated by an equal sign
		               var gCrumb = gCookieVal[i].split("=");
		               if (name === gCrumb[0]) {
		                   var value = '';
		                   try {
		                       value = angular.fromJson(gCrumb[1]);
		                   } catch (e) {
		                       value = unescape(gCrumb[1]);
		                   }
		                   return value;
		               }
		           }
		           // a cookie with the requested name does not exist
		           return null;
		       }
	           if (arguments.length === 1) return fetchValue(name);
	           var cookie = name + '=';
	           if (typeof values === 'object') {
	               var expires = '';
	               cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
	               if (values.expires) {
	                   var date = new Date();
	                   date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 * 1000));
	                   expires = date.toGMTString();
	               }
	               cookie += (!values.session) ? 'expires=' + expires + ';' : '';
	               cookie += (values.path) ? 'path=' + values.path + ';' : '';
	               cookie += (values.secure) ? 'secure;' : '';
	           } else {
	               cookie += values + ';';
	           }
	           document.cookie = cookie;
	       }
    };
}]);
