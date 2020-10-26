import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { rule } from '@/components/rule-container';
import './style.scss';
import DebtRights from './debtRights';
import PledgersInfo from './pledgersInfo';
import GuarantorsInfo from './guarantorsInfo';
import DebtorsInfo from './debtorsInfo';
import CollateralMsgsInfo from './collateralMsgsInfo';

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
      creditorsRightsPrincipal: 30000000000,
      outstandingInterest: 5430000000,
      totalAmountCreditorsRights: 890000000,
      debtors: [
        {
          birthday: 0,
          gender: 0,
          id: 0,
          name: "张三",
          notes: "-",
          number: "543253254325234543",
          obligorType: 0,
          type: 0,
        },
        {
          birthday: 0,
          gender: 0,
          id: 1,
          name: "李四",
          notes: "-",
          number: "3421543253425432543",
          obligorType: 0,
          type: 0,
        },
      ],
      pledgers: [
        {
          birthday: 0,
          gender: 0,
          id: 2,
          name: "张三",
          notes: "-",
          number: "543253254325234543",
          obligorType: 0,
          type: 0,
        },
        {
          birthday: 0,
          gender: 0,
          id: 3,
          name: "李四",
          notes: "-",
          number: "3421543253425432543",
          obligorType: 0,
          type: 0,
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
          id: "2222",
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
    };
  }

  render() {
    const {
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      debtors,
      pledgers,
      collateralMsgs,
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
            />
            <DebtorsInfo data={debtors} params="debtors" />
            <GuarantorsInfo data={debtors} params="guarantors" />
            <PledgersInfo data={pledgers} params="pledgers" />
            <CollateralMsgsInfo data={collateralMsgs} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(HouseHoldDetail));
