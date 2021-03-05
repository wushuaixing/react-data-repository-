//筛选栏 管理员能通过地区(省/市/区) 抓取时间 还有人员筛选
import React from "react";
import { Form, Input, DatePicker, Cascader, Select, message } from "antd";
import { getStructuredPersonnel, getCheckPersonnel } from "@api";
import { area } from "@/assets/area";
import { dateUtils, clearEmpty } from "@utils/common";
import { SearchAndClearButtonGroup } from "@commonComponents";

const { Option, OptGroup } = Select;
const searchForm = Form.create;
class Index extends React.Component {
  state = {
    userList: [],
    checkUserList: [],
    area,
  };
  componentDidMount() {
    //结构化人员列表(管理员获取)
    getStructuredPersonnel().then((res) => {
      if (res.data.code === 200) {
        let data = res.data.data;
        this.setState({
          userList: this.getStructuredPersonnelTypeList(data),
        });
      } else {
        message.error(res.data.message);
      }
    });
    //检查人员列表(管理员获取)
    getCheckPersonnel().then((res) => {
      if (res.data.code === 200) {
        let data = res.data.data;
        const { chineseLetter, digit } = data;
        const datas = [...chineseLetter, ...digit];
        this.setState({
          checkUserList: this.getCheckPersonnelList(datas),
        });
      } else {
        message.error(res.data.message);
      }
    });
  }

  // 搜索框
  handleSearch = (e) => {
    e.preventDefault();
    const paramKeys = [
      "title",
      "requestStartTime",
      "requestEndTime",
      "userId",
      "checkUserId",
      "area",
    ];
    const formParams = this.props.form.getFieldsValue(paramKeys);
    const params = {
      page: 1,
    };
    Object.keys(formParams).forEach((key) => {
      //判断各种情况为空 清理空参数
      if (
        formParams[key] !== null &&
        formParams[key] !== "" &&
        formParams[key] !== undefined &&
        formParams[key].length !== 0
      ) {
        //如果选择了地点级联  对应赋值参数
        if (key === "area") {
          const location = formParams[key];
          for (let i = 0; i < formParams[key].length; i++) {
            switch (i) {
              case 0:
                params.region = location[0];
                break;
              case 1:
                params.city = location[1];
                break;
              case 2:
                params.area = location[2];
                break;
              default:
                break;
            }
          }
        }
        //如果是日期 把Moment处理掉
        else if (key === "requestEndTime" || key === "requestStartTime") {
          params[key] = dateUtils.formatMomentToStandardDate(formParams[key]);
        }
        //如果是结构化人员ID  选择了三个特殊类型 判断类型值不是数字 则对应赋值userType
        //isNaN()判断的缺点就在于 null、空格以及空串会被按照0来处理 但外层已经处理
        else if (key === "userId") {
          switch (formParams[key]) {
            case "all":
              params.userId = 0;
              break;
            case "deleted":
              params.userId = -1;
              break;
            case "auto":
              params.userId = -2;
              break;
            default:
              params.userId = formParams[key];
              break;
          }
        }
        //无特殊情况 正常赋值
        else {
          params[key] = formParams[key];
        }
      }
    });
    this.props.toSearch(clearEmpty(params));
    this.props.form.setFieldsValue({
      title: (params.title || "").trim(),
    });
  };

  //清空搜索条件
  clearSearch = () => {
    this.props.form.resetFields();
    this.props.toClear();
  };

