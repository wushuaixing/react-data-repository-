import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import DebtApi from "@/server/debt";
import { Button, message } from "antd";
import { rule } from "@/components/rule-container";
import DebtRights from "./debtRights";
import PledgersAndDebtorsInfo from "./pledgersInfo";
import GuarantorsInfo from "./guarantorsInfo";
import CollateralMsgsInfo from "./collateralMsgsInfo";
import { ANCHOR_TYPE } from "../common/type";
import { filters, clone } from "@utils/common";
import "./style.scss";
class HouseHoldDetail extends Component {
  constructor() {
    super();
    this.state = {
      id: 1002,
      owner: ["张三", "李四", "王五", "马努", "成吉思汗", "顾明", "殿语"],
      unitNumber: 0,
      creditorsRightsPrincipal: 0,
      outstandingInterest: 0,
      totalAmountCreditorsRights: 0,
      Summation: 1,
      debtors: [],
      pledgers: [],
      collateralMsgs: [],
      guarantors: [],
      detailInfo: {
        pledgers: [],
        debtors: [],
        guarantors: [],
        creditorsRightsPrincipal: 0,
        outstandingInterest: 0,
        totalAmountCreditorsRights: 0,
      },
      activeFlag: 0,
    };
  }

  componentDidMount() {
    this.getDetailInfo(this.props);
  }

