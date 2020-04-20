/** admin * */
import React from 'react';
import { Form, Input, Button, DatePicker, Tabs, Table, message, Spin } from 'antd';
import { Columns } from "../../../static/columns";
import { filters } from "../../../utils/common";
import createPaginationProps from "../../../utils/pagination";
import { structuredList,getNewStructuredData,structuredCheckErrorNum } from "../../../server/api";
import { Link, withRouter } from "react-router-dom";
import { BreadCrumb } from '../../../components/common'

// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

const searchForm = Form.create;
function AssetStructureTabTable(props) {
	return (
		<Table rowClassName="table-list"
			columns={props.columnsRevise}
			dataSource={props.tableList}
			rowKey={record => record.id}
			onChange={props.onChangePage}
			pagination={props.paginationProps}
		/>
	)
}


class Asset extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page: 1,
			total: '',
			tableList: [],  //表格数据
			waitNum: 0,   //待修改tab 后边的红色数字
			status: '',  //所处statusTab 0.待标记 1.已标记 2.待修改
			loading: false,
		};
	}

	componentDidMount() {
		//详情页跳回路由
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
			this.getTableList(0, 1);
		}
		this.getWaitNum();

	};
	getApi = (params) => {
		this.setState({
			loading: true,
		});
		structuredList(params).then((res) => {
			if (res.data.code === 200) {
				this.setState({
					loading: false,
				});
				let _list = res.data.data;

				//这里还得改  map函数不应该用这   暂时写个返回值
				_list.map(function (item) {
					let _temp = [];
					_temp.push(item.status);
					item.status = _temp;
					return null;
				});
				console.log(params)
				this.setState({
					tableList: _list,
					total: res.data.total,
					status: params.approveStatus,
				});
				if (params.approveStatus === 2) {
					this.setState({
						waitNum: res.data.total,
					});
				}
				return;
			} else {
				message.error(res.data.message);
				return;
			}
		});
	};

	//get table dataSource
	getTableList = (approveStatus, page) => {
		let params = {
			approveStatus: approveStatus,
			page: page,
		};
		let _index = approveStatus.toString();
		this.setState({
			tabIndex: _index,
			page: page,
		});
		this.getApi(params);
	};

	//切换Tab
	changeTab = (key) => {
		// approveStatus| 状态 0未标记 1已标记 2待修改
		if (key === "0") {
			this.getTableList(0, 1);
		} else if (key === "1") {
			this.getTableList(1, 1);
		} else if (key === "2") {
			this.getTableList(2, 1);
		}
	};

	//换页
	onChangePage = (pagination) => {
		const { status } = this.state;
		this.getTableList(status, pagination.current);
	};

	//搜索框
	handleSearch = e => {
		e.preventDefault();
		const { status } = this.state;
		const searchTitle = this.props.form.getFieldValue('title');
		const startTime = this.props.form.getFieldValue('start');
		const endTime = this.props.form.getFieldValue('end');
		let params = {
			approveStatus: '',
			title: '',
			page: 1,
			tabIndex: "0"
		};
		let _params = Object.assign(params, {
			approveStatus: status,
			title: searchTitle,
		});
		if (status !== 0) {
			if (startTime) { _params.structuredStartTime = filters((startTime)) }
			if (endTime) { _params.structuredEndTime = filters((endTime)) }
		}
		this.getApi(_params);
	};

	//清空搜索条件
	clearSearch = () => {
		this.props.form.resetFields();
		const { status } = this.state;
		this.getTableList(status, 1);
	};
	getNewStructureData(){
		this.setState({
			loading: true,
		});
		getNewStructuredData().then((res)=>{
			this.setState({
				loading: false,
			});
		})
	}
	getWaitNum = () => {
		structuredCheckErrorNum().then((res)=>{
			this.setState({
				waitNum:res.data.data
			})
		})
	};
	render() {
		
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, waitNum, page, status, tabIndex, loading } = this.state;
		let timeSearch = false;
		if (status !== 0) { timeSearch = true }
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
		const paginationProps = createPaginationProps(page,total)
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化']} buttonText={'获取新数据'} handleClick={this.getNewStructureData.bind(this)}></BreadCrumb>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{ marginLeft: 10, marginTop: 15 }}>
							<Form.Item label="标题">
								{getFieldDecorator('title', {})
									(<Input
										type="text"
										size='default'
										style={{ width: 240 }}
										placeholder="拍卖信息标题"
									/>)}
							</Form.Item>
							{
								timeSearch &&
								<Form.Item label="结构化时间">
									{getFieldDecorator('start', {})
										(<DatePicker
											placeholder="开始时间"
											style={{ width: 108 }}
										/>)}
								</Form.Item>
							}
							{
								timeSearch &&
								<Form.Item label="至">
									{getFieldDecorator('end', {})
										(<DatePicker
											placeholder="结束时间"
											style={{ width: 108 }}
										/>)}
								</Form.Item>
							}
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ backgroundColor: '#0099CC', marginLeft: 15, fontSize: 12 }}>
									搜索
                    </Button>
								<Button type="default" style={{ marginLeft: 5, fontSize: 12 }} onClick={this.clearSearch}>
									清空搜索条件
                    </Button>
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
								<TabPane tab={<span>待修改<span style={{ color: 'red', marginLeft: 2 }}>({waitNum})</span></span>} key="2">
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
