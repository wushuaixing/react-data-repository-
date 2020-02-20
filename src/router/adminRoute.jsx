import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import StructureAccount from "../pages/admin/structureUser";
import CheckAccount from "../pages/admin/checkUser";
import DocumentSearch from "../pages/documentSearch";


class ContentMain extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={StructureAccount} />
				<Route path="/index/checkUser" exact component={CheckAccount} />
				<Route path="/index/documentSearch" component={DocumentSearch} />
      </div>
    )
  }
}

export default ContentMain
