import React from "react";
import { Badge } from "antd";

export const Columns = [
  {
    title: "拍卖标题",
    dataIndex: "title",
    width: 760,
    key: "title",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 285,
    key: "status",
    render: (status) => (
      <span>
        {(() => {
          let color = "default";
          let text = "未标注";
          if (
            localStorage.getItem("userState") === "检查人员" &&
            status === 1
          ) {
            color = "default";
            text = "未检查";
          } else {
            switch (status) {
              case 0:
                color = "default";
                text = "未标注";
                break;
              case 1:
                color = "success";
                text = "已标注";
                break;
              case 2:
                color = "success";
                text = "检查无误";
                break;
              default:
                break;
            }
          }
          return <Badge status={color} text={text} />;
        })()}
      </span>
    ),
  },
  {
    title: "标注人员",
    dataIndex: "approverName",
    key: "approverName",
    render: (text, record) => (
      <span>
          {record.approverStauts === 1 ? `${text}('已删除')`: text}
      </span>
      )
    ,
  },
];
