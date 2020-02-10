import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import AdminList from "./admin";
import CheckList from "./check";
import StructureDetail from "./structure";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/home" component={AdminList} />
          <Route exact path="/page/check" component={CheckList} />
          <Route exact path="/page/structure" component={StructureDetail} />
        </Switch>
      </div>
    )
  }
}

export default ContentMain
