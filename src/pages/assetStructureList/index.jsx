import React from "react";
import AdminTabTable from "./adminAccount";
import CheckTabTable from "./checkAccount";
import StructureTabTable from "./structureAccount";

/* 在所有用户下路由分配此page,这个page会根据用户权限进行不同的视图返回
在tabTable进行更细分 */
class index extends React.Component {
  render() {
    const userState = window.localStorage.userState;
    return (
      <div>
        {(() => {
          switch (userState) {
            case "结构化人员":
              return <StructureTabTable />;
            case "检查人员":
              return <CheckTabTable />;
            case "管理员":
              return <AdminTabTable />;
            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

export default index;
