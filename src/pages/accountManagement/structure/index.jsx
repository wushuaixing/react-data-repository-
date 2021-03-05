/** right content for Account manage* */
import React from "react";
import { BreadCrumb } from "@commonComponents";
import { Tabs, Table, Spin, message, Button, Modal } from "antd";
import {
  userCreate,
  userView,
  userEdit,
  userReset,
  userRemove,
  userDelete,
} from "@api";
import AccountModal from "@/components/accountManagement/structureAccountModal";
import SearchAccount from "@/components/accountManagement/search";
import createPaginationProps from "@/utils/pagination";
import DelIMG from "../../../assets/img/confirm_delete.png";
import { formUtils } from "@/utils/common";
import "../style.scss";
// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;
const { confirm } = Modal;
class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "add",
      userInfo: {},
      loading: false,
      isEnabledUser: true,
      role: "",
      username: "",
      total: 1,
      visible: false,
      tabIndex: "1",
      page: 1,
      totalWrongNumAsc: "", //排序  null:自然顺序 true:升序 false:降序
      columns: [
        {
          title: "ID",
          dataIndex: "id",
        },
        {
          title: "账号",
          dataIndex: "username",
        },
        {
          title: "姓名",
          dataIndex: "name",
        },
        {
          title: "结构化对象",
          dataIndex: "structuredObject",
        },
        {
          title: "角色",
          dataIndex: "role",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 200,
          render: (text, record) => (
            <span>
              <a
                className="action_left"
                onClick={() => this.editAccount(record)}
              >
                编辑
              </a>
              <a
                className="action_center"
                onClick={() => this.resetPassword(record.id)}
              >
                重置密码
              </a>
              <a onClick={() => this.deleteUser(record.id)}>删除</a>
            </span>
          ),
        },
      ],
      columnsDelete: [
        {
          title: "ID",
          dataIndex: "id",
        },
        {
          title: "姓名",
          dataIndex: "name",
        },
        {
          title: "结构化对象",
          dataIndex: "structuredObject",
        },
        {
          title: "角色",
          dataIndex: "role",
        },
        {
          title: "当前错误条数",
          dataIndex: "wrongNum",
          sorter: true,
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 180,
          render: (text, record) => (
            <span>
              <a onClick={() => this.remove(record.id)}>移除</a>
            </span>
          ),
        },
      ],
    };
  }
  get searchParams() {
    const {
      isEnabledUser,
      page,
      role,
      username,
      totalWrongNumAsc,
      functions,
    } = this.state;
    return formUtils.removeObjectNullVal({
      isEnabledUser,
      page,
      role,
      functions,
      username: username.trim(),
      totalWrongNumAsc:
        parseInt(this.state.tabIndex) === 2 ? totalWrongNumAsc : "",
    });
  }
  componentDidMount() {
    //默认初始传入正常账号+全部
    this.getTableList();
    document.title = "结构化账号";
  }
  //账号添加／编辑弹窗
  showModal = (action) => {
    this.setState({
      visible: true,
      action,
    });
  };

  editAccount = (userInfo) => {
    this.setState({
      userInfo,
    });
    this.showModal("edit");
  };

  //重置密码
  resetPassword(id) {
    confirm({
      title: "确认重置密码?",
      content: "重置密码后,该账号密码为账号后6位",
      icon: <img src={DelIMG} alt="" className="ico_confirmdel" />,
      onOk: () => {
        this.setState({
          loading: true,
        });
        userReset(id).then((res) => {
          this.setState({
            loading: false,
          });
          if (res.data.code === 200) {
            message.success("重置密码成功");
          } else {
            message.error(res.data.message);
          }
        });
      },
    });
  }

  //删除账号
  deleteUser(id) {
    confirm({
      title: "确认删除账号?",
      content: "删除后,该账户将无法在数据资产平台登录",
      icon: <img src={DelIMG} alt="" className="ico_confirmdel" />,
      onOk: () => {
        this.setState({
          loading: true,
        });
        userRemove(id).then((res) => {
          this.setState({
            loading: false,
          });
          if (res.data.code === 200) {
            message.success("删除成功");
            this.getTableList();
          } else if (res.data.code === 9004) {
            message.warning("操作失败，为您刷新当前列表", this.getTableList());
          } else {
            message.error(res.data.message);
          }
        });
      },
    });
  }
  //已删除账号移除操作
  remove(id) {
    this.setState({
      loading: true,
    });
    userDelete(id).then((res) => {
      this.setState({
        loading: false,
      });
      if (res.data.code === 200) {
        message.success("移除成功");
        this.getTableList();
      } else {
        message.error(res.data.message);
      }
    });
  }
  getTableList = () => {
    this.setState({ loading: true });
    userView(this.searchParams).then((res) => {
      if (res.data.code === 200) {
        this.setState({
          loading: false,
          tableList: res.data.data,
          total: res.data.total,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  //弹窗确定
  handleSubmit = (data, id) => {
    const { action } = this.state;
    this.setState({
      visible: false,
      loading: true,
    });
    if (action === "add") {
      //确定前还需验证
      userCreate(data)
        .then((res) => {
          if (res.data.code === 200) {
            message.success("账号添加成功");
            this.setState({ page: 1 });
            this.getTableList();
          } else {
            message.error(res.data.message);
          }
        })
        .finally(() => this.setState({ loading: false }));
    } else {
      userEdit(id, data)
        .then((res) => {
          if (res.data.code === 200) {
            message.info("修改成功");
            this.getTableList();
          } else {
            message.error(res.data.message);
          }
        })
        .finally(() => this.setState({ loading: false }));
    }
  };

  //弹窗取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //搜索
  handleSearch = (formData) => {
    this.setState(
      {
        ...formData,
        page: 1,
      },
      () => {
        this.getTableList();
      }
    );
  };
  //切换Tab
  changeTab = (tabIndex) => {
    this.setState(
      {
        isEnabledUser: tabIndex === "1",
        tabIndex,
        page: 1,
      },
      () => {
        this.getTableList();
      }
    );
  };
  //换页和切换排序
  handleTableChange = (pagination, filter, sorter) => {
    let totalWrongNumAsc = "";
    if (sorter.order) {
      totalWrongNumAsc = sorter.order !== "descend";
    }
    this.setState(
      {
        page: pagination.current,
        totalWrongNumAsc,
      },
      () => {
        this.getTableList();
      }
    );
  };
  handleClear() {
    this.setState(
      {
        username: "",
        role: "",
        functions: "",
        page: 1,
      },
      () => {
        this.getTableList();
      }
    );
  }
  render() {
    const {
      role,
      username,
      tableList,
      total,
      page,
      visible,
      action,
      columns,
      columnsDelete,
      userInfo,
      loading,
      tabIndex,
    } = this.state;
    const paginationProps = createPaginationProps(page, total, true);
    const roleButtons =
      this.state.tabIndex === "1" ? (
        <div className="addUser-button">
          <Button onClick={this.showModal.bind(this, "add")}>+ 添加账号</Button>
        </div>
      ) : null;
    return (
      <div className="yc-content-container">
        <BreadCrumb texts={["账号管理", "结构化账号"]} />
        <div className="yc-detail-content">
          <Spin tip="Loading..." spinning={loading}>
            <Tabs
              defaultActiveKey={tabIndex}
              onChange={this.changeTab}
              animated={false}
              className="role-tab sorter-tab"
              tabBarExtraContent={roleButtons}
            >
              <TabPane tab="正常账号" key={"1"}>
                <SearchAccount
                  role={role}
                  username={username}
                  tabIndex={this.state.tabIndex}
                  handleClear={this.handleClear.bind(this)}
                  handleSearch={this.handleSearch.bind(this)}
                  flag="normal"
                />
                <Table
                  rowClassName="table-list"
                  columns={columns}
                  dataSource={tableList}
                  className="role-table"
                  rowKey={(record) => record.id}
                  onChange={this.handleTableChange}
                  pagination={paginationProps}
                />
              </TabPane>
              <TabPane tab="已删除账号" key={"2"}>
                <SearchAccount
                  role={role}
                  username={username}
                  tabIndex={this.state.tabIndex}
                  handleClear={this.handleClear.bind(this)}
                  handleSearch={this.handleSearch.bind(this)}
                  flag="deleted"
                />
                <Table
                  rowClassName="table-list"
                  columns={columnsDelete}
                  dataSource={tableList}
                  className="role-table"
                  rowKey={(record) => record.id}
                  onChange={this.handleTableChange}
                  pagination={paginationProps}
                />
              </TabPane>
            </Tabs>
          </Spin>
        </div>
        <div>
          <AccountModal
            visible={visible}
            handleSubmit={this.handleSubmit.bind(this)}
            handleCancel={this.handleCancel.bind(this)}
            action={action}
            info={userInfo}
          />
        </div>
      </div>
    );
  }
}
export default AccountManage;
