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
			<div className="list-query-wrapper ">
				<Form layout="inline" onSubmit={this.handleSearch} className='list-query-wrapper-form' >
					<Form.Item label="企业">
						{getFieldDecorator('title', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入破产企业名称" autoComplete="off"/>)}
					</Form.Item>
					<Form.Item label="标题">
						{getFieldDecorator('title', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入标题" autoComplete="off" />)}
					</Form.Item>
					<Form.Item label="结构化时间">
						{getFieldDecorator('structuredStartTime', { initialValue: null })(
							<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'structuredEndTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
						<span> 至 </span>
						{getFieldDecorator('structuredEndTime', { initialValue: null })(
							<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledEndDate(val,'structuredStartTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
					</Form.Item>
					<Form.Item label="更新时间">
						{getFieldDecorator('startTime', { initialValue: null })(
							<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'endTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
						<span> 至 </span>
						{getFieldDecorator('endTime', { initialValue: null })(
							<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledEndDate(val,'startTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
					</Form.Item>
					<Form.Item style={{width:194,height:40}}/>
					<Form.Item className='list-query-wrapper-button'>
						<SearchAndClearButtonGroup handleClearSearch={this.clearSearch}/>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create()(ListQuery))
