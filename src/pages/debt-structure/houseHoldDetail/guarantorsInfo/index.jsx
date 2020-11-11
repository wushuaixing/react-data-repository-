import React, { Fragment } from "react";
import { Table, Input, Select, Modal, Button, Icon } from "antd";
import { GuarantorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import { SEXS_TYPE, OBLIGOR_TYPE, ROLETYPES_TYPE } from "../../common/type";
import BatchAddModal from "../../common/modal/batchAddModal";
import AutoCompleteInput from "../autoComplete";
const { Option } = Select;
const { confirm } = Modal;
const getGuarantorsMsgs = () => ({
  birthday: "",
  gender: 0,
  id: new Date().getTime(),
  name: "",
  notes: "",
  number: "",
  obligorType: 0,
  type: 2,
});

const getGuarantors = (name) => ({
  amount: 0,
  id: Math.random(),
  msgs: [
    {
      birthday: 0,
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
      data: props.data,
      visible: false,
    };
  }

  handleFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

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
      content: "确认删除？",
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
                arr[index].msgs[indexs]["obligorType"] = 1;
              }
              arr[index].msgs[indexs]["blurAndNotNull"] = true;
            } else {
              arr[index].msgs[indexs]["obligorType"] = 0;
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

  handleOpenModal = () => {
    const { visible } = this.state;
    if (!visible) this.setState({ visible: true });
  };
  handleCloseModal = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  };
  handleBatchAdd = (text) => {
    const { data } = this.state;
    const arr = data;
    const BatchAddList = text.split("、");
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
        width: 760,
        key: "name",
        render: (text, record) =>
          record.msgs &&
          record.msgs.map((item) => <p key={item.id}>{item.name}</p>),
      },
      ...GuarantorsColumn,
    ];
    const columnsEdit = [
      {
        title: "保证人名称",
        dataIndex: "name",
        width: 760,
        key: "name",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            // <Input
            //   placeholder="请输入名称"
            //   value={item.name}
            //   autoComplete="off"
            //   name={`name${indexs}`}
            //   style={{ marginBottom: 20, height: 32 }}
            //   onChange={(e) => this.handleChange(e, "name", index, indexs)}
            //   onBlur={(e) => this.handleChange(e, "name", index, indexs, true)}
            //   key={`name${indexs}`}
            // />
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
        width: 160,
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
        width: 460,
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
                style={{ marginBottom: 20, height: 32 }}
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
        width: 1200,
        key: "number",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入证件号"
              autoComplete="off"
              value={item.number}
              style={{ marginBottom: 20, height: 32 }}
              key={`number${indexs}`}
              onChange={(e) => this.handleChange(e, "number", index, indexs)}
              onBlur={(e) =>
                this.handleChange(e, "number", index, indexs, true)
              }
            />
          )),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 760,
        key: "birthday",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入生日"
              autoComplete="off"
              value={item.birthday}
              key={`birthday${indexs}`}
              style={{ marginBottom: 20, height: 32 }}
              onChange={(e) => {
                this.handleChange(e, "birthday", index, indexs);
              }}
              onBlur={(e) => {
                this.handleChange(e, "birthday", index, indexs, true);
              }}
            />
          )),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 760,
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
                style={{ marginBottom: 20, height: 32 }}
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
        width: 760,
        key: "amount",
        render: (text, record, index) => (
          <Input
            placeholder="请输入担保金额"
            autoComplete="off"
            value={text}
            key={`amount${index}`}
            style={{ marginBottom: 20, height: 32 }}
            onChange={(e) => {
              this.handleChange(e, "amount", index);
            }}
            onBlur={(e) => {
              this.handleChange(e, "amount", index, "", true);
            }}
            className="amount"
          />
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 760,
        key: "notes",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input.TextArea
              placeholder="请输入备注"
              autoComplete="off"
              value={item.notes}
              key={`notes${indexs}`}
              style={{ marginBottom: 20, height: 32 }}
              onChange={(e) => {
                this.handleChange(e, "notes", index, indexs);
              }}
              onBlur={(e) => {
                this.handleChange(e, "notes", index, indexs, true);
              }}
            />
          )),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 760,
        key: "action",
        render: (text, record, index) =>
          record.msgs.map((item, indexs) => (
            <div className="action" key={`action${indexs}`}>
              {indexs === 0 && (
                <span
                  onClick={() => this.handleADDGroup(index, indexs)}
                  className="add-group"
                >
                  添加同组保证人
                </span>
              )}
              <span
                onClick={() => {
                  this.handleDel(index, indexs);
                }}
                className={indexs !== 0 ? "del-btn" : ""}
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
          {isEdit && (
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
          )}
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
