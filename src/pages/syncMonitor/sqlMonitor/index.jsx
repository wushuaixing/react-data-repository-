/** sync monitor * */
import React from 'react';
import { message, Radio, Row, Col, Spin } from "antd";
import { sqlMonitorText, sqlMonitorChart } from "@api";
import { AxisStyle } from '@/static/axisStyle';
import echarts from 'echarts/lib/echarts';
import { BreadCrumb } from '@commonComponents'
// 引入柱状图
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const xAxisStyle = AxisStyle[0];
const yAxisStyle = AxisStyle[1];

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeType: 0,
			auctionNumAll: 0,
			detailNumAll: 0,
			extractNumAll: 0,
			auctionNumLast: 0,
			extractNumLast: 0,
			aucToExRate: 0,
			exToDetailRate: 0,
			lastAucToExRate: 0,
			aucToExDiff: 0,
			exToDeDiff: 0,
			lastAuToExDiff: 0,
			loading: false,
		};
	}

	componentDidMount() {
		this.setState({
			loading: true,
		});
		const { timeType } = this.state;
		this.changeDayMonth(timeType);
		sqlMonitorText().then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				const { auctionNumAll, detailNumAll, extractNumAll } = res.data.data.numberAllDetail;
				const { auctionNumIncrement, extractNumIncrement } = res.data.data.numberIncrementDetail.auctionNumIncrement;
				const { auction2ExtractNumAllSyncRate, extract2DetailAllSyncRate,
					auction2ExtractNumIncrementSyncRate } = res.data.data.numberSyncRateDetail;
				const { auction2ExtractNumAllDiff, extract2DetailNumAllDiff,
					auction2ExtractNumIncrementDiff } = res.data.data.numberDifferenceDetail;
				this.setState({
					auctionNumAll: auctionNumAll,
					detailNumAll: detailNumAll,
					extractNumAll: extractNumAll,
					auctionNumLast: auctionNumIncrement,
					extractNumLast: extractNumIncrement,
					aucToExRate: auction2ExtractNumAllSyncRate,
					exToDetailRate: extract2DetailAllSyncRate,
					lastAucToExRate: auction2ExtractNumIncrementSyncRate,
					aucToExDiff: auction2ExtractNumAllDiff,
					exToDeDiff: extract2DetailNumAllDiff,
					lastAuToExDiff: auction2ExtractNumIncrementDiff,
				});
			} else {
				message.error(res.data.message);
			}
		});
	}

	onChangeRadio = (e) => {
		let type = parseInt(e.target.value);
		this.changeDayMonth(type);
	};

	//sql 切换日/月
	changeDayMonth(type) {
		this.setState({
			loading: true,
			timeType: type,
		});
		sqlMonitorChart(type).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				let data = res.data.data || {};
				this.drawSql(data);
			} else {
				message.error(res.data.message);
			}
		}
		);
	}

	//SQL同步监控
	drawSql = (data) => {
		let sqlLine = echarts.init(document.getElementById('sqlMonitor'));
		let sqlTable = [];
		let auctionTable = data.auctionNumIncrementList || [];
		let extractTable = data.extractNumIncrementList || [];
		let dateTable = data.date || [];
		for (let n = 0; n < dateTable.length; n += 1) {
			sqlTable.push([
				dateTable[n],
				auctionTable[n],
				extractTable[n],
			])
		}
		sqlTable.reverse();
		sqlLine.setOption({
			color: ['#FD9C26FF', '#1CAFE0FF', '#F03733FF'],
			title: {
				text: '各表数据增量折线图',
				textStyle: {
					fontWeight: 'bold',
					fontSize: 14,
					color: '#293038',
				},
			},
			legend: {
				left: 20,
				top: 30,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			dataset: {
				source: sqlTable
			},
			xAxis: xAxisStyle,
			yAxis: yAxisStyle,
			series: [
				{ type: 'line', smooth: true, name: "auction表增量" },
				{ type: 'line', smooth: true, name: "extract表增量" },
				{ type: 'line', smooth: true, name: "detail表增量", },
			]
		});

	};

	render() {
		const { timeType, auctionNumAll, detailNumAll, extractNumAll, auctionNumLast, extractNumLast,
			aucToExRate, exToDetailRate, lastAucToExRate, aucToExDiff, exToDeDiff, loading, } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div>
					<BreadCrumb texts={['SQL同步监控']}></BreadCrumb>
					<div className="yc-detail-amount">
						<Row style={{ height: 60, marginTop: 20, marginLeft: 20, marginBottom: 0 }}>
							<Col span={6}>
								<p style={{ color: '#808387' }}>auction表数据总量</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{auctionNumAll ? auctionNumAll : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
							<Col span={3}>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: 4 }}>{aucToExRate} %</div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginTop: 0 }}> - - - - -> </div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginBottom: 0 }}> {`${'<- - - - -'}`} </div>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: -10 }}>少 {aucToExDiff} 条</div>
							</Col>
							<Col span={6}>
								<p>extract表数据总量</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{extractNumAll ? extractNumAll : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
							<Col span={3}>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: 4 }}>{exToDetailRate} %</div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginTop: 0 }}> - - - - -> </div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginBottom: 0 }}> {`${'<- - - - -'}`} </div>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: -10 }}>少 {exToDeDiff} 条</div>
							</Col>
							<Col span={6}>
								<p>detail表数据总量</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{detailNumAll ? detailNumAll : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
						</Row>
						<p style={{ color: '#293038', fontWeight: 800, marginLeft: 20 }}>昨日增量</p>
						<Row style={{ height: 60, marginLeft: 20, marginBottom: 0, }}>
							<Col span={6}>
								<p style={{ color: '#808387' }}>auction表</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{auctionNumLast ? auctionNumLast : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
							<Col span={3}>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: 4 }}>{lastAucToExRate} %</div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginTop: 0 }}> - - - - -> </div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginBottom: 0 }}> {`${'<- - - - -'}`} </div>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: -10 }}>少 {aucToExDiff} 条</div>
							</Col>
							<Col span={6}>
								<p>extract表</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{extractNumLast ? extractNumLast : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
							<Col span={3}>
								<div style={{ color: '#293038', fontSize: 10, marginLeft: 4 }}>0%</div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginTop: 0 }}> - - - - -> </div>
								<div style={{ color: '#0099CC', fontWeight: 800, marginBottom: 0 }}> {`${'<- - - - -'}`} </div>
							</Col>
							<Col span={6}>
								<p>detail表</p>
								<p style={{ fontSize: 20, color: '#293038', fontWeight: 800 }}>
									{extractNumLast ? extractNumLast : '--'}
									<span style={{ marginLeft: 2, fontSize: 14 }}>条</span>
								</p>
							</Col>
						</Row>
					</div>
					<div style={{ marginRight: 20, textAlign: 'right', }}>
						<Radio.Group
							onChange={this.onChangeRadio}
							value={timeType}
						>
							<Radio.Button value={0} style={{ width: 54, height: 28 }}>
								<span>日</span>
							</Radio.Button>
							<Radio.Button value={1} style={{ width: 54, height: 28 }}>
								<span>月</span>
							</Radio.Button>
						</Radio.Group>
					</div>
					<div className="yc-sql-line" id="sqlMonitor"
						style={{ marginLeft: 20, marginBottom: 0, marginTop: 0 }}
					/>

				</div>
			</Spin>

		)
	}

}
export default Index;
