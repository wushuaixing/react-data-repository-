import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { BreadCrumb } from '@commonComponents';
import { rule } from '@/components/rule-container';
import Basic from './basic';
import AssetPackage from './assetPackage';
import HouseHold from './houseHold';
import UnknownRelationShip from './unknownRelationShip';
import SystemExtractInfo from './systemExtractInfo';
import MsgsInfoModal from '../common/modal/msgsInfoModal';
import NumberModal from '../common/modal/numberModal';
import './style.scss';

class DebtDetail extends Component {
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

      creditorsUnitsList: [
        {
          accountId: 0,
          collateralNum: 3,
          guarantorNum: 5,
          id: 2,
          interest: 0,
          pledgerNum: 5,
          rightsPrincipal: 0,
          status: 0,
          users: [
            {
              name: "张高强/王爱珍",
              number: "5793475943795874395",
            },
            {
              name: "张少加",
              number: "854309580345804355",
            },
            {
              name: "王五",
              number: "843509830458034085",
            },
          ],
        },
      ],

      msgsLists: [
        {
          name: "潮州市市宝山区联谊路649弄7号",
          type: "房地产",
        },
        {
          name: "潮州市市宝山区联谊路649弄7号",
          type: "房地产",
        },
        {
          name: "潮州市市宝山区联谊路649弄7号",
          type: "房地产",
        },
      ],
      usersLists: [
        {
          name: "李世华",
          notes: "名下有一间自住房",
          type: 0,
        },
        {
          name: "潮州市荣辉有限公司",
          notes: "",
          type: 0,
        },
      ],
      msgsInfo: {
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
      },
      GuarantorMsgInfo: [
        {
          amount: 234324,
          id: 100,
          msgs: [
            {
              birthday: 0,
              gender: 1,
              id: 0,
              name: "张羽羽",
              notes: "这是一个御用的备注",
              number: "747474747474747474",
              obligorType: 1,
              type: 0,
            },
          ],
        },
        {
          amount: 1111110,
          id: 200,
          msgs: [
            {
              birthday: 0,
              gender: 0,
              id: 4,
              name: "栗子",
              notes: "这是第二个备注",
              number: "850438504380543805",
              obligorType: 0,
              type: 3,
            },
          ],
        },
      ],
      numberModalListone: [
        {
          id: 0,
          name: "【第二次拍卖】",
          owner: [
            {
              id: 1,
              name: "张三",
            },
          ],
          useType: "房产",
        },
        {
          id: 0,
          name: "【第二次拍卖】北京市通州区京洲园",
          owner: [
            {
              id: 1,
              name: "张三",
            },
          ],
          useType: "房产",
        },
        {
          id: 0,
          name: "【第二次拍卖】北京市通州区京洲园250号楼（世爵源墅）-",
          owner: [
            {
              id: 1,
              name: "张三",
            },
          ],
          useType: "房产",
        },
      ],
      numberModalList: [
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
          id: 0,
          name: "李四",
          notes: "-",
          number: "3421543253425432543",
          obligorType: 0,
          type: 0,
        },
      ],
      msgsModalVisible: false,
      NumberModalVisible: false,
      numberModalParams: "",
    };
  }

  handleCloseModal = (key) => {
    this.setState({
      [key]: false,
    });
  };

  handleOpenModal = (key, { id = 0, type = "" }) => {
    this.setState({
      [key]: true,
      numberModalParams: type,
    });
  };

  render() {
    const {
      logs,
      unitNumber,
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      creditorsUnitsList,
      msgsLists,
      usersLists,
      msgsModalVisible,
      NumberModalVisible,
      msgsInfo,
      numberModalList,
      numberModalParams,
    } = this.state;
    return (
      <div className="yc-debt-container">
        <div className="yc-debt-content">
          <BreadCrumb texts={["拍卖债权结构化/详情"]} />
          <div className="yc-debt-detail">
            <Basic
              title="【第一次】潮州市枫溪粤东陶瓷制作厂等4户债权"
              status={11}
              withdraw="录入信息有误，撤回重新发布"
              logs={logs}
            />
            <AssetPackage
              unitNumber={unitNumber}
              creditorsRightsPrincipal={creditorsRightsPrincipal}
              outstandingInterest={outstandingInterest}
              totalAmountCreditorsRights={totalAmountCreditorsRights}
            />
            <SystemExtractInfo
              msgsLists={msgsLists}
              usersLists={usersLists}
              handleOpenModal={this.handleOpenModal}
            />
            <HouseHold
              data={creditorsUnitsList}
              page={1}
              total={1}
              handleOpenModal={this.handleOpenModal}
            />
            <UnknownRelationShip
              data={creditorsUnitsList}
              handleOpenModal={this.handleOpenModal}
            />
            <MsgsInfoModal
              visible={msgsModalVisible}
              handleCloseModal={this.handleCloseModal}
              msgsInfo={msgsInfo}
            />
            <NumberModal
              visible={NumberModalVisible}
              handleCloseModal={this.handleCloseModal}
              data={numberModalList}
              numberModalParams={numberModalParams}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(DebtDetail));
