import React from 'react';
import { Table } from 'antd';
import { HouseHoldDetailColumn } from '../../common/column';
import NoDataIMG from '@/assets/img/no_data.png';
class PledgersInfo extends React.Component {
  render() {
    const { data } = this.props;
    const columns = HouseHoldDetailColumn.concat([]);
    columns.splice(6, 1);
    return (
      <div className="debt-detail-components pledgers-info">
        <div className="header">抵质押人信息</div>
        <Table
          rowClassName="table-list"
          columns={columns}
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

export default PledgersInfo;
