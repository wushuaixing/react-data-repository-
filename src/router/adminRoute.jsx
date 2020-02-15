import React from 'react'
//引入路由
import {Route, Switch} from 'react-router-dom';
import AccountManage from "../pages/admin";
import CheckList from "../pages/check/checkComponent";


class ContentMain extends React.Component {
  render() {
    return (
      <div>
        {/*<Switch>*/}
        	<Route path="/" component={AccountManage} />
        	<Route path="/page/check" exact component={CheckList} />
				{/*</Switch>*/}
      </div>
    )
  }
}

export default ContentMain
