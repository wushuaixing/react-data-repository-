/** check * */
import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {Tabs, Table, Button} from 'antd';
import {Columns} from "../../../static/columns";
import 'antd/dist/antd.css';
import '../../style.scss';

const { TabPane } = Tabs;
let storage = window.localStorage;
const role = storage.userState;
let isCheck=true;
if(role==="管理员"){
	isCheck=false;
}


class  CheckTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage:1,
			tableList:[],
			isCheck:true,
			total:0,
			waitNum:0,
			checkErrorNum:0,
			editNum:0,
			tabIndex:"0",
		};
	}

	componentWillReceiveProps(nextProps){
		const {data,page,isCheck,total,waitNum,checkErrorNum,editNum,tabIndex,status}=nextProps;
		// console.log(nextProps,'next');
		console.log(tabIndex,'tabIndextabIndextabIndex');
		this.setState({
			tableList:data,
			currentPage:page,
			isCheck:isCheck,
			total:total,
			waitNum:waitNum,
			checkErrorNum:checkErrorNum,
			editNum:editNum,
			tabIndex:tabIndex,
			status:status,
		});
	}

	//切换Tab
	changeTab=(key)=>{
		const _key=parseInt(key);
		this.props.onTabs(_key)
	};

	//换页
	onTablePageChange=(pagination)=>{
		this.props.onPage(pagination.current)
	};

	render() {
		const {tableList,waitNum,checkErrorNum,editNum,total,currentPage,isCheck,tabIndex,status}=this.state;
		// console.log(currentPage,typeof(currentPage));
		const paginationProps = {
			current: currentPage,
			showQuickJumper:true,
      total: total, // 数据总数
      pageSize: 10, // 每页条数
      showTotal: (() => {
        return `共 ${total} 条`;
      }),
		};
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
				<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
						{(record.status[0]===2 || record.status[0]===3 ||record.status[0]===4)
						&& record.structPersonnelEnable
						&& record.structPersonnel !== '自动标注'
						&& <Button style={{fontSize:12}} >修改检查</Button>}
					{(!record.structPersonnelEnable
						|| record.structPersonnel === '自动标注')
					&& <Button style={{fontSize:12}}>修改标注</Button>}
					{record.status[0]===1
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}}>检查</Button>}
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
				<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
						{(record.status[0]===2 || record.status[0]===3 ||record.status[0]===4)
						&& record.structPersonnelEnable
						&& record.structPersonnel !== '自动标注'
						&& <Button style={{fontSize:12}} >修改检查</Button>}
					{(!record.structPersonnelEnable
						|| record.structPersonnel === '自动标注')
					&& <Button style={{fontSize:12}}>修改标注</Button>}
					{record.status[0]===1
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}}>检查</Button>}
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
				<Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
						{(record.status[0]===2 || record.status[0]===3 ||record.status[0]===4)
						&& record.structPersonnelEnable
						&& record.structPersonnel !== '自动标注'
						&& <Button style={{fontSize:12}} >修改检查</Button>}
					{(!record.structPersonnelEnable
						|| record.structPersonnel === '自动标注')
					&& <Button style={{fontSize:12}}>修改标注</Button>}
					{record.status[0]===1
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}}>检查</Button>}
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
				<Link to={`/index/${record.id}/${record.status}/${currentPage}`}>
						<Button style={{fontSize:12}}>查看</Button>
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
						<Button style={{fontSize:12}}>查看</Button>
				</Link>
      </span>
				),
			}
		];
		const columnsReviseAdmin= [
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
						<Button style={{fontSize:12}}>查看</Button>
				</Link>
      </span>
				),
			}
		];
		return(
					<div>
						<Tabs activeKey={tabIndex} onChange={this.changeTab} >
							<TabPane tab="全部" key="0" >
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsStructure : columnsAdmin}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id}
											 pagination={paginationProps}
											 onChange={this.onTablePageChange}
								/>

							</TabPane>
							<TabPane tab={isCheck ? "未检查" : "未标记" } key="1">
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsStructure : columnsAdmin}
											 dataSource={tableList}
											 style={{margin:10,}}
											 rowKey={record => record.id}
											 pagination={paginationProps}
											 onChange={this.onTablePageChange}
								/>

							</TabPane>
							<TabPane tab={isCheck ? "检查无误" : "未检查" } key="2">
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsCheck: columnsCheckAdmin}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id}
											 pagination={paginationProps}
											 onChange={this.onTablePageChange}
								/>
							</TabPane>
							<TabPane tab={isCheck ? "检查错误" : "检查无误" } key="3">
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsCheck : columnsCheckAdmin}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id}
											 pagination={paginationProps}
											 onChange={this.onTablePageChange}
								/>
							</TabPane>
							<TabPane tab={isCheck
														?
														"已修改"
														:
														<span>检查错误<span style={{color:'red',marginLeft:2}}>({checkErrorNum})</span></span>}
											 key="4">
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsRevise : columnsCheckAdmin}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id}
											 pagination={paginationProps}
											 onChange={this.onTablePageChange}
								/>
							</TabPane>
							<TabPane tab={isCheck ? <span>待确认<span style={{color:'red',marginLeft:2}}>({waitNum})</span></span>
														:<span>已修改<span style={{color:'red',marginLeft:2}}>({editNum})</span></span>
														}
											 key="5">
								<Table rowClassName="table-list"
											 columns={isCheck ? columnsStructure : columnsReviseAdmin}
											 dataSource={tableList}
											 style={{margin:10}}
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
export default withRouter(CheckTable);
