/** right content for Account manage* */
import React from 'react';
import {message,Checkbox,Input,Radio,} from "antd"
import deleteIcon from "../../assets/img/delete_wenshu.png";
import addIcon from "../../assets/img/add_wenshu.png";
import {clone} from "../../utils/common";

let storage = window.localStorage;
const role = storage.userState;

class  WsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			wsStyle:'',
			valueWenshu:0,
			wenshuNum:[],
			wenshuUrl:[],
			strucStyle:'',
			checkStyle:'none',
			wsAttach:true,
			need:false,
		};
  }

	componentWillReceiveProps(nextProps){
		let storage = window.localStorage;
		const role = storage.userState;
		const { num, url, ifWs, attach, need }=nextProps;
		if(role !== '结构化人员' && !need){
			this.setState({
				strucStyle:'none',
				checkStyle:'',
			});
		}
		if(ifWs===1){
			this.setState({
				wsStyle:'none',
			});
		}
		if(ifWs===0){
			this.setState({
				wsStyle:'',
			});
		}
		if(num.length===0){
			let ws = clone(num);
			ws.splice(1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			this.setState({
				wenshuNum:ws,
			})
		}
		if(url.length===0){
			let ws = clone(url);
			ws.splice(1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			this.setState({
				wenshuUrl:ws,
			})
		}
		this.setState({
			wenshuNum: num,
			wenshuUrl: url,
			valueWenshu:ifWs,
			wsAttach:attach,
			need:need,
		});

	}

	//文书信息
	onChangeRadioWenshu = e =>{
  	this.props.fnChanged(e.target.value,'ws');

	};
  //文书案号
	getWenshuNum=(index,value)=>{
		console.log(index,value);
		let temp=[];
		temp.push(value);
		this.props.fnChanged(temp,'num');
	};

	//文书链接
	getWenshuUrl=e=>{
		let temp=[];
		temp.push(e.target.value);
		this.props.fnChanged(temp,'url');
	};

	//详情见附件
	onChangeAttach=e=>{
			console.log(e.target.checked,'attach');
		this.props.fnChanged(e.target.checked,'attach');
	};

	//添加文书号
	addWS=(index) =>{
		console.log(index,'index');
		const {wenshuNum}=this.state;
		let temp=wenshuNum;
		if (temp.length < 3) {
			let ws = clone(temp);
			ws.splice(index + 1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			this.props.fnChanged(ws,'addNum');
		}else if(temp.length ===3){
			message.error("最多添加3个")
		}
	};
	//添加文书链接地址
	addWSUrl=(index) =>{
		const {wenshuUrl}=this.state;
		const temp=wenshuUrl;
		if (temp.length < 3) {
			let ws = clone(temp);
			ws.splice(index + 1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			this.props.fnChanged(ws,'addUrl');
		}else if(temp.length ===3){
			message.error("最多添加3个")
		}
	};
	//删除文书号
	deleteWS=(index) =>{
		const {wenshuNum}=this.state;
		let temp=wenshuNum;
		temp.splice(index,1);
		this.props.fnChanged(temp,'deleteNum');
	};
	//删除文书链接地址
	deleteWSUrl=(index)=> {
		let temp=this.state.wenshuUrl;
		temp.splice(index,1);
		this.props.fnChanged(temp,'deleteUrl');
	};

	initialInput=(array)=>{
		if(array.length===0){
			let ws = clone(array);
			ws.splice(1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			return ws
		}else{
			return array
		}
	};

//待标记--》详情页
  render() {
		const { wenshuNum, wenshuUrl, wsAttach,valueWenshu,need }=this.state;
		const { strucStyle,checkStyle,wsStyle}=this.state;

		let ah=this.initialInput(wenshuNum);
		let url=this.initialInput(wenshuUrl);

		let disabled=false;
		if(role !== "结构化人员" && !need){
			disabled=true;
		}
		return(
							<div style={{height:200}}>
								<div className="yc-part-title">
									<p>文书信息</p>
								</div>
								<div className="yc-wrong-detail">
									<div>
										<p className="yc-sec-title">查找文书:</p>
										<Radio.Group
											onChange={this.onChangeRadioWenshu}
											value={valueWenshu}
											className=""
											style={{marginLeft:5,display:'inline-block'  }}
											disabled={disabled}
										>
											<Radio value={0}>找到文书</Radio>
											<Radio value={1}>未找到文书</Radio>
										</Radio.Group>
									</div>
									<div style={{display:wsStyle, }} >
										<p style={{float:'left'}}>相关文书案号:</p>
										<div className="range" style={{display:checkStyle}}>
											{wenshuNum.length>0
												? wenshuNum.map((item)=>{
													return(
														<div className="range-item" key={item.id} style={{display:'inline-block'}}>
															<p style={{marginLeft:5,fontSize:12,}}>{item.value}</p>
														</div>
													)
												})
												:<p style={{fontSize:14,marginLeft:4}}>--</p>}
										</div>
										<div className="range" style={{display:strucStyle}}>
											{ah && ah.map((item,index)=>{
													return(
														<div className="range-item" key={item.id}>
															<Input placeholder="请输入相关文书案号"
																		 style={{width:225,margin:5}}
																		 defaultValue={item.value}
																		 onChange={this.getWenshuNum.bind(this,index)}
																		 key={index}
																		 autoComplete="new-password"
															/>
															<img
																className="delete-img"
																src={deleteIcon}
																onClick={()=>this.deleteWS(index)}
																alt=""
															/>
															<img
																className="add-img"
																src={addIcon}
																onClick={()=>this.addWS(index)}
																alt=""
															/>
														</div>
													)
												})}
										</div>
									</div>
									<div style={{display:wsStyle}}>
										<p style={{float:'left'}}>文书链接地址:</p>
										<div className="range" style={{display:strucStyle}}>
										{ url && url.map((item,index)=>{
											return(
												<div key={index} className="range-item" >
													<Input
														     placeholder="请输入文书链接地址"
																 style={{width:225,margin:5,display:'inline-block'}}
																 defaultValue={item.url}
																 onChange={this.getWenshuUrl}
																 key={index}
																 autoComplete="new-password"
													/>
													<img
														className="delete-img"
														src={deleteIcon}
														onClick={()=>this.deleteWSUrl(index)}
														alt=""
													/>
													<img
														className="add-img"
														src={addIcon}
														onClick={()=>this.addWSUrl(index)}
														alt=""
													/>
												</div>
											)
										})
										}
										</div>
										<div className="range" style={{display:checkStyle}}>
											{wenshuUrl.length>0
												? wenshuUrl.map((item,index)=>{
													return(
														<div className="range-item" key={index} style={{display:'inline-block'}}>
															<p style={{marginLeft:5,fontSize:12,}}>{item.url}</p>
														</div>)
												})
												:<p style={{fontSize:14,marginLeft:4}}>--</p>}
										</div>
									</div>
									<div style={{display:wsStyle}}>
										<div style={{display:strucStyle}}>
											<Checkbox
												defaultChecked={wsAttach}
												onChange={this.onChangeAttach}
												style={{marginLeft:80}}
												disabled={disabled}
											>详情见资产拍卖附件</Checkbox>
										</div>
									</div>
								</div>
							</div>

        );
    }
}
export default WsDetail;