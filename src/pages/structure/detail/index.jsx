/** right content for Account manage* */
import React from 'react';
import {withRouter} from "react-router-dom";
import {Form, message, Modal} from "antd";

import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
import RadioGroup from "antd/es/radio/group";
import CheckboxGroup from "antd/es/checkbox/Group";
import Radio from "antd/es/radio";
import Input from "antd/es/input";
import {
	structuredList,
	getCheckDetail,
	structuredObligorTypeList,
	saveDetail,
	getNewStructureData
} from '../../../server/api';
import BasicDetail from "../../../components/basicDetail";
import WrongReason from "../../../components/wrongReason";
import WsDetail from "../../../components/wsDetail";
import RoleDetail from "../../../components/roleDetail";
import HouseDetail from "../../../components/houseDetail";
import './style.scss';


let storage = window.localStorage;
const role = storage.userState;

class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMark:  0,
      dataTotal:50,
			buttonText:'保存',
			buttonStyle:{backgroundColor:'#0099CC', color:'white'},
			checkStyle:'none',
			back:'none',
			sure:'none',
			checkTrue:'',
			editReason:'none',
			isCheck:'',
			errorReason:[],
			recordsForCheck:[],
			checkedCollateral:true,
			houseType:0,
			valueWenshu:0,
			ifAttach:true,
			wenshuNum:[],
			wenshuUrl:[],
			obligors:[],
			obligorList:[],
			autionStatus:'',
			data:{},
			needWrongReason:false,
			needRecord:false,
			visible:false,
			remark:"",
			reasonList: [
				"拍卖页文本看漏",
				"拍卖页图片看漏",
				"附件文本看漏",
				"附件图片看漏",
				"文书未找到",
				"文书文本看漏",
				"填写失误",
				"其他"
			],
			highLevel: [
				/*"资产所有人、债权人、资产线索遗漏:",
				"名字填写错误:",
				"身份信息填写错误:"*/
				"所有人遗漏：",
				"所有人错误：",
				"多填所有人:",
				"债权人遗漏：",
				"债权人错误：",
				"资产线索遗漏：",
				"资产线索错误：",
				"资产线索备注遗漏/错误：",
				"身份信息遗漏：",
				"身份信息错误：",
				"抵押文书遗漏：",
				"抵押文书错误：",
				"无抵押勾选遗漏/错误:",
				"见附件勾选遗漏/错误：",
				"角色类别错误：",
				"未优先填身份证号：",
				"面积遗漏/错误：",
				"案号遗漏/错误：",
				"其他角色备注遗漏/错误：",
				"房产/土地类型遗漏/错误：",
				"多填债权人/资产线索/抵押文书：",
			],
		};
  }

	componentDidMount() {
  	// console.log('didmount');
		const {Id, status} = this.props.match.params;
		console.log(Id, status);
		if (role === "结构化人员") {
			//按钮
			this.setState({
				checkStyle:'none',
				back:'none',
				sure:'none',
				checkTrue:'none',
				editReason:'none',
				isCheck:'',
			});
			if (status === 0) {
				this.setState({
					buttonText: '保存',
				});
			}
			if (status === 1) {
				this.setState({
					buttonText: '保存并标记下一条',
					buttonStyle: {},

				});
			}
			if (status === 2) {
				this.setState({
					buttonText: '保存并修改下一条',
					buttonStyle: {},
					needWrongReason:true,
				});
			}
			this.getStrucData(Id,role);
		} else {
			this.setState({
				needWrongReason:true,
				needRecord:true,
				isCheck:'none',
				buttonStyle: {display:'none'},

			});
			//检查／管理员数据详情
			this.getDetailData(Id, role);
			//检查按钮
			if (status !== 0 || status !== 3) {
				this.setState({
					checkStyle: '',
					editReason:'none',
				});
			}
			else if (status !== 2) {
				this.setState({
					back: 'none',
				});
			}else if(status == 3) {
				this.setState({
					editReason: '',
					checkStyle: 'none',
					back: 'none',

				});
			}
			else if(status === 4) {
				this.setState({
					checkTrue: '',
				});
			}
			else if(status === 5) {
				this.setState({
					sure:'',
				});
			}
		}

		structuredObligorTypeList().then(res => {
			if (res.data.code === 200) {
				let list = [];
				for (let key in res.data.data) {
					list.push({
						value: res.data.data[key] + "",
						label: key
					});
				}
				this.setState({
					obligorList: list,
				});
			} else {
				message.error(res.data.message);
			}
		});
	}

	shouldComponentUpdate () {
		// console.log('shouldComponentUpdate');
		return true;
	}
	componentWillUpdate(){
		// console.log('componentWillUpdate');
	}

	//房产子组件
	setArea(num) {
		const {data}=this.state;
		let _data=data;
		_data.buildingArea=num;
		this.setState({
			data: _data //把父组件中的parentText替换为子组件传递的值
		},() =>{
			// console.log(data.buildingArea);//setState是异步操作，但是我们可以在它的回调函数里面进行操作
		});
	}
	//角色信息子组件
	setRole(list) {
		const {obligorList}=this.state;
		this.setState({
			obligorList: list //把父组件中的parentText替换为子组件传递的值
		},() =>{
			// console.log(obligorList);//setState是异步操作，但是我们可以在它的回调函数里面进行操作
		});
	}
		//initData
	initData=(data)=>{
		let initData=data;
		this.setState({
			data:initData,
			id:initData.id,
			houseType: initData.houseType,
			wenshuNum: initData.ah,
			wenshuUrl: initData.wsUrl,
			wsFindStatus: initData.wsFindStatus,
			obligors:initData.obligors,
		});
		//拍卖状态
		const _autionStatus=initData.auctionStatus;
		if(_autionStatus === 1 ){
			this.setState({
				autionStatus:"即将开始",
			});
		}else if (_autionStatus === 3) {
			this.setState({
				autionStatus:"拍卖中",
			});
		} else if (_autionStatus === 5) {
			this.setState({
				autionStatus:"成功交易",
			});
		} else if (_autionStatus === 7) {
			this.setState({
				autionStatus:"失败",
			});
		} else if (_autionStatus === 9) {
			this.setState({
				autionStatus:"终止",
			});
		} else if (_autionStatus === 11) {
			this.setState({
				autionStatus:"撤回",
			});
		}
		// 文书是否在附件
		if(initData.wsInAttach === 0){
			this.setState({
				ifAttach:false,
			});
		}
		if(initData.wsInAttach === 1){
			this.setState({
				ifAttach:true,
			});
		}

		if(initData.collateral === 0){
			this.setState({
				checkedCollateral:true,
			});
		}
		if(initData.collateral === 1){
			this.setState({
				checkedCollateral:false,
			});
		}
		return this.state;
	};


	async getStrucData(id){
		//结构化数据详情
		let params = {
			id: id
		};
		const res=await structuredList(params);
			if (res.data.code === 200) {
				const strucData = res.data.data[0];
				this.initData(strucData);
				const _error=strucData.wrongReason;
				this.setState({
					errorReason: _error,
				});
			} else {
				message.error(res.data.message);
			}
	}

	async getDetailData(id,role){
		const res= await getCheckDetail(id);
		if (res.data.code === 200) {
			const checkData = res.data.data;
			this.initData(checkData);
			const records=checkData.records;
			//结构化记录
			this.setState({
				recordsForCheck: records,
			});
			//错误原因
			const tempList = records.filter(item => item.error && item.desc !== '结构化');
			if(role === "管理员"){
				this.setState({
					errorReason: tempList,
				});
			}
			if(role === "检查人员") {
				//检查人员的错误原因，展示最新一次的记录
				let _tempList = tempList.sort(function (a, b) {
					return a.time < b.time ? 1 : -1
				});
				let err=[];
				err.push( _tempList[0]);
				if (_tempList) {
					this.setState({
						errorReason: err,
					});
				}
			}
		}else {
				message.error(res.data.message);
			}
	};

	toSave=()=> {
		const {id,data,wsFindStatus,ifAttach,
			wenshuUrl,wenshuNum,obligors,
			houseType,}=this.state;
		let _data=data;
		_data.ah=wenshuNum;
		_data.wenshuUrl=wenshuUrl;
		_data.obligors=obligors;
		_data.houseType=houseType;

		if(wsFindStatus === 1 && ifAttach === true){
			_data.wsInAttach=1;
		}
		else if(wsFindStatus === 1 && ifAttach === false){
			_data.wsInAttach=0;
		}
		else if(wsFindStatus === 0) {
			_data.wsInAttach=0;

			if(_data.wenshuUrl){
				_data.wenshuUrl.forEach(item => {
					item.value="";
				});
			}
			if(_data.wenshuNum){
				_data.wenshuNum.forEach(item => {
					item.value="";
				});
			}
		}


		this.setState({
			data:_data,
		});
		saveDetail(id, this.state.data).then(res => {
			let num=this.state.data.buildingArea;
			let _num=/(^[0-9]{1,6}$)|(^[0-9]{1,6}[.]{1}[0-9]+$)/.test(num);
			if(!_num){
				message.error("建筑面积格式错误");
				return
			}else{
				if (res.data.code === 200) {
					alert('200');
					if(this.state.buttonText === '保存并标记下一条'){
						getNewStructureData().then(res=>{
							if (res.data.code === 200) {
								if(res.data.data === 0){
									message.info("暂无新数据");
									this.props.history.push('/index')
								}
								this.getData({id: res.data.data});
							}else {
								message.error(res.data.message);
							}
						});
					}
					else if(this.state.buttonText === '保存并修改下一条'){
						let params = {
							approveStatus: 2
						};
						structuredList(params).then(res => {
							if (res.data.code === 200) {
								if(res.data.data.length===0){
									// this.$router.push({
									// 	name: "AssetStructure",
									// 	query:{
									// 		id:'waitTag'
									// 	}
									// });
								}
								this.getData({id: res.data.data[0]["id"]});
							} else {
								// this.$Message.error(res.data.message);
							}
						});
					}

				} else {
					message.error(res.data.message);
				}
			}

		});
	};

	goBack=()=>{};

	showModal=()=>{
		this.setState({
			visible: true,
		});
	};

	addRemark(data) {
		const {remark}=this.state;
		let _remark = remark+ data+"\n";
		this.setState({
			remark:_remark,
		});
	};
