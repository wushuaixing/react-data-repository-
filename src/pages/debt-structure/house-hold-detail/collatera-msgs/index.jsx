import React from "react";
import { Button, Form, Modal, Icon, message } from "antd";
import DebtApi from "@/server/debt";
import ItemEditContent from "./item";
import { HAS_TYPE, USE_TYPE, Title_TYPE } from "../../common/type";
import NoDataIMG from "@/assets/img/no_data.png";
import { clone } from "@utils/common";
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
  seizureSequence: "",
  mortgageSequence: "",
  consultPrice: "",
  mortgagePrice: "",
  id: Math.random(),
  note: "",
  owner: [],
});
/**
 * 户详情-抵押物信息
 */
class CollateralMsgsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isChange: "",
      collateralMsg: [],
    };
  }

  static defaultProps = {
    id: "",
    isEdit: false,
    enble: true,
    data: [],
    dynamicOwners: [],
    handleChange: () => {},
  };

  componentDidMount() {
    this.getCollateralMsgList();
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { data } = this.state;
    !data.length &&
      this.setState({
        data: props.data,
      });
  }

  //爬虫爬取抵押物名称信息
  getCollateralMsgList = () => {
    const { id } = this.props;
    DebtApi.getCollateralMsgList(id).then((result) => {
      if (result.data.code === 200) {
        const data = result.data.data;
        this.setState({
          collateralMsg: data,
        });
      } else {
        message.warning(result.data.message);
      }
    });
  };

  //添加
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

  //删除
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
      title: "确认删除此抵押物？",
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

  //重置内容
  handleRowReset = (index) => {
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
      title: "确认清空此抵押物信息？",
      onOk: () => {
        arr[index] = getMsgs();
        this.setState(
          {
            data: arr,
          },
          () => {
            this.props.form.resetFields();
            const { data } = this.state;
            this.props.handleChange("collateralMsgs", data);
          }
        );
      },
    });
  };

  //通过val找key
  handFindKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find((i) => compare(obj[i], value));
  };

  //保存
  handleSave = (val, index) => {
    const { data } = this.state;
    const { dynamicOwners } = this.props;

    const arr = data;
    let obj = clone(val);
    let owners = [];
    obj.owner.forEach((i) => {
      dynamicOwners.forEach((j) => {
        if (j.typeName === i) {
          owners.push(j);
        }
      });
    });
    obj.id = 0;
    obj.hasLease = parseInt(this.handFindKey(HAS_TYPE, obj.hasLease));
    obj.hasSeizure = parseInt(this.handFindKey(HAS_TYPE, obj.hasSeizure));
    obj.useType = this.handFindKey(USE_TYPE, obj.useType);
    obj.buildingArea = parseInt(obj.buildingArea) || 0;
    obj.consultPrice = parseInt(obj.consultPrice) || 0;
    obj.landArea = parseInt(obj.landArea) || 0;
    obj.mortgagePrice = parseInt(obj.mortgagePrice) || 0;
    obj.owner = owners;
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

  //选中抵押物名称，则自动填充爬取的此抵质押物的所有字段信息
  handleSelect = (id, index) => {
    const { data } = this.state;
    let arr = data;
    DebtApi.getCollateralDetail(id).then((result) => {
      if (result.data.code === 200) {
        arr[index] = result.data.data;
        this.setState(
          {
            data: arr,
          },
          () => {
            const { data } = this.state;
            this.props.handleChange("collateralMsgs", data);
          }
        );
      } else {
        message.error(result.data.message);
      }
    });
  };

  //角色信息更改后 所有人置空
  handleChange = () => {
    this.setState({
      isChange: Math.random(),
    });
  };

  render() {
    const { data, isChange, collateralMsg } = this.state;
    const { dynamicOwners, isEdit } = this.props;
    let dynamicOwnersList = dynamicOwners
      .map((i) => i.typeName)
      .filter((i) => i);
    return (
      <div className="debt-detail-components msgs-info" id="MsgsInfo">
        <div className="header">抵押物信息</div>
        <div className="content">
          {data.length ? (
            data.map((item, index) =>
              isEdit ? (
                <ItemEditContent
                  msgsList={item}
                  index={index}
                  key={`itemEditContent${index}`}
                  handleRowDel={this.handleRowDel}
                  handleSave={this.handleSave}
                  handleRowReset={this.handleRowReset}
                  dynamicOwners={dynamicOwnersList}
                  isChange={isChange}
                  handleSelect={this.handleSelect}
                  collateralMsg={collateralMsg}
                />
              ) : (
                <ItemContent msgsList={item} key={item.id} index={index} />
              )
            )
          ) : !isEdit ? (
            <div className="no-data-box">
              <img src={NoDataIMG} alt="暂无数据" />
              <p>暂无数据</p>
            </div>
          ) : null}
          {isEdit ? (
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
          ) : null}
        </div>
      </div>
    );
  }
}

const ItemContent = (props) => {
  const {
    msgsList: {
      name,
      type,
      useType,
      landArea,
      buildingArea,
      hasLease,
      hasSeizure,
      seizureSequence,
      mortgageSequence,
      consultPrice,
      mortgagePrice,
      note,
      owner,
    },
    index,
  } = props;
  const ownerList = (owner && owner.map((i) => i.name)) || [];
  const msgsList = [
    name,
    type,
    USE_TYPE[useType],
    landArea,
    buildingArea,
    HAS_TYPE[hasLease],
    HAS_TYPE[hasSeizure],
    seizureSequence,
    mortgageSequence,
    consultPrice,
    mortgagePrice,
    note,
    ownerList.join(),
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
