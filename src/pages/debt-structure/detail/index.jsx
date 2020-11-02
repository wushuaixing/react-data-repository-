import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BreadCrumb } from "@commonComponents";
import { rule } from "@/components/rule-container";
import Basic from "./basic";
import AssetPackage from "./assetPackage";
import HouseHold from "./houseHold";
import UnknownRelationShip from "./unknownRelationShip";
import SystemExtractInfo from "./systemExtractInfo";
import MsgsInfoModal from "../common/modal/msgsInfoModal";
import NumberModal from "../common/modal/numberModal";
import "./style.scss";

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
      creditorsRightsPrincipal: 3000,
      outstandingInterest: 50000,
      totalAmountCreditorsRights: 53000,
      Summation: 1,
      enable: false,
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
              name: "张高强",
              number: "5793475943795874395",
              type: 0,
            },
            {
              name: "杭州源城科技公司",
              number: "854309580345804355",
              type: 1,
            },
            {
              name: "王五",
              number: "843509830458034085",
              type: 0,
            },
          ],
        },
        {
          accountId: 3,
          collateralNum: 3,
          guarantorNum: 5,
          id: 35345435,
          interest: 0,
          pledgerNum: 5,
          rightsPrincipal: 0,
          status: 0,
          users: [
            {
              name: "杭州阿里巴巴科技公司",
              number: "843509830458034085",
              type: 1,
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
      guarantors: [
        {
          amount: 12,
          id: 12,
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
          amount: 132,
          id: 132132,
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
      msgsModalVisible: false,
      NumberModalVisible: false,
      numberModalParams: "",
    };
  }

  componentDidMount() {
    this.getDetailInfo(this.props);
  }

  getDetailInfo = (props) => {
    const {
      match: {
        params: { approverStatus, id },
      },
    } = props;
    this.setState({
      enable: !Boolean(parseInt(approverStatus)),
      id,
    });
  };

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

  handleChange = (key, value) => {
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
      GuarantorMsgInfo,
      numberModalParams,
      guarantors,
      Summation,
      enable,
    } = this.state;
    const {
      ruleSource: { rule },
    } = this.props;
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
              role={rule}
            />
            <AssetPackage
              unitNumber={unitNumber}
              creditorsRightsPrincipal={creditorsRightsPrincipal}
              outstandingInterest={outstandingInterest}
              totalAmountCreditorsRights={totalAmountCreditorsRights}
              Summation={Summation}
              handleChange={this.handleChange}
              enable={enable}
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
              enable={enable}
            />
            <UnknownRelationShip
              data={creditorsUnitsList}
              handleOpenModal={this.handleOpenModal}
              enable={enable}
            />
            <MsgsInfoModal
              visible={msgsModalVisible}
              handleCloseModal={this.handleCloseModal}
              msgsInfo={GuarantorMsgInfo}
            />
            <NumberModal
              visible={NumberModalVisible}
              handleCloseModal={this.handleCloseModal}
              data={guarantors}
              numberModalParams={numberModalParams}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(DebtDetail));
