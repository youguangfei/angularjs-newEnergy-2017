angular.module('pagination',[])
    .factory('myPage',function () {
                var f={};
                f.pageNo=1;
                f.getpageNo=function () {
                    return f.pageNo;
                };
                f.setpageNo=function (n) {
                    f.pageNo=n;
                };
                return f;
     })
    .directive('uiPagination',['myPage',function (myPage) {
                return {
                    restrict:'EA',
                    replace:true,
					templateUrl:'template/ui-pager.html',
                    scope:{
                        pg:'='
                    },
                    link: function(scope, element, attrs){
                        // 变更当前页
               			scope.pg.pageNo = 1;
                        scope.changepageNo = function(p){
                            if(p == '...'){
                                return;
                            }else{
                                scope.pg.pageNo = p;
                                myPage.setpageNo(scope.pg.pageNo);
                            }
                            getPagination();
                        };
						scope.goFirst = function(){
							if(scope.pg.pageNo <= 1){
								scope.pg.pageNo = 1;
                            }
                            myPage.setpageNo(1);
                            getPagination();
                        };
                        scope.goToLast = function(){
							if(scope.pg.pageNo == scope.pg.numberOfPages){
								scope.pg.pageNo=scope.pg.numberOfPages;
                            }
                            myPage.setpageNo(scope.pg.numberOfPages);
                            getPagination();
                        };
                        scope.prevPage = function(){
                            if(scope.pg.pageNo > 1){
                                scope.pg.pageNo -= 1;
                            }else {
                                scope.pg.pageNo=1;
                            }
                            myPage.setpageNo(scope.pg.pageNo);
                            getPagination();
                        };
                        //nextPage
                        scope.nextPage = function(){
                            if(scope.pg.pageNo < scope.pg.numberOfPages){
                                scope.pg.pageNo += 1;
                            }else {
                                scope.pg.pageNo=scope.pg.numberOfPages;
                            }
                            myPage.setpageNo(scope.pg.pageNo);
                            getPagination();
                        };
                        // jumpPageNum(初始默认值)
// 						scope.pg.jumpPageNum = scope.pg.pageNo = parseInt(myPage.pageNo);
						scope.pg.jumpPageNum = scope.pg.pageNo;
                        // 跳转页
                        scope.jumpToPage = function(pageNuber){
								console.log(pageNuber);
								var flag=!isNaN(pageNuber);
								console.log(flag)
								if(flag){
									scope.pg.jumpPageNum=pageNuber;
									if(scope.pg.jumpPageNum>0 || scope.pg.jumpPageNum<=scope.pg.numberOfPages)
									scope.pg.pageNo=scope.pg.jumpPageNum;
                                	myPage.setpageNo(scope.pg.pageNo);
                               		 getPagination();
								}
                        };
 												
                        // 修改每页显示的条数
                        scope.changeItemsPerPage = function(){
                            getPagination();
                        };
 
                        // 定义分页的长度必须为奇数 (default:9)
                        scope.pg.pagesLength = parseInt(scope.pg.pagesLength) ? parseInt(scope.pg.pagesLength) : 5 ;
                        if(scope.pg.pagesLength % 2 === 0){
                            scope.pg.pagesLength = scope.pg.pagesLength -1;
                        }
                        if(!scope.pg.perPageOptions){
                            scope.pg.perPageOptions = [10, 15, 20, 30, 50];
                        }
                        // pageList数组
                        getPagination();
                        function getPagination(){
                            // pg.totalCount
                            scope.pg.totalCount = parseInt(scope.pg.totalCount);
                            scope.pg.numberOfPages = Math.ceil(scope.pg.totalCount/scope.pg.pageSize);
 							scope.pg.jumpPageNum = scope.pg.pageNo ; 
                            if(scope.pg.pageNo < 1){
                                scope.pg.pageNo = 1;
                            }
 
                            if(scope.pg.pageNo > scope.pg.numberOfPages){
                                scope.pg.pageNo = scope.pg.numberOfPages;
                            }
 
 							//分页码数
                            scope.pageList = [];
                            var currentNum=scope.pg.pageNo; 
                            var totalPage=scope.pg.totalPages; //13
                            
                            if(totalPage <= 5){
                                // 判断总页数如果小于等于分页的长度，若小于则直接显示
                                for(i =1; i <= totalPage; i++){
                                    scope.pageList.push(i);
                                }
                            }else{
                            	if (currentNum <= 2) {
                            		scope.pageList=[1, 2, 3, "...", totalPage];
                            	}else if(currentNum === 3){
                            		scope.pageList=[1, 2, 3, 4, "...", totalPage];
                            	}else if(currentNum === totalPage - 2){
                            		scope.pageList=[1,"...", totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
                            	}else if(currentNum >= totalPage - 1){
                            		scope.pageList=[1,"...", totalPage - 2, totalPage - 1, totalPage];
                            	}else{
                            		scope.pageList=[1,"...", currentNum - 1, currentNum, currentNum + 1,"...", totalPage];
                            	}
                            	
                            }
 
                        }
 						
   						var watch1=scope.$watch("pg.pageNo",function (newValue,oldValue) {
   							if(newValue!=oldValue){
   								getPagination();
   							}
                        });
   						var watch2=scope.$watch("pg.totalPages",function (newValue,oldValue) {
   							if(newValue!=oldValue){
   								getPagination();
   							}
                        });
   						
   						
   						scope.$on('$destroy', function() {
							if(watch2){
								watch1();
							}
							if(watch2){
								watch1();
							}
						});
 						
 						
                        /*scope.$watch(scope.pg.pageNo,function (newClue,oldVlue) {
                            myPage.setpageNo(scope.pg.pageNo);
                            console.log('变化啦');
                            getPagination();
                            scope.$digest();
                        });
                        scope.$watch(scope.pg.totalCount,function (newClue,oldVlue) {
                            getPagination();
                        });*/
 
                    }
                }
            }])