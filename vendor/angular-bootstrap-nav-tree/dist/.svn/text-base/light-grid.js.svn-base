/*!
 Light Grid 0.3.1 

 by Michał Dudak (http://dudak.me)
 https://github.com/michaldudak/light-grid.git
 license: MIT

 build date: 2015-11-28T17:22:20.828Z
*/

(function (window, angular, $, undefined) {

if (typeof ($) === "undefined") {
	throw new Error("Light Grid requires jQuery.");
}

if (angular.element !== $) {
	throw new Error("jQuery must be included before Angular.");
}

angular.module("lightGrid", []).constant("DEFAULT_VIEW", "read");


/* exported getBlockNodes */

function getBlockNodes(nodes) {
	// TODO(perf): just check if all items in `nodes` are siblings and if they are return the original
	// collection, otherwise update the original collection.

	var node = nodes[0];
	var endNode = nodes[nodes.length - 1];
	var blockNodes = [node];

	do {
		node = node.nextSibling;
		if (!node) {
			break;
		}
		blockNodes.push(node);
	} while (node !== endNode);

	return angular.element(blockNodes);
}

/**
 * The root grid directive.
 * Parameters:
 *  - model - {Array} (interpolated) data model displayed on the grid (optional).
 *  - initial-view - {String} Name of the initial view mode of all rows in the grid.
 */
angular.module("lightGrid").directive("lgGrid", function gridDirective() {
	"use strict";

	return {
		scope: true,
		controller: ["$scope", "$attrs", function lgGridController($scope, $attrs) {
			this.getModel = function getModel() {
				return $scope.grid.data;
			};
			
			this.getInitialView = function getInitialView() {
				return $attrs.initialView;
			};
			
			this.switchView = function switchView(viewName) {
				$scope.$parent.$broadcast("switchView:" + this.getIdentifier(), viewName);
			};
			
			this.getIdentifier = function getIedntifier() {
				return $scope.$$gridId;
			};
		}],
		require: "lgGrid",
		link: {
			pre: function lgGridLink($scope, $elem, $attrs, gridController) {
				$scope.$$gridId = Math.floor(Math.random() * 1000000);
				
				$scope.grid = {
					data: $scope.$eval($attrs.model),
					controller: gridController
				};
				
				$scope.$watch($attrs.model, function (newValue, oldValue) {
					if (newValue !== oldValue) {
						$scope.grid.data = newValue;
					}
				});
				
				$elem.addClass("light-grid");
			}
		}
	};
});


/* global getBlockNodes */

angular.module("lightGrid").directive("lgRow", ["$parse", "$animate", "DEFAULT_VIEW", function rowDirective($parse, $animate, DEFAULT_VIEW) {
	"use strict";

	/* Code based on Angular's ngRepeat: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js */

	var NG_REMOVED = "$$NG_REMOVED";

	var updateScope = function(scope, index, valueIdentifier, value, arrayLength, rowController, gridController) {
		// TODO(perf): generate setters to shave off ~40ms or 1-1.5%
		scope[valueIdentifier] = value;

		scope.$index = index;
		scope.$first = (index === 0);
		scope.$last = (index === (arrayLength - 1));
		scope.$middle = !(scope.$first || scope.$last);
		// jshint bitwise: false
		scope.$odd = !(scope.$even = (index & 1) === 0);
		// jshint bitwise: true

		scope.row = {
			data: scope.$$rowData,
			view: gridController.getInitialView() || DEFAULT_VIEW,
			viewModel: angular.copy(scope.$$rowData),
			controller: rowController,
			index: index
		};

		scope.$on("switchView:" + gridController.getIdentifier(), function (e, viewName) {
			rowController.switchView(viewName);
		});
	};

	var getBlockStart = function(block) {
		return block.clone[0];
	};

	var getBlockEnd = function(block) {
		return block.clone[block.clone.length - 1];
	};

	function createMap() {
		return Object.create(null);
	}

	function RowController($scope) {
		var registeredViews = {};

		this.switchView = function (view) {
			$scope.row.view = view;
		};

		this.acceptViewModel = function () {
			angular.extend($scope.row.data, $scope.row.viewModel);
		};

		this.registerView = function (viewName) {
			registeredViews[viewName] = true;
		};

		this.isViewRegistered = function (viewName) {
			return !!registeredViews[viewName];
		};
	}

	return {
		restrict: "A",
		multiElement: true,
		transclude: "element",
		priority: 1000,
		terminal: true,
		$$tlb: true,
		require: "^lgGrid",
		compile: function lgRowCompile() {
			var lgRowEndComment = document.createComment(" end lgRow ");

			var valueIdentifier = "$$rowData";
			var collectionIdentifier = "grid.data";

			var trackByIdObjFn = function identity(key) {
				return key;
			};

			return function lgRowLink($scope, $element, $attr, gridController, $transclude) {

				// Store a list of elements from previous run. This is a hash where key is the item from the
				// iterator, and the value is objects with following properties.
				// - scope: bound scope
				// - element: previous element.
				// - index: position
				// We are using no-proto object so that we don't need to guard against inherited props via
				// hasOwnProperty.
				var lastBlockMap = createMap();

				// watch props
				$scope.$watchCollection(collectionIdentifier, function lgRowWatchAction(collection) {
					var index,
						length,
						previousNode = $element[0], // node that cloned nodes should be inserted after
						                            // initialized to the comment node anchor
						nextNode,
						// Same as lastBlockMap but it has the current state. It will become the
						// lastBlockMap on the next iteration.
						nextBlockMap = createMap(),
						collectionLength,
						key, value, // key/value of iteration
						trackById,
						trackByIdFn,
						collectionKeys,
						block,			 // last object information {scope, element, id}
						nextBlockOrder,
						elementsToRemove;

					trackByIdFn = trackByIdObjFn;

					// if object, extract keys, in enumeration order, unsorted
					collectionKeys = [];
					for (var itemKey in collection) {
						if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) !== "$") {
							collectionKeys.push(itemKey);
						}
					}

					collectionLength = collectionKeys.length;
					nextBlockOrder = new Array(collectionLength);

					function restoreLastBlockMap(block) {
						if (block && block.scope) {
							lastBlockMap[block.id] = block;
						}
					}

					// locate existing items
					for (index = 0; index < collectionLength; index++) {
						key = (collection === collectionKeys) ? index : collectionKeys[index];
						value = collection[key];
						trackById = trackByIdFn(key, value, index);
						
						if (lastBlockMap[trackById]) {
							// found previously seen block
							block = lastBlockMap[trackById];
							delete lastBlockMap[trackById];
							nextBlockMap[trackById] = block;
							nextBlockOrder[index] = block;
						} else if (nextBlockMap[trackById]) {
							// if collision detected restore lastBlockMap and throw an error
							angular.forEach(nextBlockOrder, restoreLastBlockMap);
							throw new Error("Duplicate rows detected. The grid cannot render the same row twice. Use angular.copy to create a new instance. Duplicate value: " + value);
						} else {
							// new never before seen block
							nextBlockOrder[index] = { id: trackById, scope: undefined, clone: undefined };
							nextBlockMap[trackById] = true;
						}
					}

					/* jshint forin:false */
					// remove leftover items
					for (var blockKey in lastBlockMap) {
						block = lastBlockMap[blockKey];
						elementsToRemove = getBlockNodes(block.clone);
						$animate.leave(elementsToRemove);
						
						if (elementsToRemove[0].parentNode) {
							// if the element was not removed yet because of pending animation, mark it as deleted
							// so that we can ignore it later

							length = elementsToRemove.length;
							for (index = 0; index < length; index++) {
								elementsToRemove[index][NG_REMOVED] = true;
							}
						}
						
						block.scope.$destroy();
					}
					/* jshint forin:true */

					// we are not using forEach for perf reasons (trying to avoid #call)
					for (index = 0; index < collectionLength; index++) {
						key = (collection === collectionKeys) ? index : collectionKeys[index];
						value = collection[key];
						block = nextBlockOrder[index];

						if (block.scope) {
							// if we have already seen this object, then we need to reuse the
							// associated scope/element

							nextNode = previousNode;

							// skip nodes that are already pending removal via leave animation
							do {
								nextNode = nextNode.nextSibling;
							} while (nextNode && nextNode[NG_REMOVED]);

							if (getBlockStart(block) !== nextNode) {
								// existing item which got moved
								$animate.move(getBlockNodes(block.clone), null, angular.element(previousNode));
							}
							previousNode = getBlockEnd(block);
							updateScope(block.scope, index, valueIdentifier, value, collectionLength, new RowController(block.scope), gridController);
						} else {
							/* jshint loopfunc:true */
							// new item which we don't know about
							$transclude(function lgRowTransclude(clone, scope) {
								block.scope = scope;
								// http://jsperf.com/clone-vs-createcomment
								var endNode = lgRowEndComment.cloneNode(false);
								clone[clone.length++] = endNode;

								// TODO(perf): support naked previousNode in `enter` to avoid creation of jqLite wrapper?
								$animate.enter(clone, null, angular.element(previousNode));
								previousNode = endNode;
								// Note: We only need the first/last node of the cloned nodes.
								// However, we need to keep the reference to the jqlite wrapper as it might be changed later
								// by a directive with templateUrl when its template arrives.
								block.clone = clone;
								nextBlockMap[block.id] = block;
								updateScope(block.scope, index, valueIdentifier, value, collectionLength, new RowController(block.scope), gridController);
							});
							/* jshint loopfunc:false */
						}
					}
					lastBlockMap = nextBlockMap;
				});
			};
		}
	};
}]);


