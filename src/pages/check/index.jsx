/** check * */
import React from 'react';
import {Form, Input, Button, DatePicker, Tabs, Table, Badge, Select, message} from 'antd';
import {getCheckList,getStructuredPersonnel} from "../../server/api";
import {Link, withRouter} from "react-router-dom";

import 'antd/dist/antd.css';
import './style.scss';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const searchForm = Form.create;

const columnsStructure = [
	{
		title: "结构化时间",
		dataIndex: "firstStructuredTime",
	},
	{
		title: "拍卖信息",
		dataIndex: "info",
		render: (text, record)=>(
			<span>
				{
					<div className="info">
						<p className="link" style={{display: 'inline-block'}}>
							{record.info.title}
						</p>
						<div className="info-line">
							<p>处置法院/单位:{record.info.court}</p>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>拍卖时间:{record.info.start}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>拍卖状态:</p>
								<p>{record.info.status}</p>
							</div>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>评估价:</p>
								<p>{record.info.consultPrice}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>起拍价:</p>
								<p>{record.info.initialPrice}</p>
							</div>
						</div>
					</div>
				}
			</span>
		)
	},
	{
		title: "状态",
		dataIndex: "status",
		width: 285,
		render: (status) => (
			<span>
        {status.map((item,index) => {
					let color='default';
					let text='';
					if (item === 1) {
						color = 'default';
						text='未检查';
					}
					else if (item === 2) {
						color = 'success';
						text='检查无误';
					}else if(item === 3) {
						color = 'error';
						text='检查错误';
					}
					else if(item === 4) {
						color = 'success';
						text='已修改';
					}
					else if(item === 5) {
						color = 'error';
						text='待确认';
					}
					return (
						<Badge status={color} text={text} key={index} />
					);
				})}
      </span>
		),
	},
	{
		title: "结构化人员",
		dataIndex: "structPersonnel",
		render: (text, record) => (
			<span>
					{!record.structPersonnelEnable ?
					<p style={{fontSize:12}}>{record.structPersonnel}(已删除)</p>
					:<p style={{fontSize:12}}>{record.structPersonnel}</p>
				}
      </span>
		),
	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: 180,
		render: (text, record) => (
			<span>
				<Link to={`/index/${record.id}/${record.status}`}>
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
	}
];
const columnsCheck = [
	{
		title: "检查时间",
		dataIndex: "checkTime",
	},
	{
		title: "拍卖信息",
		dataIndex: "info",
		render: (text, record)=>(
			<span>
				{
					<div className="info">
						<p className="link">
							{record.info.title}
						</p>
						<div className="info-line">
							<p>处置法院/单位:{record.info.court}</p>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>拍卖时间:{record.info.start}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>拍卖状态:</p>
								<p>{record.info.status}</p>
							</div>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>评估价:</p>
								<p>{record.info.consultPrice}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>起拍价:</p>
								<p>{record.info.initialPrice}</p>
							</div>
						</div>
					</div>
				}
			</span>
		)
	},
	{
		title: "状态",
		dataIndex: "status",
		width: 285,
		render: (status) => (
			<span>
        {status.map((item,index) => {
					let color='default';
					let text='';
					if (item === 1) {
						color = 'default';
						text='未检查';
					}
					else if (item === 2) {
						color = 'success';
						text='检查无误';
					}else if(item === 3) {
						color = 'error';
						text='检查错误';
					}
					else if(item === 4) {
						color = 'success';
						text='已修改';
					}
					else if(item === 5) {
						color = 'error';
						text='待确认';
					}
					return (
						<Badge status={color} text={text} key={index} />
					);
				})}
      </span>
		),
	},
	{
		title: "结构化人员",
		dataIndex: "structPersonnel",
	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: 180,
		render: (text, record) => (
			<span>
				<Link to={`/index/${record.id}/${record.status}`}>
					{(record.status[0]===2 || record.status[0]===3 ||record.status[0]===4)
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}} >修改检查</Button>}
					{!record.structPersonnelEnable
					&& record.structPersonnel === '自动标注'
					&& <Button style={{fontSize:12}}>修改标注</Button>}
					{record.status[0]===1
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}}>检查</Button>}
				</Link>
      </span>
		),
	}
];
const columnsRevise = [
	{
		title: "修改时间",
		dataIndex: "lastStructuredTime",
	},
	{
		title: "拍卖信息",
		dataIndex: "info",
		render: (text, record)=>(
			<span>
				{
					<div className="info">
						<p className="link">
							{record.info.title}
						</p>
						<div className="info-line">
							<p>处置法院/单位:{record.info.court}</p>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>拍卖时间:{record.info.start}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>拍卖状态:</p>
								<p>{record.info.status}</p>
							</div>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>评估价:</p>
								<p>{record.info.consultPrice}</p>
							</div>
							<div className="line-half">
								<p style={{margin: 10}}>起拍价:</p>
								<p>{record.info.initialPrice}</p>
							</div>
						</div>
					</div>
				}
			</span>
		)
	},
	{
		title: "状态",
		dataIndex: "status",
		width: 285,
		render: (status) => (
			<span>
        {status.map((item,index) => {
					let color='default';
					let text='';
					if (item === 1) {
						color = 'default';
						text='未检查';
					}
					else if (item === 2) {
						color = 'success';
						text='检查无误';
					}else if(item === 3) {
						color = 'error';
						text='检查错误';
					}
					else if(item === 4) {
						color = 'success';
						text='已修改';
					}
					else if(item === 5) {
						color = 'error';
						text='待确认';
					}
					return (
						<Badge status={color} text={text} key={index} />
					);
				})}
      </span>
		),
	},
	{
		title: "结构化人员",
		dataIndex: "structPersonnel",
	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: 180,
		render: (text, record) => (
			<span>
				<Link to={`/index/${record.id}/${record.status}`}>
					{(record.status[0]===2 || record.status[0]===3 ||record.status[0]===4)
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}} >修改检查</Button>}
					{!record.structPersonnelEnable
					&& record.structPersonnel === '自动标注'
					&& <Button style={{fontSize:12}}>修改标注</Button>}
					{record.status[0]===1
					&& record.structPersonnelEnable
					&& record.structPersonnel !== '自动标注'
					&& <Button style={{fontSize:12}}>检查</Button>}
				</Link>
      </span>
		),
	}
];


