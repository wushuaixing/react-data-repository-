/** search **/
import React from 'react';
import {Form, Input, Button, DatePicker, Cascader, Select, message} from 'antd';
import {getStructuredPersonnel,getCheckPersonnel} from "../../../server/api";
import { province } from "../../../assets/province";
import {dataFilter} from "../../../util/commonMethod";
import 'antd/dist/antd.css';
import '../../style.scss';

const { Option, OptGroup } = Select;
const searchForm = Form.create;
let storage = window.localStorage;
const role = storage.userState;
let isCheck=true;
if(role==="管理员"){
	isCheck=false;
}

class  Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status:0,
			userList:[],
			checkUserList:[],
			timeType:"结构化时间",
			province:province,
		};
	}

	componentDidMount() {
		//结构化人员
		getStructuredPersonnel("").then(res => {
			if (res.data.code === 200) {
				let id = res.data.data[0]["firstNameRank"];
				let list = [];
				let typeList=[];
				typeList.push({
					id: "",
					array: [
						{
							value: 0,
							label: "全部"
						},
						{
							value: 1,
							label: "已删除"
						},
						{
							value: 2,
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
					userList:typeList,
				});
			} else {
				message.error(res.data.message);
			}
		});
		//检查人员列表(管理员获取)
		if(!isCheck){
			getCheckPersonnel().then(res => {
				if (res.data.code === 200) {
					let checklist=[];
					checklist.push({
						value: "all",
						label: "全部"
					});
					for (let key = 0; key < res.data.data.length; key++) {
						checklist.push({
							value: res.data.data[key]["id"],
							label: res.data.data[key]["name"]
						});
					}
					this.setState({
						checkUserList:checklist,
					})
				} else {
					message.error(res.data.message);
				}
			});
		}
	};

	componentWillReceiveProps(nextProps){
		const {status,timeType}=nextProps;
		this.setState({
			status:status,
			timeType:timeType,
		});
	}
	//根据status传不同时间类型
	// checkType| 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间

	// 搜索框
	handleSearch = e => {
		e.preventDefault();
		const {status}=this.state;
		const searchTitle=this.props.form.getFieldValue('title');
		const startTime=this.props.form.getFieldValue('startTime');
		const endTime=this.props.form.getFieldValue('endTime');
		const userId=this.props.form.getFieldValue('userId');
		const province=this.props.form.getFieldValue('province');
		let options={
			title: searchTitle,
			page: 1,
			num: 10,
		};
		if(startTime){options.startTime=dataFilter((startTime))}
		if(endTime){options.endTime=dataFilter((endTime))}
		if(userId){
			options.userId=userId;
		}
		if(isCheck){
			options.approveStatus=status;
		}else{
			options.status=status;
			//省 region 市 city 区 area
			if(province){
				if(province[0]){
					options.region=province[0];
				}else if(province[1]){
					options.city=province[1];
				}else if(province[2]){
					options.area=province[2];
				}
			}
		}
		console.log(options,'options');
		this.props.toSearch(options);
	};

	//清空搜索条件
	clearSearch=()=>{
		this.props.form.resetFields();
		this.props.toClear(this.props.status);
		console.log(this.props.status);
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const {userList,checkUserList,timeType}=this.state;
		return(
			<div>
				<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{marginLeft:10,marginTop:15}}>
					<Form.Item label="标题">
						{getFieldDecorator('title', {})
						(<Input
							type="text"
							placeholder="拍卖信息标题"
							size='default'
							style={{ width: 240 }}
						/>)}
					</Form.Item>

					<Form.Item label={timeType}>
						{getFieldDecorator('startTime', {})
						(<DatePicker
							placeholder="开始时间"
							style={{width:108}}
						/>)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('endTime', {})
						(<DatePicker
							placeholder="结束时间"
							style={{width: 108}}
						/>)}
					</Form.Item>
					<Form.Item label="结构化人员">
						{getFieldDecorator('userId', {
						})(
							<Select style={{width:198,marginLeft:4}} transfer placeholder="请选择">
								{
									userList && userList.map((item,index) => {
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
					{!isCheck &&
					<Form.Item label="检查人员">
						{getFieldDecorator('checkUserId', {})(
							<Select style={{width: 198, marginLeft: 4}} transfer placeholder="请选择">
								{
									checkUserList && checkUserList.map((item) => {
										return (
											<Option
												value={item.value}
												key={item.value}
											>
												{item.label}
											</Option>
										);
									})
								}
							</Select>
						)}
					</Form.Item>}
					{!isCheck &&
						<Form.Item label="地区">
							{
								getFieldDecorator('province', {})(
								<Cascader options={province} placeholder="请选择" />
								)}
								</Form.Item>
							}
						<Form.Item>
						<Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15,fontSize:12}}>
							搜索
						</Button>
						<Button type="default" style={{marginLeft:5,fontSize:12}} onClick={this.clearSearch}>
							清空搜索条件
						</Button>
					</Form.Item>
				</Form>
			</div>

		);
	}
}
export default searchForm()(Index);