/**
 * Defines a view in the column template
 */
angular.module("lightGrid").directive("lgView", ["$compile", function ($compile) {
	"use strict";

	function isInitialized(element) {
		if (element.length > 1) {
			return angular.isDefined(element.first().attr("lg-view-initialized"));
		} else {
			return angular.isDefined(element.attr("lg-view-initialized"));
		}
	}

	return {
		multiElement: true,
		link: function lgViewLink($scope, $elem, $attrs) {
			if (isInitialized($elem)) {
				return;
			}

			var viewNameExpression = $attrs.lgView || $attrs.view;
			var viewNames;

			if (!viewNameExpression) {
				viewNames = [];
			} else {
				viewNames = viewNameExpression.split(",").map(function (viewName) {
					return viewName.trim();
				});
			}

			viewNames.forEach(function (viewName) {
				$scope.row.controller.registerView(viewName);
			});

			$scope.shouldShowDefaultView = function (requestedViewName) {
				return !$scope.row.controller.isViewRegistered(requestedViewName);
			};

			var displayCondition;

			if (viewNames.length === 0) {
				displayCondition = "shouldShowDefaultView(row.view)";
			} else {
				displayCondition = viewNames.map(function (viewName) {
					return "row.view === '" + viewName + "'";
				}).join(" || ");
			}

			if ($elem.length > 1) {
				var first = $elem.first();
				var last = $elem.last();

				first.attr("ng-if-start", "displayCondition");
				first.attr("lg-view-initialized", "");
				last.attr("ng-if-end", "");
			} else {
				$elem.attr("lg-view-initialized", "");
				$elem.attr("ng-if", displayCondition);
			}

			$compile($elem)($scope);
		}
	};
}]);


