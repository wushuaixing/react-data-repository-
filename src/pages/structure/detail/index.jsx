/** right content for Account manage* */
import React from 'react';
import {withRouter} from "react-router-dom";
import {message} from "antd";
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
import {
	structuredList,
	getCheckDetail,
	structuredObligorTypeList,
	saveDetail,
	getNewStructureData,beConfirmed,inspectorCheck,changeWrongType,
} from '../../../server/api';
import BasicDetail from "../../../components/basicDetail";
import WrongReason from "../../../components/wrongReason";
import WsDetail from "../../../components/wsDetail";
import RoleDetail from "../../../components/roleDetail";
import HouseDetail from "../../../components/houseDetail";
import Check from "./checkModal";
import './style.scss';

let storage = window.localStorage;
const role = storage.userState;

class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	dataStatus:0,
			dataId:0,
      dataMark:  0,
      dataTotal:50,
			buttonText:'保存',
			buttonStyle:{backgroundColor:'#0099CC', color:'white'},
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
			wsStyle:'',
		};
  }

	componentDidMount() {
		const {Id, status} = this.props.match.params;
		let _status=parseInt(status);
		let dataId=parseInt(Id);
		this.setState({
			dataStatus:_status,
			dataId:dataId,
		});
		if (role === "结构化人员") {
			//按钮
			this.setState({
				checkStyle:'none',
				sure:'none',
				checkTrue:'none',
				editReason:'none',
				isCheck:'',
			});
			if (_status === 0) {
				this.setState({
					buttonText: '保存',
				});
			}
			if (_status === 1) {
				this.setState({
					buttonText: '保存并标记下一条',
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
			this.setState({
				needWrongReason:true,
				needRecord:true,
				isCheck:'none',
				buttonStyle: {display:'none'},
			});
			//检查／管理员数据详情
			this.getDetailData(Id, role);
			//检查按钮

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
			changeUrl: initData.wsUrl,
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

	//待确认--确认接口
	sure=()=> {
		beConfirmed(this.$route.params.id).then(res => {
			if (res.data.code === 200) {
				message.info("操作成功");
			} else {
				message.error(res.data.message);
			}
		});
	};
	//检查无误
	async checkIfTrue(){
		const {dataStatus,dataId}=this.state;
		let params = {
			auctionExtractWrongTypes:[],
			checkError: false,
			id: dataId
		};
		const res= await inspectorCheck(params);
		if (res.data.code === 200) {
			message.info("操作成功");
			// this.$router.push({
			// 	name: "CheckAssetStrure",
			// 	query:{
			// 		id:this.$route.params.state,
			// 		pageNum:this.$route.params.page,
			// 	}
			// });
		} else {
			message.error(res.data.message);
		}
	};
	checkTrue() {
		const {dataStatus,dataId}=this.state;
		if(dataStatus === 3){
			let params = {
				auctionExtractWrongTypes:[],
				desc: '检查无误',
				level: 0
			};
			changeWrongType(dataId,params).then(res => {
				if (res.data.code === 200) {
					message.info("操作成功");
					// this.$router.push({
					// 	name: "CheckAssetStrure",
					// 	query:{
					// 		id:this.$route.params.state,
					// 		pageNum:this.$route.params.page,
					// 	}
					// });
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
		const {dataStatus,dataId}=this.state;

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
						//console.log(this.$route)
						message.info("操作成功");
						// this.$router.push({
						// 	name: "CheckAssetStrure",
						// 	query:{
						// 		id:this.$route.params.state,
						// 		pageNum:this.$route.params.page,
						// 	}
						// });

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
						message.info("操作成功");
						// this.$router.push({
						// 	name: "CheckAssetStrure",
						// 	query:{
						// 		id:this.$route.params.state,
						// 		pageNum:this.$route.params.page,
						// 	}
						// });

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
						message.info("操作成功");
						// this.$router.push({
						// 	name: "CheckAssetStrure",
						// 	query:{
						// 		id:this.$route.params.state,
						// 		pageNum:this.$route.params.page,
						// 	}
						// });
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
				wenshuNum:value,
			})
		}
	};


//待标记--》详情页
  render() {
  	console.log('render');
		let storage = window.localStorage;
		const role = storage.userState;
		const { status} = this.props.match.params;
		const { dataMark, dataTotal, buttonText, buttonStyle,data }=this.state;
		const { wenshuNum, wenshuUrl,wsFindStatus, ifAttach, wsStyle }=this.state;
		const basic=data;
    const { errorReason, recordsForCheck,autionStatus,needWrongReason,needRecord }=this.state;
    const { obligors,obligorList,checkedCollateral,houseType }=this.state;
    const { visible }=this.state;
    let isTrue,isErr,revise,confirm,isCheck,isAdmin;
    let isStruct='';
    let need=needWrongReason;

		//按钮状态
		if(role==="检查人员"){
			if(status === "2"|| status === "1"){
				need=false;
			}
			isCheck='none';
			isStruct='none';
			if(status === "1" || status ==="4"){
				isTrue='';
				isErr='';
				revise='none';
				confirm='none';
			}else if(status === "2"){
				isTrue='none';
				isErr='';
				revise='none';
				confirm='none';
			}else if(status === "3"){
				isTrue='';
				isErr='none';
				revise='';
				confirm='none';
			}else if(status ==="4"){
				isTrue='';
				isErr='';
				revise='none';
				confirm='';
			}
		}else if(role==="管理员"){
			if(status === "-1"|| status === "1"){
				need=false;
			}
			isStruct='none';
			isAdmin='none';
			isTrue='none';
			isErr='none';
			revise='none';
			confirm='none';
		}else if(role==="结构化人员"){
			isStruct='';
			isTrue='none';
			isErr='none';
			revise='none';
			confirm='none';
		}



			return(
					<div>
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
								<Button style={buttonStyle}
												onClick={this.toSave}
								>{buttonText}
								</Button>
								<Button style={{display:isErr,margin:4}}
												onClick={this.showModal}
								>检查有误
							  </Button>
								<Button style={{display:revise,margin:4}}
												onClick={this.showModal}
								>修改错误原因
								</Button>
								<Button style={{display:isTrue,margin:4}}
												onClick={this.checkTrue}
								>检查无误
								</Button>
								<Button style={{margin:4}}
												onClick={this.goBack}
								>返回
								</Button>
								<Button style={{display:confirm}}
												onClick={this.sure}
								>确认
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
								<WsDetail num={wenshuNum}
													url={wenshuUrl}
													ifWs={wsFindStatus}
													attach={ifAttach}
													wsStyle={wsStyle}
													fnChanged={this.changeInfo.bind(this)}
								/>
								</div>
							</div>
							<div>
								<RoleDetail info={obligors} list={obligorList} fn={this.setRole.bind(this)} />
							</div>
							<div>
								<Check visible={visible}
											 ok={this.handleOk.bind(this)}
											 cancel={this.handleCancel.bind(this)}
											 show={this.showModal.bind(this)}
											 // status={dataStatus}
											 // id={dataId}
								/>
							</div>
            </div>
					</div>
        );
    }
}
export default withRouter(StructureDetail);