  getStructuredPersonnelTypeList(data) {
    let personnelTypeList = [
      {
        id: "用户类型",
        array: [
          {
            value: "all",
            label: "全部",
            enable: true,
          },
          {
            value: "deleted",
            label: "已删除账号",
            enable: true,
          },
          {
            value: "auto",
            label: "自动标注",
            enable: true,
          },
        ],
      },
    ]; //类名数组
    let typeData = data.chineseLetter; //包含两类 chineseLetter和digit
    for (let i = 0; i < typeData.length; i++) {
      const item = typeData[i];
      if (item.firstNameRank !== personnelTypeList.slice(-1)[0].id) {
        personnelTypeList.push({
          id: item.firstNameRank,
          array: [],
        });
      }
      personnelTypeList[personnelTypeList.length - 1].array.push({
        value: item.id,
        label: item.name,
        enable: item.enable,
      });
    }
    personnelTypeList.push({
      id: "#",
      array: data.digit.map((item) => ({
        value: item.id,
        label: item.name,
        enable: item.enable,
      })),
    });
    return personnelTypeList;
  }
  getCheckPersonnelList(data) {
    let checklist = [];
    checklist.push({
      value: "",
      label: "全部",
    });
    for (let i = 0; i < data.length; i++) {
      checklist.push({
        value: data[i].id,
        label: data[i].name,
      });
    }
    return checklist;
  }
  //根据所处tabIndex获取搜索时间栏的文字显示内容
  get searchTimeTypeInput() {
    switch (this.props.tabIndex) {
      case 0:
      case 1:
        return "抓取时间";
      case 2:
        return "初次标注时间";
      case 3:
      case 4:
        return "检查时间";
      case 5:
        return "修改标注时间";
      default:
        return "";
    }
  }

  disabledStartDate = (startValue) => {
    const { getFieldValue } = this.props.form;
    const endValue = getFieldValue("requestEndTime");
    if (!startValue || !endValue) {
      return false;
    }
    const _startValue = new Date(startValue.valueOf()).setHours(0, 0, 0, 0);
    return _startValue > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { getFieldValue } = this.props.form;
    const startValue = getFieldValue("requestStartTime");
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userList, checkUserList } = this.state;
    const { tabIndex } = this.props;
    return (
      <div>
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          className="yc-search-form"
        >
          <Form.Item label="标题">
            {getFieldDecorator("title", {
              initialValue: "",
            })(
              <Input
                type="text"
                placeholder="拍卖信息标题"
                size="default"
                autoComplete="off"
                style={{ width: 240 }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={this.searchTimeTypeInput}
            className="end-time-after"
          >
            {getFieldDecorator("requestStartTime", {
              initialValue: null,
            })(
              <DatePicker
                placeholder="开始时间"
                disabledDate={this.disabledStartDate}
                style={{ width: 120 }}
              />
            )}
          </Form.Item>
          <Form.Item label="至">
            {getFieldDecorator("requestEndTime", {
              initialValue: null,
            })(
              <DatePicker
                placeholder="结束时间"
                disabledDate={this.disabledEndDate}
                style={{ width: 120 }}
              />
            )}
          </Form.Item>
          {tabIndex !== 1 && (
            <Form.Item label="标注人员">
              {getFieldDecorator("userId", {
                initialValue: "all",
              })(
                <Select
                  showSearch
                  filterOption={(input, option) => {
                    if (!isNaN(option.key)) {
                      //去除optGroup项和用户类型选项 不进行筛选
                      return (
                        option.props.children[0]
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }
                  }}
                  style={{ width: 178, marginLeft: 4 }}
                  transfer
                  placeholder="请选择"
                >
                  {userList.map((item) => {
                    return (
                      <OptGroup label={item.id} key={item.id}>
                        {item.array.map((ele) => {
                          return (
                            <Option value={ele.value} key={ele.value}>
                              {ele.label}
                              {ele.enable || (
                                <span style={{ color: "#B1B1B1" }}>
                                  {" "}
                                  (已删除){" "}
                                </span>
                              )}
                            </Option>
                          );
                        })}
                      </OptGroup>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          )}
          {tabIndex !== 1 && tabIndex !== 2 && (
            <Form.Item label="检查人员">
              {getFieldDecorator("checkUserId", {
                initialValue: "",
              })(
                <Select
                  style={{ width: 178, marginLeft: 4 }}
                  transfer
                  placeholder="请选择"
                >
                  {checkUserList.map((item) => {
                    return (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          )}
          <Form.Item label="地区">
            {getFieldDecorator("area", {
              initialValue: [],
            })(
              <Cascader
                options={area}
                placeholder="请选择"
                changeOnSelect
                style={{ width: 178, marginLeft: 4 }}
              />
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
