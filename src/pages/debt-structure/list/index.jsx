import React from "react";
import { withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import DebtApi from "@/server/debt";
import DebtTable from "./table";
import SearchForm from "./query";
import { rule } from "@/components/rule-container";
import { BreadCrumb } from "@commonComponents";
import { scrollTop } from "@utils/tools";
import "./style.scss";

class DebtList extends React.Component {
  constructor(props) {
    super(props);
    props.cacheLifecycles.didRecover(this.componentDidRecover); //恢复时
    const {
      ruleSource: { rule },
    } = props;
    const data = [
      { title: "全部", key: "0", rule: "admin", status: 0 },
      { title: "未标注", key: "1", rule: "admin", status: 1 },
      { title: "已标注", key: "2", rule: "admin", status: 2 },
      { title: "全部", key: "0", rule: "check", status: 0 },
      { title: "待标注", key: "0", rule: "normal", status: 1 },
      { title: "已标注", key: "1", rule: "normal", status: 2 },
    ];
    const panes = data.filter((i) => i.rule === rule); // 高阶组件包裹 rule为角色
    this.state = {
      page: 1,
      total: 0,
      tableList: [], //列表数据
      tabIndex: 0, //tab列
      loading: false,
      panes,
      searchParams: {}, //搜索参数
      buttonDisabled: true, //获取新数据按钮 是否置灰
    };
  }

  componentDidMount() {
    this.getTableList();
  }

  componentDidRecover = () => {
    this.getTableList();
  };
  // 只有管理员下的全部和未标注列显示抓取时间，其它显示初次标注时间
  get timeText() {
    const { tabIndex } = this.state;
    if (localStorage.getItem("userState") === "管理员" && tabIndex !== 2) {
      return "抓取时间";
    } else {
      return "初次标注时间";
    }
  }

  // 获取参数
  get params() {
    const {
      ruleSource: { rule },
    } = this.props;
    const { tabIndex, page, searchParams } = this.state;
    let params = Object.assign(searchParams, { page });
    params.status = rule === "normal" ? tabIndex + 1 : tabIndex;
    return params;
  }

  get searchFilterForm() {
    return this.searchFormRef.props.form;
  }

  // 获取列表数据
  getTableList = () => {
    this.setState({
      loading: true,
    });
    DebtApi.creditorsList(this.params)
      .then((res) => {
        if (res.data.code === 200) {
          return res.data;
        } else {
          return Promise.reject("请求出错");
        }
      })
      .then((dataObject) => {
        if (dataObject.data.length === 0) {
          //待标记列表中有数据时，不允许获取新数据，按钮置灰
          this.setState({
            buttonDisabled: false,
          });
        } else {
          this.setState({
            buttonDisabled: true,
          });
        }
        this.setState({
          tableList: dataObject.data,
          total: dataObject ? dataObject.total : 0,
          page: dataObject ? dataObject.page : 1,
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

  // 切换tab
  handleTabChange = (key) => {
    this.searchFilterForm.resetFields();
    this.setState(
      {
        tabIndex: parseInt(key),
        searchParams: {},
        page: 1,
      },
      () => {
        this.getTableList();
      }
    );
  };

  /*换页*/
  handlePageChange = (page) => {
    this.setState(
      {
        page,
      },
      () => {
        this.getTableList();
        scrollTop();
      }
    );
  };

  /*搜索*/
  handleSearch = (data) => {
    this.setState(
      {
        searchParams: data,
        page: 1,
      },
      () => {
        this.getTableList();
      }
    );
  };

  // 清空搜索条件
  handleClearSearch = () => {
    this.setState(
      {
        searchParams: {},
      },
      () => {
        this.getTableList();
      }
    );
  };

  // 获取新数据
  getNewData = () => {
    this.setState({ loading: true });
    DebtApi.getNewCreditorsData().then(() => {
      this.setState({
        loading: false,
        tabIndex: 0,
      });
      this.getTableList();
    });
  };

  render() {
    const {
      tableList,
      total,
      page,
      tabIndex,
      loading,
      panes,
      buttonDisabled,
    } = this.state;
    const {
      ruleSource: { rule },
    } = this.props;
    const text = rule === "check" ? "检查" : "";
    document.title = `金融资产结构化${text}`;
    return (
      <div className="yc-debt-container">
        <div className="yc-debt-content">
          <BreadCrumb
            texts={[`金融资产结构化${text}`]}
            breadButtonText={
              rule === "normal" && tabIndex === 0 && "获取新数据" //结构化账号 待标记列表下 显示
            }
            handleClick={this.getNewData}
            disabled={loading || buttonDisabled}
          />
          <div className="debt-search-content">
            <SearchForm
              wrappedComponentRef={(inst) => (this.searchFormRef = inst)} //清空搜索条件时 触发子组件setFiledValues方法
              role={rule}
              tabIndex={tabIndex}
              timeText={this.timeText}
              toSearch={this.handleSearch}
              toClearSearch={this.handleClearSearch}
            />
          </div>
          <div className="debt-list-content">
            <Spin tip="Loading..." spinning={loading}>
              <DebtTable
                page={page}
                tabIndex={tabIndex}
                total={total}
                data={tableList}
                onPageChange={this.handlePageChange}
                onTabChange={this.handleTabChange}
                role={rule}
                panes={panes}
                timeText={this.timeText}
              />
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(rule(DebtList));
