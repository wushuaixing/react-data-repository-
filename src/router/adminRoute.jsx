import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import CheckList from "../pages/check/checkComponent";
import Asset from "../pages/structure/assetStruc";
import StructureDetail from "../pages/structure/detail";
import AccountManage from "../pages/admin";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        <Switch>
        <Route path="/" component={AccountManage} />
        </Switch>
      </div>
    )
  }
}

export default ContentMain
