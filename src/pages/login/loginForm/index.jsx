/** Login * */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { login } from '../../../server/api';
import 'antd/dist/antd.css';
import '../style.scss';

// ==================
// 所需的所有组件
// ==================
const formLogin = Form.create;
let storage = window.localStorage;
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
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
	static async handleSubmit(info){
		const res= await login(info);
		if (res.data.code === 200) {
			storage.setItem("userState", res.data.data.ROLE);
			storage.setItem("userName", res.data.data.NAME);
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
		LoginForm.handleSubmit(values);
		console.log(this.props.history);
		this.props.history.push('/adminList');
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
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
		);
	}
}

export default formLogin()(LoginForm);
