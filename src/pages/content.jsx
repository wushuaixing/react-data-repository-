import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import AdminList from "./admin";
import CheckList from "./check";
import Structure from "./structure";
import StructureDetail from "./structure/detail";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*<Route exact path="/home" component={AdminList} />*/}
          <Route  path="/" component={Structure} />
          <Route  path="/page/check" component={CheckList} />
          <Route  path="/:Id/:status" component={StructureDetail} />
        </Switch>
      </div>
    )
  }
}

export default ContentMain
