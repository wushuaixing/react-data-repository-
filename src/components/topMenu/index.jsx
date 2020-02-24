/** check * */
import React from 'react';
import { Dropdown, Menu, Icon, Modal,message  } from "antd";
import { withRouter } from 'react-router-dom';
import logo from "../../assets/img/top_logo.png";
import Input from "antd/es/input";
import Button from "antd/es/button";
import {changePassword, logout} from "../../server/api";
import './style.scss';



class topMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				visible: false,
			 isLogout: true,
		};
	}

	showModal=()=>{
		this.setState({
			visible: true,
		});
	};

	handleOk = () => {
		const original = this.refs.originPsw.state.value;
		const newPsw = this.refs.newPsw.state.value;
		const confirm = this.refs.confirmPsw.state.value;
		console.log(this.refs.confirmPsw.state.value);
		const params={
			oldPassword: original,
		  newPassword: newPsw,
		  confirmNewPassword: confirm,
		};
		changePassword(params).then(res => {
			if (res.data.code === 200) {
				message.info("密码修改成功");
				this.props.history.push('/login')
			} else {
				message.error(res.data.message);
			}
		});
		this.setState({
			visible: false,
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	logOut =() => {
		logout().then(res => {
			if (res.data.code === 200) {
				this.props.history.push('/login');
				window.localStorage.removeItem("userState");
			} else {
				message.error(res.data.message);
			}
		});
	};

	render() {
		const { user } = this.props;
		const { visible }=this.state;
		const menu = (
			<Menu className="user-menu" style={{marginTop: 8,}}>
				<Menu.Item key="0">
					<p onClick={this.showModal}>修改密码</p>
				</Menu.Item>
				<Menu.Item key="1">
					<p onClick={this.logOut}>退出登录</p>
				</Menu.Item>
			</Menu>
		);


		return (
				<div className="top-title">
					<img src={logo} alt="" />
					<p className="title">
						源诚数据资产平台
					</p>
					<div className="user-message">
						<form style={{display:'none'}}>
							<input type="text" />
							<input type="password" />
						</form>
						<Dropdown className="user-drop" overlay={menu} trigger={['click']}>
							<a className="dropdown-link" href="#" style={{marginRight:10}}>
								Hi, {user} <Icon type="down" />
							</a>
						</Dropdown>

					</div>
					<Modal
						style={{width:500, height:340}}
						title="修改密码"
						visible={visible}
						destroyOnClose={true}
						closable={true}
						footer={[
							// 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
							<Button key="back" onClick={this.handleCancel} style={{width: 120,height: 36, marginLeft: 0 }}>取消</Button>,
							<Button key="submit" type="primary" onClick={this.handleOk} style={{backgroundColor:'#0099CC',width: 120,height: 36}}>
								确定
							</Button>
						]}
					>
						<div style={{marginBottom: 20,fontSize: 14}}>
							<p
								style={{display: 'inline-block',width: 90,marginRight: 10,marginTop: 0,textAlign: 'right'}}
							>
								原密码:
							</p>
							<Input
								type="password"
								style={{width: 240,display: 'inline-block'}}
								placeholder="请输入原密码"
								ref="originPsw"
							/>
						</div>
						<div style={{marginBottom: 20,fontSize: 14}}>
							<p
								style={{display: 'inline-block',width: 90,marginRight: 10,marginTop: 0,textAlign: 'right'}}
							>
								新密码:
							</p>
							<Input
								type="password"
								style={{width: 240,display: 'inline-block'}}
								placeholder="请输入新密码，长度为6-20位，不允许有空格"
								ref="newPsw"
							/>
						</div>
						<div style={{marginBottom: 20,fontSize: 14}}>
							<p
								style={{display: 'inline-block',width: 90,marginRight: 10,marginTop: 0,textAlign: 'right'}}
							>
								请确认新密码:
							</p>
							<Input
								type="password"
								style={{width: 240,display: 'inline-block'}}
								placeholder="请确认新密码，长度为6-20位，不允许有空格"
								ref="confirmPsw"
							/>
						</div>

					</Modal>
				</div>
		);
	}
}

export default withRouter(topMenu);

