import React from "react";
import { OBLIGOR_TYPE, SEXS_TYPE, ROLETYPES_TYPE } from "../type";
import NoSAVEIMG from "@/assets/img/no_save.png";
import { Badge } from "antd";

export const ListColumns = [
  {
    title: "拍卖标题",
    dataIndex: "title",
    width: 710,
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
          ? `${text}(已删除)`
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
                  {item.type !== 1 ? (
                    <div className="number">证件号：{item.number || "-"}</div> //债务人为企业时不展示证件号字段
                  ) : null}
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
    title: "序号",
    dataIndex: "typeName",
    width: 420,
    key: "typeName",
    render: (text, record, index) => (text ? `${text}${index + 1}` : "-"),
  },
  {
    title: "名称",
    dataIndex: "name",
    width: 520,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 680,
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
    width: 108,
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
    width: 212,
    key: "number",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{item.number || "-"}</p>),
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 130,
    key: "birthday",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{item.birthday || "-"}</p>),
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 108,
    key: "gender",
    render: (text, record) =>
      record.msgs &&
      record.msgs.map((item) => <p key={item.id}>{SEXS_TYPE[item.gender]}</p>),
  },
  {
    title: "担保金额(元)",
    dataIndex: "amount",
    width: 160,
    key: "amount",
    className: "amount",
    render: (text) => <p>{text ? text.toLocaleString() : 0}</p>,
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 158,
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
    render: (text) => text || "-",
  },
  {
    title: "所有人",
    dataIndex: "owner",
    width: 360,
    key: "owner",
    render: (text, record) =>
      record.owner && record.owner.length
        ? record.owner.map((item, index) => (
            <p key={`owner${index}`} style={{ margin: 0 }}>
              {item.name}
            </p>
          ))
        : "-",
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
    title: "序号",
    dataIndex: "type",
    width: 122,
    key: "type",
    render: (text, record, index) => `${ROLETYPES_TYPE[text]}${index + 1}`,
  },
  {
    title: "名称",
    dataIndex: "name",
    width: 263,
    key: "name",
    render: (text) => text || "-",
  },
  {
    title: "人员类别",
    dataIndex: "obligorType",
    width: 118,
    key: "obligorType",
    render: (text) => OBLIGOR_TYPE[text],
  },
  {
    title: "证件号",
    dataIndex: "number",
    width: 240,
    key: "number",
    render: (text) => text || "-",
  },
  {
    title: "生日",
    dataIndex: "birthday",
    width: 140,
    key: "birthday",
    render: (text) => text || "-",
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 124,
    key: "gender",
    render: (text) => SEXS_TYPE[text],
  },
  {
    title: "备注",
    dataIndex: "notes",
    width: 168,
    key: "notes",
    render: (text) => text || "-",
  },
];
