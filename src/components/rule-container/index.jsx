import React from "react";

export const rule = (Component) => {
  const ruleArray = [
    { id: 1, type: "admin", user: "管理员" },
    { id: 2, type: "check", user: "检查人员" },
    { id: 3, type: "normal", user: "结构化人员" },
  ];

  const getRuleType = (user) =>
    (ruleArray.filter((i) => i.user === user)[0] || {}).type;

  return class extends React.Component {
    render() {
      const ruleSource = {
        rule: getRuleType(localStorage.getItem("userState")),
        userName: localStorage.getItem("userName"),
      };
      return <Component ruleSource={ruleSource} {...this.props} />;
    }
  };
};
