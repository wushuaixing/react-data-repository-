import React, { Fragment } from "react";
import { Table, Input, Select, Button, Popover, Icon } from "antd";
import NoDataIMG from "@/assets/img/no_data.png";
import { OBLIGOR_TYPE, ROLETYPES_TYPE, SEXS_TYPE } from "../../common/type";
import { PledgersAndDebtorsColumn } from "../../common/column";
import AutoCompleteInput from "../autoComplete";
const { Option } = Select;
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
class PledgersAndDebtorsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      namePrompstList: [],
      nameLength: 0,
    };
  }

  handleFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

  getRole = () => {
    const { role } = this.props;
    return role;
  };

  handleRowAdd = () => {
    const { data } = this.state;
    let flag = this.getRole() === "pledgers";
    const arr = [...data, { ...getPledgersOrDebtors(flag) }];
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange(this.getRole(), data);
      }
    );
  };

  handleDel = (index) => {
    const { data } = this.state;
    const arr = data;
    arr.splice(index, 1);
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange(this.getRole(), data);
      }
    );
  };

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
          if (value) {
            if (value.length > 3) {
              arr[index]["obligorType"] = 1;
            }
            arr[index]["blurAndNotNull"] = true;
          } else {
            arr[index]["obligorType"] = 0;
          }
          arr[index][key] = value;
          break;
        default:
          arr[index][key] = value;
          break;
      }
      // if (key === "gender") {
      //   let dynamicValue = this.handleFindKey(SEXS_TYPE, value);
      //   arr[index][key] = dynamicValue;
      // } else if (key === "obligorType") {
      //   let dynamicValue = this.handleFindKey(OBLIGOR_TYPE, value);
      //   arr[index][key] = dynamicValue;
      // } else {
      //   arr[index][key] = value;
      // }
    } else {
      arr[index][key] = value;
    }

    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        isblur && this.props.handleChange(this.getRole(), data);
      }
    );
  };

  render() {
    const { data } = this.state;
    const { role, isEdit } = this.props;
    const PledgersAndDebtorsColumnEdit = [
      {
        title: "名称",
        dataIndex: "name",
        width: 1400,
        key: "name",
        render: (text, record, index) => (
          // <Input
          //   placeholder="请输入名称"
          //   value={text}
          //   autoComplete="off"
          //   onChange={(e) => {
          //     e.persist();
          //     this.handleChange(e, "name", index);
          //   }}
          //   onBlur={(e) => {
          //     e.persist();
          //     this.handleChange(e, "name", index, true);
          //   }}
          // />
          <AutoCompleteInput
            handleChange={this.handleChange}
            nameVal={text}
            index={index}
            key={record.id}
          />
        ),
      },
      {
        title: "角色",
        dataIndex: "type",
        width: 760,
        key: "type",
        render: (text, record, index) => ROLETYPES_TYPE[text],
      },
      {
        title: "人员类别",
        dataIndex: "obligorType",
        width: 760,
        key: "obligorType",
        render: (text, record, index) => (
          <Select
            placeholder="角色"
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
            value={OBLIGOR_TYPE[text]}
            disabled={!record.blurAndNotNull}
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
        width: 1200,
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
              this.handleChange(e, "number", index, true);
            }}
          />
        ),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 760,
        key: "birthday",
        render: (text, record, index) => (
          <Input
            placeholder="请输入生日"
            autoComplete="off"
            value={text}
            onChange={(e) => {
              e.persist();
              this.handleChange(e, "birthday", index);
            }}
            onBlur={(e) => {
              e.persist();
              this.handleChange(e, "birthday", index, true);
            }}
          />
        ),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 760,
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
        width: 760,
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
            style={{ height: 32 }}
          />
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 760,
        key: "action",
        render: (text, record, index) => (
          <Button
            onClick={() => {
              this.handleDel(index);
            }}
          >
            删除
          </Button>
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
          {role === "pledgers" && (
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
          )}
        </div>
        {isEdit ? (
          <Fragment>
            <Table
              rowClassName="table-list"
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
