import React from "react";
import { Button, Form, Modal, Icon } from "antd";
import ItemEditContent from "./item";
import { HAS_TYPE, USE_TYPE, Title_TYPE } from "../../common/type";
const collateralForm = Form.create;
const { confirm } = Modal;
const getMsgs = () => ({
  name: "",
  type: "",
  useType: 0,
  landArea: "",
  buildingArea: "",
  hasLease: 0,
  hasSeizure: 0,
  seizureSequence: 0,
  mortgageSequence: 0,
  consultPrice: "",
  mortgagePrice: 0,
  id: Math.random(),
  note: "",
});
class CollateralMsgsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  static defaultProps = {
    data: [],
    enble: true,
  };
  handleRowAdd = () => {
    const { data } = this.state;
    const arr = [...data, { ...getMsgs() }];
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange("collateralMsgs", data);
      }
    );
  };

  handleRowDel = (index) => {
    const { data } = this.state;
    const arr = data;
    arr.splice(index, 1);
    confirm({
      icon: (
        <Icon
          type="exclamation-circle"
          theme="filled"
          style={{ color: "#fa930c" }}
        />
      ),
      content: "确认删除此抵押物信息？",
      onOk: () =>
        this.setState(
          {
            data: arr,
          },
          () => {
            const { data } = this.state;
            this.props.handleChange("collateralMsgs", data);
          }
        ),
    });
  };

  handleRowReset = (index) => {
    const { data } = this.state;
    const arr = data;
    arr[index] = getMsgs();
    confirm({
      icon: (
        <Icon
          type="exclamation-circle"
          theme="filled"
          style={{ color: "#fa930c" }}
        />
      ),
      content: "确认清空此抵押物信息？",
      onOk: () =>
        this.setState(
          {
            data: arr,
          },
          () => {
            this.props.form.resetFields();
            const { data } = this.state;
            this.props.handleChange("collateralMsgs", data);
          }
        ),
    });
  };

  handFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

  handleSave = (val, index) => {
    const { data } = this.state;
    const arr = data;
    let obj = val;
    obj.hasLease = this.handFindKey(HAS_TYPE, obj.hasLease);
    obj.hasSeizure = this.handFindKey(HAS_TYPE, obj.hasSeizure);
    obj.useType = this.handFindKey(USE_TYPE, obj.useType);
    arr[index] = obj;
    this.setState(
      {
        data: arr,
      },
      () => {
        const { data } = this.state;
        this.props.handleChange("collateralMsgs", data);
      }
    );
  };

  handleSubmit = () => {
    const { data } = this.state;
    this.props.handleChange(data);
  };

  render() {
    const { data } = this.state;
    const { owner, isEdit } = this.props;
    return (
      <div className="debt-detail-components msgs-info" id="MsgsInfo">
        <div className="header">抵押物信息</div>
        <div className="content">
          {data.map((item, index) =>
            isEdit ? (
              <ItemEditContent
                msgsList={item}
                index={index}
                key={`itemEditContent${index}`}
                handleRowDel={this.handleRowDel}
                handleSave={this.handleSave}
                handleRowReset={this.handleRowReset}
                owner={owner}
              />
            ) : (
              <ItemContent msgsList={item} key={item.id} index={index} />
            )
          )}
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
        </div>
      </div>
    );
  }
}

const ItemContent = (props) => {
  const {
    msgsList: {
      collateralName,
      category,
      landArea,
      buildingArea,
      useType,
      hasSeizure,
      hasLease,
      seizureSequence,
      mortgageSequence,
      note,
    },
    index,
  } = props;
  const msgsList = [
    collateralName,
    category,
    landArea,
    buildingArea,
    useType,
    hasSeizure,
    hasLease,
    seizureSequence,
    mortgageSequence,
    "-",
    "10000",
    "2000000",
    note,
  ];
  return (
    <div className="item-container">
      <div className="item-header">抵押物{index + 1}</div>
      <ul className="item-content">
        {msgsList.map((item, indexs) => (
          <Item
            title={Title_TYPE[indexs]}
            content={item}
            key={`item${indexs}`}
          />
        ))}
      </ul>
    </div>
  );
};

const Item = (props) => (
  <li>
    <div>{props.title}：</div>
    <div>{props.content ? props.content : "-"}</div>
  </li>
);

export default collateralForm()(CollateralMsgsInfo);
