/** check * */
import React from 'react';
import { Dropdown, Menu, Icon, Modal  } from "antd";
import './style.scss';
import logo from "../../assets/img/top_logo.png";
import Input from "antd/es/input";



class topMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				visible: false,
		};
	}

	showModal=()=>{
		this.setState({
			visible: true,
		});
	};

	handleOk = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	render() {
		const { user } = this.props;
		const menu = (
			<Menu className="user-menu" style={{marginTop: 8,}}>
				<Menu.Item key="0">
					<p onClick={this.showModal}>修改密码</p>
				</Menu.Item>
				<Menu.Item key="1">
					<p>退出登录</p>
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
						<Dropdown className="user-drop" overlay={menu} trigger={['click']}>
							<a className="dropdown-link" href="#" >
								Hi, {user} <Icon type="down" />
							</a>
						</Dropdown>
						<Modal
							style={{width:500, height:340}}
							title="修改密码"
							visible={!this.state.visible}
							onOk={this.handleOk}
							onCancel={this.handleCancel}
							destroyOnClose='true'
							closable='true'
							cancelText='取消'
							okText='确定'
						>
							<div style={{marginBottom: 20,fontSize: 14}}>
								<p
									style={{display: 'inline-block',width: 90,marginRight: 10,marginTop: 0,textAlign: 'right'}}
								>
									原密码:
								</p>
								<Input
									type="password"
									style={{width: 320,display: 'inline-block'}}
									placeholder="请输入原密码"
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
									style={{width: 320,display: 'inline-block'}}
									placeholder="请输入新密码，长度为6-20位，不允许有空格"
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
									style={{width: 320,display: 'inline-block'}}
									placeholder="请确认新密码，长度为6-20位，不允许有空格"
								/>
							</div>
							</Modal>
					</div>
				</div>
		);
	}
}

export default topMenu;