  getDetailInfo = (props) => {
    const {
      match: {
        params: { id },
      },
    } = props;
    DebtApi.getcreditorsUnitDetail(id).then((result) => {
      const res = result.data;
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          id: data.id,
          collateralMsgs: data.collateralMsgs, //抵押物信息
          debtors: data.debtors, //债务人信息
          guarantors: data.guarantors, //保证人信息
          pledgers: data.pledgers, //抵质押人信息
          creditorsRightsPrincipal: data.creditorsRightsPrincipal, //债权本金
          outstandingInterest: data.outstandingInterest, //利息
          totalAmountCreditorsRights: data.totalAmountCreditorsRights, //本息合计
        });
      }
    });
  };

  handleSubmit = () => {
    const { detailInfo } = this.state;
    const {
      match: {
        params: { packageId, id, type },
      },
    } = this.props;

    const params = {
      type: parseInt(type),
      packageID: parseInt(packageId),
      id: parseInt(id),
      ...detailInfo,
    };

    DebtApi.unitSaveDetail(params).then((res) => {
      if (res.data.code === 200 && res.data.data) {
        message.success("保存成功", 2, this.handleClosePage);
      } else {
        message.warning(res.data.message);
      }
    });
  };

  handleClosePage = () => {
    if (window.opener) {
      window.opener = null;
      window.open("", "_self");
      window.close();
    } else {
      message.warning(
        "由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面",
        2,
        () => (window.location.href = "about:blank")
      );
    }
  };

  removeRepeat = (arrList) => {
    let arr = arrList;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i]["name"] === arr[j]["name"]) {
          if (arr[j]["name"].length > 3) {
            arr.splice(j, 1);
          } else {
            if (!arr[i]["number"] && !arr[j]["number"]) {
              if (!arr[i]["birthday"] && !arr[j]["birthday"]) {
                arr.splice(j, 1);
              } else {
                if (arr[i]["birthday"] === arr[j]["birthday"]) {
                  arr.splice(j, 1);
                } else {
                  arr[i]["name"] = arr[i]["birthday"]
                    ? `${arr[i]["name"]}(${arr[i]["birthday"]})`
                    : arr[i]["name"];
                  arr[j]["name"] = arr[j]["birthday"]
                    ? `${arr[j]["name"]}(${arr[j]["birthday"]})`
                    : arr[j]["name"];
                }
              }
            } else {
              if (arr[i]["number"] === arr[j]["number"]) {
                arr.splice(j, 1);
              } else {
                arr[i]["name"] = arr[i]["number"]
                  ? `${arr[i]["name"]}(${arr[i]["number"]})`
                  : arr[i]["name"];
                arr[j]["name"] = arr[j]["number"]
                  ? `${arr[j]["name"]}(${arr[j]["number"]})`
                  : arr[j]["name"];
              }
            }
          }
          j = j - 1; // splice()删除元素之后，会使得数组长度减少
        }
      }
    }
    let dynamicArr = arr.map((i) => i.name);
    return dynamicArr;
  };

  handleChange = (key, value) => {
    const { detailInfo } = this.state;
    const arr = detailInfo;
    if (key === "debtRights") {
      Object.keys(value).forEach((keys) => (arr[keys] = value[keys]));
    } else if (key === "guarantors") {
      const guarantorVal = clone(value);
      arr[key] = guarantorVal.filter((i) => {
        let params = i;
        params.msgs = filters.blockEmptyRow(params.msgs, ["name", "number"]);
        return params.msgs.length > 0;
      });
    } else {
      arr[key] = filters.blockEmptyRow(value, ["name", "number"]);
    }
    this.setState(
      {
        detailInfo: arr,
      },
      () => {
        let arr = [];
        const { debtors, guarantors, pledgers } = detailInfo;
        console.log(detailInfo);
        debtors.forEach((item) => {
          let obj = {
            name: item.name,
            number: item.number,
            birthday: item.birthday,
            id: Math.random(),
          };
          arr.push(obj);
        });
        pledgers.forEach((item) => {
          let obj = {
            name: item.name,
            number: item.number,
            birthday: item.birthday,
            id: Math.random(),
          };
          arr.push(obj);
        });
        guarantors.forEach((item) => {
          item.msgs.forEach((item) => {
            let obj = {
              name: item.name,
              number: item.number,
              birthday: item.birthday,
              id: Math.random(),
            };
            arr.push(obj);
          });
        });
        console.log(this.removeRepeat(arr));
        this.setState({
          owner: this.removeRepeat(arr),
        });
        // console.log(this.removeRepeat(arr)); //所有人去重规则
      }
    );
  };

  render() {
    const {
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      debtors,
      pledgers,
      collateralMsgs,
      guarantors,
      Summation,
      owner,
      activeFlag,
    } = this.state;
    const isHouseHoldDetail = window.location.href.includes("houseHoldDetail");
    const anchorList = isHouseHoldDetail
      ? Object.keys(ANCHOR_TYPE)
      : Object.keys(ANCHOR_TYPE).slice(2);
    const {
      match: {
        params: { isEdit },
      },
    } = this.props;
    return (
      <div className="yc-debt-newpage-container">
        <div className="yc-debt-newpage-content">
          <div className="yc-household-detail">
            <div className="detail-header">
              债务人：潮州市枫溪粤东陶瓷制作厂
            </div>
            <div className="yc-anchor">
              <ul>
                {anchorList.map((item, index) => (
                  <li key={`anchor${index}`}>
                    <a
                      href={`#${item}`}
                      className={index === activeFlag ? "active" : null}
                      onClick={() => this.setState({ activeFlag: index })}
                    >
                      {ANCHOR_TYPE[item]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {isHouseHoldDetail && (
              <Fragment>
                <DebtRights
                  creditorsRightsPrincipal={creditorsRightsPrincipal}
                  outstandingInterest={outstandingInterest}
                  totalAmountCreditorsRights={totalAmountCreditorsRights}
                  Summation={Summation}
                  isEdit={isEdit}
                  handleChange={this.handleChange}
                />
                <PledgersAndDebtorsInfo
                  data={debtors}
                  isEdit={isEdit}
                  handleChange={this.handleChange}
                  role="debtors"
                />
              </Fragment>
            )}
            <GuarantorsInfo
              data={guarantors}
              isEdit={isEdit}
              handleOpenBatchAddModal={this.handleOpenBatchAddModal}
              handleChange={this.handleChange}
            />
            <PledgersAndDebtorsInfo
              data={pledgers}
              isEdit={isEdit}
              handleChange={this.handleChange}
              role="pledgers"
            />
            <CollateralMsgsInfo
              data={collateralMsgs}
              handleChange={this.handleChange}
              owner={owner}
              isEdit={isEdit}
            />
            <div className="save-btn">
              <Button onClick={this.handleSubmit} type="primary">
                保存并关闭
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(HouseHoldDetail));
