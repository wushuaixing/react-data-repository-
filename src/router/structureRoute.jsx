import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import DocumentSearch from "../pages/documentSearch";
import Asset from "../pages/structure/assetStruc";
import StructureDetail from "../pages/structure/detail";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
          <Route path="/index" exact component={Asset} />
          <Route path="/index/documentSearch"  component={DocumentSearch} />
          <Route path="/index/:Id/:status" component={StructureDetail} />
      </div>
    )
  }
}

export default ContentMain
