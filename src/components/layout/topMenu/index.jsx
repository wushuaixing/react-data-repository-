/** topMenu * */
import React from 'react';
import { Dropdown, Menu, Icon, Modal,message,Input,Button,Form  } from "antd";
import { withRouter } from 'react-router-dom';
import logo from "../../../assets/img/top_logo.png";
import {changePassword, logout} from "../../../server/api";
import {handleValidator} from "../../../utils/validators";
import 'antd/dist/antd.css';
import './style.scss';

const pswForm = Form.create;
const formItemLayout = {
	labelCol: {
		sm: { span:6,offset:0 },
	},
};

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
		let options=this.props.form.getFieldsValue();
		console.log(options);
		changePassword(options).then(res => {
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
		const { getFieldDecorator } = this.props.form;

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
			<div>
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
							<a className="dropdown-link" href="" style={{marginRight:10}}>
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
					footer={[
						// 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
						<Button key="submit"
										type="primary"
										onClick={this.handleOk}
										style={{backgroundColor:'#0099CC',width: 120,height: 36,marginRight:15}}
						>
							确定
						</Button>,
						<Button key="back"
										onClick={this.handleCancel}
										style={{width: 120,height: 36, marginLeft: 0 }}
						>
							取消</Button>
					]}
				>
					<Form {...formItemLayout}>
						<Form.Item label="原密码">
							{getFieldDecorator('oldPassword', {})(
								<Input
									style={{marginLeft: 8,width: 265,height: 32 }}
									className="yc-input"
									placeholder="请输入原密码"
								/>,
							)}
						</Form.Item>
						<Form.Item label="新密码">
							{getFieldDecorator('newPassword',
								{
									rules:[
									{ validator: handleValidator }
								],
								validateTrigger:'onBlur',
							})(
								<Input
									style={{marginLeft: 8,width: 265,height: 32 }}
									className="yc-input"
									placeholder="请输入新密码，长度为6-20位，不允许有空格"
									autoComplete="new-password"
								/>,
							)}
						</Form.Item>
						<Form.Item label="请确认新密码">
							{getFieldDecorator('confirmNewPassword', {
								rules:[
									{ validator: handleValidator }
								],
								validateTrigger:'onBlur',
							})(
								<Input
									style={{marginLeft: 8,width: 265,height: 32 }}
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

