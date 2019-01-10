//一.饼图eacharts图表
//var myChart = echarts.init(document.getElementById('powerAnalysisMain2'));
	function pieOption(json){
		console.log(json);
		var option = {
				tooltip: {
					show: true, //默认值true，可选为：true（显示） | false（隐藏）
					trigger: 'item',
					formatter: "{b}:{c}({d}%)",
				},
				series: [{
					type: 'pie',
					center: ['48%', '50%'],
					data: [
						{ value: json.batterySum, name: '可充电储能装置故障' },
						{ value: json.engineSum, name: '驱动电机故障' },
						{ value: json.motorSum, name: '发动机故障' },
						{ value: json.otherSum, name: '其他故障' }
					],
					 label: {
                normal: {
                    textStyle: {
                        color: '#2bebed'
                    }
                }
            },

				}],
				color: ['rgb(43,235,237)', 'rgb(3,188,184)', 'rgb(6,131,134)', 'rgb(16,104,116)'],
			}
			return option;
	}
	var json={
		batterySum1:0,
		engineSum1:0,
		motorSum1:0,
		otherSum1:0
	}
	
	
//二.折线图eacharts图表

//1.数据统计，车辆详情——电池极差分析页面(电位极差分析页面);
	function potentialEachartsData(obj){
		var option = {
				//标题
				title: {
					x: 'center',
					y: 'top',
					text: obj.title,
					color: '#ffffff',
					textStyle: {
						fontWeight: 'normal', //标题颜色  
						color: '#ffffff',
						fontSize: '24px'
					}
				},
				//提示框
				tooltip: {
					trigger: 'axis', //类型
					axisPointer: {
						type: 'cross', //鼠标移入手指在哪
						label: {
							backgroundColor: '#283b56' //背景色
						}
					},
					
				},
				//数据
				legend: {
					x: 'center',
					y: '30px',
					data: [{
							name: obj.lower,
							textStyle: {
								fontSize: 12,
								fontWeight: 'bolder',
								color: '#fff'
							},
							icon: 'image://images/img1/potent_icon35x12.png' //格式为'image://+icon文件地址'，其中image::后的//不能省略
						},
						{
							name: obj.Highest,
							textStyle: {
								fontSize: 12,
								fontWeight: 'bolder',
								color: '#fff'
							},
							icon: 'image://images/img1/potent_icon2.png' //格式为'image://+icon文件地址'，其中image::后的//不能省略
						},
						{
							name: '极差',
							textStyle: {
								fontSize: 12,
								fontWeight: 'bolder',
								color: '#fff'
							},
							icon: 'image://images/img1/potent_icon35x13.png' //格式为'image://+icon文件地址'，其中image::后的//不能省略
						}
					]
				},
				//x轴
				xAxis: [{
					splitLine: { show: false }, //去除网格线
					type: 'category',
					boundaryGap: false,
					axisLine: { // 坐标轴线
						show: true, // 默认显示，属性show控制显示与否
						lineStyle: { // 属性lineStyle控制线条样式
							color: '#0a5869',
							width: 2,
							type: 'solid'
						}
					},
					boundaryGap: true,
					axisLabel: {
						textStyle: {
							color: '#fff', //坐标值得具体的颜色
						}
					},
					data: obj.Timedata
				}],
				yAxis: [{
						splitLine: { show: false }, //去除网格线
						type: 'value',
						scale: true,
						name: '差值',
						axisLine: { // 坐标轴线
							show: true, // 默认显示，属性show控制显示与否
							lineStyle: { // 属性lineStyle控制线条样式
								color: '#0a5869',
								width: 2,
								type: 'solid'
							}
						},
						axisTick: { //坐标轴刻度相关设置  
							show: false,
							lineStyle: {
								color: '#FFF'
							}
						},
						'nameGap': 20, //坐标轴名字里坐标系的距离
						'nameTextStyle': {
							ontStyle: 'oblique',
							fontWeight: 100,
							fontSize: 16,
							color:'#fff'
						},
						boundaryGap: [0.2, 0.2],
						axisLabel: {
							
							textStyle: {
								color: '#fff'
							}
						}
					},
					{
						splitLine: { show: false }, //去除网格线
						type: 'value',
						scale: true,
						axisLine: { // 坐标轴线
							show: true, // 默认显示，属性show控制显示与否
							lineStyle: { // 属性lineStyle控制线条样式
								color: '#0a5869',
								width: 2,
								type: 'solid'
							}
						},
						'nameGap': 20, //坐标轴名字里坐标系的距离
						'nameTextStyle': {
							ontStyle: 'oblique',
							fontWeight: 100,
							fontSize: 16,
							color:'#fff'
						},
						name: obj.name,
						axisTick: { //坐标轴刻度相关设置  
							show: false,
							lineStyle: {
								color: '#FFF'
							}
						},
						boundaryGap: [0.2, 0.2],
						axisLabel: {
							textStyle: {
								color: '#fff'
							}
						}
					}
				],
				dataZoom: [
			    {
			    	show:obj.dataZoomFlag,
			        start: 0,
			        end: 10,
			        fillerColor:"rgba(44,238,240,.6)",
			        borderColor:"transparent",
			        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
			        handleSize: '80%',
//			       	 滑块样式设置	
			        handleStyle: {
			            color: '#fff',
			            shadowBlur: 3,
			            shadowColor: 'rgba(0, 0, 0, 1)',
			            shadowOffsetX: 2,
			            shadowOffsetY: 2
			        }
			    }],
				series: [{
						name: obj.lower,
						yAxisIndex: 1,
						symbol: 'triangle', //拐点样式
						symbolSize: 6, //拐点大小
						splitLine: { show: false }, //去除网格线
						type: 'line',
						itemStyle: {
							normal: {
								color: '#ab4e4e',
								lineStyle: {
									color: '#ffff00',
									width: 1, //折线宽
								}
							}
						},
						smooth: true, //这句话是让曲线变圆滑的
						data: obj.lowest
					},
					{
						name: obj.Highest,
						yAxisIndex: 1,
						symbol: 'arrow', //拐点样式
						symbolSize: 6, //拐点大小
						splitLine: { show: false }, //去除网格线
						type: 'line',
						itemStyle: {
							normal: {
								color: '#00ff02',
								lineStyle: {
									color: '#04999b',
									width: 1, //折线宽
								}
							}
						},
						smooth: true, //这句话是让曲线变圆滑的
						data: obj.highest
					},
					{
						name: '极差',
						symbol: 'pin', //拐点样式
						symbolSize: 10, //拐点大小
						splitLine: { show: false }, //去除网格线
						type: 'line',
						itemStyle: {
							normal: {
								color: '#ff76cc',
								lineStyle: {
									color: 'red',
									width: 1, //折线宽
								}
							}
						},

						smooth: true, //这句话是让曲线变圆滑的
						data: obj.range1
					}
				]
			}
			return option;
	}
	
