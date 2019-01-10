/**
 * maxCount 批量选择图片最大数限制
 * cutSize 切图尺寸集合，逗号分割
 * maxCount 文件最多上传数量
 * nowCount 文件已经上传数量
 */
angular.module('fileUploadUI',[])
.directive('fileUpload',['FileUploader','$rootScope','$cookieStore','$filter','notifications',function(FileUploader,rootScope,cookieStore,$filter,notifications){
	return{
		restrict:'EAMC',
	    templateUrl:'html/template/fileUpload.html',
	    replace:true,
	    scope:{
	    	files:'=files',
	    	imgSrc:'=imgSrc',
	    	insertUser:'=insertUser',
	    	fileType:'=',
	    	isImg:'=',
	    	fileFilter:'&',
	    	frequency:'=',
	    	uploadUrl:'=uploadUrl',
	    	cutSize:'=cutSize',
	    	nowCount:'=nowCount',
	    	closeCallback: '&closeCallback',
	    	fileCount: '=fileCount',
	    	maxCount: '=maxCount',
	    	fileSize: '=fileSize',
	    	realSize: '=realSize',
	    	imgType: '=imgType',
	    	userId:"=",
	    	codeId:"="
	    	
	    },
	    controller:function($scope,FileUploader){
	    	//如果是图片，就不隐藏画布
	    	$scope.isHide=false;
	    	$scope.isDisabled=true;
	    	if($scope.imgSrc.length>0){
	    		$scope.isShow=true;
	    	}else{
	    		$scope.isShow=false;
	    	}
	    	
	    	/*$scope.$watch('fileCount',function(){
	    		console.log($scope.fileCount);
	    	});*/
	    	$scope.$watch('insertUser',function(newValue,oldValue, scope){
	    		//新增和修改都需要清理上传文件列表
	    		uploader.clearQueue();
	    		//更新图片需要显示图片
	    		if(newValue == "update")	
	    		{
	    			if($scope.imgSrc.length>0){
	    				$scope.isShow=true;
	    			}
	    		}else 	if(newValue){
	    			if(uploader.queue.length>0){
    					$scope.insertUser=false;
    				}
	    			$scope.isShow=false;
	    		}
	    	});
	    	//每次imgSrc集合改变都要监听，用户实施修改拖放区域的状态
	    	$scope.$watch("imgSrc", function (newValue) {
				
	    		if(newValue.length > 0){
	    			$scope.isShow = true;
	    		}else{
	    			//点击新增按钮，需要清空图片
	    			if(!$scope.insertUser){
	    				if(uploader.queue.length > 0){
	    					uploader.clearQueue();
	    					$scope.insertUser = false;
	    				}
	    			}
	    			$scope.isShow = false;
	    		}
			});
	    	var size;
	    	$scope.$watch('fileSize',function(value){
	        		if($scope.fileSize != null){
	            		 size=value;           		
	            	}
	        });
	    	var realSize;
	    	$scope.$watch("realSize",function(value){
	        		if($scope.realSize != null){
	        			realSize=value;           		
	            	}
	        });
	    	/*var watch = $scope.$watch('imgSrc',function(newValue,oldValue, scope){
	    		if(newValue.length>0){
	    			$scope.isShow=true;
	    		}else{
	    			//点击新增按钮，需要清空图片
	    			if($scope.insertUser){
	    				if(uploader.queue.length>0){
	    					uploader.clearQueue();
	    					$scope.insertUser=false;
	    				}
	    			}
	    			$scope.isShow=false;
	    		}
	    	},true);*/
	    	var token= null;
	    	if(rootScope.user!=null){
				token=rootScope.user.token;
			}
			if(token==null){
				token=cookieStore.get("token");
			}
			var url;
			if ($scope.uploadUrl == null) {
				url = '/lar/api/larClientUser/fileUploader';
			} else {
				url =$scope.uploadUrl;
			}
//			+ '?token=' + token
//			url='/product/api/business';
			url="/product/api/fileUploadController/fileUploader";
			url="http://192.168.232.213:8080"+url;
			console.log('code-----'+$scope.codeId);
			var count=$scope.fileCount;
			if(!count){
				count=5;
			}
//			var userid=$cookieStore.get("userId");
	    	//请求的URL
	        var uploader = $scope.uploader = new FileUploader({
	        	scope:$scope,
	            url: url,
	            queueLimit: count,     //最大上传文件数量
	            autoUpload: false,   // 自动开始上传
	            headers: {'token':token},
	            formData: [          // 和文件内容同时上传的form参数
	                {
//	                	userId : $scope.userId,
	                	cutSize:$scope.cutSize,
	                	isImg  :$scope.isImg,
	                	fileType:$scope.fileType,
//	                	code: Number($scope.codeId)
	                }
	            ]
	        });
	        $scope.removeItem = function(index,fileItem){    //重新选择文件时，清空队列，达到覆盖文件的效果
	        	uploader.removeFromQueue(fileItem);
	        	$scope.imgSrc.splice(index,1);
	        	if($scope.files) {
	        		index=$scope.files.length-1;
	        	}
	        	if($scope.files!=undefined){
	        		$scope.files.splice(index,1);
	        	}
	        	$scope.isShow=false;
	        }
	        $scope.removeAllItem = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
	        	uploader.clearQueue();
	        	$scope.imgSrc.length=0;
	        	if($scope.files!=undefined){
	        		$scope.files.length=0;//清空files
	        	}
	        	$scope.isShow=false;
	        	
	        }
	        $scope.closeUpload = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
	        	alert("关闭窗口");
	        }
	        
	        // 过滤器，可以对每个文件进行处理
	        uploader.filters.push({
	            name: 'imageFilter',
	            fn: function(item /*{File|FileLikeObject}*/, options) {
	                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	                
	                //为true是单文件
	                if($scope.frequency){
	                	//如果只支持单文件上传，请这样写, 这是替换上一个文件
		                if(uploader.queue.length>0){
		                	uploader.clearQueue();
		                	$scope.imgSrc=[];
		    	        	$scope.isShow=false;
		                }
	                }
	                var bool = true;
	                //为true是图片,false是文件
	                if($scope.fileType){
	                	if($scope.frequency){
	                		bool = '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && uploader.queue.length===0;
	                	}else{
	                		bool = '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1
	                	}
	                }else{
	                	$scope.isHide=true;
	                }
	                if($scope.fileFilter){
	                	
	                	bool=$scope.fileFilter({"fileType":type});
	                	if(bool==null){
	                		bool=true;
	                	}
	                }
	                return bool;
	            }
	        });
	        //上传的如果是文件，就回调
	        uploader.onWhenAddingFileFailed = function (item, filter, options) {
	            console.info('onWhenAddingFileFailed', item, filter, options);
	        };
	        //选择文件之后的回调
	        uploader.onAfterAddingFile = function (fileItem) {
	        	
	        	fileItem.formData[0]["isImg"]=$scope.isImg;
	        	
	        	if(fileItem.file.size>size){
	        		$scope.message="上传图片小于"+size/1024/1024+"M,请重新选择！";
	        	}
	        	if(count<=$scope.realSize){
	        		$scope.message="上传图片小于" + realSize + "张,请重新选择";
	        	}
	        	/*if($scope.maxCount>0&&uploader.queue.length>($scope.maxCount-$scope.nowCount)){
	        		uploader.queue.splice($scope.maxCount,uploader.queue.length);
	        		$scope.isDisabled=false;
	        		alert("选择图片数量超过最大限制数！["+$scope.maxCount+"]张,多余的自动去除！");
	        	}*/
	            console.info('onAfterAddingFile', fileItem);
	        };
	        //选择文件之后的回调
	        uploader.onAfterAddingAll = function (addedFileItems) {
	        	if($scope.maxCount>0&&uploader.queue.length>($scope.maxCount-$scope.nowCount)){
	        		
	        		uploader.queue.splice(($scope.maxCount-$scope.nowCount),uploader.queue.length);
	        	
	        		alert("选择图片数量超过最大限制数！["+$scope.maxCount+"]张,多余的自动去除！");
	        		
	        	}
	            console.info('onAfterAddingAll', addedFileItems);
	        };
	        //上传之前的回调
	        uploader.onBeforeUploadItem = function (item) {
	        	if(item.file.size>size){
	        		notifications.showWarning("上传图片小于"+size/1024/1024+"M,请重新选择！");
	        		onErrorItem();
	        	}
	        	if(count<=$scope.realSize){
	        		//notifications.showWarning("上传图片小于" + realSize + "张,请重新选择");
	        		onErrorItem();
	        	}
	        	var img=new Image();
	        	img.src=item._file;
	        	var height=img.width;
	        	//图片上传类型限制['png','jpg']
	        	var orgType=item.file.name.slice(item.file.name.indexOf(".")+1);
	        	var imgType=$scope.imgType;
	        	var flag=false;
	        	if(!imgType){
	        		flag=true;
	        	}
	        	for(var item in imgType){
	        		if(imgType[item] == orgType){
	        			flag=true;
	        			break;
	        		}
	        	}
	        	if(!flag){
	        		notifications.showWarning("上传图片不支持" + orgType + "格式");
	        		onErrorItem();
	        	}
	            console.info('onBeforeUploadItem', item);
	        };
	        //单个文件进度回调
	        uploader.onProgressItem = function (fileItem, progress) {
	            console.info('onProgressItem', fileItem, progress);
	        };
	        //所有文件进度回调
	        uploader.onProgressAll = function (progress) {
	            console.info('onProgressAll', progress);
	        };
	        //单个文件上传成功回调
	        uploader.onSuccessItem = function (fileItem, response, status, headers) {
	        	
	        	$scope.isShow=true;
	        	if($scope.frequency){
	        		$scope.imgSrc.length=0;
	        		if($scope.files!=undefined){
	        			$scope.files.length=0;
	        		}
	        	}
	        	console.log(response);
	        	
	        	var  length=response.data.split(",");
	        	if(response.data.indexOf(",")>=0&&response.data.split(",").length>2){
	        		var cutlength=$scope.cutSize.split(",").length;
	        		var cutSrc=$filter("imageUrl")(response.data,cutlength-1,0);
	        		$scope.imgSrc.push(cutSrc);
	        	}else{
	        		$scope.imgSrc.push(response.data);
	        	}
	        	
	        	if($scope.files!=undefined){
	        		$scope.files.push({'name':fileItem.file.name,'path':response.data});
	        	}
	        	//脏检查后，就成了父scope下的imgSrc,但是只能是子作用域修改
	        	$scope.$apply();
	        	realSize++;
	            console.info('onSuccessItem', fileItem, response, status, headers);
	        };
	        //单个文件错误回调
	        uploader.onErrorItem = function (fileItem, response, status, headers) {
	            console.info('onErrorItem', fileItem, response, status, headers);
	        };
	        //删除文件
	        uploader.onRemoveItem = function (fileItem, response, status, headers) {
	        	
	        	console.info('----------------sdfsdf');
	            console.info('onRemoveItem', fileItem, response, status, headers);
	        };
	        //单个文件取消回调
	        uploader.onCancelItem = function (fileItem, response, status, headers) {
	            console.info('onCancelItem', fileItem, response, status, headers);
	        };
	        //单个文本上传未完成
	        uploader.onCompleteItem = function (fileItem, response, status, headers) {
	            console.info('onCompleteItem', fileItem, response, status, headers);
	            if (response != null && response.code == 10403) {
	            	notifications.showError("当前登录用户无权限执行此操作，请联系管理员");
	            }
	        };
	        //所有文件上传成功
	        uploader.onCompleteAll = function () {
	            console.info('onCompleteAll');
	        };
	    },
	    link:function(scope,element,attrs){
	    	
	    	
	    }
	}
}]).directive('ngThumb', ['$window', function ($window) {
    //如果不是图片就不显示了
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };
    //图片创建为一个画布形式,只有H5支持这种形式
    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({width: width, height: height});
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);