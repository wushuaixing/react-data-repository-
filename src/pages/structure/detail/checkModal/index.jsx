/** right content for Account manage* */
import React from 'react';
import {withRouter} from "react-router-dom";
import {Form, Modal} from "antd";
import Button from "antd/es/button";
import Checkbox from "antd/es/checkbox";
import CheckboxGroup from "antd/es/checkbox/Group";
import Radio from "antd/es/radio";
import Input from "antd/es/input";
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
  	const {visible}=this.state;
		this.setState({
			visible: false,
		});
  	this.props.ok(options,visible);
	};

  modalCancel=()=>{
		const {visible}=this.state;
		this.setState({
			visible: false,
		});
		this.props.cancel(false);
	};


	onChangeReason=(checkedValues)=>{
		console.log('checked = ', checkedValues);
	};

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
		const { visible,reasonList,highLevel }=this.state;
			return(
					<div>
						<div className="yc-detail-content">
								<Modal
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
									<Form style={{width:387}}>
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
											{getFieldDecorator('wrongLevel', {})(
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
													{reasonList && reasonList.map((item,index)=>{
														return (
															<Checkbox value={item} key={index}>
																<span>{ item }</span>
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
													{highLevel && highLevel.map((item,index)=>{
														return(
															<p
																key={index}
																className="part-error-content"
																onClick={()=>this.addRemark(item)}
															>
																{ item }
															</p>
														)})}
												</div>
										</div>
										<div className="footer">
											<Button type="primary" onClick={this.modalOk}>确定</Button>
											<Button onClick={this.modalCancel}>取消</Button>
										</div>
									</Form>
								</div>
								</Modal>
            </div>
					</div>
        );
    }
}
export default withRouter(checkForm()(Check));

