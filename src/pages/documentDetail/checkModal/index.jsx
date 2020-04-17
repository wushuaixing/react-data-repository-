/** right content for Account manage* */
import React from 'react';
import {withRouter} from "react-router-dom";
import {Form, Modal} from "antd";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import CheckboxGroup from "antd/es/checkbox/Group";
import Radio from "antd/es/radio";
import Input from "antd/es/input";
import {reasonList,wrongTypeList} from "../../../static/dataList";
import './style.scss';

const checkForm = Form.create;

class  Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			visible:false,
			dataStatus:0,
			dataId:0,
			remark:"",
			reasonList: reasonList,
			wrongTypeList: wrongTypeList,
		};
  }

	componentDidMount() {

	}
	componentWillReceiveProps(nextProps){
		const {visible,status,id}=nextProps;
		// console.log(nextProps,'next');
		this.setState({
			visible:visible,
			dataStatus:status,
			dataId:id,
		});
	}

  modalOk=()=>{
		const options=this.props.form.getFieldsValue();
		console.log(options,'options');
  	const {visible}=this.state;
		this.setState({
			visible: false,
		});
  	this.props.ok(options,visible);
	};

  modalCancel=()=>{
		this.setState({
			visible: false,
		});
		this.props.cancel(false);
	};


	// onChangeReason=(checkedValues)=>{
	// 	console.log('checked = ', checkedValues);
	// };

	addRemark(data) {
		const {remark}=this.state;
		let _remark = remark+ data+"\n";
		this.setState({
			remark:_remark,
		});
		this.props.form.setFieldsValue({
			remark: _remark,
		});
	};
//待标记--》详情页
  render() {
		const { getFieldDecorator } = this.props.form;
		const { visible,reasonList,wrongTypeList }=this.state;
			return(
					<div>
								<Modal
									visible={visible}
									destroyOnClose={true}
									closable={true}
									footer={null}
									title="确认本条结构化数据标注结果有误吗？"
									maskClosable
									onCancel={this.modalCancel}
								>
								<div className="check-modal">
									<div className="part">
										<span
										>点击确定，本条结构化数据将被标记为检查错误，并将退回给结构化人员</span
										>
									</div>
									<Form style={{width:347}}>
										<Form.Item className="part" label="备注">
											{getFieldDecorator('remark', {})(
												<Input.TextArea
													style={{height:136}}
													maxLength="136"
													placeholder="请填写备注"
												/>
											)}
										</Form.Item>
										<Form.Item className="part" label="错误等级" style={{fontSize:12}}>
											{getFieldDecorator('wrongLevel', {
												initialValue:4,
											})(
												<Radio.Group  initialValue={4}>
													<Radio value={4}>
														<span>普通错误</span>
													</Radio>
													<Radio value={1}>
														<span>严重错误</span>
													</Radio>
													<Radio value={7}>
														<span>不计入错误</span>
													</Radio>
												</Radio.Group>
											)}
										</Form.Item>
										<Form.Item className="part" label="出错原因">
											{getFieldDecorator('reason', {})(
												<CheckboxGroup onChange={this.onChangeReason}>
													{reasonList && reasonList.map((item)=>{
														return (
															<Checkbox value={item.value} key={item.label}>
																<span>{ item.value }</span>
															</Checkbox>
														)
													})
													}
												</CheckboxGroup>
											)}
										</Form.Item>
										<div className="part">
											<p className="part-title">错误类型</p>
												<div className="part-error-detail">
													{wrongTypeList && wrongTypeList.map((item)=>{
														return(
															<p
																key={item.label}
																className="part-error-content"
																onClick={()=>this.addRemark(item.value)}
															>
																{ item.value }
															</p>
														)})}
												</div>
										</div>
										<div className="footer">
											<Button type="primary" onClick={this.modalOk} style={{backgroundColor:'#0099CC'}}>确定</Button>
											<Button onClick={this.modalCancel}>取消</Button>
										</div>
									</Form>
								</div>
								</Modal>
					</div>
        );
    }
}
export default withRouter(checkForm()(Check));

