App.controller('packeditController', [
'$scope', 'ngDialog', '$timeout', 'requestService','lgLocalDataProviderFactory','lgServerDataProviderFactory' ,'pagerService',
function($scope,ngDialog, $timeout, requestService,lgLocalDataProviderFactory,lgServerDataProviderFactory,pagerService) {
	$scope.data = {};			
	$scope.data.tree = [];
	$scope.data.pageAllModelId=null;
	$scope.dataProvider = null;

	$scope.data.treeAllModel=[];
	$scope.data.treePageModel=[];
	$scope.data.selecteValues=new Array();
	$scope.selects={};
	var findSelected = function(selection, e){
		
		if(e.children != null){
			for(var item in e.children){
				findSelected(selection, e.children[item]);
			}
		}
		if(e.selected){
			selection.push(e);
		}
	}
	var getModuleData = function(){
		 var url = '/security/api/menu/getTopMenuTree';
		 var param = {};
		 param.packId=$scope.salesPackageId;
		 $scope.data.pageAllModelId=[];
		 requestService.post(url, param).then(
					function(data){
						$scope.data.treePageModel=data.data;
						$scope.data.pageAllModelId=new Array();
						for ( var int = 0; int < $scope.data.treePageModel.length; int++) {
							$scope.data.pageAllModelId.push($scope.data.treePageModel[int].mark.moduleId);
						   }
					},function(error){
					}
				);
		 var paramAll = {};
		 paramAll.type=0;
		 paramAll.packId=$scope.salesPackageId;
		 requestService.post(url, paramAll).then(
					function(dataAll){
							$scope.data.treeAllModel=dataAll.data;
					},function(error){
					}
				);
		}
	getModuleData();
  
   
   $scope.moduleSelected = function(branch){
	   $scope.data.selecteValues.push(branch);
	   
   }
   $scope.leftAdd=function(){
	   $scope.selects.rights=new Array();
	   for ( var int = 0; int < $scope.data.treeAllModel.length; int++) {
		   findSelected($scope.selects.rights,$scope.data.treeAllModel[int]);
	   }
	   for ( var i= 0; i < $scope.selects.rights.length; i++) {
		   var isAdd=true;
		   for ( var int = 0; int < $scope.data.treePageModel.length; int++) {
			   if($scope.selects.rights[i].mark.moduleId== $scope.data.treePageModel[int].mark.moduleId){
				   isAdd=false;
			   }
		   }
		   if(isAdd){
			   $scope.data.treePageModel.push($scope.selects.rights[i]);
		   }
		   for ( var a = 0; a < $scope.data.treeAllModel.length; a++) {
			  if($scope.selects.rights[i].mark.moduleId==$scope.data.treeAllModel[a].mark.moduleId){
				  $scope.data.treeAllModel.splice(a,1);
			  }
		   }
		  
	   }
	   
	   
   }
   $scope.rightRemove=function(){
	   $scope.selects.lefts=new Array();
	   for ( var int = 0; int < $scope.data.treePageModel.length; int++) {
		   findSelected($scope.selects.lefts,$scope.data.treePageModel[int]);
	   }
	   for ( var i= 0; i < $scope.selects.lefts.length; i++) {
		   var isAdd=true;
		   for ( var int = 0; int < $scope.data.treeAllModel.length; int++) {
			   if($scope.selects.lefts[i].mark.moduleId==$scope.data.treeAllModel[int].mark.moduleId){
				   isAdd=false;
			   }
		   }
		   if(isAdd){
			   $scope.data.treeAllModel.push($scope.selects.lefts[i]);
		   }
		  for ( var a = 0; a < $scope.data.treePageModel.length; a++) {
			  if($scope.selects.lefts[i].mark.moduleId==$scope.data.treePageModel[a].mark.moduleId){
				  $scope.data.treePageModel.splice(a,1);
			  }
	   
		  }
	   }
	   
	   
   }
   $scope.determine=function(){
	   //原有的
	   $scope.data.pageAllModelId;
	   $scope.data.chageAllmodelId=new Array();
	   for ( var int = 0; int < $scope.data.treePageModel.length; int++) {
		   $scope.data.chageAllmodelId.push($scope.data.treePageModel[int].mark.moduleId);
	   }
	   var url = '/security/api/package/updatePackage';
		 var param = {
				 salesPackageId:$scope.salesPackageId,
				 modules:$scope.data.chageAllmodelId,
				 allmodules:$scope.data.pageAllModelId
		 };
		
		 $scope.data.pageAllModelId=[];
		 requestService.post(url, param).then(
					function(data){
						var param = {
								id : $scope.salesPackageId
							};
						
					},function(error){
						
					}
				);
	   $scope.data.pageAllModelId=[];
	   $scope.data.chageAllmodelId=[];
	   $scope.closeEmpower();
   }
}]);