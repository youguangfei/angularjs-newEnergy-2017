App.directive('selectLinkAge',function(){
	return{
		restrict:'EAMC',
	    templateUrl:'template/selectLinkAge.html',
	    replace:true,
	    require: "^?ngSelectCustom",
	    scope:{
	    	selectType:"=",
	    	selectArrd:"=",
	    	myCity:"=",
	    	dicId:"=",
	    	selectModel1:"=",
	    	selectModel2:"=",
	    	consoSel:'&',
	    	eventObj:'='
	    },
	    controller:function($scope){
//			$scope.selectArrd=[{id:1,name:"唐山"},{id:2,name:"保定"}];
			    var dicId = $scope.dicId;
			    console.log($scope.selectType);
			    console.log(typeof $scope.selectType);
			    console.log($scope.selectmodel1);
			    console.log($scope.selectmodel2);
			    
			    $scope.changeEvent=function(){
			    	console.log("change1");
			    	if ($scope.eventObj.change1) {
			    		$scope.eventObj.change1();
			    	}
			    }
			    $scope.changeEvent2=function(){
			    	console.log("change2");
			    	if ($scope.eventObj.change2) {
			    		$scope.eventObj.change2();
			    	}
			    }
	
			   
	    },
	    link:function(scope,element,attrs,ctrl){
	    	var dicId = scope.dicId;
	    	console.log(attrs);
			scope.labelNameOne=attrs.labelnameone;
			scope.lableNameTwo=attrs.labelnametwo;



	    }
	}
});