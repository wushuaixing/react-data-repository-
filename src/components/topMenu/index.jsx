/** check * */
import React from 'react';
import { Dropdown, Menu, Icon  } from "antd";
import './style.scss';
import logo from "../../assets/img/top_logo.png";

const menu = (
	<Menu className="user-menu" style={{marginTop: 8,}}>
		<Menu.Item key="0">
			<a href="">修改密码</a>
		</Menu.Item>
		<Menu.Item key="1">
			<a href="">退出登录</a>
		</Menu.Item>
	</Menu>
);

class topMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user:'User',
		};
	}

	render() {
		const { user } = this.state;
		return (
				<div className="top-title">
					<img src={logo} alt="" />
					<p className="title">
						源诚数据资产平台
					</p>
					<div className="user-message">
						<Dropdown className="user-drop" overlay={menu} trigger={['click']}>
							<a className="dropdown-link" href="#" >
								Hi, {user}~ <Icon type="down" />
							</a>
						</Dropdown>
					</div>
				</div>
		);
	}
}

export default topMenu;

