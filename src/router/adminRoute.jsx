import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AccountManage from "../pages/admin";
import CheckList from "../pages/check";


class ContentMain extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={AccountManage} />
				<Route path="/index/check" component={CheckList} />
      </div>
    )
  }
}

export default ContentMain
