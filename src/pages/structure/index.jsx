/** admin * */
import React from 'react';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";

import StructureDetail from './detail';
import Asset from "./assetStruc";
// ==================
// 所需的所有组件
// ==================


class  Structure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
    return (
      <div>
        <Switch>
          <Route path="/"  component={Asset} />
          <Route path="/:Id/:status" exact component={StructureDetail} />
        </Switch>
      </div>
    )
  }

}
export default Structure;
