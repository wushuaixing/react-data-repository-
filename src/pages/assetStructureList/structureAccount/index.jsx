import React from 'react';
import { Form, Input, Button, DatePicker, Tabs, Table, Spin, message } from 'antd';
import { Columns } from "@/static/columns";
import createPaginationProps from "@/utils/pagination";
import { structuredList, getNewStructuredData, structuredCheckErrorNum } from "@api";
import { Link, withRouter } from "react-router-dom";
import { BreadCrumb, SearchAndClearButtonGroup, AssetTabTextWithNumber } from '@commonComponents'
import { dateUtils } from "@utils/common";

const { TabPane } = Tabs;


const searchForm = Form.create;

class Asset extends React.Component {
	state = {
		page: 1,
		total: 0,
		tableList: [],  //表格数据
		waitNum: 0,   //待修改tab 后边的红色数字
		tabIndex: 0,  //所处statusTab 0.待标记 1.已标记 2.待修改  antdesign要求strign 后端接口是int
		loading: false,
		buttonDisabled: true,
		searchTitle: {}
	};
	componentDidMount() {
		this.getApi(this.getParamsByTabIndex())
	};
	getApi = (params) => {
		this.setState({
			loading: true,
		});
		//console.log(params)
		//获取三列数量  如果当列数量》0  调获取数据接口  如果两列数据都为0  按钮改成可点
		structuredCheckErrorNum().then(res => {
			return res.data.data
		}).then(res => {
			this.setState({
				buttonDisabled: (res.notBidNum === 0 && res.modNum === 0) ? false : true,
				waitNum: res.modNum
			})
			let key = this.convertIndexToKey(this.state.tabIndex) //将index转换为后端返回对象字段
			let ifDataExist = res[key] > 0 ? true : false
			if (ifDataExist) {
				return (structuredList(params))
			} else {
				this.setState({
					loading: false,
					total: 0,
					tableList: [],
				})
				return Promise.reject('此tab下无数据');
			}
		}).then((res) => {
			if (res.data.code === 200) {
				this.setState({
					tableList: res.data.data,
					total: res.data.total,
					loading: false
				});
			} else {
				this.setState({
					loading: false
				})
				message.error('后端状态码异常 请检查');
			}
		}).catch(err => {
			console.log(err)
		})


	};
	getParamsByTabIndex({ tabIndex = this.state.tabIndex, page = this.state.page } = {}) {
		const params = {
			approveStatus: tabIndex,
			page
		}
		const paramKeys = ['title', 'structuredStartTime', 'structuredEndTime']
		const formParams = this.props.form.getFieldsValue(paramKeys)
		Object.keys(formParams).forEach((key) => {
			if (formParams[key] !== null && formParams[key] !== '' && formParams[key] !== undefined) {
				//如果是日期 把Moment处理掉
				params[key] = (key.indexOf('Time') >= 0) ? dateUtils.formatMomentToStandardDate(formParams[key]) : formParams[key]
			}
		})
		return params
	}
	convertIndexToKey(index) {
		switch (index) {
			case 0:
				return 'notBidNum';
			case 1:
				return 'bidNum';
			case 2:
				return 'modNum';
			default:
				return '';
		}
	}
	//切换Tab 改完
	changeTab = (key) => {
		this.setState({
			tabIndex: parseInt(key)
		}, () => {
			this.getApi(this.getParamsByTabIndex())
		})
	};
	//换页 改完
	onChangePage = (pagination) => {
		this.setState({
			page: pagination.current
		}, () => {
			this.getApi(this.getParamsByTabIndex())
		})
	};

	//搜索框 改
	handleSearch = e => {
		e.preventDefault();
		const params = this.getParamsByTabIndex()
		this.getApi(params)
		this.setState({
			searchTitle: params.title
		})
	};

	//清空搜索条件 改完
	clearSearch = () => {
		this.props.form.resetFields();
		this.getApi(this.getParamsByTabIndex())
	};
	// 获取新数据 
	getNewData() {
		this.setState({
			loading: true,
		});
		getNewStructuredData().then((res) => {
			this.setState({
				loading: false,
				tabIndex: 0
			});
			this.getApi(this.getParamsByTabIndex())
		})
	}
	//获取待修改列表数量
	getWaitNum = () => {
		structuredCheckErrorNum().then((res) => {
			this.setState({
				waitNum: res.data.data
			})
		})
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, waitNum, page, tabIndex, loading } = this.state;
		const columns = [
			Columns[4],
			Columns[5],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/structureDetail/${record.status}/${record.id}`}>
							<Button>
								{tabIndex === 0 ? '标注' : '修改标注'}
							</Button>
						</Link>
					</span>
				),
			},
		];
		if (tabIndex !== 0) {
			columns.unshift({
				title: "结构化时间",
				dataIndex: "firstExtractTime",
			})
		}
		const paginationProps = createPaginationProps(page, total)
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化']} breadButtonText={'获取新数据'} handleClick={this.getNewData.bind(this)} disabled={this.state.loading||this.state.buttonDisabled}></BreadCrumb>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{ marginLeft: 10, marginTop: 15 }}>
							<Form.Item label="标题">
								{getFieldDecorator('title', { initialValue: '' })
									(<Input
										type="text"
										size='default'
										style={{ width: 240 }}
										placeholder="拍卖信息标题"
									/>)}
							</Form.Item>
							{
								tabIndex !== 0 &&
								<Form.Item label="结构化时间">
									{getFieldDecorator('structuredStartTime', { initialValue: null })
										(<DatePicker
											placeholder="开始时间"
											style={{ width: 108 }}
										/>)}
								</Form.Item>
							}
							{
								tabIndex !== 0 &&
								<Form.Item label="至">
									{getFieldDecorator('structuredEndTime', { initialValue: null })
										(<DatePicker
											placeholder="结束时间"
											style={{ width: 108 }}
										/>)}
								</Form.Item>
							}
							<Form.Item>
								<SearchAndClearButtonGroup handleClearSearch={this.clearSearch}></SearchAndClearButtonGroup>
							</Form.Item>
						</Form>
					</div>
					<div className="yc-tab">
						<Spin tip="Loading..." spinning={loading}>
							<Tabs activeKey={tabIndex.toString()} onChange={this.changeTab} animated={false}>
								<TabPane tab="待标记" key="0">
									<Table rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
								<TabPane tab="已标记" key="1">
									<Table rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
								<TabPane tab={<AssetTabTextWithNumber num={waitNum} text={'待修改'} />} key="2">
									<Table rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
							</Tabs>
						</Spin>
					</div>
				</div>
			</div>

		);
	}
}
export default withRouter(searchForm()(Asset));
