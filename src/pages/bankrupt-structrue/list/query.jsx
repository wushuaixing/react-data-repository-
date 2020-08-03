import React from 'react';
import { withRouter } from "react-router";
import { DatePicker, Form, Input, message, Select } from "antd";
import { SearchAndClearButtonGroup } from "@/components/common";
import { getStructuredPersonnel } from "@server/api";
import { clearEmpty } from "@utils/common";

class ListQuery extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userList:[]
		};
	}

	componentDidMount() {
		getStructuredPersonnel().then(res => {
			if (res.data.code === 200) {
				this.setState({
					userList: this.getStructuredPersonnelTypeList(res.data.data),
				});
			} else {
				message.error(res.data.message);
			}
		});
	}
	getStructuredPersonnelTypeList({chineseLetter=[],digit=[]}) {
		const toFill = i =>({ value: i.id, label: i.name,enable: i.enable});
		const normalList = ary =>{
			const tempAry ={};
			ary.forEach(item=>{
				const field = item.firstNameRank;
				tempAry[field] ? tempAry[field].push(toFill(item)) : tempAry[field] = [toFill(item)];
			});
			return Object.keys(tempAry).map(i=>({ id:i,array:tempAry[i]}));
		};
		return [{
			id: "用户类型",
			array: [
				{ value: '', label: "全部", enable:true },
				{ value: 'deleted', label: "已删除", enable:true },
				{ value: 'auto', label: "自动标注", enable:true, }
			]
		}, ...normalList(chineseLetter),{ id: '#', array: digit.map((item) => toFill(item))	}];
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

	handleSearch = e =>{
		e.preventDefault();
		const { onSearch,form:{getFieldsValue} } = this.props;
		onSearch && onSearch( clearEmpty(getFieldsValue() ));
	};

	clearSearch = ()=>{
		const { onSearch,form:{ resetFields } } = this.props;
		resetFields();
		onSearch && onSearch( clearEmpty({}));
	};

	render() {
		const { form:{ getFieldDecorator } } = this.props;
		const { userList } = this.state;
		return (
			<div className="list-query-wrapper">
				<Form layout="inline" onSubmit={this.handleSearch} className='list-query-wrapper-form' >
					<Form.Item label="企业" key='companyName'>
						{getFieldDecorator('brcompanyName', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入破产企业名称" autoComplete="off"/>)}
					</Form.Item>
					<Form.Item label="标题" key='title'>
						{getFieldDecorator('title', { initialValue: '' })(
							<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入标题" autoComplete="off" />)}
					</Form.Item>
					<Form.Item label="最后更新者" key='lastUpdater'>
						{getFieldDecorator('uid', { initialValue: '' })(
							<Select
								style={{ width: 120, marginLeft: 4 }} showSearch transfer placeholder="请选择"
								filterOption={(input, option) => !isNaN(option.key) && option.props.children[0].indexOf(input)>=0 }
							>
								{
									userList.map((item) => (
										<Select.OptGroup label={item.id} key={item.id} >
											{
												item.array.map((ele, index) => (
													<Select.Option value={ele.value} key={index} >
														{ele.label} {ele.enable || <span style={{ color: '#B1B1B1' }}> (已删除) </span>}
													</Select.Option>
												))
											}
										</Select.OptGroup>)
									)
								}
							</Select>
						)}
					</Form.Item>
					<div style={{display:"inline-block"}}>
						<Form.Item label="发布时间" key='pulishStartTime'>
						{getFieldDecorator('pulishStartTime', { initialValue: null })(
							<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'pulishEndTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
						</Form.Item>
						<Form.Item label="至" key='pulishEndTime'>
							{getFieldDecorator('pulishEndTime', { initialValue: null })(
								<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledStartDate(val,'pulishStartTime')} style={{ width: 120 }}
														getCalendarContainer={node=>node.offsetParent} />)}
						</Form.Item>
					</div>
					<div style={{display:"inline-block"}}>
						<Form.Item label="更新时间" key='updateStartTime'>
						{getFieldDecorator('updateStartTime', { initialValue: null })(
							<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'updateEndTime')} style={{ width: 120 }}
													getCalendarContainer={node=>node.offsetParent} />)}
						</Form.Item>
						<Form.Item label="至" key='updateEndTime'>
							{getFieldDecorator('updateEndTime', { initialValue: null })(
								<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledStartDate(val,'updateStartTime')} style={{ width: 120 }}
														getCalendarContainer={node=>node.offsetParent} />)}
						</Form.Item>
					</div>
					<Form.Item style={{width:194,height:40}} key='empty'/>
					<Form.Item className='list-query-wrapper-button' key='button'>
						<SearchAndClearButtonGroup handleClearSearch={this.clearSearch}/>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default withRouter(Form.create()(ListQuery))
