/** search **/

//筛选栏 管理员能通过地区(省/市/区)以及抓取时间,结构化人员和检查人员进行表格筛选。
import React from 'react';
import { Form, Input, Button, DatePicker, Cascader, Select, message } from 'antd';
import { getStructuredPersonnel, getCheckPersonnel } from "../../../server/api";
import { area } from "../../../assets/area";
import { dateUtils } from "../../../utils/common";
import { SearchAndClearButtonGroup } from '../../common/index'

const { Option, OptGroup } = Select;
const searchForm = Form.create;
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            checkUserList: [],
            area,
        };
    }

    componentDidMount() {
        //结构化人员
        getStructuredPersonnel("").then(res => {
            if (res.data.code === 200) {
                let id = res.data.data[0]["firstNameRank"];
                let list = [];
                let typeList = [];
                typeList.push({
                    id: "",
                    array: [
                        {
                            value: 0,
                            label: "全部"
                        },
                        {
                            value: 1,
                            label: "已删除"
                        },
                        {
                            value: 2,
                            label: "自动标注"
                        }
                    ]
                });

                for (let key = 0; key < res.data.data.length; key++) {
                    if (res.data.data[key]["firstNameRank"] === id) {
                        list.push({
                            value: res.data.data[key]["id"],
                            label: res.data.data[key]["name"]
                        });
                    } else {
                        typeList.push({
                            id: id,
                            array: list
                        });
                        id = res.data.data[key]["firstNameRank"];
                        list = [];
                        list.push({
                            value: res.data.data[key]["id"],
                            label: res.data.data[key]["name"]
                        });
                    }
                }
                this.setState({
                    userList: typeList,
                });
            } else {
                message.error(res.data.message);
            }
        });
        //检查人员列表(管理员获取)
        getCheckPersonnel().then(res => {
            if (res.data.code === 200) {
                let checklist = [];
                checklist.push({
                    value: "all",
                    label: "全部"
                });
                for (let key = 0; key < res.data.data.length; key++) {
                    checklist.push({
                        value: res.data.data[key]["id"],
                        label: res.data.data[key]["name"]
                    });
                }
                this.setState({
                    checkUserList: checklist,
                })
            } else {
                message.error(res.data.message);
            }
        });
    };

    // 搜索框
    handleSearch = e => {
        e.preventDefault();
        const paramKeys = ['title', 'startTime', 'endTime', 'userId', 'checkUserId', 'area']
        const formParams = this.props.form.getFieldsValue(paramKeys)
        const params = {
            page: 1
        }
        Object.keys(formParams).forEach((key) => {
            //判断各种情况为空及area(特殊处理)  清理空参数
            if (formParams[key] !== null && formParams[key] !== '' && key !== 'area') {
                //如果是日期 把Moment处理掉
                params[key] = (key !== 'endTime' && key !== 'startTime') ? formParams[key] : dateUtils.formatMomentToStandardDate(formParams[key])
            }
            //如果选择了地点级联  对应赋值参数
            if (key === 'area' && formParams[key].length > 0) {
                const location = formParams[key]
                for (let i = 0; i < formParams[key].length; i++) {
                    switch (i) {
                        case 0:
                            params.region = location[0]; break;
                        case 1:
                            params.city = location[1]; break;
                        case 2:
                            params.area = location[2]; break;
                        default:
                            break;
                    }
                }
            }
        })
        //console.log(params)
        this.props.toSearch(params);
    };

    //清空搜索条件
    clearSearch = () => {
        this.props.form.resetFields();
        this.props.toClear();
    };
    //根据所处tabIndex获取搜索时间栏的文字显示内容 然后传给搜索栏子组件
    get searchTimeTypeInput() {
        switch (this.props.tabIndex) {
            case 0: case 1:
                return '抓取时间';
            case 2:
                return '结构化时间';
            case 3: case 4:
                return '检查时间'
            case 5:
                return '修改时间'
            default:
                return ''
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { userList, checkUserList } = this.state;
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

                    <Form.Item label={this.searchTimeTypeInput}>
                        {getFieldDecorator('startTime', {
                            initialValue: null,
                        })
                            (<DatePicker
                                placeholder="开始时间"
                                style={{ width: 108 }}
                            />)}
                    </Form.Item>
                    <Form.Item label="至">
                        {getFieldDecorator('endTime', {
                            initialValue: null
                        })
                            (<DatePicker
                                placeholder="结束时间"
                                style={{ width: 108 }}
                            />)}
                    </Form.Item>
                    <Form.Item label="结构化人员">
                        {getFieldDecorator('userId', {
                            initialValue: ''
                        })(
                            <Select style={{ width: 198, marginLeft: 4 }} transfer placeholder="请选择">
                                {
                                    userList && userList.map((item, index) => {
                                        return (
                                            <OptGroup label={item.id} key={index}>
                                                {item.array.map((ele, index) => {
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
                                            </OptGroup>)
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="检查人员">
                        {getFieldDecorator('checkUserId', {
                            initialValue: ''
                        })(
                            <Select style={{ width: 198, marginLeft: 4 }} transfer placeholder="请选择">
                                {
                                    checkUserList && checkUserList.map((item) => {
                                        return (
                                            <Option
                                                value={item.value}
                                                key={item.value}
                                            >
                                                {item.label}
                                            </Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="地区">
                        {
                            getFieldDecorator('area', {
                                initialValue: []
                            })(
                                <Cascader options={area} placeholder="请选择" changeOnSelect />
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
