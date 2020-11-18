import React, { Fragment } from "react";
import { Table, Input, Select, Modal, Button, Icon, Popover } from "antd";
import { GuarantorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import { SEXS_TYPE, OBLIGOR_TYPE, ROLETYPES_TYPE } from "../../common/type";
import BatchAddModal from "../../common/modal/batch-add-modal";
import AutoCompleteInput from "../auto-complete";
const { Option } = Select;
const { confirm } = Modal;
//添加同组
const getGuarantorsMsgs = () => ({
  birthday: "",
  gender: 0,
  id: Math.random(),
  name: "",
  notes: "",
  number: "",
  obligorType: 0,
  type: 2,
});

//添加一组
const getGuarantors = (name) => ({
  amount: "",
  id: Math.random(),
  msgs: [
    {
      birthday: "",
      gender: 0,
      id: new Date().getTime(),
      name: name ? name : "",
      notes: "",
      number: "",
      obligorType: 0,
      type: 2,
    },
  ],
});

class GuarantorsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { data } = this.state;
    !data.length &&
      this.setState({
        data: props.data
      });
  }

  //通过val 找key
  handleFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

  //删除
  handleDel = (index, itemIndex) => {
    const { data } = this.state;
    const arr = data;

    if (arr[index].msgs.length === 1) {
      arr.splice(index, 1);
    } else {
      arr[index].msgs.splice(itemIndex, 1);
    }
    confirm({
      icon: (
        <Icon
          type="exclamation-circle"
          theme="filled"
          style={{ color: "#fa930c" }}
        />
      ),
      title: "确认删除？",
      onOk: () =>
        this.setState(
          {
            data: arr,
          },
          () => {
            const { data } = this.state;
            this.props.handleChange("guarantors", data);
          }
        ),
    });
  };

  //添加同组
  handleADDGroup = (index) => {
    const { data } = this.state;
    const newMsgsList = [...data[index].msgs, { ...getGuarantorsMsgs() }];
    const arr = data;
    arr[index].msgs = newMsgsList;
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange("guarantors", data);
      }
    );
  };

  //添加一组
  handleRowAdd = () => {
    const { data } = this.state;
    const arr = [...data, { ...getGuarantors() }];
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange("guarantors", data);
      }
    );
  };

  //编辑
  handleChange = (e, key, index, indexs, isblur) => {
    const { data } = this.state;
    const { value } = e.target;
    const arr = data;
    if (key === "amount") {
      arr[index][key] = value;
    } else {
      if (isblur) {
        switch (key) {
          case "gender":
            let genderValue = this.handleFindKey(SEXS_TYPE, value);
            arr[index].msgs[indexs][key] = genderValue;
            break;
          case "obligorType":
            let obligorTypeValues = this.handleFindKey(OBLIGOR_TYPE, value);
            arr[index].msgs[indexs][key] = obligorTypeValues;
            break;
          case "name":
            if (value) {
              if (value.length > 3) {
                arr[index].msgs[indexs]["obligorType"] = 1; //大于三 人员类别为企业
              }
              arr[index].msgs[indexs]["blurAndNotNull"] = true;
            } else {
              arr[index].msgs[indexs]["obligorType"] = 0;
              arr[index].msgs[indexs]["blurAndNotNull"] = false; //无数据时 人员类别为 未知且禁用
            }
            arr[index].msgs[indexs][key] = value;
            break;
          default:
            arr[index].msgs[indexs][key] = value;
        }
      } else {
        arr[index].msgs[indexs][key] = value;
      }
    }
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        isblur && this.props.handleChange("guarantors", data);
      }
    );
  };

  //打开数字弹窗
  handleOpenModal = () => {
    const { visible } = this.state;
    if (!visible) this.setState({ visible: true });
  };

  //关闭弹窗
  handleCloseModal = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  };

  //批量添加
  handleBatchAdd = (text) => {
    const { data } = this.state;
    const arr = data;
    const BatchAddList = text ? text.split("、") : [];
    BatchAddList.forEach((item) => {
      arr.push(getGuarantors(item));
    });
    this.setState(
      {
        data: arr,
        visible: false,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange("guarantors", data);
      }
    );
  };

  render() {
    const { data, visible } = this.state;
    const { isEdit } = this.props;
    const columns = [
      {
        title: "保证人名称",
        dataIndex: "name",
        width: 185,
        key: "name",
        className: "guarantors-name",
        render: (text, record) =>
          record.msgs &&
          record.msgs.map((item) => <p key={item.id}>{item.name}</p>),
      },
      {
        title: "角色",
        dataIndex: "type",
        width: 193,
        key: "type",
        render: (text, record) =>
          record.msgs &&
          record.msgs.map((item) => (
            <p key={item.id}>{ROLETYPES_TYPE[item.type]}</p>
          )),
      },
      ...GuarantorsColumn,
    ];
    const columnsEdit = [
      {
        title: "名称",
        dataIndex: "name",
        width: 185,
        key: "name",
        className: "guarantors-name",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <AutoCompleteInput
              handleChange={this.handleChange}
              nameVal={item.name}
              index={index}
              indexs={indexs}
              key={`${record.id}${indexs}`}
              role="guarantors"
            />
          )),
      },
      {
        title: "角色",
        dataIndex: "type",
        width: 61,
        key: "type",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <div className="guarantors-type" key={`type${indexs}`}>
              {ROLETYPES_TYPE[item.type]}
            </div>
          )),
      },
      {
        title: "人员类别",
        dataIndex: "obligorType",
        width: 78,
        key: "obligorType",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <div key={`obligorType${indexs}`}>
              <Select
                placeholder="角色"
                onChange={(value) => {
                  this.handleChange(
                    {
                      target: { value },
                    },
                    "obligorType",
                    index,
                    indexs
                  );
                }}
                onBlur={(value) => {
                  this.handleChange(
                    {
                      target: { value },
                    },
                    "obligorType",
                    index,
                    indexs,
                    true
                  );
                }}
                value={OBLIGOR_TYPE[item.obligorType]}
                disabled={!item.blurAndNotNull}
                style={{ marginBottom: 20, height: 32, width: 68 }}
              >
                {Object.keys(OBLIGOR_TYPE).map((key) => (
                  <Option key={key} style={{ fontSize: 12 }}>
                    {OBLIGOR_TYPE[key]}
                  </Option>
                ))}
              </Select>
            </div>
          )),
      },
      {
        title: "证件号",
        dataIndex: "number",
        width: 175,
        key: "number",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入证件号"
              autoComplete="off"
              value={item.number}
              key={`number${indexs}`}
              onChange={(e) => this.handleChange(e, "number", index, indexs)}
              onBlur={(e) =>
                this.handleChange(e, "number", index, indexs, true)
              }
              style={{ marginBottom: 20, height: 32, width: 160 }}
            />
          )),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 106,
        key: "birthday",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入生日"
              autoComplete="off"
              value={item.birthday}
              key={`birthday${indexs}`}
              onChange={(e) => {
                this.handleChange(e, "birthday", index, indexs);
              }}
              onBlur={(e) => {
                this.handleChange(e, "birthday", index, indexs, true);
              }}
              style={{ marginBottom: 20, height: 32, width: 100 }}
            />
          )),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 84,
        key: "gender",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <div key={`gender${indexs}`}>
              <Select
                placeholder="性别"
                onChange={(value) => {
                  this.handleChange(
                    { target: { value } },
                    "gender",
                    index,
                    indexs
                  );
                }}
                onBlur={(value) => {
                  this.handleChange(
                    { target: { value } },
                    "gender",
                    index,
                    indexs,
                    true
                  );
                }}
                value={SEXS_TYPE[item.gender]}
                style={{ marginBottom: 20, height: 32, width: 68 }}
              >
                {Object.keys(SEXS_TYPE).map((key) => (
                  <Option key={key} style={{ fontSize: 12 }}>
                    {SEXS_TYPE[key]}
                  </Option>
                ))}
              </Select>
            </div>
          )),
      },
      {
        title: "担保金额",
        dataIndex: "amount",
        width: 118,
        key: "amount",
        className: "amount",
        render: (text, record, index) => (
          <Input
            placeholder="请输入担保金额"
            autoComplete="off"
            value={text}
            key={`amount${index}`}
            onChange={(e) => {
              this.handleChange(e, "amount", index);
            }}
            onBlur={(e) => {
              this.handleChange(e, "amount", index, "", true);
            }}
            style={{ height: 32, width: 108, marginBottom: 20 }}
          />
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 135,
        key: "notes",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input.TextArea
              placeholder="请输入备注"
              autoComplete="off"
              value={item.notes}
              key={`notes${indexs}`}
              autoSize
              onChange={(e) => {
                this.handleChange(e, "notes", index, indexs);
              }}
              onBlur={(e) => {
                this.handleChange(e, "notes", index, indexs, true);
              }}
              style={{ marginBottom: 20, height: 32, width: 118 }}
            />
          )),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 170,
        key: "action",
        render: (text, record, index) =>
          record.msgs.map((item, indexs) => (
            <div className="action" key={`action${indexs}`}>
              {indexs === 0 && (
                <span
                  onClick={() => this.handleADDGroup(index, indexs)}
                  className="add-group"
                  style={{ color: "#016AA9", cursor: "pointer" }}
                >
                  添加同组保证人
                </span>
              )}
              <span
                onClick={() => {
                  this.handleDel(index, indexs);
                }}
                className={indexs !== 0 ? "del-btn" : ""}
                style={{ color: "#016AA9", cursor: "pointer" }}
              >
                删除
              </span>
            </div>
          )),
      },
    ];
    return (
      <div
        className="debt-detail-components guarantors-info"
        id="GuarantorsInfo"
      >
        <div className="header">
          保证人信息
          {isEdit ? (
            <div className="batch-add">
              <Button
                onClick={this.handleOpenModal}
                className="header-btn"
                size="small"
                type="primary"
                ghost
                style={{ minWidth: 88, height: 32 }}
              >
                批量添加
              </Button>
              <span className="popover-icon">
                <Popover content="批量输入保证人，并以顿号隔开，如XXX、YYY、ZZZ保存后系统将自动生成单条保证人信息">
                  <Icon
                    type="exclamation-circle"
                    style={{
                      color: "#808387",
                      position: "relative",
                      marginLeft: 4,
                    }}
                  />
                </Popover>
              </span>
            </div>
          ) : null}
        </div>
        {isEdit ? (
          <Fragment>
            <Table
              rowClassName="table-list"
              columns={columnsEdit}
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
            columns={columns}
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
        <BatchAddModal
          visible={visible}
          handleCloseModal={this.handleCloseModal}
          handleSubmit={this.handleBatchAdd}
        />
      </div>
    );
  }
}

export default GuarantorsInfo;
