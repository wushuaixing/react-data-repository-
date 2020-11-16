import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Button, Table } from "antd";
import createPaginationProps from "@/utils/pagination";
import { HouseHoldColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";


class HouseHold extends Component {
  static defaultProps = {
    isEdit: false,
    data: [],
    page: 1,
    total: 0,
  };

  //去户详情页
  goDetail(id) {
    const { packageId, isEdit } = this.props;
    window.open(`/houseHoldDetail/${packageId}/${id}/0/${isEdit}`);
  }

  //删除
  handleDel=(id)=>{
    this.props.handleDel(id);
  }
  getColumns = (isEdit) => {
    return [
      ...HouseHoldColumn,
      {
        title: "保证人个数",
        dataIndex: "guarantorNum",
        width: 224,
        key: "guarantorNum",
        render: (guarantorNum, record) => (
          <span
            onClick={this.handleNumberModal.bind(this, {
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
            onClick={this.handleNumberModal.bind(this, {
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
            onClick={this.handleNumberModal.bind(this, {
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
              {isEdit ? (
                <div className="action-btn-group">
                  <span>
                    <span onClick={() => this.goDetail(record.id)}>编辑</span>
                  </span>
                  <span>|</span>
                  <span onClick={()=>this.handleDel(record.id)}>删除</span>
                </div>
              ) : (
                <span>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    style={{ minWidth: 86, height: 30 }}
                    onMouseDown={() => this.goDetail(record.id)}
                  >
                    查看详情
                  </Button>
                </span>
              )}
            </Fragment>
          );
        },
      },
    ];
  };

  //数字弹框 
  handleNumberModal = (params) => {
    this.props.handleOpenModal("NumberModalVisible", params);
  };

  //各户信息列表 翻页
  handlePageChange = (pagination) => {
    this.props.handlePageChange(pagination.current);
  };

  render() {
    const { data, page, total, isEdit } = this.props;
    const paginationProps = createPaginationProps(page, total);
    return (
      <div className="debt-detail-components debt-house-hold">
        <div className="header">
          各户信息
          {isEdit && (
            <Button
              className="header-btn"
              size="small"
              type="primary"
              ghost
              style={{ minWidth: 88, height: 32 }}
              onMouseDown={() => this.goDetail(0)}
            >
              添加户
            </Button>
          )}
        </div>
        <Table
          rowClassName="table-list"
          columns={this.getColumns(isEdit)}
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
