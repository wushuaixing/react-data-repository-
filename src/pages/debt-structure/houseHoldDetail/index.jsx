import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { rule } from "@/components/rule-container";
import DebtRights from "./debtRights";
import PledgersInfo from "./pledgersInfo";
import GuarantorsInfo from "./guarantorsInfo";
import DebtorsInfo from "./debtorsInfo";
import CollateralMsgsInfo from "./collateralMsgsInfo";
import "./style.scss";

const getPledgers = () => ({
  birthday: "",
  gender: 0,
  id: new Date().getTime(),
  name: "",
  notes: "",
  number: "",
  obligorType: 0,
  type: 3,
});

const getGuarantors = () => ({
  amount: 0,
  id: new Date().getTime(),
  msgs: [
    {
      birthday: 0,
      gender: 0,
      id: "",
      name: "",
      notes: "",
      number: "",
      obligorType: 1,
      type: 1,
    },
  ],
});

class HouseHoldDetail extends Component {
  constructor() {
    super();
    this.state = {
      id: 1002,
      logs: [
        { type: 0, msg: "结构化", name: "赵测", time: 1602728165 },
        { type: 1, msg: "1", name: "检察人员", time: 1602751934 },
        { type: 0, msg: "检查无误", name: "检察人员", time: 1602752380 },
        { type: 1, msg: ".l;p", name: "检察人员", time: 1602812955 },
        { type: 0, msg: "结构化", name: "赵测", time: 1602816382 },
      ],
      unitNumber: 4,
      creditorsRightsPrincipal: 30000,
      outstandingInterest: 50000,
      totalAmountCreditorsRights: 80000,
      Summation: 1,
      enable: false,
      debtors: [
        {
          birthday: 0,
          gender: 0,
          id: 0,
          name: "张三",
          notes: "-",
          number: "543253254325234543",
          obligorType: 0,
          type: 1,
        },
        {
          birthday: 0,
          gender: 0,
          id: 1,
          name: "李四",
          notes: "-",
          number: "3421543253425432543",
          obligorType: 0,
          type: 1,
        },
      ],
      pledgers: [
        {
          birthday: 0,
          gender: 0,
          id: 2,
          name: "张三",
          notes: "-",
          number: "5432533",
          obligorType: 1,
          type: 3,
        },
        {
          birthday: 0,
          gender: 0,
          id: 3,
          name: "李四",
          notes: "-",
          number: "34243",
          obligorType: 0,
          type: 3,
        },
      ],
      collateralMsgs: [
        {
          buildingArea: 4324324,
          category: "房产",
          collateralName: "潮州市市宝山区联谊路649弄7号",
          crawlerModified: "",
          gmtCreate: "",
          gmtDeleted: "",
          gmtModified: "",
          hasLease: 0,
          hasSeizure: 0,
          landArea: 0,
          mortgageSequence: "",
          note: "",
          seizureSequence: "",
          useType: "",
          id: "111",
        },
        {
          buildingArea: 4324324,
          category: "房产",
          collateralName: "潮州市市宝山区联谊路649弄7号",
          crawlerModified: "",
          gmtCreate: "",
          gmtDeleted: "",
          gmtModified: "",
          hasLease: 0,
          hasSeizure: 0,
          landArea: 0,
          mortgageSequence: "",
          note: "",
          seizureSequence: "",
          useType: "",
          id: "3333",
        },
      ],
      guarantors: [
        {
          amount: 0,
          id: 0,
          msgs: [
            {
              birthday: 0,
              gender: 1,
              id: 67,
              name: "李四",
              notes: "-",
              number: "3421543253425432543",
              obligorType: 1,
              type: 2,
            },
            {
              birthday: 0,
              gender: 2,
              id: 92,
              name: "李四",
              notes: "-",
              number: "3421543253425432543",
              obligorType: 1,
              type: 1,
            },
          ],
        },
        {
          amount: 1,
          id: 1,
          msgs: [
            {
              birthday: 0,
              gender: 1,
              id: 90,
              name: "李四",
              notes: "-",
              number: "3421543253425432543",
              obligorType: 1,
              type: 2,
            },
          ],
        },
      ],
    };
  }

