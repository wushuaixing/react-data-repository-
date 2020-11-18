import React from "react";
import { withRouter } from "react-router-dom";
import { Tabs, Table, Button } from "antd";
import { ListColumns } from "../common/column";
import createPaginationProps from "@/utils/pagination";
import NoDataIMG from "@/assets/img/no_data.png";
import { STATUS_TYPE } from "../common/type";
const { TabPane } = Tabs;

class DebtTable extends React.Component {
  static defaultProps = {
    page: 1,
    tabIndex: 0,
    total: 0,
    data: [],
    role: "",
    panes: [],
    timeText: "",
  };

  //切换tab
  handleTabChange = (key) => {
    this.props.onTabChange(key);
  };

  //切换页码
  handlePageChange = (pagination) => {
    this.props.onPageChange(pagination.current);
  };

  //跳转详情页
  handGoDetail = (record) => {
    const { approverStauts, id, status } = record; // 最后更新者状态 0-正常账户 1-删除账户  |  id  | 状态 0待标记 1继续标注 2已标记/未检查 3检查无误
    const { role } = this.props;
    let approverStatus = approverStauts;
    if (role === "admin") {
      approverStatus = 1;
    }
    if (role === "normal") {
      approverStatus = 0;
    }
    if(approverStauts===-1){
      approverStatus = 0;
    }
    this.props.history.push(
      `/index/debtDetail/${approverStatus}/${status}/${id}`
    );
  };

  render() {
    const { data, total, tabIndex, page, role, panes, timeText } = this.props;
    const paginationProps = createPaginationProps(page, total); //分页器组件
    let dynamic_column_index = 3;
    if (role === "normal" || (role === "admin" && tabIndex === 1)) {
      //正常账号和管理员未标注列表  不显示标注人员列
      dynamic_column_index = 2;
    }
    const btnText = (record) => {
      const { approverStauts, status } = record;
      if (role === "admin" || (role === "check" && approverStauts === 1)) {
        //管理员和检察人员检查 正常账号
        return "查看";
      } else if (role === "check" && approverStauts === 0) {
        //检查人员检查 已删除||自动标注
        return "修改标注";
      } else {
        return STATUS_TYPE[status]; //标注人员
      }
    };
    const columns = [
      ...ListColumns.slice(0, dynamic_column_index),
      {
        title: "操作",
        dataIndex: "action",
        width: 180,
        key: "action",
        render: (text, record) => {
          return (
            <span>
              <Button
                size="small"
                type="primary"
                ghost
                style={{ minWidth: 60, height: 28 }}
                className="btn-bgcolor-change"
                onClick={() => {
                  this.handGoDetail(record);
                }}
              >
                <span>{btnText(record)}</span>
              </Button>
            </span>
          );
        },
      },
    ];

    /*只有结构化账号下的待标记列表不显示时间*/
    if (!(role === "normal" && tabIndex === 0)) {
      columns.unshift({
        title: timeText,
        dataIndex: "time",
        key: "time",
      });
    }
    return (
      <div>
        <Tabs
          activeKey={tabIndex.toString()}
          onChange={this.handleTabChange}
          animated={false}
          className="yc-debt-content_tabs"
        >
          {panes.map((i) => (
            <TabPane tab={i.title} key={i.key} />
          ))}
        </Tabs>
        <Table
          rowClassName="table-list"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={paginationProps}
          onChange={this.handlePageChange}
          locale={{
            emptyText: (
              <div className="no-data-box">
                <img src={NoDataIMG} alt="暂无数据" />
                <p>暂无数据</p>
              </div>
            ),
          }}
        />
      </div>
    );
  }
}
export default withRouter(DebtTable);
