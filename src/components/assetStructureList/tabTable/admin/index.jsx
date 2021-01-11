/* 全部/未检查/检查无误/检查错误/已修改/待确认 */
import React from "react";
import { withRouter } from "react-router-dom";
import { Tabs, Table, Button } from "antd";
import { Columns } from "@/static/columns";
import createPaginationProps from "@/utils/pagination";
import { AssetTabTextWithNumber } from "@commonComponents";
import NoDataIMG from "../../../../assets/img/no_data.png";
const { TabPane } = Tabs;

class TabTable extends React.Component {
  static defaultProps = {
    data: [],
    total: 0,
    checkErrorNum: 0,
    editNum: 0,
    tabIndex: "0",
  };
  //切换Tab
  changeTab = (key) => {
    this.props.onTabs(parseInt(key));
  };

  //换页
  onTablePageChange = (pagination) => {
    this.props.onPage(pagination.current);
  };
  goDetail(record, e) {
    e.preventDefault() && e.persist();
    let isNewPage = e.button === 1 || (e.ctrlKey && e.button === 0);
    isNewPage
      ? window.open(`/defaultDetail/${record.status}/${(record.info || {}).id}`)
      : this.props.history.push(
          `/index/structureDetail/${record.status}/${(record.info || {}).id}`
        );
  }
  get columnShowObject() {
    const showObject = {};
    showObject.dataIndex = "time"; //时间返参发生变化
    switch (this.props.tabIndex) {
      case 0:
      case 1:
        showObject.title = "抓取时间";
        break;
      case 2:
        showObject.title = "初次标注时间";
        break;
      case 3:
      case 4:
        showObject.title = "检查时间";
        break;
      case 5:
        showObject.title = "修改时间";
        break;
      default:
        break;
    }
    return showObject;
  }

  render() {
    const { data, checkErrorNum, editNum, total, tabIndex, page } = this.props;
    const paginationProps = createPaginationProps(page, total);
    let dynamic_column_index = 4;
    if (tabIndex === 1) {
      dynamic_column_index = 2;
    } else if (tabIndex === 2) {
      dynamic_column_index = 3;
    } //根据不同的标签页显示不同的column
    const columns = [
      {
        title: this.columnShowObject.title,
        dataIndex: this.columnShowObject.dataIndex,
      },
      ...Columns.slice(0, dynamic_column_index),
      {
        title: "操作",
        dataIndex: "action",
        width: 180,
        render: (text, record) => {
          return (
            <span>
              <Button
                size="small"
                type="primary"
                ghost
                style={{ minWidth: 88, height: 28 }}
                className="btn-bgcolor-change"
                onMouseDown={this.goDetail.bind(this, record)}
              >
                查看
              </Button>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Tabs
          activeKey={tabIndex.toString()}
          onChange={this.changeTab}
          animated={false}
        >
          <TabPane tab="全部" key="0">
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
          <TabPane tab={"未标记"} key="1">
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
          <TabPane tab={"未检查"} key="2">
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
          <TabPane tab={"检查无误"} key="3">
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
          <TabPane
            tab={
              <AssetTabTextWithNumber text={"检查错误"} num={checkErrorNum} />
            }
            key="4"
          >
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
          <TabPane
            tab={<AssetTabTextWithNumber text={"已修改"} num={editNum} />}
            key="5"
          >
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => (record.info || {}).id}
              pagination={paginationProps}
              onChange={this.onTablePageChange}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default withRouter(TabTable);
