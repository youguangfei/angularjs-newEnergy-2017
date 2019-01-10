App.factory('pagerService',function(){
	// 工厂方式services服务
	var pager = new Object();
	// -- 返回结果 --//
	//当前页
	pager.pageNo = 1;
	//每页显示的条数
	pager.pageSize = 20;
	//总记录数
	pager.totalCount=0;
	//总页数
	pager.totalPages=1;
	//需要排序的属性
	pager.orderBy = "";
	//排序的方式
	pager.order = "DESC";
	//查询对象时是否先自动执行count查询获取总记录数
	pager.autoCount = true;
	//是否去重复
	pager.distinct = false;
	//根据pageNo和pageSize计算当前页第一条记录在总结果集中的索引位置,序号从1开始
	pager.first=0
	//是否还有下一页
	pager.hasNext=false;
	//是否还有上一页
	pager.hasPre=false;
	//下一页的页号
	pager.nextPage=1
	//上一页的页号
	pager.prePage=1;
	//是否已设置排序
	pager.orderBySetted=false;
	//设置排序后生成的sql
	pager.orderSql="createDate desc";
	//查询条件的map
	pager.params={};
	//扩展业务
	//pager.extendMap={};
	//扩展参数
	//pager.extendList=[];
	//返回的数据
	pager.result=null;
	return pager;
})