function LocalDataProvider(model, filterFilter, orderByFilter, limitToFilter, defaultViewSettings) {

	var viewSettings;
	var viewModel;
	var filteredItemCount;
	var originalModel = model;

	function updateFilters() {
		viewModel = originalModel;

		if (viewSettings.filter) {
			viewModel = filterFilter(viewModel, viewSettings.filter.expression, viewSettings.filter.comparator);
		}

		if (viewSettings.orderBy) {
			viewModel = orderByFilter(viewModel, viewSettings.orderBy.expression, viewSettings.orderBy.reverse);
		}

		filteredItemCount = viewModel.length;

		if (viewSettings.limitTo && viewSettings.limitTo.limit !== 0) {
			if (viewSettings.limitTo.begin) {
				if (viewSettings.limitTo.begin >= filteredItemCount) {
					viewSettings.limitTo.begin = 0;
				}

				viewModel = viewModel.slice(viewSettings.limitTo.begin, viewModel.length);
			}

			viewModel = limitToFilter(viewModel, viewSettings.limitTo.limit);
		}
	}

	this.setModel = function (newModel) {
		originalModel = newModel;
		updateFilters();
	};

	this.getGridModel = function() {
		return viewModel;
	};
	
	this.getOriginalModel = function(){
		return originalModel;
	}

	this.getModelItemCount = function () {
		return filteredItemCount;
	};

	this.getCurrentViewSettings = function() {
		return viewSettings;
	};

	this.saveModel = function () {
	};

	this.orderBy = function (expression, reverse) {
		viewSettings.orderBy = {
			expression: expression,
			reverse: reverse
		};

		updateFilters();
	};

	this.limitTo = function (limit, begin) {
		if (limit === undefined || limit === null) {
			viewSettings.limitTo = null;
		} else {
			viewSettings.limitTo = {
				limit: limit,
				begin: begin || 0
			};
		}

		updateFilters();
	};

	this.page = function (pageIndex) {
		if (viewSettings.limitTo && viewSettings.limitTo.limit) {
			viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
		}

		updateFilters();
	};

	this.filter = function (expression, comparator) {
		viewSettings.filter = {
			expression: expression,
			comparator: comparator
		};

		updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		updateFilters();
	};

	this.reset();
}

