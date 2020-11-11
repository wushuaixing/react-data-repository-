import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DebtApi from "@/server/debt";
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
      id: "",
      logs: [],
      packageId: "",
      unitNumber: "",
      creditorsRightsPrincipal: "",
      outstandingInterest: "",
      totalAmountCreditorsRights: "",
      Summation: 1,
      isEdit: false,
      creditorsUnitsList: [],

      msgsLists: [],
      usersLists: [],
      msgsInfo: {},
      GuarantorMsgInfo: [],
      numberModalListone: [],
      numberModalList: [],
      guarantors: [],
      msgsModalVisible: false,
      NumberModalVisible: false,
      numberModalParams: "",
      page: 1,
      total: 0,
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
    const { page } = this.state;
    DebtApi.getcreditorsDetail(id).then((result) => {
      const res = result.data;
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          id: data.id, //债权id
          packageId: data.packageId, //包id
          title: data.title, //标题
          status: data.status, //拍卖状态
          withdraw: data.withdraw, //撤回原因
          logs: data.logs, //结构化检查记录

          unitNumber: data.unitNumber, //户数
          creditorsRightsPrincipal: data.creditorsRightsPrincipal, //本金合计
          outstandingInterest: data.outstandingInterest, //利息合计
          totalAmountCreditorsRights: data.totalAmountCreditorsRights, //本息合计
          Summation: 1, //勾选本息自动求和

          msgsLists: data.msgsLists, //系统提取信息-抵押物信息
          usersLists: data.usersLists, //系统提取信息-保证人信息
          msgsInfo: data.msgsInfo,
          GuarantorMsgInfo: data.GuarantorMsgInfo,
          numberModalListone: data.numberModalListone,
          numberModalList: data.numberModalList,
          guarantors: data.guarantors,
          msgsModalVisible: data.msgsModalVisible, //系统提取信息-抵质押物-查看详情弹框
          NumberModalVisible: data.NumberModalVisible, //保证人-抵质押人-抵质押物 弹框
          numberModalParams: data.numberModalParams, //保证人-抵质押人-抵质押物 弹框角色
          isEdit: Boolean(parseInt(approverStatus)), //是否可编辑
        });
      }
    });

    DebtApi.getcreditorsUnitsList(id, page).then((result) => {
      const res = result.data;
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          creditorsUnitsList: data.list, //各户信息||未知对应关系  列表
          total: data ? data.total : 0,
          page: data ? data.page : 1,
        });
      }
    });
  };

  /*换页*/
  handlePageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getTableList();
      }
    );
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
      title,
      status,
      withdraw,
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
      isEdit,
      id,
      packageId,
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
              title={title}
              status={status}
              withdraw={withdraw}
              logs={logs}
              role={rule}
              id={id}
            />
            <AssetPackage
              unitNumber={unitNumber}
              creditorsRightsPrincipal={creditorsRightsPrincipal}
              outstandingInterest={outstandingInterest}
              totalAmountCreditorsRights={totalAmountCreditorsRights}
              Summation={Summation}
              handleChange={this.handleChange}
              isEdit={isEdit}
            />
            {rule === "admin" && (
              <SystemExtractInfo
                msgsLists={msgsLists}
                usersLists={usersLists}
                handleOpenModal={this.handleOpenModal}
              />
            )}

            <HouseHold
              data={creditorsUnitsList}
              page={1}
              total={1}
              handleOpenModal={this.handleOpenModal}
              isEdit={isEdit}
              onChange={this.handlePageChange}
              packageId={packageId}
            />
            <UnknownRelationShip
              data={creditorsUnitsList}
              handleOpenModal={this.handleOpenModal}
              isEdit={isEdit}
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
