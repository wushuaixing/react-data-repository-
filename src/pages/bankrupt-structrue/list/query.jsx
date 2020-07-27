import React from 'react';
import {withRouter} from "react-router";
import {DatePicker, Form, Input} from "antd";
import {SearchAndClearButtonGroup} from "@/components/common";

class ListQuery extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	disabledStartDate = (startValue,endField) => {
		const { getFieldValue } = this.props.form;
		const endValue = getFieldValue(endField);
		if (!startValue || !endValue) return false;
		const _startValue= new Date(startValue.valueOf()).setHours(0,0,0,0);
		return _startValue > endValue.valueOf();
	};

	disabledEndDate = (endValue,startField) => {
		const { getFieldValue } = this.props.form;
		const startValue = getFieldValue(startField);
		if (!endValue || !startValue) return false;
		return endValue.valueOf() <= startValue.valueOf();
	};

	render() {
		const { form:{ getFieldDecorator } } = this.props;
		return (
			<div className="list-query-wrapper">
				<Form layout="inline" onSubmit={this.handleSearch} >
					<Form.Item label="企业">
						{getFieldDecorator('title', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 240 }} placeholder="请输入破产企业名称" />)}
					</Form.Item>
					<Form.Item label="标题">
						{getFieldDecorator('title', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 240 }} placeholder="拍卖信息标题" />)}
					</Form.Item>
					<Form.Item label="结构化时间">
						{getFieldDecorator('structuredStartTime', { initialValue: null })(
							<DatePicker placeholder="开始时间" disabledDate={val=>this.disabledStartDate(val,'structuredEndTime')} style={{ width: 120 }} />)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('structuredEndTime', { initialValue: null })(
							<DatePicker placeholder="结束时间" disabledDate={val=>this.disabledEndDate(val,'structuredStartTime')} style={{ width: 120 }}	/>)}
					</Form.Item>
					<Form.Item label="更新时间">
						{getFieldDecorator('startTime', { initialValue: null })(
							<DatePicker placeholder="开始时间" disabledDate={val=>this.disabledStartDate(val,'endTime')} style={{ width: 120 }} />)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('endTime', { initialValue: null })(
							<DatePicker placeholder="结束时间" disabledDate={val=>this.disabledEndDate(val,'startTime')} style={{ width: 120 }}	/>)}
					</Form.Item>
					<Form.Item>
						<SearchAndClearButtonGroup handleClearSearch={this.clearSearch}/>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create()(ListQuery))