angular.module("lightGrid").provider("lgLocalDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.$get = ["filterFilter", "orderByFilter", "limitToFilter", function(filterFilter, orderByFilter, limitToFilter) {
		return {
			create: function(localModel) {
				return new LocalDataProvider(localModel, filterFilter, orderByFilter, limitToFilter, self.defaultViewSettings);
			}
		};
	}];
});


function defaultSettingsSerializer(requestSettings) {
	var queryString = [];
	
	if (requestSettings.limitTo) {
		if (requestSettings.limitTo.limit) {
			queryString.push("limit=" + requestSettings.limitTo.limit);
		}
		
		if (requestSettings.limitTo.begin) {
			queryString.push("begin=" + requestSettings.limitTo.begin);
		}
	}
	
	if (requestSettings.orderBy && requestSettings.orderBy.expression) {
		queryString.push("orderBy=" + encodeURIComponent(requestSettings.orderBy.expression));
		
		if (requestSettings.orderBy.reverse) {
			queryString.push("reverse=true");
		}
	}
	
	if (requestSettings.filter && requestSettings.filter.expression) {
		var expression = requestSettings.filter.expression;
		if (angular.isString(expression)) {
			queryString.push("search=" + encodeURIComponent(expression));
		} else if (angular.isObject(expression)) {
			var searchQueryParts = [];
			for (var field in expression) {
				if (!expression.hasOwnProperty(field)) {
					continue;
				}
				
				var value = expression[field];
				searchQueryParts.push(encodeURIComponent(field) + ":" + encodeURIComponent(value));
			}
			
			queryString.push("search=" + searchQueryParts.join(","));
		}
	}
	
	return queryString.join("&");
}

function defaultResponseParser(serverResponse) {
	return serverResponse;
}

