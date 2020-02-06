/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import Checkbox from "antd/es/checkbox";
import {structuredList, getCheckDetail} from '../../../server/api';
import './style.scss';
import WrongReason from "../../../components/rongReason";
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
			"ah":[],
		"associatedAnnotationId":"",
		"auctionStatus":5,
		"buildingArea":123456.0,
		"collateral":0,
		"completeTime":"2019-12-24 09:19:44",
		"houseType":1,
		"id":1521703,
		"obligors":[
			{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},		{"birthday":null,"gender":"","labelType":"","name":"","notes":"","number":"","type":""},{"birthday":null,"gender":"0","labelType":"5","name":"张燕芬","notes":"","number":"","type":"5"}
			],
		"reasonForWithdrawal":"",
		"status":2,
		"title":"【第一次拍卖】中山市沙溪镇云汉村青云东路1号401房的房地产【带租拍卖】",
		"type":0,
		"url":"//sf-item.taobao.com/sf_item/582189191779.htm",
		"wrongReason":["事实上多填所有人:\n债权人错误：\n"],
		"wsFindStatus":0,
		"wsInAttach":1,
		"wsUrl":[]
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
			reason:{},
		};
  }

  componentWillMount() {
		const id=1111;
		//结构化数据详情
		structuredList(id).then(res => {
			// this.loading = false;
			if (res.data.code === 200) {
				this.data = res.data.data[0];
				this.setState({

				});
			} else {
				// this.$Message.error(res.data.message);
			}
		});
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
		if(role === "结构化人员"){
			this.setState({
				reason:strucData.data[0].wrongReason,
			});
			if('tagged'){
				this.setState({
					buttonText:'保存',
					reason:
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
		if(role === "检查人员"){
			this.setState({
				reason:strucData.data[0].wrongReason,
			});
		}
		if(role === "管理员"){

		}

	}

	toSave=()=>{

	};


//待标记--》详情页
  render() {
    const { }=this.props;
    const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
        return(
          <div>
            <div className="yc-detail-title">
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>资产结构化／详情</div>
              <div className="yc-button-goback">
                <p>{ dataMark}/{ dataTotal }</p>
                <Button type="default" onClick="goBack"><Icon type="left" />返回上一条</Button>
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
							<WrongReason reasonList=strucData />

						</div>
          </div>
        );
    }
}
export default StructureDetail;
