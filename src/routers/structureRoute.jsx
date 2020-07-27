import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import Asset from "@/pages/assetStructureList/structureAccount";
import StructureDetail from "@/pages/assetStructureDetail/structure";

const ContentMain = [
  <Route path="/index" exact component={Asset} />,
  <Route path="/index/structureDetail/:status/:id" component={StructureDetail} />
];
export default ContentMain