function ServerDataProvider(requestService, $timeout, defaultViewSettings, debounceTime) {
	var _this = this;
	//这个是page类
	_this.viewSettings = angular.copy(defaultViewSettings);
	//数据模型
	_this.viewModel = [];
	//错误信息
	_this.errorMsg={};
	_this.data = null;
	_this.url = "";
	// debounce data
	_this.pendingRequest = null;
	//用于异步防抖动
	_this.debounceTime = debounceTime;
	
	_this.getUrl = function(){
		return _this.url;
	}
	//返回data
	_this.getData = function(){
		return _this.data;
	}
	//返回错误信息
	_this.getErrorMsg = function(){
		return _this.errorMsg;
	}
	//给table设置模型数据
	_this.setModel = function (newModel) {
		_this.viewModel = newModel;
	};
	//获得模型数据
	_this.getGridModel = function() {
		return _this.viewModel;
	};
	//返回模型数据条数
	_this.getModelItemCount = function () {
		return _this.viewSettings.result.size;
	};
	//返回数据库总记录数
	_this.getTotalCount = function () {
		return _this.viewSettings.totalCount;
	};
	//返回viewSettings(page类)
	_this.getCurrentViewSettings = function() {
		return _this.viewSettings;
	};
	//设置排序
	_this.orderBy = function (orderBy, orderFilter) {
		_this.viewSettings.orderBy = orderBy;
		if(orderFilter){
			_this.viewSettings.order = "DESC";
		}else{
			_this.viewSettings.order = "ASC";
		}
		
		_this.updateFilters();
	};
	//设置分页
	_this.limitTo = function (pageNo, pageSize) {
		_this.viewSettings.pageNo = pageNo;
		_this.viewSettings.pageSize = pageSize;
	};
	//设置viewSettings(page类)
	_this.setViewSettings = function(v) {
		_this.viewSettings = v;
	};
	//刷新
	_this.refresh = function () {
		_this.updateFilters();
	};
	//重置
	_this.reset = function () {
		_this.updateFilters();
	};
	
	//分页的过滤器
	_this.updateFilters = function(resourceUrl,v) {
		if (resourceUrl) {
			_this.url = resourceUrl;
		}
		if(v){
			_this.viewSettings = v;
		}
		//暂时没用
		if (_this.pendingRequest !== null) {
			$timeout.cancel(_this.pendingRequest);
			_this.pendingRequest = null;
		}
		
		function sendRequest() {
		//删除其中的某些属性
			delete _this.viewSettings.result;
			delete _this.viewSettings.neighborPagePos;
			
			requestService.post(_this.url, _this.viewSettings, true).then(function(d) {
				_this.data = d;
            },function(error) {
            	_this.errorMsg = error;
            });
		}
		
		//暂时没用
		if (self.debounceTime) {
			pendingRequest = $timeout(function() {
				pendingRequest = null;
				pendingRequestSettings = null;
				sendRequest();
			}, self.debounceTime);
		} else {
			sendRequest();
		}
	}
}

angular.module("lightGrid").provider("lgServerDataProviderFactory", function () {
	var self = this;
	//延迟放止页面抖动
	this.debounceTime = 150;
	this.$get = ["$http", "$timeout", function($http, $timeout) {
		return {
			create: function(requestService,larPager) {
				return new ServerDataProvider(requestService, $timeout, larPager, self.debounceTime);
			}
		};
	}];
});

/* global getBlockNodes */

angular.module("lightGrid").directive("lgExpandedRow", ["$animate", function ($animate) {
	"use strict";

	/* Code based on Angular's ngIf directive: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js */
	return {
		multiElement: true,
		transclude: "element",
		priority: 600,
		terminal: true,
		restrict: "A",
		require: "^?lgRow",
		$$tlb: true,
		link: function lgExpandedRowLink ($scope, $element, $attr, ctrl, $transclude) {
			var block;
			var childScope;
			var previousElements;
			
			$scope.$watch("row.expanded", function lgExpandedRowWatchAction(shouldBeVisible) {
				if (shouldBeVisible) {
					if (!childScope) {
						$transclude(function(clone, newScope) {
							childScope = newScope;
							clone[clone.length++] = document.createComment(" end lgExpandedRow ");
							// Note: We only need the first/last node of the cloned nodes.
							// However, we need to keep the reference to the jqlite wrapper as it might be changed later
							// by a directive with templateUrl when its template arrives.
							block = {
								clone: clone
							};
							
							$animate.enter(clone, $element.parent(), $element);
						});
					}
				} else {
					if (previousElements) {
						previousElements.remove();
						previousElements = null;
					}
					
					if (childScope) {
						childScope.$destroy();
						childScope = null;
					}
					
					if (block) {
						previousElements = getBlockNodes(block.clone);
						$animate.leave(previousElements).then(function () {
							previousElements = null;
						});
						
						block = null;
					}
				}
			});
		}
	};
}]);

