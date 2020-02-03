/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import box from '../../assets/img/box.png';
import logo from '../../assets/img/logo.png';
import miniLogo from '../../assets/img/logo_blue.png';
import { login } from '../../server/api';
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
			findPsw: false,
		};
	}
	componentDidMount() {

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
	};

	static async handleSubmit(info){
		const res= await login(info);
		if (res.data.code === 200) {
			storage.setItem("userState", res.data.data.ROLE);
			storage.setItem("userName", res.data.data.NAME);
		} else {
			console.log('wrong');
		}
	}

	handleCorrect = e => {
		e.preventDefault();
		const values={
			username: this.props.form.getFieldValue('username'),
			password: this.props.form.getFieldValue('password'),
			rememberMe: true,
		};
		Login.handleSubmit(values);
		// console.log(this.props.history);
		this.props.history.push('/adminList');
	};

	render() {
		const { getFieldDecorator } = this.props.form;
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
						<Form onSubmit={this.handleCorrect} className="login-form" style={{ marginTop: -10 }} >
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
										placeholder="请输入手机号"
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
										prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />}
										type="password"
										placeholder="请输入验证码"
									/>,
									<Button type="primary" class="yc-get-code" onClick={this.getMobileCode} style={{marginTop:-10}}>获取验证码
									</Button>
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
										prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
										type="password"
										placeholder="请输入手机验证码"
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
										placeholder="请输入新密码"
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
