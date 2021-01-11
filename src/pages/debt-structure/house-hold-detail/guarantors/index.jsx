import React, { Fragment } from "react";
import {
  Table,
  Input,
  Select,
  Modal,
  Button,
  Icon,
  Popover,
  InputNumber,
} from "antd";
import { GuarantorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import { SEXS_TYPE, OBLIGOR_TYPE } from "../../common/type";
import BatchAddModal from "../../common/modal/batch-add-modal";
import AutoCompleteInput from "../auto-complete";
import { dateUtils, clone } from "@utils/common";
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
      id: Math.random(),
      name: name ? name : "",
      notes: "",
      number: "",
      obligorType: 0,
      type: 2,
    },
  ],
});
/**
 * 户详情-保证人信息
 */
class GuarantorsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
    };
  }

  static defaultProps = {
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

  /**
   * 获取保证人索引值
   * @param arr 保证人所有数据
   * @param index 第几组
   * @param indexs 组中第几个保证人
   * return 第n组中第n个保证人 在整批保证人中的索引
   */
  getLength = (arr, index, indexs) => {
    const data = arr.slice(0, index);
    let i = 0;
    data.forEach((item) => {
      item.msgs.forEach(() => i++);
    });
    return i + indexs + 1;
  };

  //通过val 找key
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

  //删除
  handleDel = (index, itemIndex) => {
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
        if (arr[index].msgs.length === 1) {
          arr.splice(index, 1);
        } else {
          arr[index].msgs.splice(itemIndex, 1);
        };
        this.setState(
          {
            data: arr,
          },
          () => this.getdetailInfo()
        )}
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
      () => this.getdetailInfo()
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
      () => this.getdetailInfo()
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
            let val = value.trim().replace(/[(]/g, "（").replace(/[)]/g, "）");
            if (val) {
              if (val.length > 4) {
                arr[index].msgs[indexs]["obligorType"] = 1; //大于三 人员类别为企业
              } else {
                arr[index].msgs[indexs]["obligorType"] = 2; //小于三 为个人
              }
              arr[index].msgs[indexs]["blurAndNotNull"] = true;
            } else {
              arr[index].msgs[indexs]["obligorType"] = 0;
              arr[index].msgs[indexs]["blurAndNotNull"] = false; //无数据时 人员类别为 未知且禁用
            }
            arr[index].msgs[indexs][key] = val;
            break;
          case "birthday":
            let intVal = this.handleBirthdayFormat(value);
            arr[index].msgs[indexs][key] = intVal;
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
        isblur && this.getdetailInfo();
      }
    );
  };

  //id增加时为随机数，作为key值，给后端时为0
  getdetailInfo = () => {
    const { data } = this.state;
    const list = clone(data);
    list.forEach((item, index) => {
      item.id = item.id > 1 ? item.id : 0;
      item.msgs.forEach((val, key) => {
        val.typeName = `保证人${this.getLength(list, index, key)}`;
        val.id = val.id > 1 ? val.id : 0;
      });
    });
    this.props.handleChange("guarantors", list);
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
        title: "序号",
        dataIndex: "type",
        width: 103,
        key: "type",
        className: "guarantors-types",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => {
            return (
              <p key={`type${indexs}`}>
                {`保证人${this.getLength(data, index, indexs)}`}
              </p>
            );
          }),
      },
      {
        title: "保证人名称",
        dataIndex: "name",
        width: 220,
        key: "name",
        render: (text, record) =>
          record.msgs &&
          record.msgs.map((item) => <p key={item.id}>{item.name}</p>),
      },
      ...GuarantorsColumn,
    ];
    const columnsEdit = [
      {
        title: "序号",
        dataIndex: "type",
        width: 83,
        key: "type",
        className: "guarantors-types",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => {
            return (
              <div className="guarantors-type" key={`type${indexs}`}>
                {`保证人${this.getLength(data, index, indexs)}`}
              </div>
            );
          }),
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 200,
        key: "name",
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
              width={180}
            />
          )),
      },
      {
        title: "人员类别",
        dataIndex: "obligorType",
        width: 88,
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
                style={{ marginBottom: 16, height: 32, width: 68 }}
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
        width: 192,
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
              onBlur={(e) => {
                e.persist();
                e.target.value = e.target.value
                  .trim()
                  .replace(/[^a-zA-Z\d（）()]+/g, "")
                this.handleChange(e, "number", index, indexs, true);
              }}
              style={{ marginBottom: 16, height: 32, width: 172 }}
              maxLength={18}
            />
          )),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 140,
        key: "birthday",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入生日"
              autoComplete="off"
              value={item.birthday || ""}
              key={`birthday${indexs}`}
              onChange={(e) => {
                this.handleChange(e, "birthday", index, indexs);
              }}
              onBlur={(e) => {
                this.handleChange(e, "birthday", index, indexs, true);
              }}
              style={{ marginBottom: 16, height: 32, width: 120 }}
            />
          )),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 88,
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
                style={{ marginBottom: 16, height: 32, width: 68 }}
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
        title: "担保金额(元)",
        dataIndex: "amount",
        width: 150,
        key: "amount",
        className: "amount",
        render: (text, record, index) => (
          <InputNumber
            placeholder="请输入担保金额"
            autoComplete="off"
            value={text}
            key={`amount${index}`}
            precision={2}
            max={999999999999.99}
            min={0}
            onChange={(value) => {
              this.handleChange({ target: { value } }, "amount", index);
            }}
            onBlur={(e) => {
              this.handleChange(e, "amount", index, "", true);
            }}
            style={{ height: 32, width: 130, marginBottom: 20 }}
          />
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 138,
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
              style={{ marginBottom: 16, height: 32, width: 118 }}
              maxLength={200}
            />
          )),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 165,
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
            </div>
          ) : null}
        </div>
        {isEdit ? (
          <Fragment>
            <Table
              rowClassName="edit-list"
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
            rowClassName="enable-list"
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
