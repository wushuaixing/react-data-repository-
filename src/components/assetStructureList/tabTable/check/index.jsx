/** 5.1 checkTable(资产结构化检查-6个tab栏下的表格-检察人员)

全部/未检查/检查无误/检查错误/已修改/待确认 * */
import React, { Fragment } from "react";
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
    waitNum: 0,
    checkErrorNum: 0,
    editNum: 0,
    tabIndex: 0,
    page: 1,
  };
  //切换Tab
  changeTab = (key) => {
    this.props.onTabs(parseInt(key));
  };
  //换页
  onTablePageChange = (pagination) => {
    this.props.onPage(pagination.current);
  };
  handGoDetail(record, e) {
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
    switch (this.props.tabIndex) {
      case 0:
      case 2:
      case 6:
        showObject.title = "初次标注时间";
        showObject.dataIndex = "time";
        break;
      case 3:
      case 4:
        showObject.title = "检查时间";
        showObject.dataIndex = "time";
        break;
      case 5:
        showObject.title = "修改标注时间";
        showObject.dataIndex = "time";
        break;
      default:
        break;
    }
    return showObject;
  }

  render() {
    const {
      data,
      waitNum,
      checkErrorNum,
      editNum,
      total,
      page,
      tabIndex,
    } = this.props;
    const paginationProps = createPaginationProps(page, total);
    const columns = [
      {
        title: this.columnShowObject.title,
        dataIndex: this.columnShowObject.dataIndex,
      },
      Columns[0],
      Columns[1],
      Columns[2],
      {
        title: "操作",
        dataIndex: "action",
        width: 180,
        render: (text, record) => {
          return (
            <span>
              <ToDetailBtn
                record={record}
                goDeteil={this.handGoDetail.bind(this, record)}
              />
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
              rowKey={(record) => record.id}
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
              rowKey={(record) => record.id}
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
              rowKey={(record) => record.id}
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
              rowKey={(record) => record.id}
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
              rowKey={(record) => record.id}
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
            tab={<AssetTabTextWithNumber text={"待确认"} num={waitNum} />}
            key="6"
          >
            <Table
              rowClassName="table-list"
              columns={columns}
              dataSource={data}
              rowKey={(record) => record.id}
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
const ToDetailBtn = (props) => {
  const { record } = props;
  const { status, structPersonnelEnable, structPersonnel } = record;
  const text = () => {
    if (
      (status === 3 || status === 4) &&
      structPersonnelEnable &&
      structPersonnel !== "自动标注"
    ) {
      return "修改检查";
    }
    if (
      status === 5 &&
      structPersonnelEnable &&
      structPersonnel !== "自动标注"
    ) {
      return "再次检查";
    }
    if (!structPersonnelEnable || structPersonnel === "自动标注") {
      return "修改标注";
    }
    if (
      status === 2 &&
      structPersonnelEnable &&
      structPersonnel !== "自动标注"
    ) {
      return "检查";
    }
  };
  return (
    <Fragment>
      <Button
        style={{
          fontSize: 14,
          width: 88,
          height: 30,
          textAlign: "center",
          padding: 0,
        }}
        onMouseDown={(e) => props.goDeteil(e)}
      >
        {text()}
      </Button>
    </Fragment>
  );
};

export default withRouter(TabTable);
