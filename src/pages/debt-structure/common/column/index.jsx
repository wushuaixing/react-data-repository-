import React from "react";
import { ROLE_TYPE, OBLIGOR_TYPE, SEXS_TYPE, USE_TYPE } from "../type";
import NoSAVEIMG from "@/assets/img/no_save.png";
import { Badge } from "antd";

export const ListColumns = [
  {
    title: "拍卖标题",
    dataIndex: "title",
    width: 760,
    key: "title",
    render: (text, record) => (
      <a href={record.url} target="_target">
        {text}
      </a>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 285,
    key: "status",
    render: (status) => {
      let color = "default";
      let text = "未标注";
      if (status === 2) {
        if (localStorage.getItem("userState") === "检查人员") {
          text = "未检查";
        } else {
          color = "success";
          text = "已标注";
        }
      }
      if (status === 3) {
        color = "success";
        if (localStorage.getItem("userState") === "检查人员") {
          text = "检查无误";
        } else {
          text = "已标注";
        }
      }
      return <Badge status={color} text={text} />;
    },
  },
  {
    title: "标注人员",
    dataIndex: "approverName",
    key: "approverName",
    render: (text, record) => (
      <span>
        {(record.approverStauts === 0 && text !== "自动标注") ||
        record.approverStauts === -1
          ? `${text}('已删除')`
          : text}
      </span>
    ),
  },
];

export const HouseHoldColumn = [
  {
    title: "序号",
    dataIndex: "accountId",
    width: 120,
    key: "accountId",
    className: "no-save",
    render: (text, record) => (
      <div>
        {record.status === 0 &&
          localStorage.getItem("userState") !== "管理员" && (
            <img
              src={NoSAVEIMG}
              alt=""
              style={{ position: "absolute", left: 0, top: 0 }}
            />
          )}
        {text}
      </div>
    ),
  },
  {
    title: "债务人信息",
    dataIndex: "users",
    width: 478,
    key: "users",
    render: (text, record) => (
      <div>
        {record && record.users && record.users.length ? (
          <div className="users-info">
            {record.users.map((item, index) => {
              return (
                <div className="info-line" key={`info${index}`}>
                  <div className="name">名称：{item.name || "-"}</div>
                  {!item.type && (
                    <div className="number">证件号：{item.number || "-"}</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: "债权信息",
    dataIndex: "Principal",
    width: 220,
    key: "Principal",
    render: (text, record) => (
      <div>
        {record && (
          <div className="Principal">
            <p>
              债权本金：
              {record.rightsPrincipal
                ? `${record.rightsPrincipal}元`
                : "-"}{" "}
            </p>
            <p>利息：{record.interest ? `${record.interest}元` : "-"} </p>
          </div>
        )}
      </div>
    ),
  },
];

export const AdminUsersColumn = [
  {
    title: "名称",
    dataIndex: "name",
    width: 520,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "角色",
    dataIndex: "type",
    width: 400,
    key: "type",
    render: (text) => ROLE_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 560,
    key: "notes",
    render: (text) => text || "-",
  },
];

export const AdminMsgsColumn = [
  {
    title: "抵押物名称",
    dataIndex: "name",
    width: 745,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "类别",
    dataIndex: "type",
    width: 746,
    key: "type",
    render: (text) => text || "-",
  },
];

export const GuarantorsColumn = [
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 78,
    key: "obligorType",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => (
        <p key={item.id}>{OBLIGOR_TYPE[item.obligorType]}</p>
      )),
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 175,
    key: "number",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{item.number || "-"}</p>),
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 106,
    key: "birthday",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{item.birthday || "-"}</p>),
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 84,
    key: "gender",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{SEXS_TYPE[item.gender]}</p>),
  },
  {
    title: "担保金额",
    dataIndex: "amount",
    width: 118,
    key: "amount",
    className: "amount",
    render: (text) => text || "-",
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 135,
    key: "notes",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{item.notes || "-"}</p>),
  },
];

export const CreditorsColumn = [
  {
    title: "抵质押物名称",
    dataIndex: "name",
    width: 400,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "类别",
    dataIndex: "useType",
    width: 230,
    key: "useType",
    render: (text) => USE_TYPE[text],
  },
  {
    title: "所有人",
    dataIndex: "owner",
    width: 360,
    key: "owner",
    render: (text, record) => record && record.name,
  },
];

export const PledgersColumn = [
  {
    title: "抵质押人名称",
    dataIndex: "name",
    width: 231,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 140,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 228,
    key: "number",
    render: (text) => text || "-",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 160,
    key: "birthday",
    render: (text) => text || "-",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 140,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 290,
    key: "notes",
    render: (text) => text || "-",
  },
];

export const PledgersAndDebtorsColumn = [
  {
    title: "名称",
    dataIndex: "name",
    width: 218,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "角色",
    dataIndex: "type",
    width: 193,
    key: "type",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 180,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 206,
    key: "number",
    render: (text) => text || "-",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 124,
    key: "birthday",
    render: (text) => text || "-",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 92,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 112,
    key: "notes",
    render: (text) => text || "-",
  },
];
