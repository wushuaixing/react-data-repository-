/** right content for Account manage* */
import React from 'react';
import Checkbox from "antd/es/checkbox";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import deleteIcon from "../../assets/img/delete_wenshu.png";
import addIcon from "../../assets/img/add_wenshu.png";
import clone from "../../util/util";

// ==================
// 所需的所有组件
// ==================
class  WsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			style:'',
			valueWenshu:0,
			wenshuNum:[],
			wenshuUrl:[],
			strucStyle:'',
			checkStyle:'none',
			wsAttach:true,
		};
  }

	componentWillReceiveProps(nextProps){
		let storage = window.localStorage;
		const role = storage.userState;
		if(role !== '结构化人员'){
			this.setState({
				strucStyle:'none',
				checkStyle:'',
			});
		}
		const { num, url, ifWs, attach }=nextProps;

		this.setState({
			wenshuNum: num,
			wenshuUrl: url,
			valueWenshu:ifWs,
			wsAttach:attach,
		});
// console.log(this.state.wenshuNum.length);

	}

	//文书信息
	onChangeRadioWenshu = e =>{
		console.log('radio checked', e.target.value);
		if(e.target.value === 1){
			this.setState({
				style: 'none',
			});
		}
		if(e.target.value === 0){
			this.setState({
				style: '',
			});
		}
		this.props.ifWs=e.target.value;
	};
  //文书案号
	getWenshuNum=e=>{
		let temp=[];
		temp.push(e.target.value);
		// this.props.num=temp;
	};

	//文书链接
	getWenshuUrl=e=>{
		let temp=[];
		temp.push(e.target.value);
		// this.props.url=temp;
	};

	//详情见附件
	onChangeAttach=e=>{
		// this.props.attach=e.target.checked;
	};

	//添加文书号
	addWS=(index) =>{
		let temp=this.state.wenshuNum;
		if (temp.length < 3) {
			let ws = clone(temp);
			ws.splice(index + 1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			// this.props.num=ws;
			// this.$set(this.data, "ah", ws);
		}
	};
	//添加文书链接地址
	addWSUrl=(index) =>{
		const temp=this.state.wenshuUrl;
		if (temp.length < 3) {
			let ws = clone(temp);
			ws.splice(index + 1, 0, {
				id: new Date().getTime(),
				value: ""
			});
			// this.props.url=ws;
			// this.$set(this.data, "wsUrl", ws);
		}
	};
	//删除文书号
	deleteWS=(index) =>{
		let temp=this.state.wenshuNum;
		temp.splice(index,1);
		// this.props.num=temp;
	};
	//删除文书链接地址
	deleteWSUrl=(index)=> {
		let temp=this.state.wenshuUrl;
		temp.splice(index,1);
		// this.props.url=temp;
	};

//待标记--》详情页
  render() {
		const { wenshuNum, wenshuUrl, wsAttach }=this.state;
		const { strucStyle,checkStyle}=this.state;
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
											value={this.state.valueWenshu}
											className=""
											style={{marginLeft:5,display:'inline-block'  }}
										>
											<Radio value={0}>找到文书</Radio>
											<Radio value={1}>未找到文书</Radio>
										</Radio.Group>
									</div>
									<div style={{display:this.state.style, }} >
										<p style={{float:'left'}}>相关文书案号:</p>
										<div className="range" style={{display:checkStyle}}>
											{wenshuNum.length>0
												? wenshuNum.map((item,index)=>{
													return(
														<div className="range-item" key={item.id} style={{display:'inline-block'}}>
															<p style={{marginLeft:5,fontSize:12,}}>{item.value}</p>
														</div>
													)
												})
												:<p style={{fontSize:14,marginLeft:4}}>--</p>}
										</div>
										<div className="range" style={{display:strucStyle}}>
											{wenshuNum.length>0
												? wenshuNum.map((item,index)=>{
													return(
														<div className="range-item" key={item.id}>
															<Input placeholder="请输入相关文书案号"
																		 style={{width:225,margin:5}}
																		 value={item.value}
																		 onChange={this.getWenshuNum}
																		 key={index}
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
												})
												:<div className="range-item">
													<Input placeholder="请输入相关文书案号"
																 style={{width:225,margin:5}}
																 onChange={this.getWenshuNum}
													/>
													<img
														className="delete-img"
														src={deleteIcon}
														onClick={()=>this.deleteWS(0)}
														alt=""
													/>
													<img
														className="add-img"
														src={addIcon}
														onClick={()=>this.addWS(0)}
														alt=""
													/>
												</div>}


										</div>
									</div>

									<div style={{display:this.state.style}}>
										<p style={{float:'left'}}>文书链接地址:</p>
										<div className="range" style={{display:strucStyle}}>
										{ wenshuUrl && wenshuUrl.map((item,index)=>{
											return(
												<div key={item.id} className="range-item" >
													<Input
														     placeholder="请输入文书链接地址"
																 style={{width:225,margin:5,display:'inline-block'}}
																 value={item.url}
																 onChange={this.getWenshuUrl}
																 key={index}
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
											{ wenshuUrl && wenshuUrl.map((item,index)=>{
												return(
													<div className="range-item" key={item.id} style={{display:'inline-block'}}>
														<p style={{marginLeft:5,fontSize:12,}}>{item.url}</p>
													</div>
												)
											})
											}
										</div>
									</div>
									<div style={{display:this.state.style}}>
										<Checkbox
											defaultChecked={wsAttach}
											onChange={this.onChangeAttach}
											style={{marginLeft:5}}
										>详情见资产拍卖附件</Checkbox>
									</div>
								</div>
							</div>

        );
    }
}
export default WsDetail;
