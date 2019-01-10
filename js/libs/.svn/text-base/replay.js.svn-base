function Replay(map,path,opts){
	this._map = map;	//当前地图实例
	this._path = path; 	//坐标点的集合
	this._opts = opts;
	this._intervalFlag = undefined; //循环播放轨迹
	this._car = undefined; //小车图片
	this._tempLine = undefined;
	this.stopCallback = null; //回放结束
	this.arrowClickCallback = null; //点击轨迹箭头
	this._projection = this._map.getMapType().getProjection();
}

Replay.prototype.setPath = function(points){
	var me = this;
	me._path = points;
	this._totalPoints = this._path.length;
	this._currIndex = this._totalPoints - 1;
	me._currentCount = 0;
	me.load();
},
//初始化
Replay.prototype.load = function(){	
	var me = this;
//	me._map.clearOverlays();
	me._intervalFlag & clearInterval(me._intervalFlag);
	this._points = [];
	this._lines = [];
	this._isPause = false;
	this._isStop = true;
	this._isRun = false;
	//添加小车
	var car = new BMap.Marker(me._path[0]);	
    me._opts.carIcon && car.setIcon(me._opts.carIcon);	
    me._map.addOverlay(car);
	car.setZIndex(1);
	me._car = car;
	//开始标记
	var s = new BMap.Marker(me._path[0]);
    me._opts.startIcon && s.setIcon(me._opts.startIcon);
	me._points.push(s);
    me._map.addOverlay(s);
	me._opts.shadowIcon & s.setShadow(me._opts.shadowIcon);
	s.hide();
	
	//中间采集点及路线
	for(var i = 1; i < me._totalPoints; i++){
		//采集点
		var marker = new BMap.Marker(me._path[i]);
		if(me._path[i].isParking === 1){
	        me._opts.parkingIcon && marker.setIcon(me._opts.parkingIcon);
	        marker.setTop(true);
		}
		else if(me._path[i].isOverseed === 1){
			me._opts.overspeedIcon && marker.setIcon(me._opts.overspeedIcon);
			marker.setTop(true);
		}
		else{
			me._opts.arrowIcon && marker.setIcon(me._opts.arrowIcon);	
		}		
		var rotation = me.calRotation(me._path[i - 1],me._path[i]);
		marker.setRotation(rotation);
		me._points.push(marker);		
        marker.index = i;
        marker.parent = me;
        marker.addEventListener('click', function(event){
        	if(event.target.parent != undefined && event.target.parent.arrowClickCallback != undefined){
        		event.target.parent.arrowClickCallback(event.target.index);
        	}
        });
		marker.hide();
		//路线
		var line = new BMap.Polyline([me._path[i - 1],me._path[i]],{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});		
		line.hide();
		me._lines.push(line);
		me._map.addOverlay(line);
	}
	
	//结束标记
	var end = this._points[me._totalPoints - 1];
	end.setRotation(0);
    me._opts.endIcon && end.setIcon(me._opts.endIcon);
	//移动地图
	//me._map.panTo(me._path[0]);
	me._currIndex = 0;
},
//开始播放
Replay.prototype.start = function(){
	var me= this;
	if(me._isRun || !me._points || me._points.length == 0) return;
	me._isRun = true;
	if(me._currIndex >= me._points.length - 1) {
		me._isPause = false;
		me.clearPath();
		me._currIndex = 0;
	}
	if(me._isPause){
		me.moveNext(me._currIndex);	
		me._isStop = false;
	}else{
		me._currentCount = 0;
		me.clearPath();
		me._currIndex = 0;
		me.moveNext(0);
	}
	
	me._isPause = false;
	me._isStop = false;
	
	if(me._points[me._currIndex]){
		if(me._points[me._currIndex].getMap() == null){
			me._map.addOverlay(me._points[me._currIndex]);
		}	
		me._points[me._currIndex].show();
	}
	if(me._currIndex > 0){
		me._lines[me._currIndex - 1].show();
	}
	me._car.show();
	/*me._interval = setInterval(function(){
		if(me._currIndex >= me._totalPoints){
			me._car.setIcon(me._opts.carIcon);
			me.stop();
			if(me.stopCallback  != null){
				me.stopCallback(-1);
			}
			return;
		}
		if(me.stopCallback  != null){
			me.stopCallback(me._currIndex);
		}
		//移动地图
		if(!me._map.getBounds().containsPoint(me._path[me._currIndex])){
			me._map.panTo(me._path[me._currIndex]);
        }  
		//车前进
		me._car.setPosition(me._path[me._currIndex]);
		var directIndex = parseInt(((me._points[me._currIndex].getRotation()+360)%360 - 22.5)/45);
		
		//me._car.setRotation(me._points[me._currIndex].getRotation());
		me._car.setIcon(me._opts.directions[7-directIndex]);
		
		//路线显示
		me._points[me._currIndex].show();
		me._lines[me._currIndex - 1].show();
		me._currIndex++;
	}, me._opts.speed);*/
},
Replay.prototype.clearPath = function(){
	var me = this;
//	me._car.hide();
	for(var i = 0; i < me._currIndex; i++){
		me._points[i].hide();
		if(me._lines[i])
			me._lines[i].hide();
	}
	if(me._currIndex <= me._totalPoints - 1){
		me._points[me._currIndex].hide();
	}
	
},
Replay.prototype.pause = function(){
	var me = this;
	if(me._isRun){
		clearInterval(me._intervalFlag);
	}
	me._isPause = true;
	me._isRun = false;
},
//停止播放
Replay.prototype.stop = function(){
	var me = this;
	me._isStop = true;
	clearInterval(me._intervalFlag);
	me._isRun = false;
},
Replay.prototype.calRotation = function(from, to){
			var me = this;
            var deg = 0;
            //start!
            from =  me._map.pointToPixel(from);
            to =  me._map.pointToPixel(to);   
            if(to.x != from.x){
                    var tan = (to.y - from.y)/(to.x - from.x),
                    atan  = Math.atan(tan);
                    deg = atan*360/(2*Math.PI);
                    //degree  correction;
                    if(to.x < from.x){
                        deg = -deg + 90 + 90;

                    } else {
                        deg = -deg;
                    }
					
                    return -deg;   

            }else {
                    var disy = to.y- from.y ;
                    var bias = 0;
                    if(disy > 0)
                        bias=-1
                    else
                        bias = 1
                    return -bias * 90;  
        }
},
//设置方向
Replay.prototype.setDirection = function(newDirection){
	var me = this;
	me._opts.directions = newDirection;
},
Replay.prototype.linear = function(initPos, targetPos, currentCount, count) {
    var b = initPos, c = targetPos - initPos, t = currentCount,
    d = count;
    return c * t / d + b;
},
Replay.prototype.move = function(initPos,targetPos,effect) {
    var me = this,
        //步长，米/秒
        timer = 30,
        step = this._opts.speed / (1000 / timer),
        //初始坐标
        init_pos = this._projection.lngLatToPoint(initPos),
        //获取结束点的(x,y)坐标
        target_pos = this._projection.lngLatToPoint(targetPos),
        //总的步长
        count = Math.round(me.getDistance(init_pos, target_pos) / step);
        //当前的帧数
    	//me._currentCount = 0;

    //如果小于1直接移动到下一点
    if (count < 1) {
    	if(me.stopCallback  != null){
			me.stopCallback(me._currIndex + 1);
		}
        me.moveNext(++me._currIndex);
        return;
    }
    //两点之间匀速移动
    me._intervalFlag = setInterval(function() {
    //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
		//console.log(me._intervalFlag);
        if (me._currentCount >= count) {
            clearInterval(me._intervalFlag);
            //移动的点已经超过总的长度
        	if(me._currIndex > me._path.length || !me._isRun){
				return;
        	}
        	//运行下一个点
            me._currentCount = 0;
            if(me._tempLine) {
            	me._map.removeOverlay(me._tempLine);
            	me._tempLine = undefined;
            }
            if(me.stopCallback  != null){
    			me.stopCallback(me._currIndex + 1);
    		}
            me.moveNext(++me._currIndex);
        }else {
				if(!me._isRun) {
					clearInterval(me._intervalFlag);
					return;
				}
				me._currentCount++;
                var x = effect(init_pos.x, target_pos.x, me._currentCount, count),
                    y = effect(init_pos.y, target_pos.y, me._currentCount, count),
                    pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
                //设置marker
                if(me._currentCount == 1){
                    var proPos = null;
                    if(me._currIndex - 1 >= 0){
                        proPos = me._path[me._currIndex - 1];
                    }
                }else{
                	if(me._tempLine) {
                    	me._map.removeOverlay(me._tempLine);
                    	me._tempLine = undefined;
                    }
                	me._tempLine = new BMap.Polyline([me._path[me._currIndex], pos],{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});		
                	me._map.addOverlay(me._tempLine);
                }
                //正在移动
                me._car.setPosition(pos);
                //设置自定义overlay的位置
            }
    },timer);
},
Replay.prototype.moveNext = function(index) {
    var me = this;
    if (index < this._path.length - 1) {
    	if(me._points[index].getMap() == null){
			me._map.addOverlay(me._points[index]);
		}
    	me._points[index].show();
		if(index > 0) me._lines[index-1].show();
		var directIndex = parseInt(((me._points[index+1].getRotation()+360)%360 - 22.5)/45);
    	me._car.setIcon(me._opts.directions[7-directIndex]);  	
//    	if(me.stopCallback  != null){
//			me.stopCallback(me._currIndex + 1);
//		}
        me.move(me._path[index], me._path[index + 1], me.linear);
        if(!me._map.getBounds().containsPoint(me._path[me._currIndex])){
    		me._map.panTo(me._path[me._currIndex]);
        }
    }
    else if (index >= this._path.length - 1){
    	if(me._points[index].getMap() == null){
			me._map.addOverlay(me._points[index]);
		}
    	me._points[index].show();
		me._lines[index-1].show();
		me._car.setIcon(me._opts.carIcon);
		me.stop();
    }
    
},
Replay.prototype.getDistance = function(pxA, pxB) {
    return Math.sqrt(Math.pow(pxA.x - pxB.x, 2) + Math.pow(pxA.y - pxB.y, 2));
},
Replay.prototype.moveTo = function(index){
	var me = this;
	if(me._currIndex <= index){
		for(; me._currIndex <= index;)
		{
			if(me._points[me._currIndex].getMap() == null){
				me._map.addOverlay(me._points[me._currIndex]);
			}
			me._points[me._currIndex].show();
			me._lines[me._currIndex - 1] && me._lines[me._currIndex - 1].show();
			if(me._currIndex == index && index == me._points.length - 1){
				break;
			}
			me._currIndex++;
		}
	}
	else{	
		if(me._currIndex > me._points.length - 1) {
			me._currIndex = me._points.length - 1;
		}
		for(; me._currIndex > index;)
		{
			me._points[me._currIndex].hide();
			me._lines[me._currIndex - 1] && me._lines[me._currIndex - 1].hide();
			if(me._currIndex == index){
				break;
			}
			me._currIndex--;
		}
	}
	me._car.setPosition(me._path[me._currIndex]);
	me._car.setRotation(me._points[me._currIndex].getRotation());
	me.pause();
}