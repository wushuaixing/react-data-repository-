import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import Asset from "@/pages/assetStructureList/structureAccount";
import StructureDetail from "@/pages/assetStructureDetail/structure";

class ContentMain extends React.Component {
  render() {
    return (
      <div>
          <Route path="/index" exact component={Asset} />
          <Route path="/index/structureDetail/:status/:id" component={StructureDetail} />
      </div>
    )
  }
}

export default ContentMain
