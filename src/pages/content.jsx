import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import AdminList from "./admin";
import CheckList from "./check";
import StructureDetail from "./structure";
import Home from "./home";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*<Route exact path="/home" component={Home} history={this.props.history} />*/}
          <Route exact path='/home' component={Home}/>
          <Route exact path="/page/adminList" component={AdminList} />
          <Route exact path="/page/check" component={CheckList} />
          <Route exact path="/page/structure" component={StructureDetail} />
        </Switch>
      </div>
    )
  }
}

export default ContentMain
