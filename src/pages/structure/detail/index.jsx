/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
import {structuredList, getCheckDetail} from '../../../server/api';
import './style.scss';
import WrongReason from "../../../components/wrongReason";
import StructureRecord from "../../../components/structureRecord";
import WsDetail from "../../../components/wsDetail";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import deleteIcon from "../../../assets/img/delete_wenshu.png";
import addIcon from "../../../assets/img/add_wenshu.png";
import clone from "../../../util/util";

// ==================
// 所需的所有组件
// ==================

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
			"ah":[88888,99999],
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
		"wsUrl":["//sf-item.taobao.com/sf_item/582189191779.htm","//sf-item.taobao.com/sf_item/582189191779.htm"]
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
			valueHouse:0,
			valueWenshu:0,
			area:'',
			ifAttach:true,
			wenshuNum:[],
			wenshuUrl:[],
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

		let storage = window.localStorage;
		const role = storage.userState;

		this.setState({
			value: strucData.data[0].houseType,
			ifAttach: strucData.data[0].wsInAttach,
			wenshuNum: strucData.data[0].ah,
			wenshuUrl: strucData.data[0].wsUrl,
			valueWenshu: strucData.data[0].wsFindStatus,
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
	//拍卖状态
	filterAuctionStatus=(value) =>{
		if (value === 1) {
			return "即将开始";
		} else if (value === 3) {
			return "拍卖中";
		} else if (value === 5) {
			return "成功交易";
		} else if (value === 7) {
			return "失败";
		} else if (value === 9) {
			return "终止";
		} else if (value === 11) {
			return "撤回";
		}
	};

	//打开标题链接
	openLink=()=>{
		let href = window.location.href.split("#")[0];
		// window.open(href + "#/SourcePage/"+this.$route.params.id);
	};

	//
	associated=(id) =>{
		let href = window.location.href.split("#")[0];
		// window.open(
		// 	href + "#/check/" + id + "/" + strucData.data[0].auctionStatus
		// );
	};
 //抵押情况
	onChangeCheckBox = e =>{
		// console.log(e.target.checked);
	};

	//房产／土地类型
	onChangeRadioHouse = e =>{
		// console.log('radio checked', e.target.value);
		this.setState({
			valueHouse: e.target.value,
		});
	};

	//建筑面积
	getArea = e =>{
		// console.log(e.target.value);
		this.setState({
			area: e.target.value,
		});
	};

//待标记--》详情页
  render() {
    const { }=this.props;
    const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
    const { errorReason, recordsForCheck }=this.state;
    const { wenshuNum, wenshuUrl,valueWenshu }=this.state;
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
							<div className="yc-wrong-part">
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
										<p className="yc-sec-title" style={{ marginLeft:5}}>{ this.filterAuctionStatus(basic.auctionStatus) }</p>
									</div>
									<StructureRecord records={recordsForCheck} />
										{/*//什么数据是有撤回原因和关联标注的 条件：!character && status !== 0*/}
									<div >
										<p className="yc-sec-title">撤回原因:</p>
										<p className="yc-sec-title" style={{ marginLeft:5}}>{ basic.reasonForWithdrawal }</p>
									</div>
									<div >
										<p className="yc-sec-title">关联标注:</p>
										<p
											className="yc-link-title"
											style={{ marginLeft:5}}
											onClick={this.associated(basic.associatedAnnotationId)}
									  >
											{basic.associatedAnnotationId }
									  </p>
								  </div>
						</div>
					    </div>
							<div className="yc-wrong-part">
							<div className="left-part">
								<div className="yc-part-title">
									<p>房产／土地信息</p>
								</div>
								<div className="yc-wrong-detail">
									<div>
										<p className="yc-sec-title">抵押情况:</p>
										<Checkbox
											defaultChecked={this.state.checkedCollateral}
											onChange={this.onChangeCheckBox}
											style={{marginLeft:5}}
										>未抵押</Checkbox>
									</div>
									<div>
										<p className="yc-sec-title">房产／土地类型:</p>
										<Radio.Group
											onChange={this.onChangeRadioHouse}
											value={this.state.valueHouse}
											className="yc-link-title"
											style={{marginLeft:5}}
										>
											<Radio value={0}>未知</Radio>
											<Radio value={1}>商用</Radio>
											<Radio value={2}>住宅</Radio>
											<Radio value={4}>工业</Radio>
										</Radio.Group>
									</div>
									<div>
										<p className="yc-sec-title">建筑面积:</p>
										<Input className="yc-sec-title"
													 placeholder="请输入建筑面积"
													 style={{width:225,margin:5}}
													 onChange={this.getArea}
										/>
										<p className="yc-sec-title">m²</p>
									</div>
									<div>
								</div>
							</div>

						</div>
								<div className="right-part">

								<WsDetail num={wenshuNum} url={wenshuUrl} ifWs={valueWenshu}/>
								</div>
							</div>
							<div>
							<WrongReason errorList={errorReason} />
							</div>
            </div>
					</div>
        );
    }
}
export default StructureDetail;
