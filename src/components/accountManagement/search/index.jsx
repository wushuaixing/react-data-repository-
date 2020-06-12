import React from 'react';
import Button from "antd/es/button";
import { Select, Form, Input } from 'antd';
import { CHARACTER_LIST } from '@/static/status'
import './style.scss';
import { SearchAndClearButtonGroup } from '@commonComponents'
const { Option } = Select;

class Index extends React.Component {
	clearSearch = () => {
        this.props.form.resetFields();
        this.props.handleClear();
	};
	handleSearch(e){
		e.preventDefault();
		this.props.handleSearch(this.props.form.getFieldsValue())
	}
	render() {
		const { username, role } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="yc-components-accountManagement-search" >
				<Form layout="inline" onSubmit={this.handleSearch.bind(this)}>
					<Form.Item label="账号/姓名">
						{
							getFieldDecorator('username', {
								initialValue: username
							})(
								<Input placeholder="请输入账号或姓名" style={{ width: 240 }}></Input>
							)}
					</Form.Item>
					<Form.Item label="角色">
						{
							getFieldDecorator('role', {
								initialValue: role
							})(
								<Select style={{ width: 75, marginLeft: 4 }}>
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
							)}
					</Form.Item>
					<Form.Item>
                        <SearchAndClearButtonGroup handleClearSearch={this.clearSearch} />
                    </Form.Item>
				</Form>
			</div>
		);
	}
}
export default Form.create()(Index)
