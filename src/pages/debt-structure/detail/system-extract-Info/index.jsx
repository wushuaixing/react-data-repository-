import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Table, Popover, Icon } from "antd";
import { AdminMsgsColumn, AdminUsersColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import MsgInfoImg from "@/assets/img/msg_info.png";
import GuarantorImg from "@/assets/img/guarantor.png";
/**
 * 包详情-系统提取信息
 */
class SystemExtractInfo extends Component {
  static defaultProps = {
    usersLists: [],
    msgsLists: [],
    handleOpenModal: () => {},
  };

  //系统提取信息  抵押物信息 查看详情弹窗
  handleOpenMsgsModal = (id) => {
    this.props.handleOpenModal("msgsModalVisible", { id, type: "msgsInfo" });
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
          width: 135,
          key: "action",
          render: (text, record) => {
            return (
              <span
                onClick={() => this.handleOpenMsgsModal(record.id)}
                style={{ color: "#016AA9", cursor: "pointer" }}
              >
                查看详情
              </span>
            );
          },
        },
      ];
    }
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
            key="systemExtractUsersInfo"
          />
        </div>
        <div className="system-extract msgsInfo">
          <Item
            title="抵押物信息"
            data={msgsLists}
            columns={this.getColumns()}
            key="systemExtractmsgsInfo"
          />
        </div>
      </div>
    );
  }
}

const Item = (props) => {
  const { title, data, columns } = props;
  const imgs = title === '保证人信息' ? GuarantorImg : MsgInfoImg;
  return (
    <Fragment>
      <div className="title"><span><img src={imgs} alt=""/></span>{title}</div>
      <Table
        rowClassName="table-list"
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => (record.id ? record.id : record.name)}
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
