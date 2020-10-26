import React from 'react';
import { ROLE_TYPE, OBLIGOR_TYPE, SEXS_TYPE } from '../type';

export const HouseHoldColumn = [
  {
    title: "序号",
    dataIndex: "accountId",
    width: 260,
    key: "accountId",
  },
  {
    title: "债务人信息",
    dataIndex: "users",
    width: 760,
    key: "users",
    render: (text, record) => {
      return (
        <div>
          {record && record.users && record.users.length > 0 && (
            <div className="info">
              {record.users.map((item, index) => {
                return (
                  <div className="info-line" key={`info${index}`}>
                    <div className="name">名称：{item.name}</div>
                    <div className="number">证件号：{item.number}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: "债权信息",
    dataIndex: "Principal",
    width: 560,
    key: "Principal",
    render: (text, record) => {
      return (
        <div>
          {record && (
            <div className="Principal">
              <p>债权本金：{record.rightsPrincipal}</p>
              <p>利息：{record.interest}</p>
            </div>
          )}
        </div>
      );
    },
  },
];

export const AdminUsersColumn = [
  {
    title: "名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "角色",
    dataIndex: "type",
    width: 760,
    key: "type",
    render: (text) => ROLE_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 760,
    key: "notes",
  },
];

export const AdminMsgsColumn = [
  {
    title: "抵押物名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "类别",
    dataIndex: "type",
    width: 760,
    key: "type",
  },
];

export const GuarantorsColumn = [
  {
    title: "保证人名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 760,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 760,
    key: "number",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 760,
    key: "birthday",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 760,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "担保金额",
    dataIndex: "amount",
    width: 760,
    key: "amount",
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 760,
    key: "notes",
  },
];

export const CreditorsColumn = [
  {
    title: "抵质押物名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "类别",
    dataIndex: "useType",
    width: 760,
    key: "useType",
  },
  {
    title: "所有人",
    dataIndex: "owner",
    width: 760,
    key: "owner",
    render: (text, record) => record && record.name,
  },
];

export const PledgersColumn = [
  {
    title: "抵质押人名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 760,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 760,
    key: "number",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 760,
    key: "birthday",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 760,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 760,
    key: "notes",
  },
];

export const HouseHoldDetailColumn = [
  {
    title: "名称",
    dataIndex: "name",
    width: 760,
    key: "name",
  },
  {
    title: "角色",
    dataIndex: "type",
    width: 760,
    key: "type",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 760,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 760,
    key: "number",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 760,
    key: "birthday",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 760,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "担保金额",
    dataIndex: "amount",
    width: 760,
    key: "amount",
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 760,
    key: "notes",
  },
];