//2.一个折线图使用,适用于弹框样式(故障统计弹框，电耗分析弹框等);
	function powerEachartsdata(obj){
		var option = {
				//提示框
				tooltip: {
					trigger: 'axis', //类型
					axisPointer: {
						type: 'cross', //鼠标移入手指在哪
						label: {
							backgroundColor: '#283b56' //背景色
						}
					},
					formatter: function(datas) {
						var res = datas[0].name + '<br/>',
							val;
						for(var i = 0, length = datas.length; i < length; i++) {
							val = (datas[i].value);
							res +=obj.text1 + val + obj.Company + '<br/>';
						}
						return res;
					}
				},
				grid: { //直角坐标系内绘图网格
					show: false,
					left: "8%", //grid 组件离容器左侧的距离。
					right: "0px",
					bottom: obj.bottom,
					backgroundColor: 'rgba(0,0,0,0)',
				},
				//x轴
				xAxis: [{
						splitLine: { show: false }, //去除网格线
						type: 'category',
						boundaryGap: true,
						axisLine: { // 坐标轴线
							show: true, // 默认显示，属性show控制显示与否
							lineStyle: { // 属性lineStyle控制线条样式
								color: '#04fcff',
								width: 2,
								type: 'solid'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#fff', //坐标值得具体的颜色
							}
						},
						data: obj.xdata
					},

				],
				yAxis: [{
						splitLine: { show: false }, //去除网格线
						//splitArea : {show : true},//保留网格区域
						type: 'value',
						'nameGap': 20, //坐标轴名字里坐标系的距离
						'nameTextStyle': {
							ontStyle: 'oblique',
							fontWeight: 100,
							fontSize: 16,
							color: '#fff'
						},
						'splitNumber': 10,
						'axisLabel': { //字体
							margin: 20,
							textStyle: {
								fontStyle: 'oblique',
								fontWeight: 800,
								fontSize: 18,
							}
						},
						scale: true,
						name: '电耗(w)',
						boundaryGap: [0.2, 0.2],
						axisLine: { // 坐标轴线
							show: true, // 默认显示，属性show控制显示与否
							lineStyle: { // 属性lineStyle控制线条样式
								color: '#04fcff',
								width: 2,
								type: 'solid'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#fff'
							}
						}
					},

				],
				series: [{
					type: 'line',
					itemStyle: {
						normal: {
							color: '#ab4e4e',
							lineStyle: {
								color: '#04fcff',
								width: 1, //折线宽
							}
						}
					},
					smooth: false, //这句话是让曲线变圆滑的
					data: obj.ydata
				}]
			}
			return option;
	}
