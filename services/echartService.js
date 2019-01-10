App.factory('echartService',function(){// 工厂方式services服务
	
	function notNull(data){
		if(data!=""&&data!=null&&data!=undefined){
			return true;
		}else{
			return false;
		}
	}
	
    var getOption=function(m,data){
    		if(m=="pie"){
				var optionPie= {
			  			backgroundColor: 'rgba(240,248,250,0)',
			  			color:["#4F81BD","#C0504D","#9BBB59","#8064A2"],
					    title : {
					    	text: data.titel||'故障车辆数量',
					        x:'center',
					        y:"3px",
					        textStyle: {
					            color: '#2e93fb',// 图例文字颜色
					            fontSize:16
					        }
					    },
					    grid: {
					    	x:80,
							y: 40,
							y2: 60,
							x2: 100,
						},
					    tooltip : {
	//				        trigger: 'axis',
					        showDelay: 20, 
					        backgroundColor: '#1791f1',
					        position:function(p){
					         	return [p[0]+10,p[1]-10];
					        },
					        formatter:"{c}"
					    },
					    legend: {
					        orient: 'vertical',
							x: '120px',
							y: '34px',
					        data: data.legend||"",
					        itemWidth: 25,             // 图例图形宽度
	        				itemHeight: 14,
	        				textStyle: {
					            color: '#fff'          // 图例文字颜色
					        }
					    },
					    series : [
					        {
					            name: data.titel||'运营成本',
					            type: 'pie',
					            radius : data.radius||'60%',
					            center: data.center||['24%', '55%'],
					            data:data.Capacity_Data  ||"" ,
					            itemStyle: {
					            	normal: {
						                borderColor: '#fff',
						                borderWidth: 1,
						                label: {
						                    show:data.labelShow || false,
						                    position: 'outside',
	//					                    formatter:"{a}-{b}-{c}-{d}",
	//					                    formatter:"{c}",
											formatter:function(params){
												return Number(params.percent).toFixed(0)+"%";
											}
						                },
						                labelLine: {
						                    show: data.labelLineshow||false,
						                    length: 20,
						                    lineStyle: {
						                        width: 1,
						                        type: 'solid'
						                    }
						                }
						            },
					                emphasis: {
					                    shadowBlur: 20,
					                    shadowOffsetX: 0,
					                    shadowColor: 'rgba(0, 0, 0, 0.5)',
					                    borderColor: 'white',
				                		borderWidth: 1,
					                }
					            },
	
					        }
					    ]
			};
				
			return optionPie;
			
		}
		if(m=="zhe"){
				if(data==undefined){
					return "";
				}
				if(notNull(data.Capacity_Data)){
						var seriesArr=[];
						angular.forEach(data.Capacity_Data,function(datat,index,Array){
								var json={};
								json.name=data.legend[index];
								json.type="bar";
								json.data=datat;
								json.barWidth="15";
								seriesArr.push(json);
						});
						
				}
		var optionZhe = {
			  	backgroundColor: 'rgba(40, 71, 101, 0.72)',
			    title : {
			        text: data.titel||'设备故障',
			        x:"center",
			        y:"3px",
			        subtext: '',
			        textStyle:{
			        	color:"#fff",
			        	
			        }
			        
			    },
			    color:['#0f0','#f00', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			    	x: 'right',
					y: 'center',
					orient: 'vertical',
			        data:data.legend==""?['一级故障','二级故障',"三级故障"]:data.legend,
			        textStyle:{
			        	color:"#fff",
			        }
			        
			    },
			    toolbox: {
			        show : false,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    grid: {
			    	x:80,
					y: 40,
					y2: 60,
					x2: 100,
				},
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : ["充电装置","驱动电机","发动机","其他"],
			            axisLabel:{
			            	textStyle:{
			            		color:"#fff",
			            	}
			            },
			            //网格线
				        splitLine:{  
			                            show:false  
			            },
			            axisLine:{
				            lineStyle:{
				                color:"#1284f5"
				            }
				        },
			            
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            axisLabel:{
			            	textStyle:{
			            		color:"#fff",
			            	}
			            },
			            //网格线
				        splitLine:{  
			                            show:false  
			            },
			            axisLine:{
				            lineStyle:{
				                color:"#1284f5"
				            }
				        },
			        }
			    ],
			    series : seriesArr||[
			        {
			            name:'一级故障',
			            type:'bar',
			            data:[2.0, 4, 7, 23],
			            barWidth : 20,
			            label:{
			               normal:{
			                  show: true,
			                   position: 'top',
			//                 formatter: '{c}'
			                   formatter: '{c}'+"次",
			                   textStyle:{
			                   		color:"#0f0"
			                   }
			                 
			               	}
		           		},
			        },
			        {
			            name:'二级故障',
			            type:'bar',
			            barWidth : 20,
			            data:[2, 5, 9, 26],
			            label:{
			               normal:{
			                  show: true,
			                   position: 'top',
			//                 formatter: '{c}'
			                   formatter: '{c}'+"次",
			                   textStyle:{
			                   		color:"#0f0"
			                   }
			                 
			               	}
		           		},
	
			        },
			        {
			            name:'三级故障',
			            type:'bar',
			            barWidth : 20,
			            data:[2, 5, 9, 26],
			            label:{
			               normal:{
			                  show: true,
			                   position: 'top',
			//                 formatter: '{c}'
			                   formatter: '{c}'+"次",
			                   textStyle:{
			                   		color:"#0f0"
			                   }
			                 
			               	}
		           		},
	
			        }
			    ]
			};
			return optionZhe;
		}
    	
    }
	return {
			"getApp":function(m,data){
				var option=getOption(m,data);
				return option;
			}
		};



})