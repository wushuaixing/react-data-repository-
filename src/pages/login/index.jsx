/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Tooltip } from 'antd';
import box from '../../assets/img/box.png';
import logo from '../../assets/img/logo.png';
import miniLogo from '../../assets/img/logo_blue.png';
import { login, codeImage, validateImgCode, resetPassword } from '../../server/api';
import 'antd/dist/antd.css';
import './style.scss';
// ==================
// 所需的所有组件
// ==================
const loginForm = Form.create;
let storage = window.localStorage;
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
		};
	}

	componentWillMount() {

		//获取图形验证码
		this.toRefreshImg();

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

	//验证账号密码-输入框格式
	handleValidator = (rule, val, callback) => {
		if(rule.field === "username"){
			if(!val){
				callback('账号不能为空');
			}
			else if(!val.match(/[0-9]{11}/)){
				callback('账号长度为11位数字');
			}
		}
		if(rule.field === "password"){
			if(!val){
				callback('密码不能为空');
			}
			else if(val.length>20 || val.length<6){
				callback('密码长度为6-20位');
			}
		}
		//找回密码的格式验证
		if(rule.field === "psw"){
			if(!val){
				callback('密码不能为空');
			}
			else if(val.length>20 || val.length<6){
				callback('密码长度为6-20位');
			}
		}
	};

	//接口异步 验证账号密码
	static async handleSubmit(info,history){
		const res= await login(info);
		if (res.data.code === 200) {
			storage.setItem("userState", res.data.data.ROLE);
			storage.setItem("userName", res.data.data.NAME);
			history.push('/home');

		} else {
			console.log('wrong');
		}
	};

  //提交账号密码
	handleCorrect = e => {
		e.preventDefault();
		const values={
			username: this.props.form.getFieldValue('username'),
			password: this.props.form.getFieldValue('password'),
			rememberMe: true,
		};
		const history=this.props.history;
		Login.handleSubmit(values,history);
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
				// this.$Message.error(res.data.message);
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
					// this.$Message.info("验证码发送成功，请查收短信");
					this.setState({
						display_button:'none',
						display_disabled:'',
					});
					setTimeout(this.newSend,1000);
				} else {
					if(res.data.message==="非法请求,请获取图形验证码"){
						res.data.message="请点击刷新图形验证码";
						// this.$Message.error(res.data.message);
						this.setState({
							display_button:'',
							display_disabled:'none',
						});
						// clearTimeout(7);
					}
					// this.$Message.error(res.data.message);
				}
			});
		}

	};

	//60秒后重新获取验证码
	newSend = () => {
		if(this.state.wait === 0) {
			this.setState({
				wait: 60,
				display_button:'',
				display_disabled:'none',
			});
		}
		else{
			this.state.wait--;
			this.setState({
				wait: this.state.wait,
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
				// this.$Message.info("修改成功");
				// this.loading = false;
				// this.forgetPsw = false;
				findPsw=Object.assign({},{
					username: "",
					imageCode: "",
					smsCode: "",
					password: "",
					confirmPassword: ""
				});
			} else {
				// this.$Message.error(res.data.message);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { imgSrc, wait } = this.state;
		return (
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
													{ validator: this.handleValidator }
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
										{ validator: this.handleValidator }
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
										{ validator: this.handleValidator }
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
		);
	}
}

export default loginForm()(Login);
