import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button, Table } from "antd";
import createPaginationProps from "@/utils/pagination";
import { HouseHoldColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";

class HouseHold extends Component {
  static defaultProps = {
    enable: true,
    data: [],
    page: 1,
    total: 0,
  };

  getColumns = (enable) => {
    return [
      ...HouseHoldColumn,
      {
        title: "保证人个数",
        dataIndex: "guarantorNum",
        width: 224,
        key: "guarantorNum",
        render: (guarantorNum, record) => (
          <span
            onClick={this.handleOpenGuarantorModal.bind(this, {
              id: record.id,
              type: "guarantorNum",
            })}
          >
            {guarantorNum}
          </span>
        ),
      },
      {
        title: "抵质押人个数",
        dataIndex: "pledgerNum",
        width: 209,
        key: "pledgerNum",
        render: (pledgerNum, record) => (
          <span
            onClick={this.handleOpenGuarantorModal.bind(this, {
              id: record.id,
              type: "pledgerNum",
            })}
          >
            {pledgerNum}
          </span>
        ),
      },
      {
        title: "抵质押物个数",
        dataIndex: "collateralNum",
        width: 215,
        key: "collateralNum",
        render: (collateralNum, record) => (
          <span
            onClick={this.handleOpenGuarantorModal.bind(this, {
              id: record.id,
              type: "collateralNum",
            })}
          >
            {collateralNum}
          </span>
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 130,
        key: "action",
        render: (text, record) => {
          return (
            <Fragment>
              {enable ? (
                <span>
                  <Link to="/houseHoldDetail" target="_blank">
                    查看详情
                  </Link>
                </span>
              ) : (
                <div className="action-btn-group">
                  <span>
                    <Link to="/houseHoldDetail" target="_blank">
                      编辑
                    </Link>
                  </span>
                  <span>|</span>
                  <span>删除</span>
                </div>
              )}
            </Fragment>
          );
        },
      },
    ];
  };

  handleOpenGuarantorModal = (params) => {
    this.props.handleOpenModal("NumberModalVisible", params);
  };
  render() {
    const { data, page, total, enable } = this.props;
    const paginationProps = createPaginationProps(page, total);
    return (
      <div className="debt-detail-components debt-house-hold">
        <div className="header">
          各户信息
          {!enable && (
            <Button
              className="header-btn"
              size="small"
              type="primary"
              ghost
              style={{ minWidth: 88, height: 32 }}
            >
              <Link to="/houseHoldDetail" target="_blank">
                添加户
              </Link>
            </Button>
          )}
        </div>
        <Table
          rowClassName="table-list"
          columns={this.getColumns(enable)}
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

export default withRouter(HouseHold);
