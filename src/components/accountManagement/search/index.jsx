import React from 'react';
import { Select, Form, Input } from 'antd';
import { CHARACTER_LIST } from '@/static/status';
import './style.scss';
import { SearchAndClearButtonGroup } from '@commonComponents';

const { Option } = Select;

const strTypeArray = [
	{ id: 1, value: '', label: '全部' },
	{ id: 2, value: 8, label: '资产拍卖数据' },
	{ id: 3, value: 11, label: '破产重组数据' },
	{ id: 3, value: 26, label: '拍卖债权数据' },
];

class Index extends React.Component {
	clearSearch = () => {
		this.props.form.resetFields();
		this.props.handleClear();
	};

	handleSearch(e) {
		e.preventDefault();
		this.props.handleSearch(this.props.form.getFieldsValue());
	}

	render() {
		const { username, role ,flag} = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="yc-components-accountManagement-search">
				<Form layout="inline" onSubmit={this.handleSearch.bind(this)}>
					<Form.Item label={flag==='deleted' ? "姓名" : "账号/姓名"}>
						{
							getFieldDecorator('username', {
								initialValue: username,
								getValueFromEvent(event) {
									return event.target.value.trim();
								},
								validateTrigger: 'onBlur',
							})(
								<Input placeholder={flag==='deleted' ? "请输入姓名" : '请输入账号或姓名'} style={{ width: 240 }} autoComplete="off" />,
							)}
					</Form.Item>
					<Form.Item label="角色">
						{
							getFieldDecorator('role', {
								initialValue: role,
							})(
								<Select style={{ width: 75, marginLeft: 4 }}>
									{
										CHARACTER_LIST.map(item => (
											<Option value={item.value} key={item.value}>
												{item.label}
											</Option>
										))
									}
								</Select>,
							)}
					</Form.Item>
					<Form.Item label="结构化对象">
						{ getFieldDecorator('functions', { initialValue: '' })(
								<Select style={{ width: 120, marginLeft: 4 }}>
									{ strTypeArray.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>)) }
								</Select>	)}
					</Form.Item>
					<Form.Item>
						<SearchAndClearButtonGroup handleClearSearch={this.clearSearch} />
					</Form.Item>
				</Form>
			</div>
		);
	}
}
export default Form.create()(Index);
