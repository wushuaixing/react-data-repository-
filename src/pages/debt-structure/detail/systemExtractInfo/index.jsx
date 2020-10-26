import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Table, Popover, Icon } from 'antd';
import { AdminMsgsColumn, AdminUsersColumn } from '../../common/column';
import NoDataIMG from '@/assets/img/no_data.png';

class SystemExtractInfo extends Component {
  static defaultProps = {
    enble: true,
    usersLists: [],
    msgsLists: [],
  };

  handleOpenMsgsModal = () => {
    this.props.handleOpenModal("msgsModalVisible", { id: 0, type: "" });
  };

  getColumns = (flag) => {
    if (flag) {
      return AdminUsersColumn;
    } else {
      return [
        ...AdminMsgsColumn,
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
                  onClick={this.handleOpenMsgsModal}
                >
                  查看详情
                </Button>
              </span>
            );
          },
        },
      ];
    }
  };

  handleOpenGuarantorModal = (id) => {
    console.log(id);
  };

  render() {
    const { usersLists, msgsLists } = this.props;
    return (
      <div className="debt-detail-components debt-system-extract">
        <div className="header">
          系统提取信息
          <span>
            <Popover content="系统自动提取的信息，不知道具体属于哪一户">
              <Icon
                type="exclamation-circle"
                style={{
                  color: "#808387",
                  position: "relative",
                  marginLeft: 8,
                }}
              />
            </Popover>
          </span>
        </div>
        <div className="system-extract usersInfo">
          <Item
            title="保证人信息"
            data={usersLists}
            columns={this.getColumns(true)}
          />
        </div>
        <div className="system-extract msgsInfo">
          <Item
            title="抵押物信息"
            data={msgsLists}
            columns={this.getColumns()}
          />
        </div>
      </div>
    );
  }
}

const Item = (props) => {
  const { title, data, columns } = props;
  return (
    <Fragment>
      <div className="title">{title}</div>
      <Table
        rowClassName="table-list"
        columns={columns}
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
    </Fragment>
  );
};

export default withRouter(SystemExtractInfo);
