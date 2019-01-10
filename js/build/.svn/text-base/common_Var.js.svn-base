//字符限制
function FontCount(text1,leng) {
	if(text1 != null && text1 != undefined && text1 != "" && text1.length > leng) {
		text1 = text1.substring(0, leng) + '...';
	}
	return text1 || "";
}
//地图相关
//21，地图弹框
var infoBox_init = function(map){
	infoBox = new BMapLib.InfoBox(map,"",{
		boxClass:'infoBoxContent infoBoxContent_m1'
		,offset: {width:40,height:32}
		,closeIconMargin: "0.45rem 0.3rem 0 0"
		,enableAutoPan: false
		,closeIconUrl:"images/img1/infoBox_close1_2.png"
		,align: INFOBOX_AT_TOP
	});	
}
//22,地图服务网点，marker图标
function map_siteIcons(type){
				var siteIcClass={'服务站':'marker_serviceSite','充电桩':'marker_chargingPile','充电站':'marker_chargingStation','加油站':'marker_gasStation','停车场':'marker_parkingStation','其它':'marker_otherStation'};
				return new BMap.Icon("images/img1/"+siteIcClass[type]+".png", new BMap.Size(43,61),{
			    	imageSize:new BMap.Size(28,39.7)
	})
}

//23,服务网点 html
function getService_IfboxHtml(objDetail){
	var html = '<div class="mapInfoBox2">'+
						'<p class="text-center SiteTypetitle">'+objDetail.type+'</p>'+
						'<p class="modal-title">'+FontCount(objDetail.name,15)+'</p>'+
					'<div class="panel-body">'
						 +'<div class="map_in_box clearfix">'
							+'<div class="mCar_inf_ulist1 clearfix">'
								+'<ul class="ullist2"><li class="commonColor1">联系人</li><li class="font-big Service_contacts">'+FontCount(objDetail.contacts,8)+'</li></ul>'
								+'<ul class="ullist3"><li class="commonColor1">联系电话</li><li class="font-big">'+(objDetail.phone||"") +'</li></ul>'
								+'<ul class="wt100"><li class="commonColor1">具体位置</li><li class="font-big">'+FontCount(objDetail.address,28) +'</li></ul>'
							+'</div>'
				    	 +'</div>'
		    		+'</div>'
		  +'</div>';
	return html;
}

//31,电池电压极差分析,电池温度极差分析 option拼接
function potential_option(resultData){
		var lowestV = [],lowestT = [], //单体最低电压值,单体最低温度值
		highestV = [],highestT = [], //单体最高电压值,单体最高温度值
		rangeV = [],rangeT = [], //电压极差,温度极差
		Timedata = []; //时间轴
		
		console.log(resultData);
		var dataZoomFlag=true;
		if(resultData.length>0){
			resultData=resultData[0];
			lowestV=resultData.lowestV;
			lowestT=resultData.lowestT;
			highestV=resultData.highestV;
			highestT=resultData.highestT;
			rangeV=resultData.rangeV;
			rangeT=resultData.rangeT;
			Timedata=resultData.time;
		}else{
			dataZoomFlag=false;
		}
		
		var optionObj1 = { lowest: lowestV, highest: highestV, range1: rangeV, Timedata: Timedata, title: '电池电压极差分析', name: '电压(v)', Highest: '单体最高电压', lower: '单体最低电压', Company: 'v',dataZoomFlag:dataZoomFlag};
		var optionObj2 = { lowest: lowestT, highest: highestT, range1: rangeT, Timedata: Timedata, title: '电池温度极差分析', name: '温度(℃)', Highest: '单体最高温度', lower: '单体最低温度', Company: '℃',dataZoomFlag:dataZoomFlag };
		
		return [optionObj1,optionObj2];
}







