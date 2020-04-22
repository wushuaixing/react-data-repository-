import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from "../pages/documentDetail";
import DocumentSearch from "../pages/documentSearch";


class Index extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={AssetList} />
        <Route path="/index/documentSearch"  component={DocumentSearch} />
        <Route path="/index/structureDetail/:id" component={StructureDetail} />
      </div>
    )
  }
}

export default Index
