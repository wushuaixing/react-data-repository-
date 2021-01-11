import React, { Fragment } from "react";
import { Table, Input, Select, Button, Popover, Icon, Modal } from "antd";
import NoDataIMG from "@/assets/img/no_data.png";
import { OBLIGOR_TYPE, ROLETYPES_TYPE, SEXS_TYPE } from "../../common/type";
import { PledgersAndDebtorsColumn } from "../../common/column";
import AutoCompleteInput from "../auto-complete";
import { dateUtils, clone } from "@utils/common";
const { Option } = Select;
const { confirm } = Modal;
const getPledgersOrDebtors = (ispledgers) => ({
  birthday: "",
  gender: 0,
  id: Math.random(),
  name: "",
  notes: "",
  number: "",
  obligorType: 0,
  type: ispledgers ? 3 : 1,
});

/**
 * 户详情-抵质押人信息
 */
class PledgersAndDebtorsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  static defaultProps = {
    role: "",
    isEdit: false,
    data: [],
    handleChange: () => {},
  };

  UNSAFE_componentWillReceiveProps(props) {
    const { data } = this.state;
    !data.length &&
      this.setState({
        data: props.data,
      });
  }

  //获取角色 （抵质押人还是债务人）
  getRole = () => {
    const { role } = this.props;
    return role;
  };

  //通过val找key值
  handleFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

  handleBirthdayFormat = (value) => {
    let reg = /(^\d{1,4}|\d{1,2})/g;
    let timeArr = value.match(reg);
    let result =
      timeArr && timeArr.length > 0
        ? dateUtils.formatDateComplete(timeArr)
        : value;
    return parseInt(result);
  };

  //添加
  handleRowAdd = () => {
    const { data } = this.state;
    let flag = this.getRole() === "pledgers";
    const arr = [...data, { ...getPledgersOrDebtors(flag) }];
    this.setState(
      {
        data: arr,
      },
      () => this.getdetailInfo()
    );
  };

  //删除
  handleDel = (index) => {
    const { data } = this.state;
    const arr = data;
    confirm({
      icon: (
        <Icon
          type="exclamation-circle"
          theme="filled"
          style={{ color: "#fa930c" }}
        />
      ),
      title: "确认删除？",
      onOk: () => {
        arr.splice(index, 1);
        this.setState(
          {
            data: arr,
          },
          () => this.getdetailInfo()
        )
      }
    });
  };

  //编辑时信息在组件内更新(信息保存在state中)
  handleChange = (e, key, index, isblur) => {
    const { value } = e.target;
    const { data } = this.state;
    const arr = data;
    if (isblur) {
      switch (key) {
        case "gender":
          let genderValue = this.handleFindKey(SEXS_TYPE, value);
          arr[index][key] = genderValue;
          break;
        case "obligorType":
          let obligorTypeValue = this.handleFindKey(OBLIGOR_TYPE, value);
          arr[index][key] = obligorTypeValue;
          break;
        case "name":
          let val = value.trim().replace(/[(]/g, "（").replace(/[)]/g, "）");
          if (val) {
            if (val.length > 4) {
              arr[index]["obligorType"] = 1; //名称大于三时人员类别为企业
            } else {
              arr[index]["obligorType"] = 2; //名称小于三时人员类别为个人
            }
            arr[index]["blurAndNotNull"] = true; //按钮可选
          } else {
            arr[index]["obligorType"] = 0;
            arr[index]["blurAndNotNull"] = false; //没有数据时 人员类别 未知且禁用
          }
          arr[index][key] = val;
          break;
        case "birthday":
          let intVal = this.handleBirthdayFormat(value);
          arr[index][key] = intVal;
          break;
        default:
          arr[index][key] = value;
          break;
      }
    } else {
      arr[index][key] = value;
    }
    this.setState(
      {
        data: arr,
      },
      () => {
        isblur && this.getdetailInfo(); //失焦后将数据抛出 (在onChange下改变props值页面会卡顿)
      }
    );
  };

  //id增加时为随机数，作为key值，给后端时为0
  getdetailInfo = () => {
    const { data } = this.state;
    let list = clone(data);
    list.forEach((i, index) => {
      list[index].typeName =
        this.getRole() === "pledgers"
          ? `抵质押人${index + 1}`
          : `债务人${index + 1}`;
      list[index].id = list[index].id > 1 ? list[index].id : 0;
    });
    this.props.handleChange(this.getRole(), list); //失焦后将数据抛出 (在onChange下改变props值页面会卡顿)
  };

  render() {
    const { data } = this.state;
    const { role, isEdit } = this.props;
    const PledgersAndDebtorsColumnEdit = [
      {
        title: "序号",
        dataIndex: "type",
        width: this.getRole() === "pledgers" ? 122 : 108,
        key: "type",
        render: (text, record, index) => `${ROLETYPES_TYPE[text]}${index + 1}`,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: this.getRole() === "pledgers" ? 261 : 278,
        key: "name",
        render: (text, record, index) => (
          <AutoCompleteInput
            handleChange={this.handleChange}
            nameVal={text}
            index={index}
            key={record.id}
            width={this.getRole() === "pledgers" ? 221 : 238}
          />
        ),
      },
      {
        title: () => {
          return (
            <div className="obligorType">
              <span>人员类别</span>
              {role !== "pledgers" && (
                <span>
                  <Popover content="人员类别为系统根据名称自动判断，如有误可点击手动更改状态类别。">
                    <Icon
                      type="exclamation-circle"
                      style={{
                        color: "#808387",
                        position: "absolute",
                        marginLeft: 2,
                      }}
                    />
                  </Popover>
                </span>
              )}
            </div>
          );
        },
        dataIndex: "obligorType",
        width: 108,
        key: "obligorType",
        render: (text, record, index) => (
          <Select
            onChange={(value) => {
              this.handleChange({ target: { value } }, "obligorType", index);
            }}
            onBlur={(value) => {
              this.handleChange(
                { target: { value } },
                "obligorType",
                index,
                true
              );
            }}
            value={OBLIGOR_TYPE[text || 0]}
            disabled={!record.blurAndNotNull}
            style={{ width: 68 }}
          >
            {Object.keys(OBLIGOR_TYPE).map((key) => (
              <Option key={key} style={{ fontSize: 12 }}>
                {OBLIGOR_TYPE[key]}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "证件号",
        dataIndex: "number",
        width: 230,
        key: "number",
        render: (text, record, index) => (
          <Input
            placeholder="请输入证件号"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              e.persist();
              this.handleChange(e, "number", index);
            }}
            onBlur={(e) => {
              e.persist();
              e.target.value = e.target.value
                .trim()
                .replace(/[^a-zA-Z\d（）()]+/g, "")
              this.handleChange(e, "number", index, true);
            }}
            style={{ width: 190 }}
            maxLength={18}
          />
        ),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 155,
        key: "birthday",
        render: (text, record, index) => (
          <Input
            placeholder="请输入生日"
            autoComplete="off"
            value={text || ""}
            onChange={(e) => {
              e.persist();
              this.handleChange(e, "birthday", index);
            }}
            onBlur={(e) => {
              e.persist();
              this.handleChange(e, "birthday", index, true);
            }}
            style={{ width: 120 }}
          />
        ),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 109,
        key: "gender",
        render: (text, record, index) => (
          <Select
            placeholder="性别"
            onChange={(value) => {
              this.handleChange({ target: { value } }, "gender", index);
            }}
            onBlur={(value) => {
              this.handleChange({ target: { value } }, "gender", index, true);
            }}
            value={SEXS_TYPE[text]}
            style={{ width: 74 }}
          >
            {Object.keys(SEXS_TYPE).map((key) => (
              <Option key={key} style={{ fontSize: 12 }}>
                {SEXS_TYPE[key]}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 158,
        key: "notes",
        render: (text, record, index) => (
          <Input.TextArea
            placeholder="请输入备注"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              e.persist();
              this.handleChange(e, "notes", index);
            }}
            onBlur={(e) => {
              e.persist();
              this.handleChange(e, "notes", index, true);
            }}
            style={{ width: 118 }}
            autoSize
            maxLength={200}
          />
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 92,
        key: "action",
        render: (text, record, index) => (
          <span
            onClick={() => {
              this.handleDel(index);
            }}
            style={{ color: "#016AA9", cursor: "pointer" }}
          >
            删除
          </span>
        ),
      },
    ];
    return (
      <div
        className="debt-detail-components pledgers-info"
        id={role === "pledgers" ? "Pledgers" : "Debtors"}
      >
        <div className="header">
          {role === "pledgers" ? "抵质押" : "债务"}人信息
          {role === "pledgers" && isEdit ? (
            <span>
              <Popover content="既不是债务人也不是保证人的抵质押物所有人为抵质押人。">
                <Icon
                  type="exclamation-circle"
                  style={{
                    color: "#808387",
                    position: "relative",
                    marginLeft: 8,
                  }}
                />
              </Popover>
            </span>
          ) : null}
        </div>
        {isEdit ? (
          <Fragment>
            <Table
              rowClassName="edit-list"
              columns={PledgersAndDebtorsColumnEdit}
              dataSource={data}
              pagination={false}
              rowKey={(record) => record.id}
              locale={{
                emptyText: <div></div>,
              }}
            />
            <div className="debtors-addRole">
              <Button
                type="dashed"
                icon="plus"
                onClick={() => {
                  this.handleRowAdd();
                }}
                block
              >
                添加
              </Button>
            </div>
          </Fragment>
        ) : (
          <Table
            rowClassName="table-list"
            columns={PledgersAndDebtorsColumn}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.id}
            locale={{
              emptyText: (
                <div className="no-data-box">
                  <img src={NoDataIMG} alt="暂无数据" />
                  <p>暂无数据</p>
                </div>
              ),
            }}
          />
        )}
      </div>
    );
  }
}

export default PledgersAndDebtorsInfo;
