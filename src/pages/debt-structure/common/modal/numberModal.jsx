import React from "react";
import { Modal, Button, Table } from "antd";
import { GuarantorsColumn, PledgersColumn, CreditorsColumn } from "../column";
import NoDataIMG from "@/assets/img/no_data.png";
import { OBLIGOR_TYPE } from "../type";

class NumberModal extends React.Component {
  getColumns = (params) => {
    if (params === "guarantorNum") {
      const columns = [
        {
          title: "保证人名称",
          dataIndex: "name",
          width: 760,
          key: "name",
          render: (text, record) =>
            record.msgs &&
            record.msgs.map((item) => <p key={item.id}>{item.name}</p>),
        },
        {
          title: "人员类别",
          dataIndex: "obligorType",
          width: 760,
          key: "obligorType",
          render: (text, record) =>
            record.msgs &&
            record.msgs.map((item) => (
              <p key={item.id}>{OBLIGOR_TYPE[item.obligorType]}</p>
            )),
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
          width={658}
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
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default NumberModal;
