/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Tooltip, message, Spin } from 'antd';
import {withRouter} from 'react-router-dom';
import { login, isLogin,codeImage, validateImgCode, resetPassword } from '../../server/api';
import {codeMessage} from "../../static/status";
import {validatorLogin} from "../../util/commonMethod";
import box from '../../assets/img/box.png';
import logo from '../../assets/img/logo.png';
import miniLogo from '../../assets/img/logo_blue.png';
import 'antd/dist/antd.css';
import './style.scss';

const loginForm = Form.create;
let storage = window.localStorage;
const{	assetUser,adminUser,checkUser}=codeMessage;
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display_login:'',
			display_find:'none',
			display_button:'',
			display_disabled:'none',
			findPsw: false,
			imgSrc:'',
			wait: 60,
			loading:false,
		};
	}

	componentDidMount() {
		const myState=localStorage.getItem("userState");
		const {history}=this.props;
		isLogin().then(res=>{
			if(res.data.code===200 && myState){
				history.push('/index');
				if(res.data.data===assetUser){
					localStorage.setItem("userState","结构化人员");
				}
				if(res.data.data===adminUser){
					localStorage.setItem("userState","管理员");
				}
				if(res.data.data===checkUser){
					localStorage.setItem("userState","检查人员");
				}
			}
			else{
			}
		});
		//获取图形验证码
		this.toRefreshImg();
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return
		}
	}



	//切换登录和找回密码
	ifFindPsw=()=>{
		const {findPsw}=this.state;
		if(!findPsw){
			this.setState({
				display_login: 'none',
				display_find: '',
				findPsw: true,
			})
		}
		else{
			this.setState({
				display_login:'',
				display_find:'none',
				findPsw: false,
			})
		}
	};

	//接口异步 验证账号密码
	async handleSubmit(info){
		const {loading}=this.state;
		console.log(loading);
		const {history} = this.props;
		// debugger
		try {
			this.setState({
				loading:true,
			});
			const res = await login(info);
			if (res.data.code === 200) {
				this.setState({
					loading:false,
				});
				console.log(res.data.data.ROLE);
				storage.setItem("userState", res.data.data.ROLE);
				storage.setItem("userName", res.data.data.NAME);
				history.push('/index');
				/*if(res.data.data.ROLE === "结构化人员"){
					history.push('/structureAsset');
				}else if(res.data.data.ROLE === "管理员"){
					history.push('/admin/account');
				}*/
			} else {
				message.error(res.data.message)
			}
		} catch (error) {
			// 如果网络请求出错了，做一些降级处理
			console.error(error);
		}

	};

  //提交账号密码
	handleCorrect = e => {
		e.preventDefault();
		const values={
			username: this.props.form.getFieldValue('username'),
			password: this.props.form.getFieldValue('password'),
			rememberMe: false,
		};
		this.handleSubmit(values);
		// console.log(this.props.history);
	};

	//点击刷新图形验证码
	toRefreshImg = () => {
		codeImage().then(res => {
			if (res.data.code === 200) {
				this.setState({
					imgSrc: res.data.data
				});
			} else {
				message.error(res.data.message)
			}
		});
	};

	//点击按钮验证图形验证码，若成功则获取手机验证码
	validateImgAndSendMobileCode = () =>{
		let params={
			imageCode: this.props.form.getFieldValue('imgCode'),
			username: this.props.form.getFieldValue('phone'),
		};
		if(params.username && params.imageCode){
			validateImgCode(params).then(res => {
				if (res.data.code === 200) {
					message.success("验证码发送成功，请查收短信");
					this.setState({
						display_button:'none',
						display_disabled:'',
					});
					setTimeout(this.newSend,1000);
				} else {
					if(res.data.message==="非法请求,请获取图形验证码"){
						res.data.message="请点击刷新图形验证码";
						message.info(res.data.message);
						this.setState({
							display_button:'',
							display_disabled:'none',
						});
						// clearTimeout(7);
					}
					message.error(res.data.message)
				}
			});
		}

	};

	//60秒后重新获取验证码
	newSend = () => {
		// props 和 state 里面的值应该这样析够出来
		const { wait } = this.state;
		if(wait === 0) {
			this.setState({
				wait: 60,
				display_button:'',
				display_disabled:'none',
			});
		}
		else{
			//不能直接操作state的值自减
			let temp = wait - 1;
			this.setState({
				wait: temp,
				display_button:'none',
				display_disabled:'',
			});
			setTimeout(this.newSend,1000);
		}
	};

	//提交 找回密码
	toSubmitFindPsw=()=>{
		let findPsw={
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
				findPsw=Object.assign({},{
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
		const { imgSrc, wait, loading } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div className="yc-login">
					<div style={{ opacity: 0, height: 0, display: 'none' }}>
						<input type="text" />
						<input type="password" />
					</div>
					<div className="yc-login-header">
						<div className="header-img">
							<img src={logo} alt="" />
						</div>
					</div>
					<div className="yc-login-container">
						<div className="yc-container-body">
							<div className="yc-left">
								<img src={box} width="650" height="600" alt="" />
							</div>
							<div className="yc-right-login" style={{ display: this.state.display_login }}>
								<p className="yc-form-title">用户登录</p>
								<Form onSubmit={this.handleCorrect} className="login-form" >
									<Form.Item>
										{getFieldDecorator('username', {
											rules:[
												// { require: true, message: "请输入账号", },
															{ validator: validatorLogin }
													 ],
											validateTrigger:'onBlur',
										})(
											<Input
												className="yc-input"
												prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
												placeholder="请输入账号"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('password', {
											rules:[
												// { required: true, message: '请输入密码', },
												{ validator: validatorLogin }
												],
											validateTrigger:'onBlur',
										})(
											<Input
												className="yc-input"
												prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入密码"
											/>,
										)}
									</Form.Item>
									<Form.Item style={{marginTop:-20}}>
										{getFieldDecorator('remember', {
											valuePropName: 'checked',
											initialValue: true,
										})(<Checkbox className="yc-forget" style={{marginLeft:6, fontSize:12}}>下次自动登录</Checkbox>)}
										<a className="yc-forget" href="#" onClick={this.ifFindPsw} style={{marginLeft:145}}>
											忘记密码
										</a>
										<Button type="primary" htmlType="submit" className="yc-login-button">
											登录
										</Button>
									</Form.Item>
								</Form>
							</div>
							<div className="yc-right-login" style={{ display: this.state.display_find, height:500, marginTop: -10 }}>
								<p className="yc-form-title">找回密码</p>
								<Form onSubmit={this.toSubmitFindPsw} className="login-form" style={{ marginTop: -10 }} >
									<Form.Item>
										{getFieldDecorator('phone', {})(
											<Input
												className="yc-input"
												prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
												placeholder="请输入手机号"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('imgCode',)(
											<Input
												className="yc-input"
												prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入图形验证码"
												suffix={
													<Tooltip title="点击刷新图形验证码">
														<img src={imgSrc} alt="" onClick={this.toRefreshImg} />
													</Tooltip>
												}
											/>
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('mobileCode',)(
											<Input
												className="yc-input"
												prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入手机验证码"
												suffix={
													<div>
													<Button type="default"
																	className="yc-get-code"
																	onClick={this.validateImgAndSendMobileCode}
																	style={{ display: this.state.display_button}}
													>
														获取验证码
													</Button>
													<Button type="default"
																	className="yc-get-code"
																	disabled
																	style={{ display: this.state.display_disabled}}
													>
													重新获取验证码{wait}s
													</Button>
													</div>
												}
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('psw', {
											rules:[
												// { required: true, message: '请输入密码', },
												{ validator: validatorLogin }
											],
											validateTrigger:'onBlur',
										})(
											<Input
												className="yc-input"
												prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入新密码"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('pswConfirm', {
											rules:[
												// { required: true, message: '请输入密码', },
												// { validator: this.handleValidator }
											],
											// validateTrigger:'onBlur',
										})(
											<Input
												className="yc-input"
												prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入新密码验证"
											/>,
										)}
									</Form.Item>
									<Form.Item style={{marginTop:-25}}>
										<a className="yc-forget" href="#" onClick={this.ifFindPsw} style={{marginLeft:270}}>
											返回登录
										</a>
										<Button type="primary" htmlType="submit" className="yc-login-button" style={{marginTop:-20}}>
											提交
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
						<div className="yc-login-footer">
							<div className="footer-container">
								<div className="footer-tech">
									<img src={miniLogo}  alt="" />
									<span style={{marginLeft:6}}>杭州源诚科技有限公司 技术支持</span>
								</div>
								<div className="footer-copyright">
									<span>
										Copyright©2019杭州源诚科技有限公司 备案号：浙ICP备17030D14
									</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Spin>
		);
	}
}

export default withRouter(loginForm()(Login));
