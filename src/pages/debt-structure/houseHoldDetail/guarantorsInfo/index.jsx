import React from "react";
import { Table } from "antd";
import { GuarantorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
class GuarantorsInfo extends React.Component {
  render() {
    const { data } = this.props;
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
      ...GuarantorsColumn,
    ];
    console.log(data);
    return (
      <div className="debt-detail-components guarantors-info">
        <div className="header">保证人信息</div>
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

export default GuarantorsInfo;