angular.module("lightGrid").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "=",
			pageSizeOptions: "@"
		},
		replace:true,
		template: 
			"<div style='height:40px;'>"+
				"<div class='page-size' style='height:30px;float:right'>"+
					"<select class='form-control' ng-options='size for size in pageSizes' ng-model='pageSize'></select>" +
				"</div>"+
				"<div class='pager' style='float:right'>" +
					"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'><i class='glyphicon glyphicon-step-backward kj'></i></button>" +
					"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'><i class='glyphicon glyphicon-chevron-left kj'></i></button>" +
					"<span class='pager-summary'>Page {{currentPage + 1}} of {{pageCount}}</span>" +
					"<button ng-disabled='isLast' class='next' ng-click='goToNext()'><i class='glyphicon glyphicon-chevron-right kj'></i></button>" +
					"<button ng-disabled='isLast' class='last' ng-click='goToLast()'><i class='glyphicon glyphicon-step-forward kj'></i></button>" +
				"</div>" +
			"</div>" ,
		link: function pagerLink($scope) {
			var DEFAULT_PAGE_SIZE_OPTIONS = "20,30,50,100";

			//$scope.pageSizeOptions = $scope.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;
			$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
			parsePageSizeOptions();

			if ($scope.pageSizes.length === 0) {
				$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
				parsePageSizeOptions();
			}

			function parsePageSizeOptions() {
				$scope.pageSizes = $scope.pageSizeOptions
					.split(",")
					.map(function(pso) {
						return parseInt(pso, 10);
					})
					.filter(function(pso) {
						return !isNaN(pso);
					});
			}

			$scope.pageSize = $scope.pageSizes[0];
			goToPage(0);

			function calculateCurrentPage(currentIndex, pageSize) {
				return Math.floor(currentIndex / pageSize);
			}

			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / pageSize);
			}

			function update(limitToSettings) {
				var totalItemCount = $scope.provider.getModelItemCount();
				if (!limitToSettings) {
					$scope.currentPage = 0;
					$scope.pageCount = 1;
				} else {
					$scope.currentPage = calculateCurrentPage(limitToSettings.begin, limitToSettings.limit);
					$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);
					$scope.pageSize = limitToSettings.limit;

					if ($scope.pageSizes.indexOf($scope.pageSize) === -1) {
						$scope.pageSizes.push($scope.pageSize);
						$scope.pageSizes.sort(function(a, b) {
							return a - b;
						});
					}
				}

				$scope.isFirst = $scope.currentPage <= 0;
				$scope.isLast = $scope.currentPage >= $scope.pageCount - 1;
			}

			function goToPage(pageNumber) {
				if (pageNumber < 0) {
					pageNumber = 0;
				} else if (pageNumber >= $scope.pageCount) {
					pageNumber = $scope.pageCount - 1;
				}

				var firstIndex = $scope.pageSize * pageNumber;
				$scope.provider.limitTo($scope.pageSize, firstIndex);
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				update(limitToSettings);
			}, true);

			$scope.$watch("provider.getModelItemCount()", function () {
				update($scope.provider.getCurrentViewSettings().limitTo);
			});

			$scope.$watch("pageSize", function(value) {
				$scope.provider.limitTo(value, 0);
			});

			$scope.goToFirst = function () {
				goToPage(0);
			};

			$scope.goToPrevious = function () {
				goToPage($scope.currentPage - 1);
			};

			$scope.goToNext = function () {
				goToPage($scope.currentPage + 1);
			};

			$scope.goToLast = function () {
				goToPage($scope.pageCount - 1);
			};
		}
	};
}).directive("servicePager", function () {
	"use strict";
	return {
		scope: {
			provider: "=",
			pageSizeOptions: "@"
		},
		template: 
			"<div class='ui-grid-pager-container clearfix'>"+
					"<div class='ui-grid-pager-control'>" +
						"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'><div class='first-triangle'><div class='first-bar'></div></div></button>" +
						"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'><div class='last-triangle next-triangle'></div></button>" +
						"<input type='text' ng-model='jumpPageNum' ng-keyup='jumpToPage($event)'/>"+
						"<span class='ui-grid-pager-max-pages-number'>/ 4</span>"+
						"<button ng-disabled='isLast' class='next' ng-click='goToNext()'><div class='last-triangle next-triangle'></div></button>" +
						"<button ng-disabled='isLast' class='last' ng-click='goToLast()'><div class='last-triangle'><div class='last-bar'></div></button>" +
						"每页 <select ng-options='size for size in pageSizes' ng-model='pageSize'></select> 条" +
				         //"，显示<span style='margin:0 2px'>{{pageSize}}</span>条" +
				         " / 共<span style='margin:0 2px' ng-model='totalItemCount'>{{ totalItemCount }}</span>条" +
					"</div>"+
				            
			"</div>",
		link: function pagerLink($scope) {
			$scope.$parent.sum = 0;
			var DEFAULT_PAGE_SIZE_OPTIONS = "20,30,50,100";

			$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
			parsePageSizeOptions();
			$scope.totalItemCount = 0;
			//如果pageSizes数组没数据就赋值
			if ($scope.pageSizes.length === 0) {
				$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
				parsePageSizeOptions();
			}

			function parsePageSizeOptions() {
				//格式化DEFAULT_PAGE_SIZE_OPTIONS并存储到pageSizes数组
				$scope.pageSizes = $scope.pageSizeOptions
					.split(",")
					.map(function(pso) {
						return parseInt(pso, 10);
					})
					.filter(function(pso) {
						return !isNaN(pso);
					});
			}
			
			//当前页,X有小数就入X
			function calculateCurrentPage(currentIndex, pageSize) {
				return Math.floor(currentIndex / pageSize);
			}

			//总页数,总记录数除以每页条数,有小数就+1
			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / pageSize);
			}
			
			//默认设置为显示8条
			$scope.pageSize = $scope.pageSizes[0];
			function update(viewSettings){
				//数据库所有记录条数
				$scope.totalItemCount = $scope.provider.getTotalCount();
				//alert($scope.totalItemCount)
				if(viewSettings===null || viewSettings.pageNo===null){
					//默认当前页是1
					$scope.currentPage = 1;
				}else{
					$scope.currentPage = viewSettings.pageNo;
				}
				if(viewSettings===null || viewSettings.totalPages===null){
					//总页数是1
					$scope.pageCount = 1;
				}else{
					$scope.pageCount = calculatePageCount($scope.pageSize, viewSettings.totalCount);
				}
				//jumpPageNum
				$scope.jumpPageNum = $scope.currentPage;
				
				$scope.pageSize=viewSettings.pageSize;
				//如果集合中没有这个新设置的pageSize
				if ($scope.pageSizes.indexOf($scope.pageSize) === -1) {
					//就添加到集合中
					$scope.pageSizes.push($scope.pageSize);
					//对集合排序并双向绑定到页面
					$scope.pageSizes.sort(function(a, b) {
						return a - b;
					});
				}
				//是否是第一页
				$scope.isFirst = $scope.currentPage <= 1;
				//是否是最后一页
				$scope.isLast = $scope.currentPage == $scope.pageCount;
				if($scope.totalItemCount==0){
					$scope.isLast =true; 
				}
			}
			//下一页
			function goToPage(pageNumber) {
				//如果当前页小于等于1那就是1，如果大于等于总页数，那就是总页数
				if (pageNumber <= 1) {
					pageNumber = 0;
				} else if (pageNumber >= $scope.pageCount) {
					pageNumber = $scope.pageCount;
				}
				//请求后台
				$scope.provider.limitTo(pageNumber,$scope.pageSize);
				$scope.provider.updateFilters(null,null);
				//$scope.$parent.sum +=1;
			}
            
			
			$scope.$watch("provider.viewSettings", function (newValue) {
				var viewSettings = $scope.provider.viewSettings;
				if(viewSettings===undefined || viewSettings.totalCount===null || viewSettings.pageNo===null || viewSettings.pageSize===null){
					return;
				}
				update(viewSettings);
			});

			$scope.$watch("pageSize", function(newValue) {
				//如果数据少于一页显示的条数，就默认第一页
				if($scope.provider.viewSettings==null || $scope.provider.viewSettings.result==null){
					return;
				}
				if($scope.provider.viewSettings.result.length<=newValue){
					$scope.provider.viewSettings.pageNo=1;
				}
				$scope.provider.viewSettings.pageSize = newValue;
				$scope.provider.updateFilters(null,null);
			});

			$scope.goToFirst = function () {
				goToPage(1);
			};

			$scope.goToPrevious = function () {
				goToPage($scope.currentPage - 1);
			};

			$scope.goToNext = function () {
				goToPage($scope.currentPage + 1);
			};

			$scope.goToLast = function () {
				goToPage($scope.pageCount);
			};
			
			// 跳转页
			$scope.jumpToPage = function(){
				$scope.jumpPageNum = $scope.jumpPageNum.replace(/[^0-9]/g,'');
                if($scope.jumpPageNum !== ''){
                	$scope.currentPage = $scope.jumpPageNum;
                }
                goToPage($scope.currentPage);
            } 
			
			
		}
	};
});


