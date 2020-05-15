import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from "@/pages/assetStructureDetail/check";


class Index extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={AssetList} />
        <Route path="/index/structureDetail/:status/:id/:isNotConfirm" component={StructureDetail} />
      </div>
    )
  }
}

export default Index
