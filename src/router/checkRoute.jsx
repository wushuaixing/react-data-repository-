import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AssetList from "../pages/check";
import StructureDetail from "../pages/structure/detail";
import DocumentSearch from "../pages/documentSearch";


class Index extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={AssetList} />
        <Route path="/index/documentSearch"  component={DocumentSearch} />
        <Route path="/index/:Id/:status" component={StructureDetail} />
      </div>
    )
  }
}

export default Index
