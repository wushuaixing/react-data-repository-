import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table } from 'antd';
import createPaginationProps from '@/utils/pagination';
import { HouseHoldColumn } from '../../common/column';
import NoDataIMG from '@/assets/img/no_data.png';

class HouseHold extends Component {
  static defaultProps = {
    enble: true,
    data: [],
    page: 1,
    total: 0,
  };

  getColumns = () => {
    return [
      ...HouseHoldColumn,
      {
        title: "保证人个数",
        dataIndex: "guarantorNum",
        width: 760,
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
        width: 760,
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
        width: 760,
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
        align: "center",
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
              >
                查看
              </Button>
            </span>
          );
        },
      },
    ];
  };

  handleOpenGuarantorModal = (params) => {
    this.props.handleOpenModal("NumberModalVisible", params);
  };
  render() {
    const { data, page, total } = this.props;
    const paginationProps = createPaginationProps(page, total);
    return (
      <div className="debt-detail-components debt-house-hold">
        <div className="header">各户信息</div>
        <Table
          rowClassName="table-list"
          columns={this.getColumns()}
          dataSource={data}
          rowKey={(record) => (record.info || {}).id}
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