  handleDebtRightsChange = (key, value) => {
    this.setState(
      {
        [key]: value,
      },
      () => {
        const {
          Summation,
          creditorsRightsPrincipal,
          outstandingInterest,
        } = this.state;
        if (key !== "totalAmountCreditorsRights") {
          Summation &&
            this.setState({
              totalAmountCreditorsRights:
                creditorsRightsPrincipal + outstandingInterest,
            });
        }
      }
    );
  };

  handleAddClick = (key) => {
    const arr = [
      ...this.state[key],
      key === "guarantors" ? { ...getGuarantors() } : { ...getPledgers() },
    ];
    this.setState({
      [key]: arr,
    });
  };

  handleDeleteClick = (key, index) => {
    const arr = this.state[key];
    arr.splice(index, 1);
    this.setState({
      [key]: arr,
    });
  };

  handleDelGuarantors = (index, itemIndex) => {
    const { guarantors } = this.state;
    const arr = guarantors;
    if (arr[index].msgs.length === 1) {
      arr.splice(index, 1);
    } else {
      arr[index].msgs.splice(itemIndex, 1);
    }
    this.setState({
      guarantors: arr,
    });
  };

  handleAddGuarantors = (index) => {
    const {guarantors}=this.state;
    const newMsgsList = [...guarantors[index].msgs, { ...getPledgers() }];
    const arr = guarantors;
    arr[index].msgs = newMsgsList;
    this.setState({
      guarantors: arr,
    });
  };

  handlPledgersAndDebtorsChange = (combine, value, role) => {
    const arr_index = combine.replace(/[^0-9]/g, "");
    const key = combine.replace(/[^a-zA-Z_]/g, "");
    const arr = [...this.state[role]];
    arr[arr_index][key] = value;
    this.setState({
      [role]: arr,
    });
  };

  handlGuarantorsChange = (combine, value, index) => {
    const {guarantors}=this.state;
    const arr_index = combine.replace(/[^0-9]/g, "");
    const key = combine.replace(/[^a-zA-Z_]/g, "");
    const arr = [...guarantors];
    if (key === "amount") {
      arr[arr_index][key] = value;
    } else {
      arr[index].msgs[arr_index][key] = value;
    }
    this.setState({
      guarantors: arr,
    });
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
      enable,
    } = this.state;
    return (
      <div className="yc-debt-newpage-container">
        <div className="yc-debt-newpage-content">
          <div className="yc-household-detail">
            <div className="detail-header">
              债务人：潮州市枫溪粤东陶瓷制作厂
            </div>
            <DebtRights
              creditorsRightsPrincipal={creditorsRightsPrincipal}
              outstandingInterest={outstandingInterest}
              totalAmountCreditorsRights={totalAmountCreditorsRights}
              handleChange={this.handleDebtRightsChange}
              Summation={Summation}
              enable={enable}
            />
            <DebtorsInfo
              data={debtors}
              params="debtors"
              enable={enable}
              handleAddClick={this.handleAddClick}
              handleDeleteClick={this.handleDeleteClick}
              handleChange={this.handlPledgersAndDebtorsChange}
            />
            <GuarantorsInfo
              data={guarantors}
              params="guarantors"
              enable={enable}
              handleAddClick={this.handleAddClick}
              handleDeleteClick={this.handleDelGuarantors}
              handleAddGuarantors={this.handleAddGuarantors}
              handleChange={this.handlGuarantorsChange}
            />
            <PledgersInfo
              data={pledgers}
              params="pledgers"
              handleAddClick={this.handleAddClick}
              handleDeleteClick={this.handleDeleteClick}
              handleChange={this.handlPledgersAndDebtorsChange}
            />
            <CollateralMsgsInfo data={collateralMsgs} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(HouseHoldDetail));
