App.service('treeService', ['requestService', function(requestService) {

	var findSelected = function(e, arr, org) {
		if (e.id == org) {
			pushArr(e, arr);
			return 1;
		}
		if (e.children != null && e.children.length > 0) {
			for ( var item in e.children) {
				var rlt = findSelected(e.children[item], arr, org);
				if (rlt == 1) {
					break;
				}
			}
		}

	}
     //找到指定的机构
	var findSelectedOrg=function(orgTree,targetOrgId){
		if(orgTree.id ==targetOrgId){
			orgTree.selected = true;
			return orgTree;
		}
		if(orgTree.children !=null && orgTree.children.length >0){
			for(var item in orgTree.children){
				var result=findSelectedOrg(orgTree.children[item],targetOrgId);
				if(result != null){
					orgTree.expanded = true;
					return result;
				}
			}
		}
	}
	
	
	var pushArr = function(e, arr) {
		arr.push(e.id);
		if (e.children != null && e.children.length > 0) {
			for ( var item in e.children) {
				pushArr(e.children[item], arr);
			}
		}
	}
	
	var cut = function(node){
		
		var res1 = false,
		res2 = false;
		
		if(node.org.latitude && node.org.longitude && node.orgId){
			res1 = true;
		}
		
		if(node.children){		
			for(var i = node.children.length - 1; i >= 0; i--){
				var res = cut(node.children[i]);
				if(!res){
					node.children.splice(i,1);
				}
				res2 = res2 || res;
			}			
		}		
		return res1 || res2;
	}
	
	var getOrg2TreeNode = function(orgList) {
		var TreeNode = [];
		var tempMap = {};
		
		angular.forEach(orgList,function(item){
			tempMap[item.org.orgId]  = item;
			item.label = item.org.name;
			item.id = item.org.orgId;
		});
		
		angular.forEach(orgList, function(item){
			if(tempMap[item.org.parentId] == null){
				TreeNode.push(item);
			}
			else{
				var parent = tempMap[item.org.parentId];
				if(parent.children == null) parent.children = [];
				parent.children.push(item);
			}
		});
		
		for(var i = TreeNode.length - 1; i >= 0; i--){
			var res = cut(TreeNode[i]);
			if(!res){
				TreeNode.splice(i,1);
			}
		}
		return TreeNode;
	}
	//查询机构
	var searchOrgs =function(param,orgs,orgsData){
		if(param.length<=0 || param ==''){
			return ;
		}		
		var returnOrgs=new Array();
		if(orgs.length==0){
			for(var item in orgsData){
				var e=orgsData[item];
				findAllOrgs(orgs,e);
			}
		}		
		if(orgs.length>0){
			for(var i=0;i<orgs.length;i++){
				var orgName=angular.copy(orgs[i].name);
				var lastspace=orgName.lastIndexOf(param);
				if(lastspace!=-1){
					returnOrgs.push(orgs[i]);
				}
			}
		}
		return returnOrgs;
		
	}
	//遍历找出树中所有的项
	var findAllOrgs =function(orgs,e){
		if(e.children != null){
 			for(var item in e.children){
 				findAllOrgs(orgs, e.children[item]);
 			}
 		}
 		if(e.otherid==1){
 			var group={name:e.label,id:e.id};
	 		orgs.push(group);
 		}
	}
	
	/*var getOrg2TreeNode = function(treeMap, orgMap) {
		var TreeNode = [];
		angular.forEach(treeMap,function(item){
			var iPid = item.parentId;
			var flag = 0;
			if(!iPid) {
				TreeNode.push(item);
			}else{
				var pNode = treeMap[iPid];
				if(pNode) {
					pNode.children.push(item);
				}else{
					while(true) {
						var poNode = orgMap[iPid];
						if(!poNode){
							TreeNode.push(item);
							flag = 1;
							break;
						}else{
							pNode = treeMap[iPid];
							if(pNode) {
								pNode.children.push(item);
								flag = 1;
								break;
							}else{
								iPid = orgMap[iPid].parentId;
							}
						}
					}
				}
			}
		})
		return TreeNode;
	}*/
	
	return {
		findSelected : findSelected,
		getOrg2TreeNode:getOrg2TreeNode,
		findSelectedOrg : findSelectedOrg,
		searchOrgs : searchOrgs
	};

}]);