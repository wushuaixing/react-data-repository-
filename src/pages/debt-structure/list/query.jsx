import React from "react";
import { Form, Input, DatePicker, Select, message } from "antd";
import DebtApi from "@/server/debt";
import { dateUtils, clearEmpty } from "@utils/common";
import { SearchAndClearButtonGroup } from "@commonComponents";

const { Option, OptGroup } = Select;
const searchForm = Form.create;
/**
 * 债权列表-搜索框
 */
class QueryForm extends React.Component {
  static defaultProps = {
    tabIndex: 0,
    role: "",
    timeText: "",
    toSearch: () => {},
    toClearSearch: () => {},
  };
  state = {
    userList: [],
  };
  componentDidMount() {
    const { role } = this.props;
    role !== "normal" &&
      DebtApi.getStructuredPersonnels().then((res) => {
        //结构化人员下无标注人员列表
        if (res.data.code === 200) {
          let data = res.data.data;
          this.setState({
            userList: this.getStructuredPersonnelTypeList(data),
          });
        } else {
          message.error(res.data.message);
        }
      });
  }

  //搜索
  handleSearch = (e) => {
    e.preventDefault();
    const {
      form: { getFieldsValue, setFieldsValue },
    } = this.props;
    const paramKeys = ["title", "startTime", "endTime", "uid"];
    const formParams = getFieldsValue(paramKeys);
    const params = {
      page: 1,
    };
    Object.keys(formParams).forEach((key) => {
      if (
        formParams[key] !== null &&
        formParams[key] !== "" &&
        formParams[key] !== undefined &&
        formParams[key].length !== 0
      ) {
        if (key === "uid") {
          switch (formParams[key]) {
            case "all":
              params.uid = 0;
              break;
            case "deleted":
              params.uid = -1;
              break;
            case "auto":
              params.uid = -2;
              break;
            default:
              params.uid = formParams[key];
              break;
          }
        } else if (key === "endTime" || key === "startTime") {
          params[key] = dateUtils.formatMomentToStandardDate(formParams[key]);
        } else {
          params[key] = formParams[key];
        }
      }
    });
    this.props.toSearch(clearEmpty(params));
    setFieldsValue({
      title: (params.title || "").trim(),
    });
  };

  //清空搜索条件
  handClearSearch = () => {
    this.props.form.resetFields();
    this.props.toClearSearch();
  };

  //标注人员列表处理
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
    ];
    let typeData = data.chineseLetter;
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

  //起始时间是否规范
  disabledStartDate = (startValue) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const endValue = getFieldValue("endTime");
    if (!startValue || !endValue) {
      return false;
    }
    const _startValue = new Date(startValue.valueOf()).setHours(0, 0, 0, 0);
    return _startValue > endValue.valueOf();
  };

  //结束时间是否规范
  disabledEndDate = (endValue) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const startValue = getFieldValue("startTime");
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    const {
      form: { getFieldDecorator },
      tabIndex,
      timeText,
      role,
    } = this.props;
    const { userList } = this.state;
    return (
      !(role === "normal" && tabIndex === 0) && ( //结构化账号待标记列表下 不显示搜索框
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
                  style={{ width: 400 }}
                />
              )}
            </Form.Item>
            <Form.Item label={timeText} className="end-time-after">
              {getFieldDecorator("startTime", {
                initialValue: null,
              })(
                <DatePicker
                  placeholder="开始时间"
                  disabledDate={this.disabledStartDate}
                  style={{ width: 130 }}
                />
              )}
            </Form.Item>
            <Form.Item label="至">
              {getFieldDecorator("endTime", {
                initialValue: null,
              })(
                <DatePicker
                  placeholder="结束时间"
                  disabledDate={this.disabledEndDate}
                  style={{ width: 130 }}
                />
              )}
            </Form.Item>
            {!((role === "admin" && tabIndex === 1) || role === "normal") && ( //结构化账号 和管理员未标注列表下 不显示标注人员
              <Form.Item label="标注人员">
                {getFieldDecorator("uid", {
                  initialValue: "all",
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) => {
                      if (!isNaN(option.key)) {
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
                                    (已删除)
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
            <Form.Item>
              <SearchAndClearButtonGroup
                handleClearSearch={this.handClearSearch} //清空搜索条件
              />
            </Form.Item>
          </Form>
        </div>
      )
    );
  }
}
export default searchForm()(QueryForm);
