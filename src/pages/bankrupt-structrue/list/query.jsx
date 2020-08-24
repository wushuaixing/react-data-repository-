import React from 'react';
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
				{ value: -1, label: "已删除账号", enable:true },
				{ value: -2, label: "系统处理", enable:true, }
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
		const { onSearch, form:{getFieldsValue,setFieldsValue},simply } = this.props;
		const params = simply ? getFieldsValue(['title','publishStartTime','publishEndTime']):getFieldsValue();
		Object.keys(params).forEach(i=>{ if(typeof params[i]==='object' && /Time$/.test(i) && params[i])params[i] = params[i].format('YYYY-MM-DD')});
		onSearch && onSearch(clearEmpty(params));
		console.log(params);
		setFieldsValue({
			companyName:params.companyName.trim(),
			title:params.title.trim()
		})
	};

	clearSearch = ()=>{
		const { onSearch,form:{ resetFields } } = this.props;
		resetFields();
		onSearch && onSearch( clearEmpty({}));
	};

	render() {
		const { form:{ getFieldDecorator }, loading, simply } = this.props;
		const { userList } = this.state;
		const companyName = <Form.Item label="企业" key='companyName'>
			{getFieldDecorator('companyName', { initialValue: '' })(
				<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入破产企业名称" autoComplete="off"/>)}
		</Form.Item>;
		const title = <Form.Item label="标题" key='title'>
			{getFieldDecorator('title', { initialValue: '' })(
				<Input type="text" size='default' style={{ width: 260 }} placeholder="请输入标题" autoComplete="off" />)}
		</Form.Item>;
		const updater = <Form.Item label="最后更新者" key='lastUpdater'>
			{getFieldDecorator('uid', { initialValue: '' })(
				<Select
					style={{ width: 180, marginLeft: 4 }} showSearch transfer placeholder="请选择"
					filterOption={(input, option) => !isNaN(option.key) && option.props.children[0].toLowerCase().indexOf(input.toLowerCase())>=0 }
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
		</Form.Item>;
		const publishTime = <div style={{display:"inline-block"}} key='publishTime'>
			<Form.Item label="发布日期" key='publishStartTime' className='list-query-wrapper-form_before end-time-after'>
				{getFieldDecorator('publishStartTime', { initialValue: null })(
					<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'publishEndTime')} style={{ width: 120 }}
											getCalendarContainer={node=>node.offsetParent} />)}
			</Form.Item>
			<Form.Item label="至" key='publishEndTime' className='list-query-wrapper-form_link'>
				{getFieldDecorator('publishEndTime', { initialValue: null })(
					<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledEndDate(val,'publishStartTime')} style={{ width: 120 }}
											getCalendarContainer={node=>node.offsetParent} />)}
			</Form.Item>
		</div>;
		const updateTime = <div style={{display:"inline-block"}} key='updateTime'>
			<Form.Item label="更新时间" key='updateStartTime' className='list-query-wrapper-form_before end-time-after'>
				{getFieldDecorator('updateStartTime', { initialValue: null})(
					<DatePicker placeholder="起始日期" disabledDate={val=>this.disabledStartDate(val,'updateEndTime')} style={{ width: 120 }}
											getCalendarContainer={node=>node.offsetParent} />)}
			</Form.Item>
			<Form.Item label="至" key='updateEndTime' className='list-query-wrapper-form_link'>
				{getFieldDecorator('updateEndTime', { initialValue: null })(
					<DatePicker placeholder="截止日期" disabledDate={val=>this.disabledEndDate(val,'updateStartTime')} style={{ width: 120 }}
											getCalendarContainer={node=>node.offsetParent} />)}
			</Form.Item>
		</div>;
		const Items = simply ? [title,publishTime]:[companyName,title,updater,publishTime,updateTime];

		return (
			<div className="list-query-wrapper">
				<Form layout="inline" onSubmit={this.handleSearch} className='list-query-wrapper-form' >
					{ Items }
					<Form.Item style={{width:194,height:40}} key='empty'/>
					<Form.Item className='list-query-wrapper-button' key='button'>
						<SearchAndClearButtonGroup handleClearSearch={this.clearSearch} loading={loading}/>
					</Form.Item>
				</Form>
			</div>
		);
	}
}
export default Form.create()(ListQuery)
