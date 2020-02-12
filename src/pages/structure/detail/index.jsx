/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
import {structuredList, getCheckDetail,structuredObligorTypeList} from '../../../server/api';
import BasicDetail from "../../../components/basicDetail";
import WrongReason from "../../../components/wrongReason";
import WsDetail from "../../../components/wsDetail";
import RoleDetail from "../../../components/roleDetail";
import HouseDetail from "../../../components/houseDetail";
import './style.scss';

// ==================
// 所需的所有组件
// ==================

const list={"code":200,"data":{"资产所有人":1,"债权人":2,"资产线索":3,"竞买人":5},"message":"成功"};

const checkData={
	"code":200,
	"data":{
		"ah":[],
		"associatedAnnotationId":"",
		"auctionStatus":1,
		"buildingArea":123456.0,
		"collateral":0,
		"detailStatus":3,
		"houseType":1,
		"obligors":[
			{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},{"birthday":null,"gender":"0","labelType":"5","name":"张燕芬","notes":"","number":"","type":"5"}
			],
		"reasonForWithdrawal":"",
		"records":[
			{"desc":"结构化","error":false,"errorLevel":0,"time":"2019-03-18 17:10:25","user":"邵颖结构化"},
			{"desc":"事实上多填所有人:\n债权人错误：\n","error":true,"errorLevel":4,"time":"2020-01-06 17:00:20","user":"检察人员"},
			{"desc":"结构化","error":false,"errorLevel":0,"time":"2019-01-18 17:10:25","user":"邵颖结构化"},
			{"desc":"多填所有人:\n债权人错误：\n","error":true,"errorLevel":4,"time":"2020-02-06 17:00:20","user":"检察人员"},
			],
		"status":5,
		"title":"【第一次拍卖】中山市沙溪镇云汉村青云东路1号401房的房地产【带租拍卖】",
		"url":"//sf-item.taobao.com/sf_item/582189191779.htm",
		"wsFindStatus":0,
		"wsInAttach":1,
		"wsUrl":[]},
	"message":"成功"
};

const strucData={
	"code":200,
	"data":[{
			"ah":[{id:12133,value:88888},{id:2131434,value:99999}],
		"associatedAnnotationId":"",
		"auctionStatus":5,
		"buildingArea":123456.0,
		"collateral":0,
		"completeTime":"2019-12-24 09:19:44",
		"houseType":1,
		"id":1521703,
		"obligors":[
			{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},
			{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},
			{"birthday":null,"gender":"0","labelType":"5","name":"张燕芬","notes":"","number":"","type":"5"}
			],
		"reasonForWithdrawal":"",
		"status":2,
		"title":"【第一次拍卖】中山市沙溪镇云汉村青云东路1号401房的房地产【带租拍卖】",
		"type":0,
		"url":"//sf-item.taobao.com/sf_item/582189191779.htm",
		"wrongReason":["事实上多填所有人:\n债权人错误：\n"],
		"wsFindStatus":0,
		"wsInAttach":1,
		"wsUrl":[{id:12133,url:"//sf-item.taobao.com/sf_item/582189191779.htm"},
			{id:2131434,url:"//sf-item.taobao.com/sf_item/582189191779.htm"}]
	}],
	"hasNext":false,
	"message":"成功",
	"page":1,
	"pages":1,
	"size":20,
	"total":1,};

