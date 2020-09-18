import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import Asset from "@/pages/assetStructureList/structureAccount";
import StructureDetail from '@/pages/asset-structure-detail';

const ContentMain = [
  <CacheRoute path="/index" exact component={Asset} key='Asset' when="always" />,
  <Route path="/index/structureDetail/:status/:id" component={StructureDetail} key='StructureDetail' />
];
export default ContentMain
