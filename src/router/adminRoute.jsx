import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AccountManage from "../pages/admin/structureUser";
import DocumentSearch from "../pages/documentSearch";


class ContentMain extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={AccountManage} />
				<Route path="/index/checkUser" exact component={AccountManage} />
				<Route path="/index/documentSearch" component={DocumentSearch} />
      </div>
    )
  }
}

export default ContentMain
