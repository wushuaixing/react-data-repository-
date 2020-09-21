/** right content for Account manage* */
import React from 'react';
import { withRouter } from "react-router-dom";
import CheckboxGroup from "antd/es/checkbox/Group";
import { Input, Radio, Checkbox, Button, Form, Modal } from 'antd'
import { REASON_LIST, WRONG_TYPE_LIST } from "@/static/status";
import NoticeImg from '@/assets/img/confirm_notice.png';
import './style.scss';

const checkForm = Form.create;
class Check extends React.Component {
	modalOk = () => {
		const options = this.props.form.getFieldsValue();
		this.props.handleModalSubmit(options);
	};

	modalCancel = () => {
		this.props.handleModalCancel();
	};

	addRemark(text) {
		const val = this.props.form.getFieldValue('remark')?this.props.form.getFieldValue('remark'):'';
		this.props.form.setFieldsValue({
			remark: `${val}${text}:\n`
		});
	};
	//待标记--》详情页
	render() {
		let { wrongReasons } = this.props;
		console.log(wrongReasons);
		const { getFieldDecorator } = this.props.form;
		const  status  = this.props.match.params.status||this.props.status;
		const wrongReasonList = [];
		WRONG_TYPE_LIST.forEach((wrongType, index) => {
			const title = <div className="part-error-title" key={index}>{wrongType.type}</div>;
			const WrongReasons = wrongType.children.map((child, index) => {
				return <div key={index} className="part-error-content"  onClick={() => this.addRemark(child.text)}>{`${child.text}：`}</div>
			});
			wrongReasonList.push(<div key={index}>{[title,WrongReasons]}</div>)
		});
    	wrongReasons = (wrongReasons&&wrongReasons instanceof Array&&wrongReasons.length>0)?wrongReasons[wrongReasons.length-1]:{};
		const isShowWrongRemark = !!(wrongReasons.remark && parseInt(status) === 4);
		return (
			<div>
				<Modal
					width={394}
					className="checkError-modal"
					visible={this.props.visible}
					closable={true}
					footer={null}
					title={<span><img src={NoticeImg} alt='' /> 确认本条结构化数据标注结果有误吗？</span>}
					maskClosable
					onCancel={this.modalCancel}
				>
					<div className="check-modal">
						<div className="part">
							<span>点击确定，本条结构化数据将被标记为检查错误，并将退回给结构化人员</span>
						</div>
						<Form style={{ width: 354 }}>
							<Form.Item className="part" label="备注">
								{getFieldDecorator('remark', {
									/* initialValue:`${returnRemarks?returnRemarks+'\n':''}${(wrongReasons.remark)?wrongReasons.remark.join('\n'):''}`, */
									initialValue:`${(isShowWrongRemark)?wrongReasons.remark.join('\n'):''}`
								})(
									<Input.TextArea
										style={{ width: 354,height:100 }}
										placeholder="请填写备注"
									/>
								)}
							</Form.Item>
							<Form.Item className="part" label="错误等级" style={{ fontSize: 12 }}>
								{getFieldDecorator('wrongLevel', {
									initialValue: wrongReasons.wrongLevel&&isShowWrongRemark?wrongReasons.wrongLevel:0,
								})(
									<Radio.Group initialValue={0}>
										<Radio value={0}>
											<span>不计入错误</span>
										</Radio>
										<Radio value={1}>
											<span>普通错误</span>
										</Radio>
										<Radio value={2}>
											<span>严重错误</span>
										</Radio>
										{/*<Radio value={3}>*/}
										{/*	<span>无误</span>*/}
										{/*</Radio>*/}
									</Radio.Group>
								)}
							</Form.Item>
							<Form.Item className="part" label="出错原因">
								{getFieldDecorator('wrongTypes', {
									initialValue:wrongReasons.auctionExtractWrongTypes&&isShowWrongRemark?wrongReasons.auctionExtractWrongTypes:[],
								})(
									<CheckboxGroup onChange={this.onChangeReason}>
										{REASON_LIST && REASON_LIST.map((item) => {
											return (
												<Checkbox value={item.value} key={item.label}>
													<span>{item.value}</span>
												</Checkbox>
											)
										})
										}
									</CheckboxGroup>
								)}
							</Form.Item>
							<div className="part" >
								<p className="part-title">错误类型</p>
								<div className="part-error-detail">
									{
										wrongReasonList
									}
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
		);
	}
}
export default withRouter(checkForm()(Check));