//待标记--》详情页
  render() {
		let storage = window.localStorage;
		const user = storage.userName;
		const role = storage.userState;
		const {Id, status} = this.props.match.params;
		const { dataMark, dataTotal, buttonText, buttonStyle,data }=this.state;
		const { wenshuNum, wenshuUrl,wsFindStatus, ifAttach }=this.state;
		const basic=data;
    const { errorReason, recordsForCheck,autionStatus,needWrongReason,needRecord }=this.state;
    const { obligors,obligorList,checkedCollateral,houseType }=this.state;
    const { isCheck,checkStyle,editReason,checkTrue,back }=this.state;
    const { visible,reasonList,highLevel,remark }=this.state;
    let need=needWrongReason;
		if(status === "2"|| status === "1"){
			need=false;
		}

			return(
					<div>
            <div className="yc-detail-title">
              <div style={{ margin:4, fontSize:16, color:'#293038' }}>{needRecord ? "资产结构化/检查" : "资产结构化/详情"}</div>
              <div className="yc-button-goback" style={{display:isCheck}} >
                <p>{ dataMark}/{ dataTotal }</p>
                <Button type="default" onClick={this.goBack} ><Icon type="left" />返回上一条</Button>
              </div>
            </div>
						<div className="yc-detail-content">
							<div className="yc-action">
								<Checkbox>仅标记本条</Checkbox>
								<Button style={buttonStyle}
												onClick={this.toSave}
								>{buttonText}
								</Button>
								<Button style={{display:checkStyle,margin:4}}
												onClick={this.showModal}
								>检查有误
							  </Button>
								<Button style={{display:editReason,margin:4}}
												onClick={this.showModal}
								>修改错误原因
								</Button>
								<Button style={{display:checkTrue,margin:4}}
												onClick={this.toSave}
								>检查无误
								</Button>
								<Button style={{display:back,margin:4}}
												onClick={this.toSave}
								>返回
								</Button>

	            </div>
							<div>
								{	need && <WrongReason errorList={errorReason} /> }
							</div>
							<div>
								<BasicDetail info={basic} records={recordsForCheck} status={autionStatus} need={needRecord}/>
							</div>
							<div className="yc-wrong-part">
							<div className="left-part">
								<HouseDetail  collateral={checkedCollateral} house={houseType} fn={this.setArea.bind(this)} area={basic.buildingArea} />
							</div>
								<div className="right-part">
								<WsDetail num={wenshuNum} url={wenshuUrl} ifWs={wsFindStatus} attach={ifAttach} />
								</div>
							</div>
							<div>
								<RoleDetail info={obligors} list={obligorList} fn={this.setRole.bind(this)} />
							</div>
							<div>
								<Modal
									className="yc-check-modal"
									style={{width:550}}
									visible={visible}
									destroyOnClose={true}
									closable={true}
									footer={null}
									title="确认本条结构化数据标注结果有误吗？"
								>
								<div className="check-modal">
									<div className="part">
										<span
										>点击确定，本条结构化数据将被标记为检查错误，并将退回给结构化人员</span
										>
									</div>
									<div className="part">
										<p className="part-title">备注</p>
										<Input.TextArea
											style={{height:136}}
											maxLength="136"
											placeholder="请填写备注"
											value={remark}
											onChange={this.getRemark}
										/>
									</div>
									<div className="part">
										<p className="part-title">错误等级</p>
										<RadioGroup v-model="data.wrongLevel">
											<Radio label="4">
												<span>普通错误</span>
											</Radio>
											<Radio label="1">
												<span>严重错误</span>
											</Radio>
											<Radio label="7">
												<span>不计入错误</span>
											</Radio>
										</RadioGroup>
									</div>
									<div className="part">
										<p className="part-title">出错原因</p>
										<CheckboxGroup v-model="data.reason">
											{reasonList && reasonList.map((item)=>{
												return (
													<Checkbox >
														<span>{ item }</span>
													</Checkbox>
												)
											})
											}
										</CheckboxGroup>
									</div>
									<div className="part">
										<p className="part-title">错误类型</p>
										<div className="part-error-detail">
											{highLevel && highLevel.map((item)=>{
												return(
													<p
													className="part-error-content"
													onClick={()=>this.addRemark(item)}
													>
														{ item }
													</p>
												)})}
										</div>
									</div>
									<div className="footer">
										<Button type="primary" onClick={this.handleOk}>确定</Button>
										<Button onClick={this.handleCancel}>取消</Button>
									</div>
								</div>
								</Modal>
							</div>
            </div>
					</div>
        );
    }
}
export default withRouter(StructureDetail);

