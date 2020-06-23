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
		super(props);
		this.state = {
			userList: []
		}
	}
	componentDidMount() {
		//结构化人员
		getStructuredPersonnel().then(res => {
			if (res.data.code === 200) {
				let data = res.data.data;
				this.setState({
					userList: this.getStructuredPersonnelTypeList(data),
				});
			} else {
				message.error(res.data.message);
			}
		});
	};
	getStructuredPersonnelTypeList(data) {
        let personnelTypeList = [{
            id: "用户类型",
            array: [
                {
                    value: 'all',
                    label: "全部",
                    enable:true
                },
                {
                    value: 'deleted',
                    label: "已删除",
                    enable:true
                },
                {
                    value: 'auto',
                    label: "自动标注",
                    enable:true
                }
            ]
        }]; //类名数组
        let typeData = data.chineseLetter; //包含两类 chineseLetter和digit
        for (let i = 0; i < typeData.length; i++) {
            const item = typeData[i];
            if (item.firstNameRank !== personnelTypeList.slice(-1)[0].id)  {
                personnelTypeList.push({
                    id: item.firstNameRank,
                    array: []
                })
            }
            personnelTypeList[personnelTypeList.length - 1].array.push({
                value: item.id,
                label: item.name,
                enable: item.enable
            })
        }
        personnelTypeList.push({
            id: '#',
            array: data.digit.map((item) => (
                {
                    value: item.id,
                    label: item.name,
                    enable: item.enable
                }
            ))
        });
        return personnelTypeList;
    }

	// 搜索框
	handleSearch = e => {
		e.preventDefault();
		const paramKeys = ['title', 'structuredStartTime', 'structuredEndTime', 'checkStartTime', 'checkEndTime', 'userId'];
		const formParams = this.props.form.getFieldsValue(paramKeys);
		/* 调整请求字段 */
		formParams.checkStartTime=formParams.structuredStartTime;
		formParams.checkEndTime=formParams.structuredEndTime;
		delete formParams.structuredStartTime;
		delete formParams.structuredEndTime;

		const params = {
			page: 1
		};
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
				else if (key === 'userId') {
          switch (formParams[key]) {
            case 'all':
                params.userType = 0; break;
            case 'deleted':
                params.userType = 1; break;
            case 'auto':
                params.userType = 2; break;
            default:
                params.userId = formParams[key]; break;
          }
        }
				//无特殊情况 正常赋值
				else {
					params[key] = formParams[key]
				}
			}
		});
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
				return '检查时间';
			case 4:
				return '修改时间';
			default:
				return ''
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { tabIndex } = this.props;
		console.log("tabIndex:",tabIndex);
		const { userList } = this.state;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form">
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
						})(<DatePicker placeholder="开始时间" 	style={{ width: 108 }} />)}
					</Form.Item>
					<Form.Item label="至">
						{getFieldDecorator('structuredEndTime', {
							initialValue: null
						})(<DatePicker	placeholder="结束时间" style={{ width: 108 }} />)}
					</Form.Item>
					<Form.Item label="结构化人员">
						{getFieldDecorator('userId', {
							initialValue: 'all'
						})(
							<Select style={{ width: 198, marginLeft: 4 }}
								showSearch
								filterOption={(input, option) =>{
                    if(!isNaN(option.key)){ //去除optGroup项和用户类型选项 不进行筛选
                        return option.props.children[0].indexOf(input)>=0
                    }
                }}
								transfer placeholder="请选择">
								{
									userList.map((item) => {
                    return (
                        <OptGroup label={item.id} key={item.id}>
                            {
                                item.array.map((ele, index) => {
                                    return (
                                        <Option
                                            value={ele.value} key={index}>
                                            {ele.label}
                                            {ele.enable || <span style={{ color: '#B1B1B1' }}> (已删除) </span>}
                                        </Option>
                                    )
                                })
                            }
                        </OptGroup>)
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
export default searchForm()(Index);
