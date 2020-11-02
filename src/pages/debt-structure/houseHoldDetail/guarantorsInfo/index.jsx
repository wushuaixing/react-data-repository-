import React, { Fragment } from "react";
import { Table, Input, Select, Button } from "antd";
import { GuarantorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import { SEXS_TYPE } from "../../common/type";
const { Option } = Select;

class GuarantorsInfo extends React.Component {
  static defaultProps = {
    data: [],
    enble: true,
  };

  handleDel = (index, indexs) => {
    this.props.handleDeleteClick(index, indexs);
  };
  handleADD = (index) => {
    this.props.handleAddGuarantors(index);
  };

  handleRowAdd = () => {
    this.props.handleAddClick("guarantors");
  };
  hanleChange = (e, index) => {
    this.props.handleChange(e.target.name, e.target.value, index);
  };

  render() {
    const { data, enable } = this.props;
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
    const columnsEdit = [
      {
        title: "保证人名称",
        dataIndex: "name",
        width: 760,
        key: "name",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入名称"
              value={item.name}
              autoComplete="off"
              name={`name${indexs}`}
              style={{ marginBottom: 20, height: 32 }}
              onChange={(e) => {
                e.persist();
                this.hanleChange(e, index);
              }}
              key={`name${indexs}`}
            />
          )),
      },
      {
        title: "证件号",
        dataIndex: "number",
        width: 1200,
        key: "number",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入证件号"
              autoComplete="off"
              value={item.number}
              style={{ marginBottom: 20, height: 32 }}
              name={`number${indexs}`}
              key={`number${indexs}`}
              onChange={(e) => {
                e.persist();
                this.hanleChange(e, index);
              }}
            />
          )),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 760,
        key: "birthday",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input
              placeholder="请输入生日"
              autoComplete="off"
              value={item.birthday}
              name={`birthday${indexs}`}
              key={`birthday${indexs}`}
              style={{ marginBottom: 20, height: 32 }}
              onChange={(e) => {
                e.persist();
                this.hanleChange(e, index);
              }}
            />
          )),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 760,
        key: "gender",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <div key={`gender${indexs}`}>
              <Select
                placeholder="性别"
                onChange={(value) => {
                  this.hanleChange(
                    { target: { name: `gender${indexs}`, value } },
                    index
                  );
                }}
                value={SEXS_TYPE[item.gender]}
                style={{ marginBottom: 20, height: 32 }}
              >
                {Object.keys(SEXS_TYPE).map((key) => (
                  <Option key={key} style={{ fontSize: 12 }}>
                    {SEXS_TYPE[key]}
                  </Option>
                ))}
              </Select>
            </div>
          )),
      },
      {
        title: "担保金额",
        dataIndex: "amount",
        width: 760,
        key: "amount",
        render: (text, record, index) => (
          <Input
            placeholder="请输入担保金额"
            autoComplete="off"
            value={text}
            name={`amount${index}`}
            key={`amount${index}`}
            style={{ marginBottom: 20, height: 32 }}
            onChange={(e) => {
              e.persist();
              this.hanleChange(e, index);
            }}
          />
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 760,
        key: "notes",
        render: (text, record, index) =>
          record.msgs &&
          record.msgs.map((item, indexs) => (
            <Input.TextArea
              placeholder="请输入备注"
              autoComplete="off"
              value={item.notes}
              name={`notes${indexs}`}
              key={`notes${indexs}`}
              style={{ marginBottom: 20, height: 32 }}
              onChange={(e) => {
                e.persist();
                this.hanleChange(e, index);
              }}
            />
          )),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 760,
        key: "action",
        render: (text, record, index) =>
          record.msgs.map((item, indexs) => (
            <div
              style={{ display: "flex", marginBottom: 20 }}
              key={`action${indexs}`}
            >
              {indexs === 0 && (
                <Button onClick={() => this.handleADD(index, indexs)}>
                  添加同组保证人
                </Button>
              )}
              <Button
                onClick={() => {
                  this.handleDel(index, indexs);
                }}
              >
                删除
              </Button>
            </div>
          )),
      },
    ];
    return (
      <div className="debt-detail-components guarantors-info">
        <div className="header">保证人信息</div>
        {enable ? (
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
        ) : (
          <Fragment>
            <Table
              rowClassName="table-list"
              columns={columnsEdit}
              dataSource={data}
              pagination={false}
              rowKey={(record) => record.id}
              locale={{
                emptyText: <div></div>,
              }}
            />
            <div className="debtors-addRole">
              <Button
                type="dashed"
                icon="plus"
                onClick={() => {
                  this.handleRowAdd();
                }}
                block
              >
                添加
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default GuarantorsInfo;
