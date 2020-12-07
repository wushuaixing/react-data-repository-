import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DebtApi from "@/server/debt";
import { BreadCrumb } from "@commonComponents";
import { rule } from "@/components/rule-container";
import Basic from "./basic";
import AssetPackage from "./asset-package";
import HouseHold from "./house-hold";
import UnknownRelationShip from "./unknown-relationship";
import SystemExtractInfo from "./system-extract-Info";
import MsgsInfoModal from "../common/modal/msgs-modal";
import NumberModal from "../common/modal/number-modal";
import { Button, Checkbox, Modal, Icon, message, Spin } from "antd";
import "./style.scss";
const { confirm } = Modal;
/**
 * 债权包详情
 */
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
      debtStatus: "",
      msgsInfo: {},
    };
  }

  componentDidMount() {
    this.getDetailInfo(this.props);
    this.isstorageChange();
  }

  //保存并获取下一条时 直接进入到下一个详情页
  UNSAFE_componentWillReceiveProps(newProps) {
    this.getDetailInfo(newProps);
  }

  //关闭户/未知关系 详情页时 刷新各户信息列表
  isstorageChange() {
    window.addEventListener("storage", () => {
      if (localStorage.getItem("debtNewPageClose") < 1) {
        const id = sessionStorage.getItem("debtId");
        this.getCreditorsUnitsList(id);
      }
    });
  }

  //债权详情各户信息 && 未知关系 列表 (户数靠各户信息的长度判断，不根据后端返回字段判断)
  getCreditorsUnitsList = (id) => {
    const { page } = this.state;
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
            unitNumber:
              data.result && data.result.list ? data.result.list.length : 0, //户数
          });
        }
        this.setState({
          loading: false,
        });
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

  //获取详情数据 页面首次进入时调用详情接口 和 各户信息两个接口  (户/未知对应关系 编辑只刷新各户信息列表)
  getDetailInfo = (props) => {
    const {
      match: {
        params: { approverStatus, id, debtStatus },
      },
    } = props;
    sessionStorage.setItem("debtId", id); //关闭户详情页后 props中 无路由参数 做本地存储
    this.setState({ loading: true });
    //获取债权结构化详情
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
          this.setState(
            {
              id: data.id, //债权id
              thisOnly: data.thisOnly, //是否关联
              packageId: data.packageId, //包id
              title: data.title, //标题
              status: data.status, //拍卖状态
              withdraw: data.withdraw, //撤回原因
              logs: data.logs ? data.logs : [], //结构化检查记录

              creditorsRightsPrincipal: data.creditorsRightsPrincipal, //本金合计
              outstandingInterest: data.outstandingInterest, //利息合计
              totalAmountCreditorsRights: data.totalAmountCreditorsRights, //本息合计
              summation: 1, //勾选本息自动求和

              collateralCount: data.collateralCount, //未知对应关系_抵质押物数
              guarantorCount: data.guarantorCount, //未知对应关系_保证人数
              pledgerCount: data.pledgerCount, //未知对应关系_抵质押人数

              msgsLists: data.msgsLists ? data.msgsLists : [], //系统提取信息-抵押物信息
              usersLists: data.usersLists ? data.usersLists : [], //系统提取信息-保证人信息

              isEdit: Boolean(parseInt(approverStatus)), //是否可编辑
              debtStatus: parseInt(debtStatus),
            },
            () => {
              const { id } = this.state;
              this.getCreditorsUnitsList(id); //获取各户信息列表
            }
          );
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
        const id = sessionStorage.getItem("debtId");
        this.getCreditorsUnitsList(id);
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
      case "msgsInfo":
        DebtApi.getCollateralDetail(id).then((result) => {
          //获取抵押物数信息
          const data = result.data;
          if (data.code === 200) {
            this.setState({
              msgsInfo: data.data,
            });
          } else {
            this.setState({
              msgsInfo: [],
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
          if (summation) {
            this.setState({
              totalAmountCreditorsRights:
                creditorsRightsPrincipal + outstandingInterest,
            });
          } else {
            this.setState({
              totalAmountCreditorsRights: "",
            });
          }
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
      debtStatus,
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
    debtStatus === 0 || debtStatus === 1 //状态为待标记或者继续标注时
      ? DebtApi.saveAndGetNext(params).then((result) => {
          //保存并标注下一条
          const res = result.data;
          if (res.code === 200) {
            const data = res.data;
            if (data > 0) {
              message.success("保存成功!", 2, () =>
                this.props.history.replace(
                  `/index/debtDetail/0/${debtStatus}/${data}`
                )
              );
            } else {
              message.warning("暂无数据", 2, () =>
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
          const res = result.data;
          if (res.code === 200) {
            const data = res.data;
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

  //删除户信息 当仅剩两户债权，删除其中一户，若已添加未知对应关系，弹窗提示 已填写的未知对应关系将被清空
  handleDel = (id, unknowShip) => {
    const { creditorsUnitsList, unKnow } = this.state;
    const contentText =
      creditorsUnitsList.length < 3 &&
      unKnow.collateralNum !== null &&
      !unknowShip ? (
        <span style={{ color: "#FB5A5C", fontSize: 14 }}>
          "已填写的未知对应关系将被清空"
        </span>
      ) : null;
    const titleText = unknowShip
      ? "确认删除未知对应关系信息？"
      : "确认删除此户信息？";
    confirm({
      icon: (
        <Icon
          type="exclamation-circle"
          theme="filled"
          style={{ color: "#fa930c" }}
        />
      ),
      title: titleText,
      content: contentText,
      onOk: () =>
        DebtApi.deleteUnitByID(id).then((result) => {
          const data = result.data.data;
          if (result.data.code === 200) {
            if (data) {
              message.success("删除成功", 1, () => {
                const id = sessionStorage.getItem("debtId");
                this.getCreditorsUnitsList(id);
              });
            } else {
              message.error(result.data.message);
            }
          }
        }),
    });
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
      debtStatus,
      msgsInfo,
      loading,
    } = this.state;

    const {
      ruleSource: { rule },
    } = this.props;
    const text = rule === "check" ? "检查" : "";
    document.title = title;
    const saveAndNextDisabled = creditorsUnitsList.some((i) => i.status === 0); //当资产包有未保存标签时，不允许“保存并标注下一条”。“保存并标注下一条”按钮置灰。
    return (
      <div className="yc-debt-container">
        <div className="yc-debt-content">
          <Spin tip="Loading..." spinning={loading}>
            <BreadCrumb texts={[`金融资产结构化${text}/详情`]} />
            <div className="yc-debt-detail">
              <div className="debt-detail-action">
                {!isEdit ? (
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
                      disabled={saveAndNextDisabled}
                    >
                      {debtStatus === 0 || debtStatus === 1
                        ? "保存并标注下一条"
                        : "保存"}
                    </Button>
                    {rule === "check" && (
                      <Button
                        style={{ height: 32, zIndex: 10, marginLeft: 20 }}
                        onClick={() => this.handleNoErr(id)}
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
                isEdit={!isEdit}
                role="assetPackage"
              />
              {rule === "admin" &&
                msgsLists.length > 0 &&
                usersLists.length > 0 && (
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
                isEdit={!isEdit}
                packageId={packageId}
                handleDel={this.handleDel}
                handlePageChange={this.handlePageChange}
                debtId={id}
              />
              <UnknownRelationShip
                data={unKnow}
                handleOpenModal={this.handleOpenModal}
                isEdit={!isEdit}
                packageId={packageId}
                handleDel={this.handleDel}
                unitNumber={unitNumber}
                debtId={id}
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
          </Spin>
        </div>
      </div>
    );
  }
}

export default withRouter(rule(DebtDetail));
