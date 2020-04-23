import React from 'react';
import { Form, Input, Button, DatePicker, Tabs, Table, Spin,message } from 'antd';
import { Columns } from "@/static/columns";
import createPaginationProps from "@/utils/pagination";
import { structuredList, getNewStructuredData, structuredCheckErrorNum } from "@api";
import { Link, withRouter } from "react-router-dom";
import { BreadCrumb, SearchAndClearButtonGroup,AssetTabTextWithNumber } from '@commonComponents'
const { TabPane } = Tabs;

const searchForm = Form.create;

class Asset extends React.Component {
	constructor(props) {
		super(props);
		this.ifUpdateWaitNumber = true// 第一次搜索需要额外请求待修改数量接口
		this.storeWaitMarkDataList = []//在没有任何筛选条件 待标记的资产结构化列表数据  当waitNum和此变量同时为0 button变成可以点击
		this.state = {
			page: 1,
			total: 0,
			tableList: [],  //表格数据
			waitNum: 0,   //待修改tab 后边的红色数字
			status: 0,  //所处statusTab 0.待标记 1.已标记 2.待修改  antdesign要求strign 后端接口是int
			loading: false,
			buttonDisabled: true,
		};
	}

	componentDidMount() {
		/* //详情页跳回路由 如果是从待标记这跳回来 那存在刚修改完最后一条数据 所以button要变成能点击样式
		if (this.props.location.state) {
			let { statusPath, pagePath, Id } = this.props.location.state;
			let _status = parseInt(statusPath);
			let _page = parseInt(pagePath);
			if (Id) {
				let _Id = parseInt(Id);
				this.getApi({ _Id });
			}
			this.getTableList(_status, _page);
		}
		else {
			this.getTableList(0);
		} */
		this.getTableList(0)
	};
	getApi = (params) => {
		this.setState({
			loading: true,
		});
		//获取三列数量  如果当列数量》0  调获取数据接口  如果两列数据都为0  按钮改成可点
		structuredCheckErrorNum().then(res => {
			return res.data.data
		}).then(res => {
			this.setState({
				buttonDisabled: (res.notBidNum === 0 && res.modNum === 0) ? false : true,
				waitNum: res.modNum
			})
			let key = this.convertIndexToKey(params.approveStatus) //将index转换为后端返回对象字段
			let ifDataExist = res[key] > 0 ? true : false
			if (ifDataExist) {
				return (structuredList(params))
			} else {
				this.setState({
					loading: false,
					total: 0,
					tableList: [],
					status: params.approveStatus
				})
				return Promise.reject('此tab下无数据');
			}
		}).then((res) => {
			if (res.data.code === 200) {
				this.setState({
					tableList: res.data.data,
					total: res.data.total,
					status: params.approveStatus,
					loading: false
				});
			}else{
				this.setState({
					loading: false
				})
				message.error('后端状态码异常 请检查');
			}
		}).catch(err => {
			console.log(err)
		})


	};

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
	//换页或者切tab 获取表格展示数据  tab值和页数  不用更新待修改数量
	getTableList = (approveStatus = 0, page = 1) => {
		let params = {
			approveStatus, //传Int
			page,
		};
		this.setState({
			tabIndex: approveStatus.toString(),//转字符串
			page,
		});
		this.getApi(params);
	};
	//切换Tab 改完
	changeTab = (key) => {
		// approveStatus| 状态 0未标记 1已标记 2待修改
		this.getTableList(parseInt(key));
	};

	//换页 改完
	onChangePage = (pagination) => {
		const { status } = this.state;
		this.getTableList(status, pagination.current);
	};

	//搜索框 改
	handleSearch = e => {
		e.preventDefault();
		const { status } = this.state;
		let params = {
			approveStatus: status,//所属tab分类
			title: this.props.form.getFieldValue('title'), //搜索关键词
		};
		if (status !== 0) {
			params.structuredStartTime = this.props.form.getFieldValue('start') //设置起始时间  默认值是''
			params.structuredEndTime = this.props.form.getFieldValue('end')
		}
		this.getApi(params)
	};

	//清空搜索条件 改完
	clearSearch = () => {
		this.props.form.resetFields();
		const { status } = this.state;
		this.getTableList(status);
	};
	// 获取新数据 
	getNewData() {
		this.setState({
			loading: true,
		});
		getNewStructuredData().then((res) => {
			this.setState({
				loading: false,
				status: 0
			});
			this.getTableList(0)
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
		const { tableList, total, waitNum, page, status, tabIndex, loading } = this.state;

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
						<Link to={`/index/${record.id}/${record.status}/${page}/${status}`}>
							<Button>
								标注
						</Button>
						</Link>
					</span>
				),
			},

		];
		const columnsRevise = [
			{
				title: "结构化时间",
				dataIndex: "completeTime",
			},
			Columns[4],
			Columns[5],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${page}/${status}`}>
							<Button>
								修改标注
							</Button>
						</Link>
					</span>
				),

			}
		];
		const paginationProps = createPaginationProps(page, total)
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化']} buttonText={'获取新数据'} handleClick={this.getNewData.bind(this)} disabled={this.state.buttonDisabled}></BreadCrumb>
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
								status !== 0 &&
								<Form.Item label="结构化时间">
									{getFieldDecorator('start', { initialValue: null })
										(<DatePicker
											placeholder="开始时间"
											style={{ width: 108 }}
										/>)}
								</Form.Item>
							}
							{
								status !== 0 &&
								<Form.Item label="至">
									{getFieldDecorator('end', { initialValue: null })
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
							<Tabs activeKey={tabIndex} onChange={this.changeTab} animated={false}>
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
										columns={columnsRevise}
										dataSource={tableList}
										rowKey={record => record.id}
										onChange={this.onChangePage}
										pagination={paginationProps}
									/>
								</TabPane>
								<TabPane tab={<AssetTabTextWithNumber num={waitNum} text={'待修改'}/>} key="2">
									<Table rowClassName="table-list"
										columns={columnsRevise}
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
