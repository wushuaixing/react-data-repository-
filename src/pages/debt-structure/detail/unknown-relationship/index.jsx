import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Button, Table } from "antd";
import NoDataIMG from "@/assets/img/no_data.png";
/**
 * 包详情-未知对应关系
 */
class UnknownRelationShip extends Component {
  static defaultProps = {
    data: {},
    packageId: "",
    title: "",
    idEdit: false,
    unitNumber: 0,
    debtId: "",
    handleDel: () => {},
    handleOpenModal: () => {},
  };

  //未知关系详情 添加时id为1
  goDetail(id) {
    const { packageId, isEdit, debtId } = this.props;
    window.open(
      `/unknownRelationShipDetail/${packageId}/${id}/1/${isEdit * 1}/${debtId}`
    );
  }

  //删除
  handleDel = (id) => {
    this.props.handleDel(id, "unknowShip");
  };

  //数字弹框
  handleNumberModal = (number, params) => {
    if (number) {
      this.props.handleOpenModal("NumberModalVisible", params);
    }
  };

  getColumns = (isEdit) => {
    return [
      {
        title: "保证人个数",
        dataIndex: "guarantorNum",
        width: 526,
        key: "guarantorNum",
        render: (guarantorNum, record) => (
          <span
            style={{ cursor: guarantorNum ? "pointer" : "" }}
            className={guarantorNum ? "hasColor" : ""}
            onClick={() =>
              this.handleNumberModal(guarantorNum, {
                id: record.id,
                type: "guarantorNum",
              })
            }
          >
            {guarantorNum || 0}
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
            style={{ cursor: pledgerNum ? "pointer" : "" }}
            className={pledgerNum ? "hasColor" : ""}
            onClick={() =>
              this.handleNumberModal(pledgerNum, {
                id: record.id,
                type: "pledgerNum",
              })
            }
          >
            {pledgerNum || 0}
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
            style={{ cursor: collateralNum ? "pointer" : "" }}
            className={collateralNum ? "hasColor" : ""}
            onClick={() =>
              this.handleNumberModal(collateralNum, {
                id: record.id,
                type: "collateralNum",
              })
            }
          >
            {collateralNum || 0}
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
            <Fragment>
              {isEdit ? (
                <div className="action-btn-group">
                  <span>
                    <span
                      onClick={() => this.goDetail(record.id)}
                      style={{ cursor: "pointer" }}
                    >
                      编辑
                    </span>
                  </span>
                  <span>|</span>
                  <span
                    onClick={() => this.handleDel(record.id)}
                    style={{ cursor: "pointer" }}
                  >
                    删除
                  </span>
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

  render() {
    const { data, isEdit, unitNumber } = this.props;
    const isIdNull = data && data.id; //后端返回为对象形式，id为null则没有数据
    const unKnowList = isIdNull ? [{ ...data }] : [];
    const disabled = unitNumber <= 1 || isIdNull; //当列表页有“未知对应关系”的信息或各户信息列表少于两条时，此按钮置灰
    return (
      <div className="debt-detail-components debt-house-hold">
        <div className="header">
          未知对应关系
          {isEdit && (
            <Button
              className="header-btn"
              size="small"
              type="primary"
              ghost
              style={{ minWidth: 88, height: 32 }}
              onClick={() => this.goDetail(0)}
              disabled={disabled}
            >
              添加未知对应关系
            </Button>
          )}
        </div>
        <Table
          rowClassName="table-list"
          columns={this.getColumns(isEdit)}
          pagination={false}
          dataSource={unKnowList}
          rowKey={() => unKnowList.length}
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
