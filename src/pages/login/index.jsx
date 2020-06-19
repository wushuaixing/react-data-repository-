/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { login, codeImage } from '../../server/api';
import ForgetPasswordForm from '@/components/login/forgetPasswordForm';
import box from '../../assets/img/loginPage-box.png';
import logo from '../../assets/img/loginPage-logoText.png';
import miniLogo from '../../assets/img/loginPage-logo.png';

import './style.scss';

const { confirm, info } = Modal;

function showManyTimeErrorConfirm(num) {
	confirm({
		content: `账号或密码多次错误，您还可以尝试${10 - num}次，是否需要找回密码?`,
		onOk: () => {
			//找回密码的逻辑
			this.setState({
				showForm: 'findPassword'
			})
		},
		okText: '忘记密码'
	});
}
function showFreezeConfirm() {
	info({
		content: `账号或密码多次错误，请1小时后再试`,
		okText: '我知道了'
	});
}
//容器底部
function ContainerFooter() {
	return (
		<div className="yc-login-footer">
			<div className="footer-container">
				<div className="footer-tech">
					<img src={miniLogo} alt="" className="footer-tech-logo" />
					<span>杭州源诚科技有限公司 技术支持</span>
				</div>
				<div className="footer-copyright">
					<span>
						Copyright©2018杭州源诚科技有限公司 备案号：浙ICP备17030014号
						</span>
				</div>
			</div>
		</div>
	)
}

let storage = window.localStorage;
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: 'login', //展示表单  1.login 登录表单 2.findPassword 找回密码表单
			phoneCodeButton: 'get', // 获取手机验证码按钮展现样式 1.get 获取 2.again 重新获取需要s秒(倒计时)
			ifAutoLogin: false, //设置是否自动登录
			codeImgSrc: '',  //图片验证码
			loading: false, //提交表单的loading样式
			iconColor: 'rgba(0,0,0,.25)', //图标背景色相同 设置变量统一管理
			errorCount: 0 //错误次数
		};
	}
	componentDidMount() {
		this.toRefreshImg();
	}
	//切换登录和找回密码表单
	switchForm() {
		const { showForm } = this.state;
		this.setState({
			showForm:showForm==='login'? 'findPassword' : 'login'
		})
	};
	handleCorrect() {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.handleSubmit(values);
			}
		});
	}
	handleResetPasswordSuccess() {
		this.setState({
			showForm: 'login'
		})
	}
	//接口异步 验证账号密码
	async handleSubmit(params) {
		this.setState({
			loading: true,
		});
		const res = await login(params);
		this.setState({
			loading: false,
		});
		if (res.data.code === 200) {
			storage.setItem("userState", res.data.data.ROLE);
			storage.setItem("userName", res.data.data.NAME);
			this.props.history.push({ pathname: '/index', query: { info: 'success' } });
		} else {
			this.setState({
				errorCount: res.data.data.errCount
			}, () => {
				this.handleErrorModalAndInfoByTime(res.data.message)
			})
		}

	};
	//根据错误次数显示对应消息,验证码,对话框
	handleErrorModalAndInfoByTime(messageText) {
		const { errorCount } = this.state;
		if (errorCount >= 6 && errorCount < 10) {
			messageText==='图形验证码输入错误'?message.error(messageText):showManyTimeErrorConfirm.bind(this)(errorCount);
			this.toRefreshImg()
		} else if (errorCount >= 10) {
			showFreezeConfirm.bind(this)();
			this.toRefreshImg()
		} else if (errorCount >= 3) {
			message.error(messageText);
			this.toRefreshImg()
		} else {
			message.error(messageText)
		}
	}
	//点击刷新图形验证码
	toRefreshImg = () => {
		codeImage().then(res => {
			if (res.data.code === 200) {
				this.setState({
					codeImgSrc: res.data.data
				});
			} else {
				message.error(res.data.message)
			}
		});
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { codeImgSrc, loading, errorCount, showForm } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div className="yc-login">
					<div className="yc-login-header" data-remark='头部图标和公司文字'><img src={logo} alt="" /></div>
					<div className="yc-login-container">
						<div className="yc-container-body">
							<div className="yc-left" data-remark='登录页展示图片中的小"盒子"'>
								<img src={box} width="650" height="600" alt="" />
							</div>
							{
								showForm === 'login' &&
								<div className={errorCount < 3 ? 'yc-right-login-noCode' : 'yc-right-login-withCode'}>
									<div className="yc-form-title">用户登录</div>
									<Form className="login-form" >
										<Form.Item>
											{getFieldDecorator('username', {
												rules: [
													{ required: true, whitespace: true, message: "请输入账号" }
												],
												getValueFromEvent(event) {
													return event.target.value.replace(/\D/g, "")
												},
												validateTrigger: ['onSubmit','onBlur'],
											})(
												<Input
													maxLength={11}
													className="yc-input"
													prefix={<Icon type="user" style={{ color: this.state.iconColor }} />}
													placeholder="请输入11位账号"
												/>,
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('password', {
												rules: [ { required: true, whitespace: true, message: "请输入密码" }],
												getValueFromEvent(event) {
													return event.target.value.replace(/[\s|\u4e00-\u9fa5]/g, "")
												},
												validateTrigger: ['onSubmit','onBlur'],
											})(
												<Input
													maxLength={20}
													className="yc-input"
													prefix={<Icon type="lock" style={{ color: this.state.iconColor }} />}
													type="password"
													placeholder="请输入密码"
												/>,
											)}
										</Form.Item>
										{
											errorCount >= 3 ?
												<Form.Item>
													{getFieldDecorator('imageVerifyCode', {
														rules: [{ required: true, whitespace: true, message: '请输入验证码', }],
														getValueFromEvent(event) {
															return event.target.value.replace(/\s/g, "")
														},
														validateTrigger: ['onSubmit','onBlur'],
													})(
														<Input
															style={{ width: 175 }}
															className="yc-input"
															prefix={<Icon type="check-circle" style={{ color: this.state.iconColor }} />}
															placeholder="请输入图片验证码"
														/>,
													)}
													<span onClick={this.toRefreshImg.bind(this)}><img src={codeImgSrc} alt="" style={{ width: 140, height: 38, marginLeft: 5 }} /></span>
												</Form.Item> : null
										}
										<Form.Item style={{ marginTop: -20 }}>
											{getFieldDecorator('rememberMe', {
												valuePropName: 'checked',
												initialValue: false,
											})(<Checkbox className="yc-forget" style={{ marginLeft: 6, fontSize: 12, visibility: 'hidden' }} disabled>下次自动登录</Checkbox>)}
											<a className="yc-forget" onClick={this.switchForm.bind(this)} style={{ marginLeft: 145 }}>
												忘记密码?
											</a>
											<Button type="primary" htmlType="submit" className="yc-login-button" onMouseDown={this.handleCorrect.bind(this)}>
												登录
											</Button>
										</Form.Item>
									</Form>
								</div>
							}
							{
								showForm === 'findPassword' &&
								<ForgetPasswordForm handleSwitchBack={this.switchForm.bind(this)} resetPasswordSuccess={this.handleResetPasswordSuccess.bind(this)}/>
							}
						</div>
						<ContainerFooter/>
					</div>
				</div>
			</Spin>
		);
	}
}

export default withRouter(Form.create()(Login));
