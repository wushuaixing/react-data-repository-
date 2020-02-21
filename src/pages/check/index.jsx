/** check * */
import React from 'react';
import {Link, withRouter} from "react-router-dom";
import {Form, Tabs, Table, message} from 'antd';
import {getCheckList,getStructuredPersonnel,adminStructuredList} from "../../server/api";
import SearchForm from "./searchInfo";
import {Columns} from "../../static/columns";
import 'antd/dist/antd.css';
import '../style.scss';

console.log(Columns);
const { TabPane } = Tabs;
const searchForm = Form.create;
let storage = window.localStorage;
const role = storage.userState;
let isCheck=true;
if(role==="管理员"){
	isCheck=false;
}
const columnsStructure = [
	{
		title: "结构化时间",
		dataIndex: "firstStructuredTime",
	},
	Columns[0],
	Columns[1],
	Columns[2],
	Columns[4],
];
const columnsCheck = [
	{
		title: "检查时间",
		dataIndex: "checkTime",
	},
	Columns[0],
	Columns[1],
	Columns[2],
	Columns[4],
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
	Columns[5],
];
const columnsRevise = [
	{
		title: "修改时间",
		dataIndex: "lastStructuredTime",
	},
	Columns[0],
	Columns[1],
	Columns[2],
	Columns[4],
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
	Columns[5],
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
	Columns[5],
];

