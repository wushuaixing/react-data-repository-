/** sync monitor * */
import React from 'react';
import {message,Row, Col} from "antd";
import {sqlMonitorText,ruleMonitor} from "../../../server/api";
import {AxisStyle} from '../../../static/axisStyle';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const xAxisStyle=AxisStyle[0];

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			structureQueue:0,
			notFitStructure:0,
			structureRate:0,
			ruleDiff:0,
			extractNumLast:0,
		};
	}

	componentDidMount() {
		ruleMonitor().then(res=>{
			if (res.data.code === 200) {
				const {detailNumEnterStructureQueue,detailNumNotEnterStructureQueue,structureSyncRate
					,ruleSyncNumDiff}=res.data.data;
				this.setState({
					structureQueue:detailNumEnterStructureQueue,
					notFitStructure:detailNumNotEnterStructureQueue,
					structureRate:structureSyncRate,
					ruleDiff:ruleSyncNumDiff,
				});
				this.drawRule(res.data.data.everydaySyncRateDetails);

			}else {
				message.error(res.data.message);
			}
		});
		sqlMonitorText().then(res=>{
			if (res.data.code === 200) {
				const {extractNumIncrement}=res.data.data.numberIncrementDetail.auctionNumIncrement;
				this.setState({
					extractNumLast:extractNumIncrement,
				});
			}else {
				message.error(res.data.message);
			}
		});

	}

	//规则正常度监控
	drawRule=(data)=>{
		//console.log(data);
		// 均值  昨日数据转化率
		let structureRate =[];
		for(let key in data){
			meanValue=parseInt(data[key].meanValue);
			structureRate.push([
				data[key].everyDate,
				data[key].everydaySyncRate,
			]);
		}
		structureRate.reverse();
		let ruleLine = echarts.init(document.getElementById('ruleMonitor'));
		ruleLine.setOption({
			title : {
				text: '数据结构化转化率',
				textStyle:{
					fontWeight:'bold',
					fontSize: 14,
				},
			},
			tooltip: {
				trigger: 'axis',
			},
			legend: {
				show: false,
			},
			xAxis: xAxisStyle,
			yAxis: {
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
				axisLine: {
					lineStyle:{
						color:'#E2E4E9'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#293038'
					},
					formatter: '{value} %'
				},
				axisTick: {
					show: false
				},
			},

			series: [
				{
					name:'数据结构化转化率',
					type:'line',
					data:structureRate,
					markLine: {
						data:
							[{
								yAxis:meanValue,
								x:'10%'
							}]
					}
				},

			]
		});
	};


	render() {
		const {structureQueue,notFitStructure,ruleDiff,extractNumLast}=this.state;
		return (
			<div>
				<div className="yc-detail-title" >
					<div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>规则正常度监控</div>
				</div>
				<div className="yc-detail-amount">
					<div>
						<p style={{color:'#293038',fontWeight:800,marginLeft:20,marginTop:10}}>昨日数据情况</p>
						<Row style={{height:40,marginLeft:20}}>
							<Col span={7}>
								<p style={{color:'#808387'}}>实际进入结构化队列数量</p>
								<p style={{fontSize:20,color:'#293038',fontWeight:800}}>
									{structureQueue}
									<span style={{marginLeft:2,fontSize:14}}>条</span>
								</p>
							</Col>
							<Col span={1}>
								<div style={{color:'#0099CC',fontWeight:800,marginTop:0}}> + </div>
							</Col>
							<Col span={6}>
								<p>不符合结构化条件数量</p>
								<p style={{fontSize:20,color:'#293038',fontWeight:800}}>
									{notFitStructure}
									<span style={{marginLeft:2,fontSize:14}}>条</span>
								</p>
							</Col>
							<Col span={4}>
								<div style={{color:'#293038',fontSize:10,marginLeft:10}}>少 {ruleDiff} 条</div>
								<div style={{color:'#0099CC',fontWeight:800,marginLeft:10}}> - - - - -> </div>
							</Col>
							<Col span={6}>
								<p>detail表数据增量</p>
								<p style={{fontSize:20,color:'#293038',fontWeight:800}}>
									{extractNumLast}
									<span style={{marginLeft:2,fontSize:14}}>条</span>
								</p>
							</Col>
						</Row>
					</div>
					<div>
						<div style={{color:'#293038',fontWeight:800,marginTop:0,marginLeft:20}}>昨日数据结构化转化率</div>
						<Row style={{height:40,marginLeft:20,marginTop:10,marginBottom:10}}>
							<Col span={7}>
								<p style={{color:'#808387'}}>detail表数据增量</p>
								<p style={{fontSize:20,color:'#293038',fontWeight:800}}>
									{extractNumLast}
									<span style={{marginLeft:2,fontSize:14}}>条</span>
								</p>
							</Col>
							<Col span={3}>
								<div style={{color:'#293038',fontSize:10,marginLeft:4}}>{structureQueue} %</div>
								<div style={{color:'#0099CC',fontWeight:800,marginTop:0}}> - - - - -> </div>
							</Col>
							<Col span={6}>
								<p>实际队列数量</p>
								<p style={{fontSize:20,color:'#293038',fontWeight:800}}>
									{structureQueue}
									<span style={{marginLeft:2,fontSize:14}}>条</span>
								</p>
							</Col>
						</Row>
					</div>
				</div>
				<div className="yc-rule-line"
						 id="ruleMonitor"
						 style={{marginLeft:20,marginTop:20}}
				/>

			</div>


		)
	}

}
export default Index;
