/** search **/

//筛选栏 管理员能通过地区(省/市/区)以及抓取时间,结构化人员和检查人员进行表格筛选。
import React from 'react';
import { Form, Input, DatePicker, Select, message } from 'antd';
import { getStructuredPersonnel } from "@api";
import { dateUtils } from "@utils/common";
import { SearchAndClearButtonGroup } from '@commonComponents'
const { Option, OptGroup } = Select;
const searchForm = Form.create;
class Index extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userList: []
		}
	}
	componentDidMount() {
		//结构化人员
		getStructuredPersonnel().then(res => {
			if (res.data.code === 200) {
				let data = res.data.data
				this.setState({
					userList: this.getStructuredPersonnelTypeList(data),
				});
			} else {
				message.error(res.data.message);
			}
		});
	};
	getStructuredPersonnelTypeList(data) {
		let typeMark = data[0]["firstNameRank"]  //类名
		let typeList = [{
			id: "用户类型",
			array: [
				{
					value: 'all',
					label: "全部"
				},
				{
					value: 'deleted',
					label: "已删除"
				},
				{
					value: 'auto',
					label: "自动标注"
				}
			]
		}] //类名数组 
		let tempList = [] //类名数组的子集  负责暂时存放
		for (let i = 0; i < data.length; i++) {
			if (data[i].firstNameRank !== typeMark) {
				typeList.push({
					id: typeMark,
					array: tempList
				})
				typeMark = data[i].firstNameRank;
				tempList = [];
			}
			tempList.push({
				value: data[i].id,
				label: data[i].name
			})
		}
		return typeList;
	}

	// 搜索框
	handleSearch = e => {
		e.preventDefault();
		const paramKeys = ['title', 'structuredStartTime', 'structuredEndTime', 'checkStartTime', 'checkEndTime', 'userId']
		const formParams = this.props.form.getFieldsValue(paramKeys)
		const params = {
			page: 1
		}
		//参数清洗
		Object.keys(formParams).forEach((key) => {
			//判断各种情况为空 清理空参数
			if (formParams[key] !== null && formParams[key] !== '' && formParams[key] !== undefined) {
				//如果是日期 把Moment处理掉
				if (key.indexOf('Time') >= 0) {
					params[key] = dateUtils.formatMomentToStandardDate(formParams[key])
				}
				//如果是结构化人员ID  选择了三个特殊类型 判断类型值不是数字 则对应赋值userType 
				//isNaN()判断的缺点就在于 null、空格以及空串会被按照0来处理 但外层已经处理
				else if (key === 'userId' && isNaN(parseInt[formParams[key]])) {
					console.log(formParams[key])
					switch (formParams[key]) {
						case 'all':
							params.userType = 0; break;
						case 'deleted':
							params.userType = 1; break;
						case 'auto':
							params.userType = 2; break;
						default:
							break;
					}
				}
				//无特殊情况 正常赋值
				else {
					params[key] = formParams[key]
				}
			}
		})
		this.props.toSearch(params);
	};

	//清空搜索条件
	clearSearch = () => {
		this.props.form.resetFields();
		this.props.toClear();
	};
	get columnShowTimeType() {
		switch (this.props.tabIndex) {
			case 0: case 1: case 5:
				return '结构化时间';
			case 2: case 3:
				return '检查时间'
			case 4:
				return '修改时间'
			default:
				return ''
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { userList } = this.state;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{ marginLeft: 10, marginTop: 15 }}>
					<Form.Item label="标题">
						{getFieldDecorator('title', {
							initialValue: ''
						})
							(<Input
								type="text"
								placeholder="拍卖信息标题"
								size='default'
								style={{ width: 240 }}
							/>)}
					</Form.Item>

					<Form.Item label={this.columnShowTimeType}>
						{getFieldDecorator('structuredStartTime', {
							initialValue: null
						})
							(<DatePicker
								placeholder="开始时间"
								style={{ width: 108 }}
							/>)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('structuredEndTime', {
							initialValue: null
						})
							(<DatePicker
								placeholder="结束时间"
								style={{ width: 108 }}
							/>)}
					</Form.Item>
					<Form.Item label='检查时间'>
						{getFieldDecorator('checkStartTime', {
							initialValue: null
						})
							(<DatePicker
								placeholder="检查开始时间"
								style={{ width: 116 }}
							/>)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('checkEndTime', {
							initialValue: null
						})
							(<DatePicker
								placeholder="检查结束时间"
								style={{ width: 116 }}
							/>)}
					</Form.Item>
					<Form.Item label="结构化人员">
						{getFieldDecorator('userId', {
							initialValue: ''
						})(
							<Select style={{ width: 198, marginLeft: 4 }}
								showSearch optionFilterProp="children.props.children"
								filterOption={(input, option) =>
									option.props.children.indexOf(input) >= 0
								  }
								transfer placeholder="请选择">
								{
									userList && userList.map((item, index) =>
										<OptGroup label={item.id} key={index}>
											{
												item.array.map((ele, index) => {
													return (
														<Option
															value={ele.value}
															key={index}
														>
															{ele.label}
														</Option>
													)
												})
											}
										</OptGroup>
									)
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
export default searchForm()(Index);
