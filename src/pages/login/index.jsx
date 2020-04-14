/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Tooltip, message, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import { login, isLogin, codeImage, validateImgCode, resetPassword } from '../../server/api';
import { codeMessage } from "../../static/status";
import { validatorLogin } from "../../utils/validators";
import box from '../../assets/img/loginPage-box.png';
import logo from '../../assets/img/loginPage-logoText.png';
import miniLogo from '../../assets/img/loginPage-logo.png';
import 'antd/dist/antd.css';
import './style.scss';

//头部图标和公司文字
function Header() {
	return (
		<div className="yc-login-header">
			<img src={logo} alt="" />
		</div>
	)
}
//登录页展示图片中的小"盒子"
function LoginPagePresentationImg() {
	return (
		<div className="yc-left">
			<img src={box} width="650" height="600" alt="" />
		</div>
	)
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
						Copyright©2019杭州源诚科技有限公司 备案号：浙ICP备17030D14
						</span>
				</div>
			</div>
		</div>
	)
}

const loginForm = Form.create;
let storage = window.localStorage;
const { assetUser, adminUser, checkUser } = codeMessage;
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: 'login', //展示表单  1.login 登录表单 2.findPassword 找回密码表单 
			phoneCodeButton: 'get', // 获取手机验证码按钮展现样式 1.get 获取 2.again 重新获取需要s秒(倒计时)
			ifAutoLogin: false, //设置是否自动登录
			codeImgSrc: '',  //图片验证码
			wait: 0, //设置计时时间 保存两次短信的等待时间
			loading: false, //提交表单的loading样式
			iconColor: 'rgba(0,0,0,.25)', //图标背景色相同 设置变量统一管理
		};
	}
	componentDidMount() {
		const myState = localStorage.getItem("userState");
		const { history } = this.props;
		isLogin().then(res => {
			if (res.data.code === 200 && myState) {
				history.push('/index');
				if (res.data.data === assetUser) {
					localStorage.setItem("userState", "结构化人员");
				}
				if (res.data.data === adminUser) {
					localStorage.setItem("userState", "管理员");
				}
				if (res.data.data === checkUser) {
					localStorage.setItem("userState", "检查人员");
				}
			}
			else {
			}
		});
		//获取图形验证码
		this.toRefreshImg();
	}
	//切换登录和找回密码表单
	switchToFindPassword = () => {
		let showForm = this.state.showForm === 'login' ? 'findPassword' : 'login'
		this.setState({
			showForm
		})
	};
	//接口异步 验证账号密码
	async handleSubmit(info) {
		const { history } = this.props;
		try {
			this.setState({
				loading: true,
			});
			const res = await login(info);
			if (res.data.code === 200) {
				this.setState({
					loading: false,
				});
				storage.setItem("userState", res.data.data.ROLE);
				storage.setItem("userName", res.data.data.NAME);
				history.push('/index');
			} else {
				this.setState({
					loading: false,
				}, () => {
					message.error(res.data.message)
				});
			}
		} catch (error) {
			console.error(error);
		}

	};

	//提交账号密码
	handleCorrect = e => {
		e.preventDefault();
		const values = {
			username: this.props.form.getFieldValue('username'),
			password: this.props.form.getFieldValue('password'),
			rememberMe: false,
		};
		this.handleSubmit(values);
	};

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

	//点击按钮验证图形验证码，若成功则获取手机验证码
	validateImgAndSendMobileCode = () => {
		let params = {
			imageCode: this.props.form.getFieldValue('imgCode'),
			username: this.props.form.getFieldValue('phone'),
		};

		if (params.username && params.imageCode) {
			validateImgCode(params).then(res => {
				if (res.data.code === 200) {
					message.success("验证码发送成功，请查收短信");
					this.setState({
						phoneCodeButton: 'again',
						wait: 60
					}, () => {
						this.newSend()
					});
				} else {
					if (res.data.message === "非法请求,请获取图形验证码") {
						res.data.message = "请点击刷新图形验证码";
						message.info(res.data.message);
					}
					message.error(res.data.message)
				}
			});
		}

	};
	//60秒后重新获取验证码
	newSend = () => {
		const { wait } = this.state;
		if (wait === 0) {
			this.setState({
				phoneCodeButton: 'get'
			});
		}
		else {
			let temp = wait - 1;
			this.setState({
				wait: temp,
				phoneCodeButton: 'again'
			});
			setTimeout(this.newSend, 1000);
		}
	};

	//提交 找回密码
	toSubmitFindPsw = () => {
		let findPsw = {
			imageCode: this.props.form.getFieldValue('imgCode'),
			username: this.props.form.getFieldValue('phone'),
			smsCode: this.props.form.getFieldValue('mobileCode'),
			password: this.props.form.getFieldValue('psw'),
			confirmPassword: this.props.form.getFieldValue('pswConfirm'),
		};
		resetPassword(findPsw).then(res => {
			// this.loading = false;
			if (res.data.code === 200) {
				message.success("修改成功");
				findPsw = Object.assign({}, {
					username: "",
					imageCode: "",
					smsCode: "",
					password: "",
					confirmPassword: ""
				});
			} else {
				message.error(res.data.message)
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { codeImgSrc, wait, loading } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div className="yc-login">
					<Header></Header>
					<div className="yc-login-container">
						<div className="yc-container-body">
							<LoginPagePresentationImg />
							{
								this.state.showForm === 'login' &&
								<div className="yc-right-login">
									<p className="yc-form-title">用户登录</p>
									<Form onSubmit={this.handleCorrect} className="login-form" >
										<Form.Item>
											{getFieldDecorator('username', {
												rules: [
													{
														validator: validatorLogin,
													}
												],
												validateTrigger: 'onBlur',
											})(
												<Input
													className="yc-input"
													prefix={<Icon type="user" style={{ color: this.state.iconColor }} />}
													placeholder="请输入账号"
												/>,
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('password', {
												rules: [
													{
														validator: validatorLogin,
													}
												],
												validateTrigger: 'onBlur',
											})(
												<Input
													className="yc-input"
													prefix={<Icon type="lock" style={{ color: this.state.iconColor }} />}
													type="password"
													placeholder="请输入密码"
												/>,
											)}
										</Form.Item>
										<Form.Item style={{ marginTop: -20 }}>
											{getFieldDecorator('remember', {
												valuePropName: 'checked',
												initialValue: true,
											})(<Checkbox className="yc-forget" style={{ marginLeft: 6, fontSize: 12 }}>下次自动登录</Checkbox>)}
											<a className="yc-forget" href="#" onClick={this.switchToFindPassword} style={{ marginLeft: 145, display: 'none' }}>
												忘记密码
										</a>
											<Button type="primary" htmlType="submit" className="yc-login-button">
												登录
										</Button>
										</Form.Item>
									</Form>
								</div>
							}
							{
								this.state.showForm === 'findPassword' &&
								<div className="yc-right-login" style={{ height: 500, marginTop: -10 }}>
									<p className="yc-form-title">找回密码</p>
									<Form onSubmit={this.toSubmitFindPsw} className="login-form" style={{ marginTop: -10 }} >
										<Form.Item>
											{getFieldDecorator('phone', {})(
												<Input
													className="yc-input"
													prefix={<Icon type="user" style={{ color: this.state.iconColor }} />}
													placeholder="请输入手机号"
												/>,
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('imgCode')(
												<Input
													className="yc-input"
													prefix={<Icon type="code" style={{ color: this.state.iconColor }} />}
													placeholder="请输入图形验证码"
													suffix={
														<Tooltip title="点击刷新图形验证码">
															<img src={codeImgSrc} alt="" onClick={this.toRefreshImg} />
														</Tooltip>
													}
												/>
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('mobileCode')(
												<Input
													className="yc-input"
													prefix={<Icon type="mail" style={{ color: this.state.iconColor }} />}
													type="password"
													placeholder="请输入手机验证码"
													suffix={
														<div>
															{
																this.state.phoneCodeButton === 'get' ?
																	(
																		<Button
																			type="default"
																			className="yc-get-code"
																			onClick={this.validateImgAndSendMobileCode}>
																			获取验证码
																		</Button>
																	) :
																	(
																		<Button
																			type="default"
																			className="yc-get-code"
																			disabled
																		>
																			重新获取验证码{wait}s
																		</Button>
																	)

															}
														</div>
													}
												/>,
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('psw', {
												rules: [
													// { required: true, message: '请输入密码', },
													{ validator: validatorLogin }
												],
												validateTrigger: 'onBlur',
											})(
												<Input
													className="yc-input"
													prefix={<Icon type="lock" style={{ color: this.state.iconColor }} />}
													type="password"
													placeholder="请输入新密码"
												/>,
											)}
										</Form.Item>
										<Form.Item>
											{getFieldDecorator('pswConfirm', {
												rules: [
													// { required: true, message: '请输入密码', },
													// { validator: this.handleValidator }
												],
												// validateTrigger:'onBlur',
											})(
												<Input
													className="yc-input"
													prefix={<Icon type="lock" style={{ color: this.state.iconColor }} />}
													type="password"
													placeholder="请输入新密码验证"
												/>,
											)}
										</Form.Item>
										<Form.Item style={{ marginTop: -25 }}>
											<a className="yc-forget" href="#" onClick={this.ifFindPsw} style={{ marginLeft: 270 }}>
												返回登录
										</a>
											<Button type="primary" htmlType="submit" className="yc-login-button" style={{ marginTop: -20 }}>
												提交
										</Button>
										</Form.Item>
									</Form>
								</div>
							}
						</div>
						<ContainerFooter></ContainerFooter>
					</div>
				</div>
			</Spin>
		);
	}
}

export default withRouter(loginForm()(Login));
