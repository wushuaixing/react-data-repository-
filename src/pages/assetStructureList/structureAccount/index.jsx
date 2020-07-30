import React from 'react';
import {Form, Input, Button, DatePicker, Tabs, Table, Spin, message, Badge} from 'antd';
import { Columns } from "@/static/columns";
import createPaginationProps from "@/utils/pagination";
import { structuredList, getNewStructuredData, structuredCheckErrorNum,getAutoBidding } from "@api";
import { withRouter } from "react-router-dom";
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
		structuredCheckErrorNum().then(res => { return res.data.data }).then(res => {
			this.setState({
				buttonDisabled: (!(res.notBidNum === 0 && res.modNum === 0)),
				waitNum: res.modNum
			});
			let key = this.convertIndexToKey(this.state.tabIndex); //将index转换为后端返回对象字段
			let ifDataExist = res[key] > 0;
			if (ifDataExist) {
				return (structuredList(params))
			} else {
				this.setState({
					loading: false,
					total: 0,
					tableList: [],
				});
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
				});
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
		};
		const paramKeys = ['title', 'structuredStartTime', 'structuredEndTime'];
		const formParams = this.props.form.getFieldsValue(paramKeys);
		Object.keys(formParams).forEach((key) => {
			if (formParams[key] !== null && formParams[key] !== '' && formParams[key] !== undefined) {
				//如果是日期 把Moment处理掉
				params[key] = (key.indexOf('Time') >= 0) ? dateUtils.formatMomentToStandardDate(formParams[key]) : formParams[key]
			}
		});
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
		this.props.form.resetFields();
		this.setState({
			tabIndex: parseInt(key),
			page:1
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
		const params = this.getParamsByTabIndex();
		this.setState({
			page:1,
			searchTitle: params.title
		},()=>{
			this.getApi(Object.assign(params,{page:1}))
		})
	};

	//清空搜索条件 改完
	clearSearch = () => {
		this.props.form.resetFields();
		this.getApi(this.getParamsByTabIndex())
	};
	// 获取新数据
	getNewData() {
		this.setState({ loading: true, });
		getNewStructuredData().then(() => {
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

	disabledStartDate = startValue => {
		const { getFieldValue } = this.props.form;
		const endValue = getFieldValue('structuredEndTime');
		if (!startValue || !endValue) return false;
		const _startValue= new Date(startValue.valueOf()).setHours(0,0,0,0);
		return _startValue > endValue.valueOf();
	};

	disabledEndDate = endValue => {
		const { getFieldValue } = this.props.form;
		const startValue = getFieldValue('structuredStartTime');
		if (!endValue || !startValue) return false;
		return endValue.valueOf() <= startValue.valueOf();
	};

	checkIsAutoMarked(record) {
		getAutoBidding(record.id).then((res)=>{
			if(res.data.code===200){
				if(!res.data.data){
					//未被自动标注
					this.props.history.push(`/index/structureDetail/${record.status}/${record.id}`)
				}else{
					message.warning('数据已被自动标注,2s后为您刷新界面',2,()=>window.location.reload());
				}
			}else{
				Promise.reject('接口错误')
			}
		}).catch(err=>{
			this.setState({
				loading:false
			},()=>{
				message.error(err)
			})
		})
	}

	// 获取结构化状态
	getStatusBadge = status =>{
		let option ={ status:'default', text:'待标记' };
		if(status===1) option ={ status:'success', text:'已标记' };
		if(status===2) option ={ status:'error', text:'检查有误' };
		return option;
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, waitNum, page, tabIndex, loading } = this.state;
		const columns = [
			Columns[4],
			{
				title: "结构化状态",
				dataIndex: "status",
				width: 285,
				render: (status) => <Badge {...this.getStatusBadge(status)} />,
			},
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) =><Button onClick={this.checkIsAutoMarked.bind(this,record)}>{tabIndex === 0 ? '标注' : '修改标注'}</Button>,
			},
		];
		if (tabIndex !== 0) {
			columns.unshift({
				title: "结构化时间",
				dataIndex: "firstExtractTime",
			})
		}
		const paginationProps = createPaginationProps(page, total);
		return (
			<div className="yc-content-container">
				<BreadCrumb
					texts={['资产结构化']}
					breadButtonText={'获取新数据'}
					handleClick={this.getNewData.bind(this)}
					disabled={this.state.loading || this.state.buttonDisabled}
				/>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form">
							<Form.Item label="标题">
								{getFieldDecorator('title', { initialValue: '' })(
									<Input type="text" size='default' style={{ width: 400 }} placeholder="拍卖信息标题" autoComplete='off' />)}
							</Form.Item>
							{
								tabIndex !== 0 && [
									<Form.Item label="结构化时间" key='startTime'>
										{getFieldDecorator('structuredStartTime', { initialValue: null })(
											<DatePicker placeholder="开始时间" disabledDate={this.disabledStartDate} style={{ width: 120 }} />)}
									</Form.Item>,
									<Form.Item label="至" key='endTime'>
										{getFieldDecorator('structuredEndTime', { initialValue: null })(
											<DatePicker placeholder="结束时间" disabledDate={this.disabledEndDate} style={{ width: 120 }}	/>)}
									</Form.Item>
								]
							}
							<Form.Item>
								<SearchAndClearButtonGroup handleClearSearch={this.clearSearch}/>
							</Form.Item>
						</Form>
					</div>
					<div className="yc-tab">
						<Spin tip="Loading..." spinning={loading}>
							<Tabs activeKey={tabIndex.toString()} onChange={this.changeTab} animated={false}>
								<TabPane tab="待标记" key="0">
									<Table
										rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
								<TabPane tab="已标记" key="1">
									<Table
										rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
								<TabPane tab={<AssetTabTextWithNumber num={waitNum} text={'待修改'} />} key="2">
									<Table
										rowClassName="table-list"
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
