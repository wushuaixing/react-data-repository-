/** check * */
import React from 'react';
import { withRouter} from "react-router-dom";
import {message} from 'antd';
import {getCheckList,getStructuredPersonnel,adminStructuredList} from "../../server/api";
import SearchForm from "./searchInfo";
import CheckTable from "./checkTable";
import 'antd/dist/antd.css';
import '../style.scss';

let storage = window.localStorage;
const role = storage.userState;
let isCheck=true;
if(role==="管理员"){
	isCheck=false;
}

class  Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page:1,
			total:0,
			currentPage:1,
			tableList:[],
			waitNum:0,
			editNmu:0,
			checkErrorNum:0,
			status:0,
			tabIndex:"0",
			personnelList:[],
			timeType:"结构化时间",
		};
	}

	componentDidMount() {
		const {status}=this.state;
		//详情页跳回路由
		if(this.props.location.state){
			let {statusPath,pagePath,tabPath}=this.props.location.state;
			let _status=parseInt(tabPath);

			const option=this.setTimeType(_status);
			this.setState({
				tabIndex:tabPath,
			});
			let params = {
				status: option.tab,
				num: 10,
				page: pagePath,
				checkType: option.time,
			};
			this.getTableList(params);
			if(!isCheck){
				this.setState({
					status:statusPath,
				})
			}
		}
		else{
			const option=this.setTimeType(status);
			let params = {
				status: option.tab,
				num: 10,
				page: 1,
				checkType:option.time,
			};
			this.getTableList(params);
		}

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
	shouldComponentUpdate () {
		// console.log('shouldComponentUpdate');
		return true;
	}

	componentWillUpdate(){
		// console.log('componentWillUpdate');

	}
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
							page:res.data.data.result.page,
							status:tabStatus,
							waitNum:res.data.data.waitConfirmedNum,
							checkErrorNum:res.data.data.checkErrorNum,
							editNum:res.data.data.alreadyEditedNum,
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
							page:res.data.data.result.page,
						});

					}
				} else {
					message.error(res.data.message);
				}
			});
		}

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

	//切换Tab
	changeTab=(key)=>{
		const _key=parseInt(key);
		const option=this.setTimeType(_key);
		console.log(option.tab);
		let params = {
			status: option.tab,
			num:10,
			page: 1,
			checkType:option.time,
		};
		this.getTableList(params);
		const _tabIndex=_key.toString();
		this.setState({
			tabIndex:_tabIndex,
		});
		if(!isCheck){
			this.setState({
				status:_key,
			})
		}
	};

	//换页
	onTablePageChange=(num)=> {
		const {tabIndex} = this.state;
		const _tabIndex=parseInt(tabIndex);
		const option = this.setTimeType(_tabIndex);
		let params = {
			status: option.tab,
			num: 10,
			page: num,
			checkType: option.time,
		};

		this.getTableList(params);
	};

	render() {
		const {tableList,waitNum,checkErrorNum,editNum,timeType,total,page,status,tabIndex}=this.state;
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
							<CheckTable page={page}
													status={status}
													tabIndex={tabIndex}
													total={total}
													waitNum={waitNum}
													checkErrorNum={checkErrorNum}
													editNum={editNum}
													data={tableList}
													isCheck={isCheck}
													onPage={this.onTablePageChange.bind(this)}
													onTabs={this.changeTab.bind(this)}
							/>
					</div>
				</div>
			</div>

		);
	}
}
export default withRouter(Check);
