import React from 'react';
import { Table } from 'antd';
import { HouseHoldDetailColumn } from '../../common/column';
import NoDataIMG from '@/assets/img/no_data.png';
class GuarantorsInfo extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className="debt-detail-components guarantors-info">
        <div className="header">保证人信息</div>
        <Table
          rowClassName="table-list"
          columns={HouseHoldDetailColumn}
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
    );
  }
}

export default GuarantorsInfo;