/**
 * Directive persisting data from the viewModel of the row.
 */
angular.module("lightGrid").directive("lgPersistData", ["$q", function ($q) {
	"use strict";

	return {
		restrict: "A",
		link: function persistDataLink($scope, $elem, $params) {
			$elem.on("click", function () {
				var dataProvider = $scope.$eval($params.provider);
				var rowController = $scope.row.controller;
				
				$q.when(dataProvider.saveModel($scope.viewData))
					.then(function () {
						if (rowController) {
							rowController.acceptViewModel();
							rowController.switchView("read");
						}
					});
			});
		}
	};
}]);


/**
 * Enables sorting data by a column specified by the sort-property attribute
 * This directive is meant to be used in header template.
 */
angular.module("lightGrid").directive("lgSorter", ["$timeout", function ($timeout) {
	"use strict";

	return {
		template: "<span style='display:block;padding:0px 15px;' class='sorting {{ cssClass }}'><span style='display:block;' ng-transclude class='columnTitle'></span></span>",
		transclude: true,
		replace: true,
		scope: true,
		link: function sorterLink(scope, elem, attrs) {
			var sortProperty = attrs.sortProperty || attrs.lgSorter;
			var dataProvider = scope.$eval(attrs.provider);

			scope.dataProvider = dataProvider;

			function updateCssClass() {
				if (!scope.isSorted) {
					scope.cssClass = "";
				} else {
					scope.cssClass = scope.sortDirectionDescending ? "sorting_desc" : "sorting_asc";
				}
			}

			scope.isSorted = false;
			scope.sortDirectionDescending = true;

			elem.on("click", function () {
				$timeout(function () {
					dataProvider.orderBy(sortProperty, !scope.sortDirectionDescending);
				});
			});
 
			scope.$watch("dataProvider.getCurrentViewSettings()", function (sortSettings) {
				if (!sortSettings.order&&!sortSettings.orderBy) {
					scope.isSorted = false;
					scope.sortDirectionDescending = true;
				} else {
					scope.isSorted = sortProperty === sortSettings.orderBy;
					var reverse;
					if(sortSettings.order==='DESC'||sortSettings.order==='desc'){
						reverse=true;
					}else{
						reverse=false;
					}
					scope.sortDirectionDescending = scope.isSorted ? reverse: true;
				}

				updateCssClass();
			});
		}
	};
}]);


