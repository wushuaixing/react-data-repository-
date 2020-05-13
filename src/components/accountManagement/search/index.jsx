import React from 'react';
import Button from "antd/es/button";
import { Select } from 'antd';
import Search from "antd/es/input/Search";
import { CHARACTER_LIST } from '@/static/status'
import './style.scss';

const { Option } = Select;

class Index extends React.Component {
	//添加账号
	addAccount = () => {
		this.props.handleShowModal('add');
	};
	//搜索
	searchAccount = (value) => {
		this.props.searchFn(value);
	};
	//角色选择
	selectRole = (value) => {
		this.props.roleFn(value);
	};
	render() {
		return (
			<div className="yc-components-accountManagement-search">
				<div className="search-container">
					<div className="search-container_body">
						<Search
							placeholder="请输入账号/姓名"
							onSearch={this.searchAccount}
							style={{ width: 240 }}
						/>
					</div>
					<div className="search-container_right">
						<p>角色:</p>
						<Select style={{ width: 75, marginLeft: 4 }} placeholder="全部" onChange={this.selectRole} transfer>
							{
								CHARACTER_LIST.map((item) => {
									return (
										<Option value={item.value} key={item.value}>
											{item.label}
										</Option>
									);
								})
							}
						</Select>
					</div>
					<Button onClick={this.addAccount.bind(this)} style={{ marginRight: 10 }}>+ 添加账号</Button>
				</div>
			</div>
		);
	}
}
export default Index
