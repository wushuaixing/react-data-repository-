import React from "react";
import { Button, Form, Modal, Icon, message } from "antd";
import DebtApi from "@/server/debt";
import ItemEditContent from "./item";
import { HAS_TYPE, USE_TYPE } from "../../common/type";
import NoDataIMG from "@/assets/img/no_data.png";
import { clone, floatFormat } from "@utils/common";
const collateralForm = Form.create;
const { confirm } = Modal;
const getMsgs = () => ({
  collateralName: "",
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
    const { id, isEdit } = this.props;
    isEdit &&
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
      () => this.getDetailInfo()
    );
  };

  //删除
  handleRowDel = (index) => {
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
      title: "确认删除此抵押物？",
      onOk: () =>{
        arr.splice(index, 1);
        this.setState(
          {
            data: arr,
          },
          () => this.getDetailInfo()
        )}
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
          () => this.getDetailInfo()
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
        if (i.includes(`${j.name}(${j.typeName})`)) {
          owners.push(j);
        }
      });
    });
    obj.hasLease = parseInt(this.handFindKey(HAS_TYPE, obj.hasLease));
    obj.hasSeizure = parseInt(this.handFindKey(HAS_TYPE, obj.hasSeizure));
    obj.useType = this.handFindKey(USE_TYPE, obj.useType);
    obj.buildingArea = parseInt(obj.buildingArea) || 0;
    obj.consultPrice = parseInt(obj.consultPrice) || 0;
    obj.landArea = parseInt(obj.landArea) || 0;
    obj.mortgagePrice = parseInt(obj.mortgagePrice) || 0;
    obj.owner = owners;
    obj.id = arr[index].id;
    arr[index] = obj;
    this.setState(
      {
        data: arr,
      },
      () => this.getDetailInfo()
    );
  };

  //选中抵押物名称，则自动填充爬取的此抵质押物的所有字段信息
  handleSelect = (id, index) => {
    const { data } = this.state;
    let arr = clone(data);
    DebtApi.getCollateralDetail(id).then((result) => {
      if (result.data.code === 200) {
        const msgData = result.data.data;
        const oldId = arr[index].id;
        arr[index] = { //新增为0,编辑时传原id
          ...msgData,
          id:oldId > 0 ? oldId : 0,
        }
        this.setState(
          {
            data: arr,
          },
          () => this.getDetailInfo()
        );
      } else {
        message.error(result.data.message);
      }
    });
  };

  //id增加时为随机数，作为key值，给后端时为0
  getDetailInfo = () => {
    const { data } = this.state;
    const list = clone(data);
    list.forEach((i, index) => {
      list[index].id = list[index].id > 1 ? list[index].id : 0;
    });
    this.props.handleChange("collateralMsgs", list);
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
      .map((i) => `${i.name}(${i.typeName})`)
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
                  key={`itemEditContent${item.id}`}
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
      collateralName,
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
    {
      lable: "名称",
      value: collateralName,
      unit: "normal",
    },
    {
      lable: "类别",
      value: type,
      unit: "normal",
    },
    {
      lable: "房地用途",
      value: USE_TYPE[useType],
      unit: "normal",
    },
    {
      lable: "土地面积",
      value: landArea,
      unit: "area",
    },
    {
      lable: "建筑面积",
      value: buildingArea,
      unit: "area",
    },
    {
      lable: "有无租赁",
      value: HAS_TYPE[hasLease],
      unit: "normal",
    },
    {
      lable: "有无查封",
      value: HAS_TYPE[hasSeizure],
      unit: "normal",
    },
    {
      lable: "查封顺位",
      value: seizureSequence,
      unit: "normal",
    },
    {
      lable: "抵押顺位",
      value: mortgageSequence,
      unit: "normal",
    },
    {
      lable: "评估价",
      value: consultPrice,
      unit: "price",
    },
    {
      lable: "抵押金额",
      value: mortgagePrice,
      unit: "price",
    },
    {
      lable: "所有人",
      value: ownerList.join(),
      unit: "normal",
    },
    {
      lable: "备注",
      value: note,
      unit: "normal",
    },
  ];
  return (
    <div className="item-container">
      <div className="item-header">抵押物{index + 1}</div>
      <ul className="item-content">
        {msgsList.map((item) => (
          <Item
            title={item.lable}
            content={item.value}
            key={item.lable}
            units={item.unit}
          />
        ))}
      </ul>
    </div>
  );
};

const Item = (props) => {
  const { title, content, units } = props;
  const unit = () => {
    if (units === "area") {
      return (
        <span>
          m<sup>2</sup>
        </span>
      );
    } else if (units === "price") {
      return " 元";
    } else {
      return "";
    }
  };
  const text = (text) => {
    if (units === "area") {
      return text.toFixed(2);
    } else if (units === "price") {
      return floatFormat(text);
    } else {
      return text;
    }
  };
  return (
    <li>
      <div>{title}：</div>
      <div>
        {content ? text(content) : "-"} {content ? unit() : ""}
      </div>
    </li>
  );
};

export default collateralForm()(CollateralMsgsInfo);
