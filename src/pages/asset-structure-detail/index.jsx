import React from "react";
import { message, Button } from "antd";
import SpinLoading from "@/components/Spin-loading";
import BasicInfo from "./basicInfo";
import PropertyInfo from "./propertyInfo";
import ErrorReason from "./errorReason";
import DocumentInfo from "./documentInfo";
import ReturnMark from "./returnMark";
import RoleInfo from "./roleInfo";
import ButtonGroup from "./buttonGroup";
import CheckModal from "./checkErrorModal";
import BreadCrumb from "@/components/common/breadCrumb";
import icon from "@/assets/img/backPrevious.png";
import iconGrey from "@/assets/img/backPrevious-grey.png";
import {
  getAuctionDetail,
  getNumberOfTags,
  inspectorCheck,
  saveAndGetNext,
  updateBackStatus,
  saveDetail,
  getDataStatus,
} from "@api";
import { filters, clone } from "@utils/common";
import "./style.scss";

const getObligors = () => ({
  birthday: "",
  gender: "0",
  label_type: "1",
  name: "",
  notes: "",
  number: "",
  system: null,
  type: "1",
});

class StructureDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      //基本信息
      title: "", //标题
      auctionStatus: null, //拍卖状态1:即将开始 3进行中 5已成交 7已流拍 9中止 11撤回
      reasonForWithdrawal: "", //撤回原因
      associatedAnnotationId: "", //关联标注
      associatedStatus: "",
      records: [], //结构化/检查记录
      isBack: false, //是否为退回数据
      //房产/土地信息
      buildingArea: null, //建筑面积
      houseType: 0, //房产土地类型 0未知 1商用 2住宅 3工业
      collateral: 0, //抵押情况 1无抵押 0未知
      //文书信息
      wsFindStatus: 0, //查找情况0未找到文书 1找到文书
      ah: [], //相关文书案号
      wsUrl: [], //文书链接地址
      wsInAttach: 0, //详情见资产拍卖附件 文书是否在附件中 1:是 0:否

      obligors: [], //角色信息
      wrongData: [], //错误信息
      backRemark: "", //退回备注
      url: "", //链接
      onlyThis: 0, //仅标记本条,1 true 0 false
      structPersonnelEnable: "", //结构化人员是否删除 0:删除账号 1:正常账号 2:该条未被结构化
      type: "", //数据类型 0普通数据 1相似数据 2已标记拍卖数据
      id: "",
      TOTAL: 0, //数据总量,
      MARK: 0, //当前标记数
      visible: false,
    };
  }

  componentDidMount() {
    this.getAuctionDetailData(this.props);
  }

  getAuctionDetailData(props) {
    const params = props.match.params;
    this.setState({ loading: true });
    if (params.id) {
      getAuctionDetail(params.id)
        .then((result) => {
          const res = result.data;
          if (res.code === 200) {
            const data = res.data;
            this.setState(
              {
                id: data.id,
                title: data.title,
                auctionStatus: data.auctionStatus,
                reasonForWithdrawal: data.reasonForWithdrawal,
                associatedStatus: data.associatedStatus,
                associatedAnnotationId: data.associatedAnnotationId,
                records: data.records,
                buildingArea: data.buildingArea,
                collateral: data.collateral,
                houseType: data.houseType,
                wsFindStatus: data.wsFindStatus,
                wsInAttach: data.wsInAttach,
                ah:
                  data && data.ah && data.ah.length === 0
                    ? [{ value: "" }]
                    : data.ah,
                wsUrl:
                  data && data.wsUrl && data.wsUrl.length === 0
                    ? [{ value: "" }]
                    : data.wsUrl,
                obligors:
                  data &&
                  data.obligors &&
                  data.obligors.length === 0 &&
                  params.status === "0" &&
                  this.getRole() === "structure"
                    ? [getObligors()]
                    : data.obligors, //结构化人员待标记列下默认显示一条
                wrongData:
                  data.wrongData && data.wrongData.length > 0
                    ? data.wrongData
                    : [],
                backRemark: data.backRemark,
                type: data.type,
                onlyThis: data.onlyThis,
                url: data.url,
                structPersonnelEnable: data.structPersonnelEnable,
                isBack: data.isBack,
              },
              () => {
                document.title = data.title;
                const oldData = JSON.stringify(this.state);
                sessionStorage.setItem("oldData", oldData);
              }
            );
          }else {
            message.error("请求出错")
          }
        })
        .finally(() => this.setState({ loading: false }));
      if (this.getRole() === "structure") {
        getNumberOfTags().then((res) => {
          this.setState({
            ...res.data.data,
          });
        });
      }
    } else {
      message.error("请求参数错误,请刷新页面或回到上一级");
    }
  }

  handleChange = (key, value) => {
    //抵押情况/房产土地类型/建筑面积/文书信息查找情况/仅标记本条改变时
    this.setState({
      [key]: value,
    });
  };

  handleDocumentChange(combine, value) {
    //案号  文书链接地址改变时
    const arr_index = combine.replace(/[^0-9]/g, ""); //combine形式为 ah1
    const key = combine.replace(/[^a-zA-Z_]/g, "");
    const arr = [...this.state[key]];
    arr[arr_index].value = value;
    this.setState({
      [key]: arr,
    });
  }

  handleRoleChange(combine, value) {
    //角色信息改变时
    const arr_index = combine.replace(/[^0-9]/g, ""); //combine形式为 name1
    const key = combine.replace(/[^a-zA-Z_]/g, "");
    const arr = [...this.state.obligors];
    arr[arr_index][key] = value;
    this.setState({
      obligors: arr,
    });
  }

  handleAddClick(key) {
    //角色信息，文书链接，文书案号增加时
    const arr =
      key !== "obligors"
        ? [...this.state[key], { value: "" }]
        : [...this.state[key], { ...getObligors() }];
    this.setState({
      [key]: arr,
    });
  }

  handleDeleteClick(key, index = -1) {
    //角色信息，文书链接，文书案号删除时
    const arr =
      index >= 0 ? this.state[key].slice(0) : this.state[key].slice(0, -1);
    if (index >= 0) {
      arr.splice(index, 1);
    }
    this.setState({
      [key]: arr,
    });
  }

  //以上为页面的基本显示

  handleBack(flag) {
    const isdetailNewpage = window.location.href.includes("defaultDetail");
    const role = this.getRole();
    if(isdetailNewpage || role === "newpage-check"){
      const sign = role === "structure" ?  'normalAction' : 'checkAction';
      localStorage.setItem(sign,'SUCCESS');
      this.handleClosePage()
    }else{
      this.props.history.push(flag ? "/index/assetList" : "/index");
    }
  }

  handleConfirm() {
    //检查人员确认按钮
    const { id } = this.props.match.params;
    updateBackStatus({ id }).then((res) => {
      if (res.data.code === 200) {
        message.success("操作成功");
        this.handleBack();
      } else {
        message.error("操作失败");
      }
    });
  }

  isUpdateRecord() {
    const OldData = JSON.parse(sessionStorage.getItem("oldData")); //取页面刚进入时的数据
    const {
      buildingArea,
      houseType,
      collateral,
      wsFindStatus,
      wsInAttach,
      onlyThis,
      ah,
      wsUrl,
      obligors,
    } = OldData;
    //基本数据类型
    const Changeparams = {
      buildingArea,
      houseType,
      collateral,
      wsFindStatus,
      wsInAttach,
      onlyThis,
    };
    const changeParamskey = Object.getOwnPropertyNames(Changeparams); //取对象的key
    if (
      this.getRole() === "structure" &&
      parseInt(this.state.associatedStatus) === 1
    ) {
      return true;
    }
    for (let i = 0; i < changeParamskey.length; i++) {
      let item = changeParamskey[i];
      if (this.state[item] !== Changeparams[item]) {
        //仅标记本条 抵押情况 房产土地类型 建筑面积 查找情况 详情见拍卖附件  发生改变时
        return true;
      }
    }
    //引用数据类型
    const arrparams = { ah, wsUrl, obligors }; //引用数据类型的数据   文书链接 文案号 角色信息
    const arrparamskey = Object.getOwnPropertyNames(arrparams); //取对象的key
    for (let i = 0; i < arrparamskey.length; i++) {
      let item = arrparamskey[i];
      let arrItem = arrparams[item];
      let stateItem = this.state[item];
      if (item === "obligors") {
        stateItem = filters.blockEmptyRow(stateItem, [
          "name",
          "birthday",
          "notes",
          "number",
        ]); //去空行
        arrItem = filters.blockEmptyRow(arrItem, [
          "name",
          "birthday",
          "notes",
          "number",
        ]);
      } else {
        stateItem = filters.blockEmptyRow(stateItem, ["value"]); //去空行
        arrItem = filters.blockEmptyRow(arrItem, ["value"]);
      }
      if (stateItem.length !== arrItem.length) {
        //判断是否增加删除数据
        return true;
      }

      for (let j = 0; j < arrItem.length; j++) {
        if (
          !arrItem
            .map((v) => JSON.stringify(v))
            .includes(JSON.stringify(stateItem[j])) ||
          !stateItem
            .map((v) => JSON.stringify(v))
            .includes(JSON.stringify(arrItem[j]))
        ) {
          return true;
        }
      }
    }
  }

  handleSubmit() {
    //保存
    const role = this.getRole();
    const isdetailNewpage = window.location.href.includes("defaultDetail");
    const { id, status } = this.props.match.params;
    const { associatedStatus } = this.state;
    let structureStatus = 0;
    switch (parseInt(associatedStatus)) {
      case 1:
        structureStatus = 0;
        break; //未标记
      case 2:
        structureStatus = 1;
        break; //检查无误 已修改 未检查中的已标记数据  都属于已标记
      case 3:
        structureStatus = 1;
        break;
      case 4:
        structureStatus = 2;
        break; //待修改
      case 5:
        structureStatus = 1;
        break;
      default:
        break;
    }
    const flag = this.state.isBack ? 1 : 0;
    if (!this.isUpdateRecord())
      return message.warning("当前页面未作修改，请修改后再保存",1);
    for (let i = 0; i < this.state.obligors.length; i++) {
      let item = this.state.obligors[i];
      if (item.notes === "") {
        if (item.label_type === "3")
          return message.warning("资产线索备注待完善");
        if (
          item.label_type === "2" &&
          !/银行|信用联?社|合作联?社/.test(item.name)
        )
          return message.warning("债权人备注待完善");
      }
      if (item.birthday && !/^\d{8}$/.test(item.birthday))
        return message.warning("生日格式不正确");
    }
    const keys = ["name", "number"];
    const state = clone(this.state);
    state.obligors = filters.blockEmptyRow(state.obligors, keys);
    if (state.wsFindStatus === 0) {
      state.wsUrl = [];
      state.wsInAttach = 0;
      state.ah = [];
    } else {
      state.ah = filters.blockEmptyRow(this.state.ah, ["value"]);
      state.wsUrl = filters.blockEmptyRow(this.state.wsUrl, ["value"]);
    }
    const params = {
      ah: state.ah,
      buildingArea: state.buildingArea,
      collateral: state.collateral,
      houseType: state.houseType,
      obligors: state.obligors,
      onlyThis: state.onlyThis,
      wsFindStatus: state.wsFindStatus,
      wsInAttach: state.wsInAttach,
      wsUrl: state.wsUrl,
      status: structureStatus,
      flag,
    };
    if (
      role === "check" ||
      (role === "structure" &&
        (parseInt(status) === 1 || parseInt(status) === 3)) ||
      role === "newpage-check"
    ) {
      //检查人员标注和结构化人员修改已标注数据
      saveDetail(id, params).then((res) => {
        const toIndexs = () => this.handleBack();
        if (res.data.code === 200) {
          message.success("保存成功!", 1, toIndexs);
          sessionStorage.setItem("id", id);
          sessionStorage.removeItem("backTime");
        } else if (res.data.code === 9003) {
          message.warning(
            `该数据已被检查错误，2秒后回到已${
              status === "3" ? "修改" : "标记" //staus为3 时 是已修改列表，为2时，是已标记列表
            }列表`,
            2,
            toIndexs
          );
        } else if(res.data.code === 9007){
          message.warning('该数据已被超时回收，2s后回到待标记列表',
            2,
            toIndexs
          );
        }else {
          message.warning(res.data.message);
        }
      });
    } else {
      saveAndGetNext(id, params).then((res) => {
        const toIndex = () => {
          if (isdetailNewpage) {
            localStorage.setItem("normalAction", "change");
            this.handleClosePage();
          } else {
            this.props.history.push({
              pathname: "/index",
              query: { flag: true },
            });
          }
        };
        const toIndexs = () => this.handleBack();
        const toNext = (_status, id) => {
          this.props.history.push({
            pathname: isdetailNewpage
              ? `/defaultDetail/${_status}/${id}`
              : `/index/structureDetail/${_status}/${id}`,
          });
        };
        if (res.data.code === 200) {
          const { data } = res.data;
          if (data > 0) {
            sessionStorage.setItem("id", id);
            message.success("保存成功!");
            toNext(status, data);
          } else if (data === -1) {
            message.error("有待修改数据，暂时无法获取新数据", 2, toIndex);
          } else {
            message.success("已修改完全部数据，2s后回到待标记列表", 2, toIndex);
          }
        } else if (res.data.code === 9003) {
          switch (parseInt(status)) {
            case 0:
              message.warning(
                "该数据已被自动标注，2s后回到待标记列表",
                2,
                toIndex
              );
              break;
            case 2:
              message.warning(
                "该数据已被检查无误，2s后回到待修改列表",
                2,
                toIndexs
              );
              break;
            default:
              break;
          }
        } else if(res.data.code===9007){
          message.warning('该数据已被超时回收，2s后回到待标记列表',
            2,
            toIndex
          );
        }else {
          message.warning(res.data.message);
        }
      });
    }
  }

  handleNoErr() {
    //确认无误
    this.submitWrongRecord({}, false);
  }

  submitWrongRecord(data, checkError = true) {
    //修改错误原因  检查有误  检查无误
    const { id } = this.props.match.params;
    const role = this.getRole();
    const params = {
      checkWrongLog: Object.assign({}, data),
      checkError,
      id,
      flag: 0,
    };
    if (this.state.isBack) params.flag = 1;
    inspectorCheck(params).then((res) => {
      if (res.data.code === 200) {
        if (role === "newpage-check" || role === "newpage-other") {
          localStorage.setItem("checkAction", 'SUCCESS');
          message.success(
            "操作成功,2秒后为您关闭页面",
            2,
            this.handleClosePage
          );
        } else {
          message.success("操作成功");
          this.handleBack();
        }
      } else {
        message.error("操作失败");
      }
    });
  }

  handleModalCancel() {
    this.setState({
      visible: false,
    });
  }

  handleModalSubmit(data) {
    this.submitWrongRecord(data, true);
  }

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

  goPreviousRecord() {
    const isdetailNewpage = window.location.href.includes("defaultDetail");
    if (sessionStorage.getItem("id")) {
      const toStatus = sessionStorage.getItem("backTime") === "1" ? 0 : 1;
      const path = {
        pathname: isdetailNewpage
          ? `/defaultDetail/${toStatus}/${sessionStorage.getItem("id")}`
          : `/index/structureDetail/${toStatus}/${sessionStorage.getItem(
              "id"
            )}`,
      };
      getDataStatus(sessionStorage.getItem("id"), toStatus).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data) {
            sessionStorage.setItem("id", this.props.match.params.id);
            sessionStorage.getItem("backTime") === "1"
              ? sessionStorage.removeItem("backTime")
              : sessionStorage.setItem("backTime", 1); //返回次数 默认只能返回一层
            this.props.history.push(path);
          } else {
            message.warning("上一条数据已被检查错误，请到待修改列表查看", 2);
          }
        }else if(res.data.code === 9007){
          message.warning("上一条数据已被超时回收，请返回待标记列表并刷新", 2);
        } else {
          message.warning(res.data.message);
        }
      });
    } else {
      message.error("无法跳转");
    }
  }

  getRole() {
    const role = localStorage.getItem("userState");
    const path = window.location.href;
    if (path.includes("notFirstMark") || path.includes("autoMark")) {
      if (role === "检查人员") {
        return "newpage-check";
      } else {
        return "newpage-other";
      }
    }
    if (role === "管理员") {
      return "admin";
    } else if (role === "检查人员") {
      return "check";
    } else {
      return "structure";
    }
  }

  /**
   * 结构化账号非处标的关联标注页面 不应该可编辑
   */
  get enable() {
    const path = window.location.href;
    return (
      localStorage.getItem("userState") === "管理员" ||
      (localStorage.getItem("userState") === "检查人员" &&
        this.state.structPersonnelEnable === 1) ||
      (localStorage.getItem("userState") === "结构化人员" &&
        path.includes("notFirstMark"))
    );
  }

  /**
   * 结构化账号非处标的关联标注页面 错误原因不展示
   */
  getErrReasonVisible() {
    const role = this.getRole();
    const { associatedStatus } = this.state;
    const path = window.location.href;
    if (
      localStorage.getItem("userState") === "结构化人员" &&
      path.includes("notFirstMark")
    ) {
      return false;
    }
    if (
      (role === "structure" &&
        (parseInt(associatedStatus) === 4 ||
          parseInt(associatedStatus) === 5)) ||
      ((role === "check" || role === "newpage-check") &&
        parseInt(associatedStatus) > 3) ||
      ((role === "admin" || role === "newpage-other") &&
        parseInt(associatedStatus) > 2)
    ) {
      return true;
    }
  }

  get wrongData() {
    if (this.getRole() === "admin" || this.getRole() === "newpage-other") {
      return this.state.wrongData.filter((item) => {
        return item.wrongLevel !== 3;
      });
    } else {
      return this.state.wrongData.slice(0, 1);
    }
  }

  async UNSAFE_componentWillReceiveProps(newProps) {
    this.getAuctionDetailData(newProps);
  }

  componentWillUnmount() {
    sessionStorage.clear();
  }

  render() {
    const {
      loading,
      id,
      title,
      auctionStatus,
      reasonForWithdrawal,
      associatedAnnotationId,
      associatedStatus,
      records,
      url,
      collateral,
      houseType,
      buildingArea,
      wsFindStatus,
      ah,
      wsUrl,
      wsInAttach,
      backRemark,
      obligors,
      onlyThis,
      type,
      visible,
      isBack,
    } = this.state;
    const {
      match: {
        params: { status },
      },
    } = this.props;
    const wrongData = this.wrongData;
    const preId = sessionStorage.getItem("id");
    const tag = `${this.state.MARK}/${this.state.TOTAL}`;
    return (
      <SpinLoading loading={loading}>
        <div className="assetstructure-detail">
          {this.getRole() === "structure" ? (
            <BreadCrumb
              disabled={!preId}
              texts={["资产结构化/详情"]}
              note={tag}
              handleClick={this.goPreviousRecord.bind(this)}
              icon={preId ? icon : iconGrey}
            />
          ) : (
            <div className="assetstructure-detail_header">
              资产结构化
              {this.getRole() === "check" || this.getRole() === "newpage-check"
                ? "检查"
                : null}
              /详情
              {this.getRole() === "admin" && (
                <Button
                  type="primary"
                  ghost
                  className="buttonGroup-back"
                  onClick={this.handleBack.bind(this, true)}
                  style={{ width: 90 }}
                >
                  返回
                </Button>
              )}
            </div>
          )}
          <div className="assetstructure-detail_container">
            {isBack && <ReturnMark backRemark={backRemark} />}
            {wrongData &&
              wrongData.length > 0 &&
              this.getErrReasonVisible() && (
                <ErrorReason
                  wrongData={wrongData}
                  role={this.getRole()}
                  associatedStatus={associatedStatus}
                />
              )}
            <BasicInfo
              title={title}
              auctionStatus={auctionStatus}
              reasonForWithdrawal={reasonForWithdrawal}
              associatedAnnotationId={associatedAnnotationId}
              associatedStatus={associatedStatus}
              records={records}
              url={url}
              status={status}
              id={id}
              type={type}
            />
            <PropertyInfo
              collateral={collateral}
              houseType={houseType}
              buildingArea={buildingArea}
              handleChange={this.handleChange.bind(this)}
              enable={this.enable}
            />
            <DocumentInfo
              wsFindStatus={wsFindStatus}
              ah={ah}
              wsUrl={wsUrl}
              wsInAttach={wsInAttach}
              handleChange={this.handleChange.bind(this)}
              handleDocumentChange={this.handleDocumentChange.bind(this)}
              enable={this.enable}
              handleAddClick={this.handleAddClick.bind(this)}
              handleDeleteClick={this.handleDeleteClick.bind(this)}
            />
            <RoleInfo
              obligors={obligors}
              enable={this.enable}
              handleChange={this.handleRoleChange.bind(this)}
              handleAddClick={this.handleAddClick.bind(this)}
              handleDeleteClick={this.handleDeleteClick.bind(this)}
              key={id}
            />
            {this.getRole() !== "admin" && (
              <ButtonGroup
                role={this.getRole()}
                id={id}
                enable={this.enable}
                onlyThis={onlyThis}
                type={type}
                isBack={isBack}
                status={parseInt(status)}
                associatedStatus={associatedStatus}
                handleSubmit={this.handleSubmit.bind(this)}
                handleChange={this.handleChange}
                handleConfirm={this.handleConfirm.bind(this)}
                handleBack={this.handleBack.bind(this)}
                handleNoErr={this.handleNoErr.bind(this)}
                handleErrorModal={() => this.setState({ visible: true })}
                handleClosePage={this.handleClosePage.bind(this)}
              />
            )}
            <CheckModal
              visible={visible}
              returnRemarks={backRemark}
              wrongReasons={wrongData.slice(0, 1)}
              handleModalSubmit={this.handleModalSubmit.bind(this)}
              handleModalCancel={() => {
                this.setState({ visible: false });
              }}
              status={associatedStatus}
              style={{ width: 430 }}
            />
          </div>
        </div>
      </SpinLoading>
    );
  }
}

export default StructureDetail;
