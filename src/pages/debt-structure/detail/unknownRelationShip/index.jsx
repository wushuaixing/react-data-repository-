import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button, Table } from "antd";
import NoDataIMG from "@/assets/img/no_data.png";

class UnknownRelationShip extends Component {
  static defaultProps = {
    title: "",
    enble: true,
  };

  getColumns = () => {
    return [
      {
        title: "保证人个数",
        dataIndex: "guarantorNum",
        width: 526,
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
        width: 516,
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
        width: 486,
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
        width: 135,
        key: "action",
        render: (text, record) => {
          return (
            // <span>
            //   <Link to="/unknownRelationShipDetail" target="_blank">
            //     查看详情
            //   </Link>
            // </span>
            <div className="action-btn-group">
              <span>
                <Link to="/unknownRelationShipDetail" target="_blank">
                  编辑
                </Link>
              </span>
              <span>|</span>
              <span>删除</span>
            </div>
          );
        },
      },
    ];
  };

  handleOpenGuarantorModal = (params) => {
    this.props.handleOpenModal("NumberModalVisible", params);
  };
  render() {
    const { data } = this.props;
    return (
      <div className="debt-detail-components debt-house-hold">
        <div className="header">
          未知对应关系
          <Button
            onMouseDown={this.handleClose}
            className="header-btn"
            size="small"
            type="primary"
            ghost
            style={{ minWidth: 88, height: 32 }}
          >
            <Link to="/unknownRelationShipDetail" target="_blank">
              添加未知对应关系
            </Link>
          </Button>
        </div>
        <Table
          rowClassName="table-list"
          columns={this.getColumns()}
          pagination={false}
          dataSource={data}
          rowKey={(record) => record.id}
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

export default withRouter(UnknownRelationShip);