/**
 * Allows to change a view mode of the row.
 * Can only be used as an attribute. Its value specifies name of the target view mode.
 */
angular.module("lightGrid").directive("lgSwitchView", ["$timeout", function ($timeout) {
	"use strict";

	return {
		restrict: "A",
		link: function switchViewLink(scope, elem, attrs) {
			var viewName = attrs.lgSwitchView;

			elem.on("click", function () {
				$timeout(function () {
					scope.row.controller.switchView(viewName);
				});
			});
		}
	};
}]);


/**
 * Opens or closes the expanded view of the row.
 * This can be only used as an attribute. Its value specifies the name of the template
 * used as an expanded row content.
 */
angular.module("lightGrid").directive("lgToggleExpandedRow", ["$timeout", function ($timeout) {
	"use strict";

	return {
		require: "^?lgRow",
		restrict: "A",
		link: function toggleExpandedRowLink($scope, $elem, $attrs, $ctrl) {

			$elem.on("click", function () {
				$timeout(function () {
					$scope.row.expanded = !$scope.row.expanded;
					if($attrs.lgToggleExpandedRow != undefined && $attrs.lgToggleExpandedRow == 'true'){
						$scope.row.readonly = false;					}
					else{
						$scope.row.readonly = true;
					}
				});
			});
		}
	};
}]);

}(window, window.angular, window.jQuery));