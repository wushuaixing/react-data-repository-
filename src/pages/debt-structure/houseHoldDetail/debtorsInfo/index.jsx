import React from "react";
import { Table, Input, Select, Button } from "antd";
import { PledgersAndDebtorsColumn } from "../../common/column";
import NoDataIMG from "@/assets/img/no_data.png";
import { OBLIGOR_TYPE, ROLETYPES_TYPE, SEXS_TYPE } from "../../common/type";

const { Option } = Select;
class DebtorsInfo extends React.Component {
  static defaultProps = {
    enable: true,
    data: [],
  };

  handleRowAdd = () => {
    this.props.handleAddClick("debtors");
  };

  handleDel = (index) => {
    this.props.handleDeleteClick("debtors", index);
  };

  hanleChange = (e) => {
    this.props.handleChange(e.target.name, e.target.value, "debtors");
  };

  render() {
    const { data, enable } = this.props;
    const PledgersAndDebtorsColumnEdit = [
      {
        title: "名称",
        dataIndex: "name",
        width: 760,
        key: "name",
        render: (text, record, index) => (
          <Input
            placeholder="请输入名称"
            value={text}
            autoComplete="off"
            name={`name${index}`}
            onChange={(e) => {
              e.persist();
              this.hanleChange(e);
            }}
          />
        ),
      },
      {
        title: "角色",
        dataIndex: "type",
        width: 760,
        key: "type",
        render: (text, record, index) => ROLETYPES_TYPE[text],
      },
      {
        title: "人员类别",
        dataIndex: "obligorType",
        width: 760,
        key: "obligorType",
        render: (text, record, index) => (
          <Select
            placeholder="角色"
            onChange={(value) => {
              this.hanleChange({
                target: { name: `obligorType${index}`, value },
              });
            }}
            value={OBLIGOR_TYPE[text]}
          >
            {Object.keys(OBLIGOR_TYPE).map((key) => (
              <Option key={key} style={{ fontSize: 12 }}>
                {OBLIGOR_TYPE[key]}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "证件号",
        dataIndex: "number",
        width: 1200,
        key: "number",
        render: (text, record, index) => (
          <Input
            placeholder="请输入证件号"
            autoComplete="off"
            value={text}
            name={`number${index}`}
            onChange={(e) => {
              e.persist();
              this.hanleChange(e);
            }}
          />
        ),
      },
      {
        title: "生日",
        dataIndex: "birthday",
        width: 760,
        key: "birthday",
        render: (text, record, index) => (
          <Input
            placeholder="请输入生日"
            autoComplete="off"
            value={text}
            name={`birthday${index}`}
            onChange={(e) => {
              e.persist();
              this.hanleChange(e);
            }}
          />
        ),
      },
      {
        title: "性别",
        dataIndex: "gender",
        width: 760,
        key: "gender",
        render: (text, record, index) => (
          <Select
            placeholder="性别"
            onChange={(value) => {
              this.hanleChange({ target: { name: `gender${index}`, value } });
            }}
            value={SEXS_TYPE[text]}
          >
            {Object.keys(SEXS_TYPE).map((key) => (
              <Option key={key} style={{ fontSize: 12 }}>
                {SEXS_TYPE[key]}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "备注",
        dataIndex: "notes",
        width: 760,
        key: "notes",
        render: (text, record, index) => (
          <Input.TextArea
            placeholder="请输入备注"
            autoComplete="off"
            value={text}
            name={`notes${index}`}
            style={{ height: 32 }}
            onChange={(e) => {
              e.persist();
              this.hanleChange(e);
            }}
          />
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 760,
        key: "action",
        render: (text, record, index) => (
          <Button
            onClick={() => {
              this.handleDel(index);
            }}
          >
            删除
          </Button>
        ),
      },
    ];
    return (
      <div className="debt-detail-components debtors-info">
        <div className="header">债务人信息</div>
        {enable ? (
          <Table
            rowClassName="table-list"
            columns={PledgersAndDebtorsColumn}
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
          <div>
            <Table
              rowClassName="table-list"
              columns={PledgersAndDebtorsColumnEdit}
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
          </div>
        )}
      </div>
    );
  }
}

export default DebtorsInfo;
