import React from "react";
import { Modal, Button, Table } from "antd";
import { GuarantorsColumn, PledgersColumn, CreditorsColumn } from "../column";
import NoDataIMG from "@/assets/img/no_data.png";

class NumberModal extends React.Component { //数字弹框
  getColumns = (params) => {
    if (params === "guarantorNum") {
      const columns = [
        {
          title: "保证人名称",
          dataIndex: "name",
          width: 185,
          key: "name",
          render: (text, record) =>
            record.msgs &&
            record.msgs.map((item) => <p key={item.id}>{item.name}</p>),
        },
        ...GuarantorsColumn,
      ];
      return columns;
    } else if (params === "pledgerNum") {
      return PledgersColumn;
    } else {
      return CreditorsColumn;
    }
  };

  handleClose = () => {
    this.props.handleCloseModal("NumberModalVisible");
  };

  render() {
    const { visible, data, numberModalParams } = this.props;
    const footer = (
      <div className="footer">
        <Button type="primary" onMouseDown={this.handleClose}>
          关闭
        </Button>
      </div>
    );
    return (
      <div className="number-modal-container">
        <Modal
          visible={visible}
          destroyOnClose={true}
          footer={footer}
          maskClosable
          width={numberModalParams === "collateralNum" ? 1100 : 1300}
          className="number-modal"
          onCancel={this.handleClose}
        >
          <div>
            <Table
              rowClassName="table-list"
              columns={this.getColumns(numberModalParams)}
              dataSource={data}
              pagination={false}
              rowKey={(record) => record.id}
              locale={{
                emptyText: (
                  <div className="no-data-box">
                    <img src={NoDataIMG} alt="暂无数据" />
                    <p>暂无数据</p>
                  </div>
                ),
              }}
              scroll={{ y: 240 }} 
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default NumberModal;