class  Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page:1,
			total:'',
			tableList:[],
			waitNum:0,
			status:'',
			personnelList:[],
			timeType:"结构化时间",
		};
	}

	componentDidMount() {
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
		this.getTableList(0,1,1);
	};

	//get table dataSource
	// checkType| 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
	getTableList=(tabStatus,page,time,ifWait)=>{
		let params = {
			status: tabStatus,
			num: 10,
			page: page,
			checkType:time,
		};
		getCheckList(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				if(res.data.data.result !== null){
					let _list=res.data.data.result.list;
					_list.map((item)=>{
						let _temp=[];
						_temp.push(item.status);
						item.status=_temp;
					});
					this.setState({
						tableList:_list,
						total:res.data.total,
						status:tabStatus,
					});
					if(ifWait){
						this.setState({
							waitNum:res.data.total,
						});
					}
					else{

					}
				}

			} else {
				message.error(res.data.message);
			}
		});
	};

	//切换Tab
	changeTab=(key)=>{
		if (key === "0") {
			this.getTableList(0,1,1);
			this.setState({
				timeType:"结构化时间",
			})
		} else if (key === "1") {
			this.getTableList(1,1,1);
			this.setState({
				timeType:"结构化时间",
			})
		} else if (key === "2") {
			this.getTableList(2,1,2);
			this.setState({
				timeType:"检查时间",
			})
		} else if (key === "3") {
			this.getTableList(3,1,2);
			this.setState({
				timeType:"检查时间",
			})
		}else if (key === "4") {
			this.getTableList(4,1,0);
			this.setState({
				timeType:"修改时间",
			})
		}else if (key === "5") {
			let ifWait=true;
			this.getTableList(5,1,1, ifWait);
			this.setState({
				timeType:"结构化时间",
			})
		}


	};

	//换页
	onChangePage=(page)=>{
		this.setState({
			page: page,
		});
		this.getTableList(this.state.status,page);
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
	handleSearch = e => {
		e.preventDefault();
		const {status}=this.state;
		const searchTitle=this.props.form.getFieldValue('title');
		const startTime=this.dataFilter(this.props.form.getFieldValue('start'));
		const endTime=this.dataFilter(this.props.form.getFieldValue('end'));
		const personnel=this.props.form.getFieldValue('personnel');

		let params={
			approveStatus: status,
			title: searchTitle,
			page: 1,
			num: 10,
			startTime:startTime,
			endTime:endTime,

		};
		if(personnel){
			params.userId=personnel;
		}
		if(status===0 ||status===1 || status===5){
			params.checkType=1;
		}else if(status===2 ||status===3){
			params.checkType=2;
		}else{
			params.checkType=0;
		}

		getCheckList(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				if(res.data.data.result !== null) {
					let _list = res.data.data.result.list;
					_list.map((item) => {
						let _temp = [];
						_temp.push(item.status);
						item.status = _temp;
					});
					this.setState({
						tableList: _list,
						total: res.data.total,
					});
				}
			} else {
				message.error(res.data.message);
			}
		});
	};

	//清空搜索条件
	clearSearch=()=>{
		this.props.form.resetFields();
		const {status}=this.state;
		let checkType;
		if(status===0 ||status===1 || status===5){
			checkType=1;
		}else if(status===2 ||status===3){
			checkType=2;
		}else{
			checkType=0;
		}

		this.getTableList(status,1,checkType);
	};


	render() {
		const { getFieldDecorator } = this.props.form;
		const {tableList,personnelList,waitNum,timeType}=this.state;
		/*const paginationProps = {
			current: page,
			showQuickJumper:true,
			showTotal: total,
		};*/
		return(
			<div>
				<div className="yc-detail-title">
					<div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>资产结构化检查</div>
				</div>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{marginLeft:10,marginTop:15}}>
							<Form.Item label="标题">
								{getFieldDecorator('title', {})
								(<Input
									type="text"
									size='default'
									style={{ width: 240 }}
								/>)}
							</Form.Item>

								<Form.Item label={timeType}>
									{getFieldDecorator('start', {})
									(<DatePicker
										placeholder="开始时间"
										style={{width:108}}
									/>)}
								</Form.Item>
								<Form.Item label="至">
									{getFieldDecorator('end', {})
									(<DatePicker
										placeholder="结束时间"
										style={{width: 108}}
									/>)}
								</Form.Item>
							<Form.Item label="结构化人员">
								{getFieldDecorator('personnel', {
								})(

									<Select style={{width:198,marginLeft:4}} transfer>
										{
											personnelList && personnelList.map((item,index) => {
												return (
													<OptGroup label={item.id} key={index}>
														{ item.array.map((ele,index)=>{
															return(
																<Option
																	value={ele.value}
																	key={index}
																>
																	{ele.label}
																</Option>
															)
														})
														}
													</OptGroup>)
											})
										}
									</Select>
								)}
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15}}>
									搜索
								</Button>
								<Button type="default" style={{marginLeft:5}} onClick={this.clearSearch}>
									清空搜索条件
								</Button>
							</Form.Item>
						</Form>
					</div>
					<p className="line"/>
					<div className="yc-tab">
						<Tabs defaultActiveKey="0" onChange={this.changeTab}>
							<TabPane tab="全部" key="0"  onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsStructure}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id} />
							</TabPane>
							<TabPane tab="未检查" key="1"  onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsStructure}
											 dataSource={tableList}
											 style={{margin:10,}}
											 rowKey={record => record.id} />
							</TabPane>
							<TabPane tab="检查无误" key="2" onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsCheck}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id} />
							</TabPane>
							<TabPane tab="检查错误" key="3" onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsCheck}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id} />
							</TabPane>
							<TabPane tab="已修改" key="4" onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsRevise}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id} />
							</TabPane>
							<TabPane tab={<span>待确认<span style={{color:'red',marginLeft:2}}>({waitNum})</span></span>}
											 key="5" onChange={(page) => this.onChangePage(page)}>
								<Table rowClassName="table-list"
											 columns={columnsStructure}
											 dataSource={tableList}
											 style={{margin:10}}
											 rowKey={record => record.id} />
							</TabPane>
							{/*{tabArray.map((i,index) => (
								<TabPane tab={i} key={index}>

									<Table className="table-list" columns={this.getColumns(i)} dataSource={this.getData(i)} style={{margin:10,}}
												 rowKey={record => record.id} />
									Content of tab {index}
								</TabPane>))}*/}

						</Tabs>
					</div>
				</div>
			</div>

		);
	}
}
export default withRouter(searchForm()(Check));
