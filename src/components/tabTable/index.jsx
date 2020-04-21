/** 5.1 checkTable(资产结构化检查-6个tab栏下的表格-检察人员)

全部/未检查/检查无误/检查错误/已修改/待确认 * */
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Tabs, Table, Button } from 'antd';
import { Columns } from "../../static/columns";
import createPaginationProps from "../../utils/pagination";

const { TabPane } = Tabs;

class TabTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 1,
			tableList: [],
			isCheck: true,
			total: 0,
			waitNum: 0,
			checkErrorNum: 0,
			editNum: 0,
			tabIndex: "0",
		};
	}

	componentWillReceiveProps(nextProps) {
		const { data, page, isCheck, total, waitNum, checkErrorNum, editNum, tabIndex, status } = nextProps;
		// console.log(nextProps,'next');
		this.setState({
			tableList: data,
			currentPage: page,
			isCheck: isCheck,
			total: total,
			waitNum: waitNum,
			checkErrorNum: checkErrorNum,
			editNum: editNum,
			tabIndex: tabIndex,
			status: status,
		});
	}

	//切换Tab
	changeTab = (key) => {
		const _key = parseInt(key);
		this.props.onTabs(_key)
	};

	//换页
	onTablePageChange = (pagination) => {
		this.props.onPage(pagination.current)
	};

	render() {
		const { tableList, waitNum, checkErrorNum, editNum, total, currentPage, isCheck, tabIndex, status } = this.state;
		const paginationProps = createPaginationProps(currentPage, total)
		const columnsStructure = [
			{
				title: "结构化时间",
				dataIndex: "firstStructuredTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}/${record.structPersonnelEnable}/${record.structPersonnel}`}>
							{(record.status[0] === 2 || record.status[0] === 3 || record.status[0] === 4)
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }} >修改检查</Button>}
							{(!record.structPersonnelEnable
								|| record.structPersonnel === '自动标注')
								&& <Button style={{ fontSize: 12 }}>修改标注</Button>}
							{record.status[0] === 1
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }}>检查</Button>}
						</Link>
					</span>
				),
			},
		];
		const columnsCheck = [
			{
				title: "检查时间",
				dataIndex: "checkTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}/${record.structPersonnelEnable}/${record.structPersonnel}`}>
							{(record.status[0] === 2 || record.status[0] === 3 || record.status[0] === 4)
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }} >修改检查</Button>}
							{(!record.structPersonnelEnable
								|| record.structPersonnel === '自动标注')
								&& <Button style={{ fontSize: 12 }}>修改标注</Button>}
							{record.status[0] === 1
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }}>检查</Button>}
						</Link>
					</span>
				),
			},
		];
		const columnsRevise = [
			{
				title: "修改时间",
				dataIndex: "lastStructuredTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}/${record.structPersonnelEnable}/${record.structPersonnel}`}>
							{(record.status[0] === 2 || record.status[0] === 3 || record.status[0] === 4)
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }} >修改检查</Button>}
							{(!record.structPersonnelEnable
								|| record.structPersonnel === '自动标注')
								&& <Button style={{ fontSize: 12 }}>修改标注</Button>}
							{record.status[0] === 1
								&& record.structPersonnelEnable
								&& record.structPersonnel !== '自动标注'
								&& <Button style={{ fontSize: 12 }}>检查</Button>}
						</Link>
					</span>
				),
			},
		];
		const columnsAdmin = [
			{
				title: "抓取时间",
				dataIndex: "grabTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			Columns[3],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
							<Button style={{ fontSize: 12 }}>查看</Button>
						</Link>
					</span>
				),
			}
		];
		const columnsCheckAdmin = [
			{
				title: "检查时间",
				dataIndex: "checkTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			Columns[3],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
							<Button style={{ fontSize: 12 }}>查看</Button>
						</Link>
					</span>
				),
			}
		];
		const columnsReviseAdmin = [
			{
				title: "修改时间",
				dataIndex: "lastStructuredTime",
			},
			Columns[0],
			Columns[1],
			Columns[2],
			Columns[3],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
							<Button style={{ fontSize: 12 }}>查看</Button>
						</Link>
					</span>
				),
			}
		];
		return (
			<div>
				<Tabs activeKey={tabIndex} onChange={this.changeTab} animated={false}>
					<TabPane tab="全部" key="0" >
						<Table rowClassName="table-list"
							columns={isCheck ? columnsStructure : columnsAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={isCheck ? "未检查" : "未标记"} key="1">
						<Table rowClassName="table-list"
							columns={isCheck ? columnsStructure : columnsAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={isCheck ? "检查无误" : "未检查"} key="2">
						<Table rowClassName="table-list"
							columns={isCheck ? columnsCheck : columnsCheckAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={isCheck
						?
						<span>检查错误<span style={{ color: 'red', marginLeft: 2 }}>({checkErrorNum})</span></span>
						: "检查无误"
					}
						key="3">
						<Table rowClassName="table-list"
							columns={isCheck ? columnsCheck : columnsCheckAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={isCheck
						?
						<span>已修改<span style={{ color: 'red', marginLeft: 2 }}>({editNum})</span></span>
						:
						<span>检查错误<span style={{ color: 'red', marginLeft: 2 }}>({checkErrorNum})</span></span>}
						key="4">
						<Table rowClassName="table-list"
							columns={isCheck ? columnsRevise : columnsCheckAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={isCheck ? <span>待确认<span style={{ color: 'red', marginLeft: 2 }}>({waitNum})</span></span>
						: <span>已修改<span style={{ color: 'red', marginLeft: 2 }}>({editNum})</span></span>
					}
						key="5">
						<Table rowClassName="table-list"
							columns={isCheck ? columnsStructure : columnsReviseAdmin}
							dataSource={tableList}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
export default withRouter(TabTable);
