/** topMenu * */
import React from 'react';
import { Dropdown, Menu, Icon, Modal, message, Input, Button, Form, Tooltip } from "antd";
import { withRouter } from 'react-router-dom';
import logo from "@/assets/img/top_logo.png";
import { changePassword, logout } from "@api";
import { twoNewPasswordValidator, oldAndNewPasswordValidator } from "@/utils/validators";
import 'antd/dist/antd.css';
import './style.scss';


const { confirm } = Modal;
const pswForm = Form.create;
const formItemLayout = {
	labelCol: {
		sm: { span: 6, offset: 0 },
	},
};

class topMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			isLogout: true,
			passwordTipVisible: false //密码格式框提示
		};
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				changePassword(values).then(res => {
					if (res.data.code === 200) {
						message.info("密码修改成功");
						this.setState({
							visible: false,
						});
						setTimeout(() => { this.props.history.push('/login') }, 1000)
					} else {
						message.error(res.data.message);
					}
				});
			}
		});
	};
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	logOut(){
		confirm({
			content: '确定要退出登录吗?',
			onOk:()=>{
				logout().then(res => {
					if (res.data.code === 200) {
						window.localStorage.removeItem("userState");
						setTimeout(() => { this.props.history.push('/login'); }, 250)
					} else {
						message.error(res.data.message);
					}
				});
			}
		});
	};
	handlePasswordTipVisible(status) {
		this.setState({
			passwordTipVisible: status
		})
	}
	render() {
		const { user } = this.props;
		const { visible } = this.state;
		const { getFieldDecorator } = this.props.form;
		const label = <span>确认新密码</span>
		const footer = [
			// 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
			<Button key="submit"
				type="primary"
				htmlType="submit"
				onMouseDown={this.handleSubmit.bind(this)}
				style={{ backgroundColor: '#0099CC', width: 120, height: 36, marginRight: 15 }}>
				确定
			</Button>,
			<Button key="back"
				onClick={this.handleCancel}
				style={{ width: 120, height: 36, marginLeft: 0 }}>
				取消</Button>]
		const menu = (
			<Menu className="yc-components-topMenu" style={{ marginTop: 8, }}>
				<Menu.Item key="0">
					<div onClick={this.showModal} className="yc-components-topMenu_item">修改密码</div>
				</Menu.Item>
				<Menu.Item key="1">
					<div onClick={this.logOut.bind(this)} className="yc-components-topMenu_item">退出登录</div>
				</Menu.Item>
			</Menu>
		);

		return (
			<div>
				<div className="top-title">
					<img src={logo} alt="" />
					<p className="title">
						源诚数据资产平台
					</p>
					<div className="user-message">
						<Dropdown className="user-drop" overlay={menu} trigger={['click']}>
							<a className="dropdown-link" href="" style={{ marginRight: 10 }}>
								Hi, {user} <Icon type="down" />
							</a>
						</Dropdown>
					</div>
				</div>
				<Modal
					title="修改密码"
					visible={visible}
					destroyOnClose={true}
					closable={true}
					onCancel={this.handleCancel}
					footer={footer}
				>
					<Form {...formItemLayout}>
						<Form.Item label="原密码">
							{getFieldDecorator('oldPassword', {
								rules: [
									{ required: true, whitespace: true, message: "原密码不能为空" },
									{ min: 6, message: '密码小于6位' },
								],
								getValueFromEvent(event) {
									return event.target.value.replace(/[\s|\u4e00-\u9fa5]/g, "")
								},
								validateFirst: true,
								validateTrigger: ['onSubmit', 'onBlur', 'onChange'],
							})(
								<Input
									maxLength={20}
									style={{ marginLeft: 8, width: 265, height: 32 }}
									className="yc-input"
									placeholder="请输入原密码"
								/>,
							)}
						</Form.Item>
						<Form.Item label="新密码">
							<Tooltip placement="top" title={'长度6-20位字符，不支持空格'} visible={this.state.passwordTipVisible}>
								<span onMouseOver={this.handlePasswordTipVisible.bind(this, true)} onMouseLeave={this.handlePasswordTipVisible.bind(this, false)}>
									{getFieldDecorator('newPassword',
										{
											rules: [
												{ required: true, whitespace: true, message: "新密码不能为空" },
												{ min: 6, message: '密码小于6位' },
												{ validator: oldAndNewPasswordValidator.bind(this) }
											],
											getValueFromEvent(event) {
												return event.target.value.replace(/[\s|\u4e00-\u9fa5]/g, "")
											},
											validateFirst: true,
											validateTrigger: ['onSubmit', 'onBlur', 'onChange'],
										})(
											<Input
												maxLength={20}
												onFocus={this.handlePasswordTipVisible.bind(this, false)}
												style={{ marginLeft: 8, width: 265, height: 32 }}
												className="yc-input"
												placeholder="请输入新密码，长度为6-20位，不允许有空格" />
										)}
								</span>
							</Tooltip>
						</Form.Item>
						{/* <span className="yc-components-hotDot" style={{ display: 'relative', left: 5, top: 187 }}>*</span> */}
						<Form.Item label={label}>
							{getFieldDecorator('confirmNewPassword', {
								rules: [
									{ required: true, whitespace: true, message: "两次新密码不一致" },
									{ validator: twoNewPasswordValidator.bind(this) }
								],
								getValueFromEvent(event) {
									return event.target.value.replace(/[\s|\u4e00-\u9fa5]/g, "")
								},
								validateFirst: true,
								validateTrigger: ['onSubmit', 'onBlur', 'onChange'],
							})(
								<Input
									maxLength={20}
									style={{ marginLeft: 8, width: 265, height: 32 }}
									className="yc-input"
									placeholder="请确认新密码，长度为6-20位，不允许有空格"
									autoComplete="new-password"
								/>,
							)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default withRouter(pswForm()(topMenu));

