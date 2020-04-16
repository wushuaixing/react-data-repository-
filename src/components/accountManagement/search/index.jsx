import React from 'react';
import Button from "antd/es/button";
import { Select } from 'antd';
import Search from "antd/es/input/Search";
import './style.scss';

const { Option } = Select;

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			characterList: [
				{
					value: 1,
					label: "正式"
				},
				{
					value: 0,
					label: "试用"
				},
				{
					value: '',
					label: "全部"
				}
			],
		};
	}
	//添加账号
	addAccount = () => {
		this.props.showModal('add');
	};
	//搜索
	searchAccount = (value) => {
		this.setState({
			searchUser: value,
		});
		this.props.searchFn(value);
	};
	//角色选择
	selectRole = (value) => {
		this.setState({
			searchRole: value,
		});
		this.props.roleFn(value);
	};

	render() {
		const { characterList } = this.state;
		return (
			<div className="yc-components-accountManagement-search">
				<div className="search-container">
					<div className="search-container_body">
						<Search
							placeholder="输入账号/姓名"
							onSearch={this.searchAccount}
							style={{ width: 240 }}
						/>
					</div>
					<div className="search-container_right">
						<p>角色:</p>
						<Select style={{ width: 75, marginLeft: 4 }} placeholder="全部" transfer>
							{
								characterList && characterList.map((item) => {
									return (
										<Option
											value={item.value}
											key={item.value}
											onChange={this.selectRole}
										>
											{item.label}
										</Option>
									);
								})
							}
						</Select>
					</div>
					<Button onClick={this.addAccount} style={{ marginRight: 10 }}>+ 添加账号</Button>
				</div>
			</div>
		);
	}
}
export default Index
