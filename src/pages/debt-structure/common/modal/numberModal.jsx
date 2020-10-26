import React from 'react';
import { Modal, Button, Table } from 'antd';
import { GuarantorsColumn, PledgersColumn, CreditorsColumn } from '../column';
import NoDataIMG from '@/assets/img/no_data.png';

class NumberModal extends React.Component {
  getColumns = (params) => {
    if (params === "guarantorNum") {
      return GuarantorsColumn;
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
              rowKey={(record) => (record.info || {}).id}
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