class  Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page:1,
			total:0,
			tableList:[],
			waitNum:0,
			editNmu:0,
			checkErrorNum:0,
			status:0,
			personnelList:[],
			timeType:"结构化时间",
		};
	}

	componentDidMount() {
		const {status}=this.state;
		const option=this.setTimeType(status);
		let params = {
			status: option.tab,
			num:10,
			page: 1,
			checkType:option.time,
		};
		this.getTableList(params);

		getStructuredPersonnel("").then(res => {
			if (res.data.code === 200) {
				let id = res.data.data[0]["firstNameRank"];
				let list = [];
				let typeList=[];
				typeList.push({
					id: "",
					array: [
						{
							value: "全部",
							label: "全部"
						},
						{
							value: "已删除",
							label: "已删除"
						},
						{
							value: "自动标注",
							label: "自动标注"
						}
					]
				});

				for (let key = 0; key < res.data.data.length; key++) {
					if (res.data.data[key]["firstNameRank"] === id) {
						list.push({
							value: res.data.data[key]["id"],
							label: res.data.data[key]["name"]
						});
					} else {
						typeList.push({
							id: id,
							array: list
						});
						id = res.data.data[key]["firstNameRank"];
						list = [];
						list.push({
							value: res.data.data[key]["id"],
							label: res.data.data[key]["name"]
						});
					}
				}
				this.setState({
					personnelList:typeList,
				});
			} else {
				message.error(res.data.message);
			}
		});


	};
	//根据status传不同时间类型
	// checkType| 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
	setTimeType=(status)=>{
 	 	let option={};
		 if (status === 0) {
			 if(isCheck) {
				 this.setState({
					 timeType:"结构化时间",
				 });
				 return option = {
					 time: 1,
					 tab: 0,
				 }
			 }else{
				 this.setState({
					 timeType:"抓取时间",
				 });
				 return option = {
					 time: 3,
					 tab: 0,
				 }
			 }
		 } else if (status === 1) {
			 if(isCheck){
				 this.setState({
					 timeType:"结构化时间",
				 });
				 return option={
					 time:1,
					 tab:1,
				 }
			 }else{
				 this.setState({
					 timeType:"抓取时间",
				 });
				 return option = {
					 time: 3,
					 tab: 6,
				 }
			 }
		 } else if (status === 2) {
			 if(isCheck) {
				 this.setState({
					 timeType:"检查时间",
				 });
				 return option = {
					 time: 2,
					 tab: 2,
				 }
			 }else{
				 this.setState({
					 timeType:"结构化时间",
				 });
				 return option={
					 time:1,
					 tab:1,
				 }
			 }
		 } else if (status === 3) {
			 this.setState({
				 timeType:"检查时间",
			 });
			 if(isCheck) {
				 return option = {
					 time: 2,
					 tab: 3,
				 }
			 }else{
				 return option = {
					 time: 2,
					 tab: 2,
				 }
			 }
		 }else if (status === 4) {
			 if(isCheck) {
				 this.setState({
					 timeType:"修改时间",
				 });
				 return option = {
					 time: 0,
					 tab: 4,
				 }
			 }else{
				 this.setState({
					 timeType:"检查时间",
				 });
				 return option = {
					 time: 2,
					 tab: 3,
				 }
			 }
		 }else if (status === 5) {
			 if(isCheck) {
				 this.setState({
					 timeType:"结构化时间",
				 });
				 return option = {
					 time: 1,
					 tab: 5,
				 }
			 }else{
				 this.setState({
					 timeType:"修改时间",
				 });
				 return option = {
					 time: 0,
					 tab: 4,
				 }
			 }
		 }
	 };

	//切换Tab
	changeTab=(key)=>{
		const _key=parseInt(key);
		this.setState({
			status:_key,
		});
		const option=this.setTimeType(_key);
		let params = {
			status: option.tab,
			num:10,
			page: 1,
			checkType:option.time,
		};
		this.getTableList(params);
	};

	//get table dataSource
	getTableList=(params)=>{
		let tabStatus=params.status;
		if(isCheck){
			getCheckList(params).then(res => {
				if (res.data.code === 200) {
					// this.loading = false;
					let data=res.data.data.result || {};
					if(data.list){
						let _list=data.list;
						_list.map((item)=>{
							let _temp=[];
							_temp.push(item.status);
							item.status=_temp;
						});
						this.setState({
							tableList:_list,
							total:res.data.data.result.total,
							status:tabStatus,
							waitNum:res.data.waitConfirmedNum,
						});
					}
					else{
						let _total=0;
						this.setState({
							tableList:[],
							total:_total,
							status:tabStatus,
						});
					}
				} else {
					message.error(res.data.message);
				}
			});
		}else{
			adminStructuredList(params).then(res => {
				// this.loading = false;
				if (res.data.code === 200) {
					if (res.data.data.result) {
						let _list=res.data.data.result.list;
						_list.map((item)=>{
							let _temp=[];
							_temp.push(item.status);
							item.status=_temp;
						});
						this.setState({
							tableList:_list,
							total:res.data.data.result.total,
							checkErrorNum:res.data.data.checkErrorNum,
							editNum:res.data.data.alreadyEditedNum,
						});
					}
				} else {
					message.error(res.data.message);
				}
			});
		}

	};


	//日期转换
	dataFilter=(value)=>{
		let data = new Date(value);
		let year = data.getFullYear();
		let month = data.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		let date = data.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		return year + "-" + month + "-" + date;
	};

	// 搜索框
	handleSearch = data => {
		const {status}=this.state;
		let params=data;
		const option= this.setTimeType(status);
		params.checkType=option.time;
		if(isCheck){
			this.getTableList(params);
		}
		else{
			this.getTableList(params);
		}

	};

	//清空搜索条件
	clearSearch=()=>{
		const {status}=this.state;
		const option=this.setTimeType(status);
		let params = {
			status: option.tab,
			num:10,
			page: 1,
			checkType:option.time,
		};
		this.getTableList(params);
	};

	//换页
	onTablePageChange=(pagination)=>{
		const {status,page}=this.state;
		this.setState({
			page: pagination.current,
		});
		const option=this.setTimeType(status);
		let params = {
			status: option.tab,
			num:10,
			page: page,
			checkType:option.time,
		};
		this.getTableList(params);
	};

	render() {
		const {tableList,waitNum,checkErrorNum,editNum,timeType,total,page,status}=this.state;
		const paginationProps = {
			current: page,
			showQuickJumper:true,
      total: total, // 数据总数
      pageSize: 10, // 每页条数
      showTotal: (() => {
        return `共 ${total} 条`;
      }),
		};
		return(
			<div>
				<div className="yc-detail-title">
					<div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>资产结构化检查</div>
				</div>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<SearchForm  status={status}
												 timeType={timeType}
												 toSearch={this.handleSearch.bind(this)}
												 toClear={this.clearSearch.bind(this)}
						/>
					</div>
					<p className="line"/>
					<div className="yc-tab">
						<Tabs defaultActiveKey="0" onChange={this.changeTab}>
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
											 columns={columnsCheck}
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
				</div>
			</div>

		);
	}
}
export default withRouter(searchForm()(Check));
