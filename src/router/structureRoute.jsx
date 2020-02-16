import React from 'react'
//引入路由
import {Link, Route, Switch} from 'react-router-dom';
import CheckList from "../pages/check/checkComponent";
import Asset from "../pages/structure/assetStruc";
import StructureDetail from "../pages/structure/detail";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/"  component={Asset} />
          <Route path="/ws" exact component={CheckList} />
          <Route path="/:Id/:status" exact component={StructureDetail} />
        </Switch>
       {/* <Link to="/" />
        <Link to="/ws" />
        <Link to="/:Id/:status" />*/}
      </div>
    )
  }
}

export default ContentMain
