/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
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

// ==================
// 所需的所有组件
// ==================

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
			errorReason:[],
			recordsForCheck:[],
			checkedCollateral:true,
			houseType:0,
			valueWenshu:0,
			area:'',
			ifAttach:true,
			wenshuNum:[],
			wenshuUrl:[],
			obligors:[],
			obligorList:[],
			autionStatus:'',
			data:{},
			needWrongReason:false,
			needRecord:false,
		};
  }

	componentDidMount() {
  	console.log('didmount');
		const {Id, status} = this.props.match.params;
		// console.log(Id, status);
		if (role === "结构化人员") {
			//按钮
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
			});
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
					obligorList: list.data,
				});
			} else {
				// this.$Message.error(res.data.message);
			}
		});
	}

	shouldComponentUpdate () {
		console.log('shouldComponentUpdate');
		return true;
	}
	componentWillUpdate(){
		console.log('componentWillUpdate');
	}


		//initData
	initData=(data)=>{
		let initData=data;
		this.setState({
			data:initData,
			id:initData.id,
			value: initData.houseType,
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


	async getStrucData(id,role){
		//结构化数据详情
		let params = {
			id: id
		};
		const res=await structuredList(params);
			if (res.data.code === 200) {
				console.log('getdata');
				const strucData = res.data.data[0];
				this.initData(strucData);
				const _error=strucData.wrongReason;
				this.setState({
					errorReason: _error,
				});
			} else {
				// this.$Message.error(res.data.message);
			}
	}

	async getDetailData(id,role){
		this.loading = true;
		const res= await getCheckDetail(id);
		if (res.data.code === 200) {
			this.loading = false;
			let checkData = res.data.data;
			this.initData(checkData);
			//结构化记录
			this.setState({
				recordsForCheck: checkData.records,
			});
			//结构化记录
			const tempList = checkData.data.records.filter(item => item.error && item.desc !== '结构化');
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
				if (_tempList) {
					this.setState({
						errorReason: _tempList[0],
					});
				}
			} else {
				// this.$Message.error(res.data.message);
			}
		}
	};

	toSave=()=> {
		const {id,data,wsFindStatus,ifAttach,
			wenshuUrl,wenshuNum,obligors,area,
			valueHouse,}=this.state;
		let _data=data;
		_data.ah=wenshuNum;
		_data.wenshuUrl=wenshuUrl;
		_data.obligors=obligors;
		_data.buildingArea=area;
		_data.houseType=valueHouse;

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
			//console.log(this.data.wsUrl);
			// this.data.ah.push("");this.data.wsUrl.push("");
		}
		this.setState({
			data:_data,
		});

		saveDetail(id, this.state.data).then(res => {
			if (res.data.code === 200) {
				alert('200');
				if(this.state.buttonText === '保存并标记下一条'){
					getNewStructureData().then(res=>{
						if (res.data.code === 200) {
							if(res.data.data === 0){
								// this.$Message.info("暂无新数据");
								// this.$router.push({
								// 	name: "AssetStructure",
								// });
							}
							this.getData({id: res.data.data});
						}else {
							// this.$Message.error(res.data.message);
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
				// this.$Message.error(res.data.message);
			}});
	};

	goBack=()=>{};

	// const date_format = date => {/* your code */}






//待标记--》详情页
  render() {
		const { dataMark, dataTotal, buttonText, buttonStyle,data }=this.state;
		const { wenshuNum, wenshuUrl,wsFindStatus, ifAttach }=this.state;
		const basic=data;

    const { errorReason, recordsForCheck,autionStatus,needWrongReason,needRecord }=this.state;
    const { obligors,obligorList,checkedCollateral,houseType }=this.state;
        return(
          <div>
            <div className="yc-detail-title">
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>资产结构化／详情</div>
              <div className="yc-button-goback">
                <p>{ dataMark}/{ dataTotal }</p>
                <Button type="default" onClick={this.goBack}><Icon type="left" />返回上一条</Button>
              </div>
            </div>
						<div className="yc-detail-content">
							<div className="yc-action">
								<Checkbox>仅标记本条</Checkbox>
								<Button style={buttonStyle}
								        onClick={this.toSave}
								>{buttonText}
							  </Button>
	            </div>
							<div>
								{	needWrongReason && <WrongReason errorList={errorReason} /> }
							</div>
							<div>
								{/*<div className="yc-wrong-part">
									<div className="yc-part-title">
										<p>基本信息</p>
									</div>
									<div className="yc-wrong-detail">
										<div>
											<p className="yc-sec-title">标题:</p>
											<p className="yc-link-title" onClick={this.openLink} style={{ marginLeft:5 }} >{ basic.title }</p>
										</div>
										<div>
											<p className="yc-sec-title">拍卖状态:</p>
											<p className="yc-sec-title" style={{ marginLeft:5}}>basic.auctionStatus</p>
										</div>
										{	needWrongReason && <StructureRecord records={recordsForCheck} />}
										//什么数据是有撤回原因和关联标注的 条件：!character && status !== 0
										<div >
											<p className="yc-sec-title">撤回原因:</p>
											<p className="yc-sec-title" style={{ marginLeft:5}}>{ basic.reasonForWithdrawal }</p>
										</div>
										<div >
											<p className="yc-sec-title">关联标注:</p>
											<p
												className="yc-link-title"
												style={{ marginLeft:5}}
												onClick={()=>this.associated(basic.associatedAnnotationId)}
											>
												{basic.associatedAnnotationId }
											</p>
										</div>
									</div>
								</div>*/}
								<BasicDetail info={basic} records={recordsForCheck} status={autionStatus} need={needRecord}/>
							</div>
							<div className="yc-wrong-part">
							<div className="left-part">
								<HouseDetail  collateral={checkedCollateral} house={houseType} area={data.buildingArea} />
							</div>
								<div className="right-part">
								<WsDetail num={wenshuNum} url={wenshuUrl} ifWs={wsFindStatus} attach={ifAttach} />
								</div>
							</div>
							<div>
								<RoleDetail info={obligors} list={obligorList} />
							</div>
            </div>
					</div>
        );
    }
}
export default StructureDetail;

