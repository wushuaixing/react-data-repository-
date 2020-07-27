import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from "@/pages/assetStructureDetail/check";

const ContentMain = [
  <Route path="/index" exact component={AssetList} />,
  <Route path={[
    "/index/structureDetail/:status/:id/:isNotConfirm/:tabIndex",
    "/index/structureDetail/:status/:id/:isNotConfirm"
  ]} component={StructureDetail} />
];

export default ContentMain
