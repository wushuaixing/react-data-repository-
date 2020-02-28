/** 详情* */
import React from 'react';
import {withRouter} from "react-router-dom";
import {message,Button,Icon,Checkbox} from "antd";
import {
	structuredList,
	getCheckDetail,
	structuredObligorTypeList,
	saveDetail,
	getNumberOfTags,notEnableSave,
	getNewStructureData,beConfirmed,inspectorCheck,changeWrongType,
} from '../../../server/api';
import BasicDetail from "../../../components/basicDetail";
import WrongReason from "../../../components/wrongReason";
import WsDetail from "../../../components/wsDetail";
import RoleDetail from "../../../components/roleDetail";
import HouseDetail from "../../../components/houseDetail";
import Check from "./checkModal";
import './style.scss';

const storage = window.localStorage;
const role = storage.userState;

class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			tabStatus:0,
    	dataStatus:0,
			dataId:0,
      dataMark:  0,
      dataTotal:50,
			buttonText:'保存',
			buttonStyle:{backgroundColor:'#0099CC', color:'white'},
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
			wsStyle:'',
			preId:"",
			needStruc:false,
		};
  }

	componentDidMount() {
		const {Id, status, page, tabStatus, enable, personnel} = this.props.match.params;
		const {needStruc}=this.state;
		let _status=parseInt(status);
		let dataId=parseInt(Id);
		let _page=parseInt(page);
		console.log(enable,personnel);
		if(enable ==="false" || personnel==='自动标注'){
			this.setState({
				needStruc:true,
			})
		}
		this.setState({
			tabStatus:tabStatus,
			dataStatus:_status,
			dataId:dataId,
			dataPage:_page,
		});
		if (role === "结构化人员") {
			//按钮
			this.setState({
				checkStyle:'none',
				sure:'none',
				checkTrue:'none',
				editReason:'none',
			});
			if (_status === 0) {
				this.setState({
					buttonText: '保存并标记下一条',
				});
			}
			if (_status ===1 ) {
				this.setState({
					buttonText: '保存并修改下一条',
					buttonStyle: {},

				});
			}
			if (_status === 2) {
				this.setState({
					buttonText: '保存并修改下一条',
					buttonStyle: {},
					needWrongReason:true,
				});
			}
			this.getStrucData(Id,role);
		} else {
			if(!needStruc){
				this.setState({
					needWrongReason:true,
					needRecord:true,
					buttonStyle: {display:'none'},
				});
			}else{
				this.setState({
					needWrongReason:true,
					needRecord:true,
					buttonText: '保存',
				});
			}

			//检查／管理员数据详情
			this.getDetailData(Id, role);

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
	setArea=(num)=> {
		const {data}=this.state;
		let _data=data;
		_data.buildingArea=num;
		this.setState({
			data: _data //把父组件中的parentText替换为子组件传递的值
		},() =>{
			// console.log(data.buildingArea);//setState是异步操作，但是我们可以在它的回调函数里面进行操作
		});
	};

	setCollateral=(bool)=>{
		const {data}=this.state;
		let _data=data;
		if(bool === true){
			_data.collateral=0;
		}else{
			_data.collateral=1;
		}
		this.setState({
			data:_data,
			checkedCollateral:true,
		})
	};

	setHouseType=(type)=>{
		const {data}=this.state;
		let _data=data;
		_data.houseType=type;
		this.setState({
				data:_data,
		});
	};
	//角色信息子组件
	setRole(list) {
		const {obligor}=this.state;
		this.setState({
			obligor: list //把父组件中的值替换为子组件传递的值
		},() =>{
			// console.log(obligor);//setState是异步操作，但是我们可以在它的回调函数里面进行操作
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



	//角色信息+建筑面积+生日-保存前格式验证
	checkRoleLable=(data)=>{
		let failed=true;
		//建筑面积格式
		if(data.buildingArea){
			let num=data.buildingArea;
			let _num=/(^[0-9]{1,6}$)|(^[0-9]{1,6}[.]{1}[0-9]+$)/.test(num);
			if(!_num){
				failed=false;
				message.error("建筑面积格式错误");
				return failed
			}
		}
		// labelType 角色： 1-资产所有人 2-债权人 3-资产线索 5竞买人
		if(data.obligors){
			let r1 = data.obligors.filter(item=>item.labelType==="3"&& !item.notes);
			let r2 = data.obligors.filter(item=>{
				let res1 = item.labelType==="2";
				let res2 = /银行|信用(联|)社/.test(item.name);
				if(res1 && res2){
					item.type=4;
				} else {
					item.type=item.labelType;
				}
				return res1 && !res2 && !item.notes
			});
			// console.log(r2)
			if(r1.length) {
				failed=false;
				message.error("资产线索备注待完善");
				return failed;
			}
			else if(r2.length){
				failed=false;
				message.error("债权人备注待完善");
				return failed;
			}
		}
		return failed
	};



	toSave=()=> {
		const {id,data,wsFindStatus,ifAttach,
			wenshuUrl,wenshuNum,obligors,
			houseType,}=this.state;
		const {dataId,dataStatus,dataPage,tabStatus,buttonText,need}=this.state;
		let _data=data;
		_data.ah=wenshuNum;
		_data.wsUrl=wenshuUrl;
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

			if(_data.wsUrl){
				_data.wsUrl.forEach(item => {
					item.value="";
				});
			}
			if(_data.ah){
				_data.ah.forEach(item => {
					item.value="";
				});
			}
		}
		if(_data.obligors) {
			let tempData = [];
			data.obligors.forEach((item, index) => {
				let itemValue = Object.values(item);
				let roleValue = itemValue.filter(_item => _item != null && _item !== undefined && _item !== "");
				if (roleValue.length) {
					tempData.push(item);
				}
			});
			_data.obligors=tempData;
		}
		this.setState({
			data:_data,
		});
		if(!need){
			saveDetail(dataId, data).then(res => {
				const failed=this.checkRoleLable(data);
				if(failed){
					if (res.data.code === 200) {
						storage.setItem("preId", id);
						this.setState({
							preId:id,
						});
						if(buttonText === '保存并标记下一条'){
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
						else if(buttonText === '保存并修改下一条'){
							let params = {
								approveStatus: 2
							};
							structuredList(params).then(res => {
								if (res.data.code === 200) {
									message.info("修改成功");
									if(res.data.data.length===0){
										this.onClickToTable(2,1,2);
									}
									this.getData({id: res.data.data[0]["id"]});
								} else {
									message.error(res.data.message);
								}
							});
						}

					} else {
						message.error(res.data.message);
					}
				}

			});
		}else{
			notEnableSave(dataId, data).then(res => {
				if (res.data.code === 200) {
					let params={};
					params.auctionExtractWrongTypes=[];
					params.checkError=false;
					params.id=id;
					inspectorCheck(params).then(res => {
						if (res.data.code === 200) {
							message.info("操作成功");
							this.onClickToTable(dataStatus,dataPage,tabStatus);
						} else {
							message.error("操作失败");
						}
					});
				} else {
					message.error(res.data.message);
				}
			});
		}


	};

	goBack=()=>{
		storage.setItem("preId", "");

	};

	showModal=()=>{
		this.setState({
			visible: true,
		});
	};

	//待确认--确认接口
	sure=()=> {
		const {dataId,dataStatus,dataPage,tabStatus}=this.state;
		beConfirmed(dataId).then(res => {
			if (res.data.code === 200) {
				this.onClickToTable(dataStatus,dataPage,tabStatus);
				message.info("操作成功");
			} else {
				message.error(res.data.message);
			}
		});
	};

	getData(id) {
		// this.loading = true;
		const {preId}=this.state;
		this.setState({
			preId:storage["preId"],
		});
		structuredList(id).then(res => {
			this.loading = false;
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
		});
		getNumberOfTags().then(res => {
			if (res.data.code === 200) {
				this.setState({
					dataMark:res.data.data.MARK,
					dataTotal:res.data.data.TOTAL,
				});
				if(!preId){
					this.setState({
						dataMark:res.data.data.MARK-1,
					});
				}
			} else {
				message.error(res.data.message);
			}
		});
	};

	//检查无误
	async checkIfTrue(){
		const {dataId,dataStatus,dataPage,tabStatus}=this.state;
		let params = {
			auctionExtractWrongTypes:[],
			checkError: false,
			id: dataId
		};
		const res= await inspectorCheck(params);
		if (res.data.code === 200) {
			this.onClickToTable(dataStatus,dataPage,tabStatus);
			message.info("操作成功");
		} else {
			message.error(res.data.message);
		}
	};

	checkTrue() {
		const {dataId,dataStatus,dataPage,tabStatus}=this.state;
		if(dataStatus === 3){
			let params = {
				auctionExtractWrongTypes:[],
				desc: '检查无误',
				level: 0
			};
			changeWrongType(dataId,params).then(res => {
				if (res.data.code === 200) {
					this.onClickToTable(dataStatus,dataPage,tabStatus);
					message.info("操作成功");
				} else {
					message.error(res.data.message);
				}
			});
		}
		else{
			this.checkIfTrue();
		}
	};

	//检查错误弹窗按钮接口
	handleOk=(data)=>{
		const {dataId,dataStatus,dataPage,tabStatus}=this.state;

		if(dataStatus === 5 || dataStatus === 4 || dataStatus === 1 ){
				let params = {
					checkError: true,
					checkWrongLog: {
						auctionExtractWrongTypes: data.reason,
						remark: data.remark,
						wrongLevel: data.wrongLevel
					},
					id: dataId
				};
				inspectorCheck(params).then(res => {
					if (res.data.code === 200) {
						this.onClickToTable(dataStatus,dataPage,tabStatus);
						message.info("操作成功");

					} else {
						message.error("操作失败");
					}
				});
			}
			else if(dataStatus === 2){
				let params = {
					auctionExtractWrongTypes:data.reason,
					desc: data.remark,
					level: data.wrongLevel
				};
				changeWrongType(dataId,params).then(res => {
					if (res.data.code === 200) {
						this.onClickToTable(dataStatus,dataPage,tabStatus);
						message.info("操作成功");

					} else {
						message.error(res.data.message);
					}
				});
			}
			if(dataStatus === 3){
				let params = {
					auctionExtractWrongTypes:data.reason,
					desc: data.remark,
					level: data.wrongLevel
				};
				changeWrongType(dataId,params).then(res => {
					if (res.data.code === 200) {
						this.onClickToTable(dataStatus,dataPage,tabStatus);
						message.info("操作成功");
					} else {
						message.error(res.data.message);
					}
				});
			}
	};

	handleCancel = (visible) => {
		console.log(visible);
		this.setState({
			visible: visible,
		});
	};

	//文书组件返回数据
	changeInfo=(value,type)=>{
		console.log(type,'type');
		if(type==='ws'){
			if(value === 1){
				this.setState({
					wsStyle: 'none',
					wsFindStatus:1,
				});
			}
			if(value === 0){
				this.setState({
					wsStyle: '',
					wsFindStatus:0,
				});
			}
		}
		if(type==='url'){
			this.setState({
				wenshuUrl:value,
			})
		}
		if(type ==='num'){
			this.setState({
				wenshuNum:value,
			})
		}
		if(type ==='attach'){
			this.setState({
				ifAttach:value,
			})
		}
		if(type==='addNum' || type==='deleteNum'){
			console.log(value,'value');
			this.setState({
				wenshuNum:value,
			})
		}
		if(type==='addUrl' || type==='deleteUrl'){
			this.setState({
				wenshuUrl:value,
			})
		}
	};

	//跳转回列表页
	onClickToTable=(status,page,tab,id)=>{
		console.log(status,page,tab);
		let data = {statusPath:status,pagePath:page,tabPath:tab, Id:id};
		let url= '';
		if(role === "管理员"){
			url='/index/assetList';
		}else{
			url='/index';
		}
		let path = {
			pathname:url,
			state:data,
		};
		this.props.history.push(path);
	};

//待标记--》详情页
  render() {
		const {status} = this.props.match.params;
		const { dataMark, dataTotal, buttonText, buttonStyle,data,dataStatus,tabStatus,dataPage }=this.state;
		const { wenshuNum, wenshuUrl,wsFindStatus, ifAttach, wsStyle }=this.state;
		const basic=data;
    const { errorReason, recordsForCheck,autionStatus,needWrongReason,needRecord }=this.state;
    const { obligors,obligorList,checkedCollateral,houseType }=this.state;
    const { visible,needStruc }=this.state;
    let isAdmin;
    let isStruct='';
    let need=needWrongReason;
    let _buttonText=buttonText;
    let _buttonStyle=buttonStyle;
    if(needStruc){
    	_buttonText='保存';
    	_buttonStyle={backgroundColor:'#0099CC', color:'white'};
		}
		//按钮状态
		if(role==="检查人员"){
			if(status === "2"|| status === "1"){
				need=false;
			}
			isStruct='none';

		}else if(role==="管理员"){
			if(status === "-1"|| status === "1"){
				need=false;
			}
			isStruct='none';
			isAdmin='none';
		}else if(role==="结构化人员"){
			isStruct='';
		}


			return(
					<div style={{backgroundColor:'#ffffff',margin:20}}>
            <div className="yc-detail-title">
              <div style={{ margin:4, fontSize:16, color:'#293038' }}>{needRecord ? "资产结构化/检查" : "资产结构化/详情"}</div>
              <div className="yc-button-goback" style={{display:isStruct}} >
                <p>{ dataMark}/{ dataTotal }</p>
                <Button type="default" onClick={this.goBack}><Icon type="left" />返回上一条</Button>
              </div>
            </div>
						<div className="yc-detail-content">
							<div className="yc-action">
								<Checkbox style={{display:isAdmin}}>仅标记本条</Checkbox>
								<Button style={_buttonStyle}
												onClick={this.toSave}
								>{_buttonText}
								</Button>
								{
									(role==="检查人员" && (status === "1" || status ==="2"|| status ==="4")&& needStruc===false) &&
									<Button style={{margin:4}} onClick={this.showModal}>检查有误</Button>
								}
								{
									(role==="检查人员" && status ==="3" && needStruc===false) &&
									<Button style={{margin:4}} onClick={this.showModal}>修改错误原因</Button>
								}
								{
									(role==="检查人员" && (status === "1" || status ==="4" )&& needStruc===false) &&
									<Button style={{margin:4}} onClick={this.checkTrue}>检查无误</Button>
								}
								<Button style={{marginLeft:10,marginRight:20}}
												onClick={()=>this.onClickToTable(dataStatus,dataPage,tabStatus)}
								>返回
								</Button>
								{
									(role==="检查人员" && status ==="5"&& needStruc===false) &&
									<Button style={{margin:4}} onClick={this.sure}>确认</Button>
								}
	            </div>
							<div>
								{	need && <WrongReason errorList={errorReason} /> }
							</div>
							<div>
								<BasicDetail info={basic} records={recordsForCheck}  status={autionStatus} need={needRecord} dataStatus={status}/>
							</div>
							<div className="yc-wrong-part">
								<div className="left-part">
									<HouseDetail  collateral={checkedCollateral}
																house={houseType}
																fnArea={this.setArea.bind(this)}
																fnCollateral={this.setCollateral.bind(this)}
																fnHouse={this.setHouseType.bind(this)}
																area={basic.buildingArea}
																need={needStruc}
									/>
								</div>
								<div className="right-part">
									<WsDetail num={wenshuNum}
														url={wenshuUrl}
														ifWs={wsFindStatus}
														attach={ifAttach}
														wsStyle={wsStyle}
														fnChanged={this.changeInfo.bind(this)}
														need={needStruc}
									/>
								</div>
							</div>
							<div>
								<RoleDetail info={obligors}
														list={obligorList}
														changed={this.setRole.bind(this)}
														need={needStruc}
								/>
							</div>
            </div>
						<div>
							<Check visible={visible}
										 ok={this.handleOk.bind(this)}
										 cancel={this.handleCancel.bind(this)}
										 show={this.showModal.bind(this)}
										 style={{width:430}}
							/>
						</div>
					</div>
        );
    }
}
export default withRouter(StructureDetail);

