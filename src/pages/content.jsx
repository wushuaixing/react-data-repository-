import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import CheckList from "./check/checkComponent";
import Asset from "./structure/assetStruc";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        {/*<Switch>*/}
          {/*<Route exact path="/home" component={AdminList} />*/}
          <Route path="/" component={Asset} />
          {/*<Route  path="/page/admin" exact component={AdminList} />*/}
          <Route path="/page/ws" exact component={CheckList} />
        {/*</Switch>*/}
      </div>
    )
  }
}

export default ContentMain
