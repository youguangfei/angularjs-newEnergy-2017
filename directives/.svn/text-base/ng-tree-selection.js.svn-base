/**
 *  Angular Tree Selection Directive
 * 
 *  Version: 0.0.2
 *
 *  Author: Baldur Már Helgason <baldur.helgason@gmail.com>
 *
 */

angular.module('ng-tree-selection', [])
  .directive('treeSelection', ['$rootScope',function($rootScope) {
    return {
      restrict: 'E',
      scope: {
        tree: '=',
        onSelect: '&',
        parent: '=',
        isOrg:'='
      },
      template:  '<ul ng-show="!parent || parent.mark.open">' +
          '<li ng-repeat="l in tree" ng-class="{\'tree-leaf\': !(l.hasChildren)||!s(level.children && level.children.length > 0)}">' 
      	   +'<tree-level on-select="onSelect(level,isOrg);"  is-org="isOrg" level="l" parent="parent">'
    	   +'</tree-level>'
           +'</li>'+
        '</ul>',
        link: function(scope, element, attrs, controller) {
        	
          	//scope.tree=scope.findTree(null,$rootScope.allTreeData);
        },
      controller: function($scope,$rootScope) {
        this.toggleCheckbox = function (level,isOrg) {
          // when checkbox is toggled it's either on or off
        	  level.indeterminate = false;
	          clickAllChildren(level,isOrg);
	          checkSubLevel(level,isOrg,0);
	          determineSelected(level,isOrg,0);
	          var allData=new Array();
	          findTreMetadata(level.id,allData);
	          if(allData.length>0){
	        	  allData[0].selected = level.selected;
	        	  allData[0].indeterminate = level.indeterminate;
	        	  checkSubLevel(allData[0],isOrg,1);
	              determineSelected(allData[0],isOrg,1);
	          }
          
          
        };
        this.clickTree=function(level){
      		if(level.children!=undefined&&level.children.length>0){
      			return ;
      		}
      		level.children=new Array();
      		level.children=findTree(level.id,$rootScope.allTreeData);
      	}
        function findTree(id,treeData){
    		if(treeData==null){
    			return null;
    		}
    		var newTree=new Array();
    		if(id==null){
    			for ( var i = 0; i < treeData.length; i++) {
    				var tre=angular.copy(treeData[i]);
    				tre.children=[];
    				newTree.push(tre);
				}
    		}else{
    			for ( var i = 0; i < treeData.length; i++) {
    				findChildren(id,treeData[i],newTree);
				}
    		}
    		return newTree;
    	}

        function findChildren(pid,e,children){
      		var tre={};
      		if(e.children != null&&e.children.length>0){
      			for(var item in e.children){
      				findChildren(pid,e.children[item],children);
      			}
      		}
      		if(e.pid==pid){
      			var tre=angular.copy(e);
      			if(tre.children!=null&&tre.children.length>0){
      				tre.hasChildren=true;
    			}
				tre.children=[];
      			
      			children.push(tre);
      		}
      	};
      	 function findChildrenMetadata(pid,e,children){
      		
      		if(e.children != null&&e.children.length>0){
      			for(var item in e.children){
      				findChildrenMetadata(pid,e.children[item],children);
      			}
      		}
      		if(e.pid==pid){
      			children.push(e);
      		}
      	};
      	function findTreeMetadata(id,e,next,tre){
      		
      		if(e.children != null&&e.children.length>0&&next){
      			for(var item in e.children){
      				findTreeMetadata(id,e.children[item],next,tre);
      			}
      		}
      		if(e.id==id){
      			next=false;
      			tre.push(e);
      		}
      	};
      	function findTreMetadata(id,tre){
      		var next=true;
      		for ( var i = 0; i < $rootScope.allTreeData.length; i++) {
      			findTreeMetadata(id,$rootScope.allTreeData[i],next,tre);
			}
      	};
      	function findAllChildrenMetadata(level,childrens){
      		for ( var i = 0; i < $rootScope.allTreeData.length; i++) {
      			findChildrenMetadata(level,$rootScope.allTreeData[i],childrens);
			}
      	};
      	 function checkAllSubLevel(elem,isOrg) {
            if(elem.children === undefined || elem.children.length==0||(isOrg!=null&&isOrg!=0&&elem.selected==false)) { return; }
            
            angular.forEach(elem.children, function (sl){
              sl.selected = elem.selected;
              sl.indeterminate = elem.indeterminate;
              checkAllSubLevel(sl);
            });
          }
      	function clickAllChildren(level,isOrg){
      		var childrens=new Array();
      		for ( var i = 0; i < $rootScope.allTreeData.length; i++) {
      			findChildrenMetadata(level.id,$rootScope.allTreeData[i],childrens);
			}
      		var elem={};
      		elem.children=childrens;
      		elem.selected = level.selected;
      		elem.indeterminate = level.indeterminate;
      		checkAllSubLevel(elem,isOrg);
      	}
      
        // changes the sub-tree
        function checkSubLevel (elem,isOrg,type) {
          if((elem.hasChildren === undefined || !elem.hasChildren||(isOrg!=null&&isOrg!=0&&elem.selected==false))
        		  &&type==0
        		  ||
        		  (elem.children === undefined || elem.children.length==0||(isOrg!=null&&isOrg!=0&&elem.selected==false))
        		  &&type==1
        		  ) { return; }
          
          angular.forEach(elem.children, function (sl){
            sl.selected = elem.selected;
            sl.indeterminate = elem.indeterminate;
            checkSubLevel(sl,isOrg,type);
          });
        }

        // traverses the parents to determine
        // the selection type
        function determineSelected (elem,isOrg,type) {
          if(elem === undefined) { return; }
          var allSet = true, allClear = true;
          if(((elem.hasChildren&&type==0)||(elem.children!=undefined&&elem.children.length!=0&&type==1))&&isOrg!=null&&isOrg!=1){
            var _break = false;
            var elemChildren=new Array();
            if(elem.children!=undefined&&elem.children.length>0){
            	elemChildren=elem.children;
            }else{
            	findAllChildrenMetadata(elem.id,elemChildren);	
            }
            
            angular.forEach(elemChildren, function (sl){
              if (!_break) {
                if(sl.indeterminate){
                  allClear = allSet = false;
                }
                else if(sl.selected){
                  allClear = false;
                }
                else{
                  allSet = false;
                }
                // stop if we don't need more work
                if(!allClear && !allSet) { _break = true; }
              }
            });
            
            if(allSet){
            	if(isOrg!=null&&isOrg!=0){
            		 elem.selected = false;
                     elem.indeterminate = true;
            	}else{
            		 elem.selected = true;
                     elem.indeterminate = false;
            	}
             
            }
            else if(allClear){
            	if(isOrg!=null&&isOrg!=0){
           		 	elem.selected = false;
                    elem.indeterminate = true;
	           	}else{
	              elem.selected = false;
	              elem.indeterminate = false;
	           	}
            }
            else{
              elem.selected = false;
              elem.indeterminate = true;
            }
          }
          var parent={};
          if(elem.parent==undefined&&elem.pid!=undefined){
        	  var allData=new Array();
        	  findTreMetadata(elem.pid,allData);
              if(allData.length>0){
            	  parent=allData[0];
              }
          }else{
        	  parent=elem.parent;
          }
          determineSelected(parent,isOrg,type);
          
        }
      }
    };
  }])
  .directive('treeLevel', ['$compile','$rootScope', function($compile,$rootScope) {
    return {
      restrict: 'E',
      scope: {
        level: '=',
        parent: '=',
        onSelect: '&',
        isOrg:'='
        
      },
      require: '^treeSelection',
      link: function(scope, element, attrs, controller) {
    	 
        scope.level.parent = scope.parent;
//        scope.level.selected = false;

 //       scope.level.indeterminate = false;

        
        //用于回显indeterminate，所以得注掉
//        scope.level.indeterminate = false;


        var template =  '<i class="color_fonts" ng-show="level.hasChildren||(level.children && level.children.length > 0)"  ng-class="{true:\'fa fa-minus\', false:\'fa fa-plus\', undefined:\'fa fa-plus\'}[level.mark.open]" ng-click="click(level)"></i>' +
                        '<div class="cb-wrapper">' +
                          '<input type="checkbox" value="None" id="{{$id}}" name="check" ng-click="toggleCheckbox();" ng-model="level.selected">' +
                          '<label ng-class="{\'ts-first-level\': !level.parent}" for="{{$id}}">' +
                        '</div>' +
                        '<span class="cb-label font-small color_blue">{{level.label}}</span>' +
                        '<tree-selection  on-select="onSelect(level,isOrg);" is-org="isOrg" ng-if="level.children" tree="level.children" parent="level"></tree-selection>';
        scope.toggleCheckbox = function () {
          if(!scope.level.selected){
        	  $rootScope.unSelectLevel=scope.level
        	  //controller.unSelected(scope.level,scope.isOrg);
        	  if(scope.onSelect!=null){
        		  scope.onSelect({"level":scope.level,"isOrg":$rootScope.isOrg});
            	  $rootScope.$watch("isNextc", function(newValue,old) {
                	  if(newValue!=true){
                		  return;
                	  }
                	  controller.toggleCheckbox($rootScope.unSelectLevel,$rootScope.isOrg); 
        	          $rootScope.isNextc=false;
                }); 
        	  }else{
        		  controller.toggleCheckbox(scope.level,scope.isOrg); 
        	  }
        	  
          }else{
        	  controller.toggleCheckbox(scope.level,scope.isOrg); 
          }
        };
        scope.click=function(level){
        	level.mark.open = !level.mark.open;
        	if(level.mark.open&&level){
        		controller.clickTree(level);
        	}
        	
        }
        var newElement = angular.element(template);
        $compile(newElement)(scope);
        element.append(newElement);

        scope.$watch('level.indeterminate', function(){
          angular.element(element).find('input')[0].indeterminate = scope.level.indeterminate;
          
        });
      }
    };
  }]);