class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMark:  0,
      dataTotal:50,
			buttonText:'保存',
			buttonStyle:{backgroundColor:'#0099CC', color:'white'},
			errorReason:{
				reasonStruc:[],
				reasonCheck:[],
				reasonAdmin:[],
			},
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
			status:'',
		};
  }

  componentWillMount() {
		const id=1111;
		//结构化数据详情
		/*structuredList(id).then(res => {
			// this.loading = false;
			if (res.data.code === 200) {
				this.data = res.data.data[0];
				this.setState({

				});
			} else {
				// this.$Message.error(res.data.message);
			}
		});*/
		//检查／管理员数据详情
		/*async getDetailData(id){
			this.loading = true;
			const res= await getCheckDetail(id);
			if (res.data.code == 200) {
				this.loading = false;
				this.data = res.data.data;
				this.checkErrorList=this.data.records.filter(item => item.error && item.desc !='结构化');
				this.checkErrorList=this.checkErrorList.sort(function(a,b){
					return a.time < b.time ? 1 : -1
				});
				if(this.checkErrorList){
					this.checkError=this.checkErrorList[0];
				}
				if(this.data.obligors){
					const _data=[];
					this.data.obligors.forEach((item)=>{
						let itemValue=Object.values(item);
						let roleValue=itemValue.filter(_item=> _item != null && _item != undefined && _item != "");
						if(roleValue.length){
							_data.push(item);
						}
					});
					this.data.obligors=_data;
				}
				this.initData();
			} else {
				this.$Message.error(res.data.message);
			}
		},*/

		// structuredObligorTypeList().then(res => {
		// 	if (res.data.code === 200) {
		// 		for (let key in res.data.data) {
		// 			this.labelTypeList.push({
		// 				value: res.data.data[key] + "",
		// 				label: key
		// 			});
		// 		}
		// 	} else {
		// 		this.$Message.error(res.data.message);
		// 	}
		// });
		let storage = window.localStorage;
		const role = storage.userState;

		this.setState({
			value: strucData.data[0].houseType,
			ifAttach: strucData.data[0].wsInAttach,
			wenshuNum: strucData.data[0].ah,
			wenshuUrl: strucData.data[0].wsUrl,
			valueWenshu: strucData.data[0].wsFindStatus,
			obligors: strucData.data[0].obligors,
			obligorList: list.data,
			area: strucData.data[0].buildingArea,

		});

		if(strucData.data[0].collateral === 0){
			this.setState({
				checkedCollateral:true,
			});
		}
		if(strucData.data[0].collateral === 1){
			this.setState({
				checkedCollateral:false,
			});
		}
		//拍卖状态
		const _status=strucData.data[0].auctionStatus;
		if(_status ===1 ){
			this.setState({
				status:"即将开始",
			});
		}else if (_status === 3) {
			this.setState({
				status:"拍卖中",
			});
		} else if (_status === 5) {
			this.setState({
				status:"成功交易",
			});
		} else if (_status === 7) {
			this.setState({
				status:"失败",
			});
		} else if (_status === 9) {
			this.setState({
				status:"终止",
			});
		} else if (_status === 11) {
			this.setState({
				status:"撤回",
			});
		}


		if(role === "结构化人员"){
			this.setState({
				errorReason:{
					reasonStruc:strucData.data[0].wrongReason,
					reasonCheck:[],
					reasonAdmin:[],
				},
			});
			if('tagged'){
				this.setState({
					buttonText:'保存',
				});
			}
			if('waitTag'){
				this.setState({
					buttonText:'保存并标记下一条',
					buttonStyle:{},

				});
			}
			if('waitChange'){
				this.setState({
					buttonText:'保存并修改下一条',
					buttonStyle:{},

				});
			}
		}
		else{
			//结构化记录
			this.setState({
				recordsForCheck:checkData.data.records,
			});

			const tempList = checkData.data.records.filter(item => item.error && item.desc !== '结构化');

			if(role === "管理员"){
				this.setState({
					errorReason: {
						reasonAdmin: tempList,
						reasonStruc:[],
						reasonCheck:[],
					}
				});
			}

			if(role === "检查人员"){
			//检查人员的错误原因，展示最新一次的记录
				let _tempList=tempList.sort(function(a,b){
					return a.time < b.time ? 1 : -1
				});
				if(_tempList){
					this.setState({
						errorReason: {
							reasonCheck: _tempList[0],
							reasonAdmin:[],
							reasonStruc:[],
						}
					})
				}

			}

		}


	}

	goBack=()=>{};
	toSave=()=>{};

	// const date_format = date => {/* your code */}






//待标记--》详情页
  render() {
    const { }=this.props;
    const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
    const { errorReason, recordsForCheck,status }=this.state;
    const { wenshuNum, wenshuUrl,valueWenshu,wsInAttach }=this.state;
    const { obligors,obligorList,checkedCollateral,houseType,area }=this.state;
    const basic=strucData.data[0];
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
								<WrongReason errorList={errorReason} />
							</div>
							<div>
								<BasicDetail info={basic} records={recordsForCheck} status={status} />
							</div>
							<div className="yc-wrong-part">
							<div className="left-part">
								<HouseDetail  collateral={checkedCollateral} house={houseType} area={area} />
							</div>
								<div className="right-part">
								<WsDetail num={wenshuNum} url={wenshuUrl} ifWs={valueWenshu} attach={wsInAttach} />
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
