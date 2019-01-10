function MapControl(options){
	this.options = options || {};
	this._map = options.map;
}
/* 
 * 根据浏览器定位确定地图位置
 *
 */
MapControl.prototype.initLocation=function(){
	var map = this._map;
	var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            map.panTo(r.point);
        }
        else {
           console.log("定位失败"); 
        }        
    },
    {
        enableHighAccuracy: true
    });
}
//缩放控件
MapControl.prototype.addZoomControl = function(){
	var map = this._map;
	/**
     * 自定义缩放控件
     *
     */
    function ZoomControl(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new BMap.Size(15, 90);
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();
    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function(map){
        var zoom = document.createElement("div");
        zoom.className = 'zoom';
        var zoomIn = document.createElement("div");
        zoomIn.className = 'zoomIn';
        var zoomOut = document.createElement("div");
        zoomOut.className = 'zoomOut';
        zoom.appendChild(zoomIn);
        zoom.appendChild(zoomOut);
        zoomIn.onclick = function (e) {
            map.zoomIn();
        };
        zoomOut.onclick = function (e) {
            map.zoomOut();
        }
        // 添加DOM元素到地图中
        map.getContainer().appendChild(zoom);
        // 将DOM元素返回
        return zoom;
    }

    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);
}
/**
 * 添加地图类型控件
 *
 */
MapControl.prototype.addMapTypeControl = function () {
	var map = this._map;
     /**
      * 自定义交通流量控件
      *
      */
     function MapTypeControl(){
         // 默认停靠位置和偏移量
         this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
         this.defaultOffset = new BMap.Size(15,68);
     }

     // 通过JavaScript的prototype属性继承于BMap.Control
     MapTypeControl.prototype = new BMap.Control();

     // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
     // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
     MapTypeControl.prototype.initialize = function(map){
         var mapType = document.createElement("div");
         mapType.className = 'map_earth';
         var typeFlag=true;
         mapType.onclick = function (e) {
//       	mapType.className.indexOf('earth') > -1
             if (typeFlag) {
                 map.setMapType(BMAP_HYBRID_MAP);
//               mapType.className = mapType.className.replace(/map_earth/, 'map_normal');
             } else {
                 map.setMapType(BMAP_NORMAL_MAP); 
//               mapType.className = mapType.className.replace(/map_normal/, 'map_earth');
             }
             typeFlag=!typeFlag;
         };
         // 添加DOM元素到地图中
         map.getContainer().appendChild(mapType);
         // 将DOM元素返回
         return mapType;
     }

     // 创建控件
     var myMapTypeCtrl = new MapTypeControl();
     // 添加到地图当中
     map.addControl(myMapTypeCtrl);
 }	 
    
//实时路况组件
MapControl.prototype.addTrafficControl = function(option){
	var map = this._map;
	/**
     * 自定义缩放控件
     *
     */
    var hasRTT = false;//是否有实时路况  
	var rttCtrl = null;
	var rttCtrl = new BMapLib.TrafficControl({  
           showPanel: false //是否显示路况提示面板  
       });  
        map.addControl(rttCtrl);
        
    function TrafficControl(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
//      15,125
        this.defaultOffset = new BMap.Size(option.right,option.bottom);
    }
    // 通过JavaScript的prototype属性继承于BMap.Control
    TrafficControl.prototype = new BMap.Control();
    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    TrafficControl.prototype.initialize = function(map){
        var zoom = document.createElement("div");
        zoom.className = 'mapTrack';
        var zoomIn = document.createElement("div");
        zoomIn.className = 'mapTrack1';
        zoom.appendChild(zoomIn);
        zoomIn.onclick = function (e) {
            if( hasRTT ){// 没有实时路况  
		        rttCtrl.hideTraffic();  
		    }else{ 		    	
		        rttCtrl.showTraffic();  
		    }  
		    hasRTT = !hasRTT;
        };
        
        // 添加DOM元素到地图中
        map.getContainer().appendChild(zoom);
        // 将DOM元素返回
        return zoom;
    }

    // 创建控件
    var my_TrafficControl = new TrafficControl();
    // 添加到地图当中
    map.addControl(my_TrafficControl);
}    
    