/** 5.1 checkTable(资产结构化检查-6个tab栏下的表格-检察人员)

全部/未检查/检查无误/检查错误/已修改/待确认 * */
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Tabs, Table, Button } from 'antd';
import { Columns } from "../../../static/columns";
import createPaginationProps from "../../../utils/pagination";
import { AssetTabTextWithNumber } from '../../../components/common'
const { TabPane } = Tabs;

class TabTable extends React.Component {
	static defaultProps = {
		data: [],
		total: 0,
		waitNum: 0,
		checkErrorNum: 0,
		editNum: 0,
		tabIndex: 0,
		page: 1,
		status: 0,
	}

	//切换Tab
	changeTab = (key) => {
		this.props.onTabs(parseInt(key))
	};

	//换页
	onTablePageChange = (pagination) => {
		this.props.onPage(pagination.current)
	};
	get columnShowTimeType() {
		//console.log(this.props)
		switch (this.props.tabIndex) {
			case 0: case 1: case 5:
				return '结构化时间';
			case 2: case 3:
				return '检查时间'
			case 4:
				return '修改时间'
			default:
				return ''
		}
	}
	get columnShowObject() {
		const showObject = {}
		switch (this.props.tabIndex) {
			case 0: case 1: case 5:
				showObject.title = '结构化时间'; showObject.dataIndex = 'firstStructuredTime'; break;
			case 2: case 3:
				showObject.title = '检查时间'; showObject.dataIndex = 'checkTime'; break;
			case 4:
				showObject.title = '修改时间'; showObject.dataIndex = 'lastStructuredTime'; break;
			default:
				break;
		}
		return showObject
	}

	render() {
		const { data, waitNum, checkErrorNum, editNum, total, page, tabIndex } = this.props;
		const paginationProps = createPaginationProps(page, total)
		const columns = [
			{
				title: this.columnShowObject.title,
                dataIndex: this.columnShowObject.dataIndex,
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
						<Link to={`/index/structureDetail/${record.id}`}>
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
		return (
			<div>
				<Tabs activeKey={tabIndex.toString()} onChange={this.changeTab} animated={false}>
					<TabPane tab="全部" key="0" >
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={"未检查"} key="1">
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={"检查无误"} key="2">
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={<AssetTabTextWithNumber text={"检查错误"} num={checkErrorNum} />}
						key="3">
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={<AssetTabTextWithNumber text={"已修改"} num={editNum} />}
						key="4">
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
							rowKey={record => record.id}
							pagination={paginationProps}
							onChange={this.onTablePageChange}
						/>
					</TabPane>
					<TabPane tab={<AssetTabTextWithNumber text={"待确认"} num={waitNum} />}
						key="5">
						<Table rowClassName="table-list"
							columns={columns}
							dataSource={data}
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
