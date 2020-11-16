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
import { Button, Checkbox, Modal, Icon, message } from "antd";
import "./style.scss";
const { confirm } = Modal;
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
      summation: 1,
      isEdit: false,
      creditorsUnitsList: [],

      usersLists: [],
      msgsLists: [],
      numberModalList: [],
      msgsModalVisible: false, //系统提取信息-抵质押物-查看详情弹框
      NumberModalVisible: false, //保证人 || 抵质押人 || 抵质押物--弹框显示隐藏
      numberModalParams: "", //保证人 || 抵质押人 || 抵质押物--弹框角色
      page: 1,
      total: 0,
      thisOnly: 1,
    };
  }

  componentDidMount() {
    this.getDetailInfo();
    this.getCreditorsUnitsList();
    this.isstorageChange();
  }

  isstorageChange() {
    window.addEventListener("storage", () => {
      if (localStorage.getItem("debtNewPageClose") < 1) {
        this.getCreditorsUnitsList();
      }
    });
  }

  //获取债权结构化详情
  getDetailInfo = () => {
    const {
      match: {
        params: { approverStatus, id },
      },
    } = this.props;
    this.setState({ loading: true });
    DebtApi.getCreditorsDetail(parseInt(id))
      .then((res) => {
        if (res.data.code === 200) {
          return res.data;
        } else {
          return Promise.reject("请求出错");
        }
      })
      .then((dataObject) => {
        let data = dataObject.data;
        if (data) {
          this.setState({
            id: data.id, //债权id
            packageId: data.packageId, //包id
            title: data.title, //标题
            status: data.status, //拍卖状态
            withdraw: data.withdraw, //撤回原因
            logs: data.logs ? data.logs : [], //结构化检查记录

            unitNumber: data.unitNumber, //户数
            creditorsRightsPrincipal: data.creditorsRightsPrincipal, //本金合计
            outstandingInterest: data.outstandingInterest, //利息合计
            totalAmountCreditorsRights: data.totalAmountCreditorsRights, //本息合计
            summation: 1, //勾选本息自动求和

            collateralCount: data.collateralCount, //未知对应关系_抵质押物数
            guarantorCount: data.guarantorCount, //未知对应关系_保证人数
            pledgerCount: data.pledgerCount, //未知对应关系_抵质押人数

            msgsLists: data.msgsLists, //系统提取信息-抵押物信息
            usersLists: data.usersLists, //系统提取信息-保证人信息

            isEdit: Boolean(parseInt(approverStatus)), //是否可编辑
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState(
          {
            loading: false,
          },
          () => {
            message.error(err);
          }
        );
      });
  };

  //债权详情各户信息 && 未知关系 列表
  getCreditorsUnitsList = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { page, loading } = this.state;
    !loading && this.setState({ loading: true });
    DebtApi.getCreditorsUnitsList(id, page)
      .then((res) => {
        if (res.data.code === 200) {
          return res.data;
        } else {
          return Promise.reject("请求出错");
        }
      })
      .then((dataObject) => {
        let data = dataObject.data;
        if (data) {
          this.setState({
            creditorsUnitsList:
              data.result && data.result.list ? data.result.list : [], //各户信息列表
            total: data.result ? data.result.total : 0,
            page: data.result ? data.result.page : 1,
            unKnow: data.unKnow ? data.unKnow : {}, //未知关系列表
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState(
          {
            loading: false,
          },
          () => {
            message.error(err);
          }
        );
      });
  };

  /*各户信息列表换页*/
  handlePageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getCreditorsUnitsList();
      }
    );
  };

  //关闭 保证人 || 抵质押人 || 抵质押物--弹框
  handleCloseModal = (key) => {
    this.setState({
      [key]: false,
    });
  };

  //打开弹窗
  handleOpenModal = (key, { id = 0, type = "" }) => {
    const { packageId } = this.state;
    const params = {
      packageId, //包ID
      unitId: id, //户ID
    };
    switch (type) {
      case "guarantorNum":
        DebtApi.getGuarantorMsg(params).then((result) => {
          //获取保证人数信息
          const data = result.data;
          if (data.code === 200) {
            this.setState({
              numberModalList: data.data,
            });
          } else {
            this.setState({
              numberModalList: [],
            });
          }
        });
        break;
      case "pledgerNum":
        DebtApi.getCreditorsMsg(params).then((result) => {
          //获取抵质押人数信息
          const data = result.data;
          if (data.code === 200) {
            this.setState({
              numberModalList: data.data,
            });
          } else {
            this.setState({
              numberModalList: [],
            });
          }
        });
        break;
      case "collateralNum":
        DebtApi.getCollateralMsg(params).then((result) => {
          //获取抵押物数信息
          const data = result.data;
          if (data.code === 200) {
            this.setState({
              numberModalList: data.data,
            });
          } else {
            this.setState({
              numberModalList: [],
            });
          }
        });
        break;
      default:
        break;
    }
    this.setState({
      [key]: true,
      numberModalParams: type,
    });
  };

  //资产包信息 本金合计/利息合计/本息合计 发生变化
  handleChange = (key, value) => {
    this.setState(
      {
        [key]: value,
      },
      () => {
        const {
          summation,
          creditorsRightsPrincipal,
          outstandingInterest,
        } = this.state;
        if (key !== "totalAmountCreditorsRights") {
          //默认勾选本息自动求和
          summation &&
            this.setState({
              totalAmountCreditorsRights:
                creditorsRightsPrincipal + outstandingInterest,
            });
        }
      }
    );
  };

  //保存 flag 0-正常保存 1-缺少人员信息保存
  handleSave = (flag) => {
    const {
      id,
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      thisOnly,
      collateralCount,
      guarantorCount,
      pledgerCount,
    } = this.state;
    const params = {
      id,
      thisOnly, //是否关联其他数据
      flag,
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      collateralNum: collateralCount,
      guarantorNum: guarantorCount,
      pledgerNum: pledgerCount,
    };
    const {
      match: {
        params: { debtStatus },
      },
    } = this.props;
    debtStatus === "0" || debtStatus === "1" //状态为待标记或者继续标注时
      ? DebtApi.saveAndGetNext(params).then((result) => {
          //保存并标注下一条
          const res = result.data;
          if (res.code === 200) {
            const { data } = res.data;
            if (data > 0) {
              message.success("保存成功!");
              this.props.history.replace(`/index/debtDetail/1/${data}`);
            } else {
              message.warning(res.message, 2, () =>
                this.props.history.push("/index/debtList")
              );
            }
          } else if (res.code === 9001) {
            //遗漏了爬虫提取的名称，弹窗提醒
            confirm({
              icon: (
                <Icon
                  type="exclamation-circle"
                  theme="filled"
                  style={{ color: "#fa930c" }}
                />
              ),
              title: "可能遗漏了以下相关人",
              content: res.message,
              okText: "未遗漏，保存",
              cancelText: "去补充",
              onOk: () => this.handleSave(1),
              className: "debt-detail-confirm",
            });
          }
        })
      : DebtApi.saveDetail(params).then((result) => {
          //状态为已标记和未检查时
          //保存
          const res = result.data;
          if (res.code === 200) {
            const { data } = res.data;
            if (data) {
              message.success("保存成功!", 2, () =>
                this.props.history.push("/index/debtList")
              );
            }
          } else if (res.code === 9001) {
            //遗漏了爬虫提取的名称，弹窗提醒
            confirm({
              icon: (
                <Icon
                  type="exclamation-circle"
                  theme="filled"
                  style={{ color: "#fa930c" }}
                />
              ),
              title: "可能遗漏了以下相关人",
              content: res.message,
              okText: "未遗漏，保存",
              cancelText: "去补充",
              onOk: () => this.handleSave(1),
              className: "debt-detail-confirm",
            });
          } else {
            message.warning(res.message);
          }
        });
  };

  //返回到列表页
  handleBack = () => {
    this.props.history.push("/index/debtList");
  };

  //删除户信息
  handleDel = (id) => {
    DebtApi.deleteUnitByID(id).then((result) => {
      const data = result.data.data;
      if (result.data.code === 200) {
        if (data) {
          message.success("删除成功", 1, () => this.getCreditorsUnitsList());
        } else {
          message.error(result.data.message);
        }
      }
    });
  };

  // 换页
  handlePageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getCreditorsUnitsList();
      }
    );
  };

  // 检查无误
  handleNoErr = (id) => {
    DebtApi.checkAndSave(id).then((result) => {
      const data = result.data.data;
      if (result.data.code === 200) {
        if (data) {
          message.success("操作成功", 1, () => this.handleBack());
        } else {
          message.warning(result.data.message);
        }
      } else {
        message.error(result.data.message);
      }
    });
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
      numberModalParams,
      summation,
      isEdit,
      id,
      packageId,
      numberModalList,
      thisOnly,
      unKnow,
      page,
      total,
    } = this.state;

    const {
      ruleSource: { rule },
      match: {
        params: { debtStatus },
      },
    } = this.props;
    return (
      <div className="yc-debt-container">
        <div className="yc-debt-content">
          <BreadCrumb texts={["拍卖债权结构化/详情"]} />
          <div className="yc-debt-detail">
            <div className="debt-detail-action">
              {isEdit ? (
                <div className="aciton-edit">
                  <Checkbox
                    onChange={(e) =>
                      this.handleChange("thisOnly", e.target.checked * 1)
                    }
                    checked={thisOnly}
                  >
                    不关联其他数据
                  </Checkbox>
                  <Button
                    type="primary"
                    style={{ height: 32, zIndex: 10 }}
                    onClick={() => this.handleSave(0)}
                  >
                    {debtStatus === "0" || debtStatus === "1"
                      ? "保存并标注下一条"
                      : "保存"}
                  </Button>
                  {rule === "check" && (
                    <Button
                      style={{ height: 32, zIndex: 10, marginLeft: 20 }}
                      onClick={this.handleNoErr(id)}
                    >
                      检查无误
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  type="primary"
                  style={{ width: 88, height: 32, zIndex: 10 }}
                  onClick={this.handleBack}
                >
                  返回
                </Button>
              )}
            </div>
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
              summation={summation}
              handleChange={this.handleChange}
              isEdit={isEdit}
              role="assetPackage"
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
              page={page}
              total={total}
              handleOpenModal={this.handleOpenModal}
              isEdit={isEdit}
              packageId={packageId}
              handleDel={this.handleDel}
              handlePageChange={this.handlePageChange}
            />
            <UnknownRelationShip
              data={unKnow}
              handleOpenModal={this.handleOpenModal}
              isEdit={isEdit}
              packageId={packageId}
              handleDel={this.handleDel}
              unitNumber={unitNumber}
            />
            <MsgsInfoModal
              visible={msgsModalVisible}
              handleCloseModal={this.handleCloseModal}
              msgsInfo={msgsLists}
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
